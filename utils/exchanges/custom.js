const axios= require( 'axios' )
const { get_random_from_arr } = require ( '../common')
const { KEYNAMES } = require('../../configs/keynames')
const { KEYNAME_APIKEY }=require ( '../../configs/configs' )
const { PORTS } = require ( '../../configs/ports' )
let URL = `http://localhost:${ PORTS?.EXCHANGES_CUSTOM_HTTP }`
const dbcustom = require ( '../../models-custom' )
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
let arr_useremail_apikeys
const get_user_apikeys_from_db = async ()=>{
  let j_useremail_keys = await rediscli.hgetall ( KEYNAMES?.REDIS?.APIKEY )
  let arr_useremails = Object.keys ( j_useremail_keys )
  if ( arr_useremail_apikeys?.length ){}
  else { arr_useremail_apikeys = await get_user_apikeys_from_db () } 
  if ( arr_useremail_apikeys?.length ){}
  else { return null }
  let arr_useremail_apikeys = Object.keys ( j_useremail_keys ).map ( el =>{ 
    return { useremail : el , apikey : j_useremail_keys[ el ] }})
  return arr_useremail_apikeys
}
const post_order = async ( {
  apikey ,  // useremail , 
  currency ,
  pair ,
  type ,
  side ,
  amount ,
  price
}  ) =>{
  if ( currency && pair && type && side && amount ){}
  else { console.log(`ERROR AT post_order : arg missing` ) ; return null }
  if ( Number.isFinite(+amount) ){}
  else { console.log(`ERROR AT post_order : arg invalid-amount` ) ; return null }
  if ( type.match ( /limit/g )) {
      if ( Number.isFinite (+price)){}
      else { console.log( `ERROR AT post_order : arg invalid`); return null }
  } else {} // ORDER       : `orders/order` , // /:market/:asset/:type/:amount/:price` ,
  let headers = {} ; headers[ KEYNAME_APIKEY ] = apikey
  let resp = await axios.post ( `${ MAP_FUNCTION_NAME_TO_ENDPOINT( 'ORDER' ) }/${pair}/${ currency}/${type}/${amount}/${price}` , { } , { headers } )
  if ( resp?.data?.status == 'OK' ){ return resp?.data }
  else { console.log( `ERROR AT post_order`) ; return resp }
}
const post_order_with_random_pick_bot = async ( {   // useremail , apikey , 
  currency ,
  pair ,
  type ,
  side ,
  amount ,
  price
  } ) => {
  let { useremail , username , apikey } =  get_random_from_arr ( arr_useremail_apikeys )
  return await post_order ( { apikey , currency ,    pair ,    type ,    side ,    amount ,    price
  }) // useremail ,
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
        asset  : tp?.asset , // currency,
        market : tp?.market , // pair ,
        base : tp?.asset , // currency ,
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
  load_and_update_active_tradepairs
}
const init = async ()=>{
  arr_useremail_apikeys = await get_user_apikeys_from_db ()
}
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
