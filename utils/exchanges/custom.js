const axios= require( 'axios' )
const { get_random_from_arr } = require ( '../common')
const { KEYNAMES } = require('../../configs/keynames')
const { KEYNAME_APIKEY }=require ( '../../configs/configs' )
const { PORTS } = require ( '../../configs/ports' )
let URL = `http://localhost:${ PORTS?.EXCHANGES_CUSTOM_HTTP }`
const dbcustom = require ( '../../models-custom' )
const { findall } = require('../db')
const db = require ( '../../models' )
// const { get_user_apike ys_from_db } = require('../../INIT-OB/initob-MESSAGING-VIA-SOCKET-CUSTOM-EXCHANGES')
const rediscli = require ( 'async-redis').createClient() 
const MAP_FUNCTION_NAME_TO_PATH = {
  TRADEPAIRS  : `queries/rows/markethasassets/active/1/0/10000/id/DESC` ,
  ORDERBOOK   : `orderbooks/orderbook` , // /:market/:asset/:N` ,
  ORDER       : `orders/order` , // /:market/:asset/:type/:amount/:price` ,
  TICKERS     : `tickers` , // 
  TICKER      : `tickers` , // /tickers/{market}/{asset}
}
const LOGGER = console.log
const MAP_FUNCTION_NAME_TO_ENDPOINT = ( name )=>{
  return `${ URL }/${ MAP_FUNCTION_NAME_TO_PATH [ name ]}`
}
const get_tickers = async () =>{
  let resp = await axios.get ( MAP_FUNCTION_NAME_TO_ENDPOINT( 'TICKERS' ) )
  let jtickers = {}
  if ( resp?.data?.status == 'OK' ) {}
  else { return null }
  let { list } = resp?.data 
  for ( let idx = 0 ; idx < list?.length ; idx ++ ){
    let { symbol , price } = list [ idx ]
    jtickers [ symbol ]  = price
  }
  return jtickers
}
const get_trade_pairs = async () =>{
  let resp  = await axios.get ( MAP_FUNCTION_NAME_TO_ENDPOINT ( 'TRADEPAIRS' ))
  if ( resp?.data?.status == 'OK' && resp?.data?.list?.length ) { return resp?.data?.list }
  else { console.log ( `ERROR AT get_trade_pairs`) ; return null }
}
const fetch_tradepairs_local = async ()=>{
  let list_tp = await dbcustom[ 'markethasassets' ].findAll ({ raw: true , where : {    active : 1  } } )
  return list_tp
}
const get_orderbook = async ( { base , quote , limit } ) =>{
  if (+limit && +limit >=1){} else { LOGGER('!!! INVALID ARG@get_orderbook'); return null }
  let resp  = await axios.get ( `${ MAP_FUNCTION_NAME_TO_ENDPOINT ( 'ORDERBOOK' )}/${ market }/${ asset }/${ limit }` )
  if ( resp?.data?.status == 'OK'){}
  else { LOGGER( ) ; return null }
}
let arr_useremail_apikeys = [ ]
const get_user_apikeys_from_local = async ()=>{  return arr_useremail_apikeys } // const get_user_apikeys_ from_db = async () => {
const setup_user_apikeys_from_cache = async () => {  
  let j_useremail_keys = await rediscli.hgetall ( KEYNAMES?.REDIS?.USERUUID_APIKEY )
  let j_username_keys  = await rediscli.hgetall ( KEYNAMES?.REDIS?.USERUUID_USERNAME )
  let arr_useremails = Object.keys ( j_useremail_keys )
  if ( arr_useremails?.length ){}
  else { return null } // let resp = await findall( 'users' , { }, [ 'username' , 'email' , ] )    }
  let arr_useremail_apikeys = Object.keys ( j_useremail_keys ).map ( el =>{ 
    return { useremail : el , apikey : j_useremail_keys[ el ] , username : j_username_keys [ el ] }})
  return arr_useremail_apikeys
/*  if ( arr_useremail_apikeys?.length ){}   else { arr_useremail_apikeys = await get_u ser_apikeys_from_db () } 
  if ( arr_useremail_apikeys?.length ){}   else { return null }   return arr_useremail_apikeys */
}
const post_order = async ( {
  apikey ,  // useremail , 
  asset ,
  market , //pair ,
  type ,
  side ,
  amount ,
  price , usernametest
}  ) =>{
  if ( asset && market && type && side && amount ){}
  else { console.log(`ERROR AT post_order : arg missing` ) ; return null }
  if ( Number.isFinite(+amount) ){}
  else { console.log(`ERROR AT post_order : arg invalid-amount` ) ; return null }
  if ( type.match ( /limit/g )) {
      if ( Number.isFinite (+price)){}
      else { console.log( `ERROR AT post_order : arg invalid`); return null }
  } else {} // ORDER       : `orders/order` , // /:market/:asset/:type/:amount/:price` ,
  let headers = {} ; headers[ KEYNAME_APIKEY ] = apikey
  LOGGER ( { url : `${ MAP_FUNCTION_NAME_TO_ENDPOINT( 'ORDER' ) }/${market}/${ asset}/${type}/${amount}/${price}` ,
    usernametest
  })
  let resp = await axios.post ( `${ MAP_FUNCTION_NAME_TO_ENDPOINT( 'ORDER' ) }/${market}/${ asset}/${type}/${amount}/${price}` , { usernametest } ) // , { headers } )
  if ( resp?.data?.status == 'OK' ){ return resp?.data }
  else { console.log( `ERROR AT post_order`) ; return null }
}
const post_order_with_random_pick_bot = async ( {   // useremail , apikey , 
  asset ,
  market , // pair ,
  type ,
  side ,
  amount ,
  price
} ) => {
  if ( arr_useremail_apikeys?.length ){}
  else { arr_useremail_apikeys = await get_user_apikeys_from_local () }
  let { useremail , username , apikey } =  get_random_from_arr ( arr_useremail_apikeys )
  let resporder = await post_order ( { apikey , asset , market    ,    type ,    side ,    amount ,    price , usernametest : username  
  }) // useremail ,pair
  return resporder 
}
const conv_asset_market_to_symbol = ({ asset , market }) => `${ asset }_${ market }`
const load_and_update_active_tradepairs = async ()=>{
  let list_tp 
  try { 
    list_tp = await get_trade_pairs () ; LOGGER({dbpoint: 0  }) // , list_tp
  } catch (err){ LOGGER( err )
    list_tp = await fetch_tradepairs_local() ; ; LOGGER({dbpoint: 1  }) // , list_tp
  }
  /** MARK UP ONLY THE ACTIVE TRADE PAIRS AS SUCH , DEACTIVATE THE REST */
  await updaterows( 'tradepairs' , {} , { active  : 0 } )
  for ( let tp of list_tp) {
    await upsert ( { 
      db , // : '' 
      table : 'tradepairs' ,
      values : { active : 1 , // metadata : STRINGER( tp?.metadata ) ,
        asset  : tp?.asset , // cur rency,
        market : tp?.market , // pair ,
        base : tp?.asset , // curre ncy ,
        quote : tp?.market , // pair ,
      } ,
      condition : { symbol: conv_asset_market_to_symbol( { ... tp } )  } ,
    } )
  }
  return list_tp
}
module.exports = {
  MAP_FUNCTION_NAME_TO_ENDPOINT ,
  get_trade_pairs ,
  fetch_tradepairs_local ,
  post_order ,
  post_order_with_random_pick_bot ,
  get_tickers ,
  get_orderbook,
  load_and_update_active_tradepairs , 
  get_user_apikeys_from_local
}
const init = async ()=>{
  arr_useremail_apikeys = await setup_user_apikeys_from_cache () // get_use r_apikeys_from_db ()
}
// false && init()
true && init()
/* {
  "status": "OK",
  "message": null,
  "code": null,
  "list":[
  {
  "id": 1,
  "createdat": "2024-10-28T05:37:42.000Z",
  "updatedat": "2024-10-28T05:56:26.000Z",
  "asset": "BTC",
  "market": "USDT",
  "symbol": "BTC_USDT",
  "price": "300",
  "laststrikeprice": "300",
  "amount": null,
  "timestampmili": 1730094986623,
  "amountasset": "0.5",
  "amountmarket": "150"
  }
  ]
  } */
/** 
 * const BIN_EP_SPOT_TICKER = `https://api.binance.com/api/v3/ticker/price?symbol=`
// EX: `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
// resp.data => { symbol: 'BTCUSDT', price: '57727.99000000' }
const BIN_EP_ORDERBOOK = `https://api.binance.com/api/v3/depth` // ?limit=10&symbol=`
 */
