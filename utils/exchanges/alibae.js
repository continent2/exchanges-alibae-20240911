const axios= require( 'axios' )
const { get_random_from_arr } = require ( '../common')
const { KEYNAMES } = require('../../configs/keynames')
let URL = `http://localhost:4000/api` //   URL = `https://alibae.io/api`
const dbalibae = require( '../../models-alibae' )
const { findall } = require('../db')
// const APIKEY = '2UTcRUf0yIDCOHxgO6KfndhLE4erZxBJMOwc1nHuIhFexRPGVjoSa5xIBUxKs1Nk'
const rediscli = require ( 'async-redis' ).createClient()
const MAP_FUNCTION_NAME_TO_PATH = {
    TRADEPAIRS  : `exchange/market?eco=false`,
    ORDERBOOK   : `exchange/orderbook` ,
    ORDER       : `exchange/order` ,
    TICKERS     : `exchange/ticker`,    
}
const MAP_FUNCTION_NAME_TO_ENDPOINT = ( name )=>{
    return `${ URL }/${ MAP_FUNCTION_NAME_TO_PATH[ name ]  }`
} // https://alibae.io/api/exchange/market?eco=false
const normalize_ticker_symbol = str=> { return str.replace ( /\//g , '_' ) }
const get_tickers = async ()=>{
  let resp = await axios.get ( MAP_FUNCTION_NAME_TO_ENDPOINT( 'TICKERS' ) ) 
  let jtickers = { }
  let arr_tickersymbols = Object.keys ( resp?.data ) //  jtickers
  for ( let idx = 0 ; idx< arr_tickersymbols?.length ; idx++ ){
    let tickersymbol = arr_tickersymbols[ idx ]
    jtickers [ normalize_ticker_symbol ( tickersymbol ) ] = + resp?.data [ tickersymbol ].last
  }
  return jtickers
} // "ZRO/USDC": {   "last": 4.062,
const get_trade_pairs = async ()=>{
  let resp =await axios.get ( MAP_FUNCTION_NAME_TO_ENDPOINT ( 'TRADEPAIRS' ) )
  if ( resp.status == 200 && resp?.data?.length ) { return resp?.data } 
  else { console.log(`ERROR AT get_trade_pairs` ) ; return null }
}
const fetch_tradepairs_local = async ()=>{
  let list_tp = await dbalibae[ 'exchange_market' ].findAll ({ raw: true , where : {    status : true  } } )
  return list_tp
}
/**   const exchangeMarkets = await models.exchangeMarket.findAll({    where: {      status: true,    },  }); */
const get_orderbook = async ( { base , quote , limit } )=>{
  let jqparams = ( limit && +limit>0 ) ? { limit} : {}
    let resp = await axios.get ( `${ MAP_FUNCTION_NAME_TO_ENDPOINT ( 'ORDERBOOK' ) }/${ base }/${ quote }` , { params: { ... jqparams } } ) // ???
    if ( resp?.status == 200 ){ return resp?.data }
    else { console.log (`ERROR AT get_orderbook`) ; return null }
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
    useremail , apikey , 
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
    if ( price ){
        if ( Number.isFinite (+price)){}
        else { console.log( `ERROR AT post_order : arg invalid`); return null }
    }
//    red iscli.hget ( )
    let resp = await axios.post ( `${ MAP_FUNCTION_NAME_TO_ENDPOINT( 'ORDER' ) }` , {
      currency ,
      pair ,
      type ,
      side ,
      amount ,
      price    } , { headers : { 'X-API-KEY': apikey } } )
    if ( resp?.status == 200 ){ return resp?.data }
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
  let { useremail , apikey } =  get_random_from_arr ( arr_useremail_apikeys )
  return await post_order ( { useremail , apikey , currency ,    pair ,    type ,    side ,    amount ,    price
  })  
}
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
    await upsert_sane ( { 
      db , // : '' 
      table : 'tradepairs' ,
      values : { active : 1 , metadata : STRINGER( tp?.metadata ) ,
        currency : tp?.currency,
        pair : tp?.pair ,
        base : tp?.currency ,
        quote : tp?.pair ,
      } ,
      condition : { symbol: conv_mashdiv_currency_pair_to_symbol( { ... tp } )  } ,
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
// init ()

/*** RESPONSE TO GET TICKERS */
if ( false ){
  const response_example_get_tickers = {
    "ZRO/USDC": {
      "last": 4.062,
      "baseVolume": 138297.51,
      "quoteVolume": 570778.75238,
      "change": -4.648
    },
    "XRP/TUSD": {
      "last": 0.5844,
      "baseVolume": 22760,
      "quoteVolume": 13340.8046,
      "change": -1.267
    },
    "BTC/ZAR": {
      "last": 1100952,
      "baseVolume": 3.00944,
      "quoteVolume": 3280857.19382,
      "change": -1.586
    },
    "ZEN/BTC": {
      "last": 0.0001289,
      "baseVolume": 2792.86,
      "quoteVolume": 0.36314505,
      "change": 0.155
    },
  }
}
