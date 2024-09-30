
/* QUERY MARKET INFO => TRADE PAIR ,  MIN ORDER AMOUNT , DECIMALS
FETCH BINANCE TICKER
SET BIN SIZE , MIN STEP SIZE ALONG PRICE AXIS
PLACE LIMIT SELL ORDERS
PLACE LIMIT BUY ORDERS
*/
const MODE_TEST_1 = true // 'TEST_1'
const db = require( '../models' )
const axios = require( 'axios' )
const { getRandomInt  , get_random_float } = require ( '../utils/math' )
const { parse_orderbook } = require ( '../utils/exchanges/binance' )
const rediscli = require( 'async-redis' ).createClient()  // 
const { post_order : post_order_prod , post_order_with_random_pick_bot } = require ( '../utils/exchanges/alibae' )
const {  post_order_bp } = require ( '../utils/exchanges/bp')
// const { post_order : post_order_bp } = require ( '../utils/exchanges/bp')
const { get_random_from_arr, conv_array_to_object } = require ( '../utils/common' )
const { findall } = require('../utils/db')
let list_tradepair = [ 'BTC_USDT' ]
// let list_tradepair = [ 'BTC_USDT' , 'ETH_USDT' ]
const BIN_EP_SPOT_TICKER = `https://api.binance.com/api/v3/ticker/price?symbol=`
// EX: `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
// resp.data => { symbol: 'BTCUSDT', price: '57727.99000000' }
const BIN_EP_ORDERBOOK = `https://api.binance.com/api/v3/depth` // ?limit=10&symbol=`
// https://api.binance.com/api/v3/depth?limit=10&symbol=BTCUSDT
// let N_BINANCE_ORDERBOOK_QUERY_COUNT = 40
let N_BINANCE_ORDERBOOK_QUERY_COUNT = 200
// let N_MAX_ORDERS_A_BIN = 2
let N_MAX_ORDERS_A_BIN = 1
let MAX_ORDER_AMOUNT = 10 
let MIN_ORDER_AMOUNT = 0.1
let REF_PRICE_DIVIDER_FOR_BIN_WIDTH = 1_0000
let N_ORDER_BINS_A_SIDE = 5
// let N_O RDER_BINS_A_SIDE = 10
// let N_ORDER_BINS_A_SIDE = 40
// let N_ORDER_BI NS_A_SIDE = 100
let arr_useremail_apikeys
const LOGGER = console.log
const place_order_local_dev = ( { idxbin , side , type , tickersymbol_snake , price , amount } )=>{ // type : 'buy'  , 'sell'
  console.log ( 'ORDER' ,idxbin , tickersymbol_snake , side , type , price , amount )
}
/** {
  XVG_ETH: '{"base":"XVG","quote":"ETH","symbol":"XVG_ETH","PRECISION_PRICE":8,"PRECISION_AMOUNT":0,"LIMIT_AMOUNT_MIN":1,"LIMIT_AMOUNT_MAX":90000000,"LIMIT_PRICE_MIN":1e-8,"LIMIT_PRICE_MAX":1000}',
  XRP_TRY: '{"base":"XRP","quote":"TRY","symbol":"XRP_TRY","PRECISION_PRICE":2,"PRECISION_AMOUNT":0,"LIMIT_AMOUNT_MIN":1,"LIMIT_AMOUNT_MAX":92141578,"LIMIT_PRICE_MIN":0.01,"LIMIT_PRICE_MAX":1000}',
  BTC_ARS: '{"base":"BTC","quote":"ARS","symbol":"BTC_ARS","PRECISION_PRICE":0,"PRECISION_AMOUNT":5,"LIMIT_AMOUNT_MIN":0.00001,"LIMIT_AMOUNT_MAX":67,"LIMIT_PRICE_MIN":1,"LIMIT_PRICE_MAX":1356378240}',
*/
let MODE_DEV_PROD = 'DEV' // 'PROD'
const post_order = MODE_DEV_PROD == 'DEV' ? place_order_local_dev : post_order_prod
const fetch_ticker_symbols = async ()=>{
  let j_ticker_symbols = {}
  switch ( MODE_TEST_1 ){ 
    case true : {
      let SELECT_TEST_PAIR = 'BTC_USDT'
      let resp = await rediscli.hget ( 'TRADEPAIRS' , SELECT_TEST_PAIR )
      j_ticker_symbols [ SELECT_TEST_PAIR ]  = resp
    }
    break
    default :   j_ticker_symbols= await rediscli.hgetall ( 'TRADEPAIRS' )
    break
  }  
  return j_ticker_symbols
}
const get_user_apikeys_from_db = async ( )=>{
  let j_useremail_keys = await rediscli.hgetall (  'APIKEY' )
  let arr_useremails = Object.keys ( j_useremail_keys )
  if ( arr_useremail_apikeys?.length ){}
  else { return null }
  arr_useremail_apikeys = Object.keys ( j_useremail_keys ).map ( el =>{
    return { useremail : el , apikey : j_useremail_keys[ el ] }})
  return arr_useremail_apikeys
}
//  let arr_useremail_ap ikeys = Object.keys ( j_useremail_keys ).map ( el =>{ 

const main = async ( { MAX_STOP_SYMBOL_ITER_AT } )=>{
  let respsettings = await findall( 'settings' , { group : 'MM' , active : 1 } )
  let jsettings = conv_array_to_object ( { arr : respsettings , keyfieldname : 'key' })
  if ( jsettings[ 'REF_PRICE_DIVIDER_FOR_BIN_WIDTH' ] && +jsettings[ 'REF_PRICE_DIVIDER_FOR_BIN_WIDTH'] ) { REF_PRICE_DIVIDER_FOR_BIN_WIDTH = +jsettings[ 'REF_PRICE_DIVIDER_FOR_BIN_WIDTH'] }
  else {}
  let j_ticker_symbols  = await fetch_ticker_symbols ()  
  let arr_ticker_symbols = Object.keys ( j_ticker_symbols )
  if( false ) {  list_tradepair = arr_ticker_symbols }
  else {    list_tradepair = [ 'BTC_USDT' ] }
  let max_iter_symbols 
  if ( MAX_STOP_SYMBOL_ITER_AT ){ max_iter_symbols = MAX_STOP_SYMBOL_ITER_AT }
  else { max_iter_symbols = list_tradepair?.length }
  arr_useremail_apikeys = await get_user_apikeys_from_db ()
//  let arr_useremail_a pikeys = await get_user_apikeys_from_db ()
  for ( let idxsymbols = 0 ; idxsymbols < max_iter_symbols && idxsymbols < list_tradepair?.length ; idxsymbols ++ ){
    let tickersymbol_snake = list_tradepair [ idxsymbols ]
    let tickersymbol = tickersymbol_snake.replace ( /_/g, '' )
    let marketinfo = JSON.parse ( j_ticker_symbols [ tickersymbol_snake ] )
    let ep = `${ BIN_EP_ORDERBOOK }` //    let ep = `${ BIN_EP_SPOT_TICKER }${ tickersymbol }`
    try {
      let resp = await axios.get ( ep , { params : { limit : N_BINANCE_ORDERBOOK_QUERY_COUNT , symbol : tickersymbol }} )
      if ( resp?.data?.asks?.length ){ //        let { price : midprice } = resp?.data
        let { midprice , buy_volume , sell_volume } = parse_orderbook ( { j_ob : resp?.data } )        
        let stepsize = +midprice / REF_PRICE_DIVIDER_FOR_BIN_WIDTH
        console.log ( { midprice , buy_volume , sell_volume , stepsize , N_ORDER_BINS_A_SIDE } )
        // let stepsize = +midprice / N_ORDE R_BINS_A_SIDE
        /** SELL SIDE */
        for ( let idxbin = 0 ; idxbin < N_ORDER_BINS_A_SIDE ; idxbin ++ ) { 
          LOGGER ( { idxbin , N_ORDER_BINS_A_SIDE })
          let bin_border_low  = midprice + ( 1 + idxbin ) * stepsize
          let bin_border_high = midprice + ( 2 + idxbin ) * stepsize
          let bin_mid         = midprice + ( 1.5+idxbin ) * stepsize //          LOGGER( { bin_border_low , bin_border_high , bin_mid })   //        continue
          let n_orders = getRandomInt ( 1 , N_MAX_ORDERS_A_BIN )
          LOGGER ( { bin_border_low , bin_border_high , n_orders })
          for ( let idxorder = 0 ; idxorder < n_orders ; idxorder ++ ) {
            let orderprice = get_random_float ( { max : bin_border_high   , min : bin_border_low })
//            let orderamount= get_random_float ( { max : MAX_ORDER_AMOUNT  , min : MIN_ORDER_AMOUNT })
            // let orderprice = get_random_float ( { max : marketinfo?.LIMIT_PRICE_MAX , min: marketinfo?.LIMIT_PRICE_MIN  })
            let orderamount= get_random_float ( { max : marketinfo?.LIMIT_AMOUNT_MAX , min : marketinfo?.LIMIT_AMOUNT_MIN })
//            let { useremail , apikey } = get_random_from_arr ( arr_useremail_apikeys )
            LOGGER ( { orderprice , orderamount } )
//            continue 
            let resp 
            if ( true ){ LOGGER ( `dbg point`)
              resp = await post_order_bp ({
                currency ,
                pair ,
                type ,
                side ,
                amount ,
                price            
              }) ; LOGGER ( { resp })
            }
            else { resp = await post_order_with_random_pick_bot ( { idxbin ,
              useremail , apikey , 
              currency : marketinfo?.base ,
              pair : marketinfo?.quote ,
              type : 'limit',
              side : 'sell' ,
              amount : orderamount ,
              price : orderprice , tickersymbol_snake
             })
             LOGGER ( { resp } )
            }
          }
        }
//        continue
//        process.exit ( 1 )
        /** BUY SIDE */
        for ( let idxbin = 0 ; idxbin < N_ORDER_BINS_A_SIDE ; idxbin ++ ) {
          let bin_border_low = midprice - ( 2 + idxbin ) * stepsize
          let bin_border_high= midprice - ( 1 + idxbin ) * stepsize
          let bin_mid         = midprice- ( 1.5+idxbin ) * stepsize //
          let n_orders = getRandomInt ( 1 , N_MAX_ORDERS_A_BIN )
          for ( let idxorder = 0 ; idxorder < n_orders ; idxorder ++ ) {
            let orderprice = get_random_float ( { max : bin_border_high   , min : bin_border_low } )
            let orderamount= get_random_float ( { max : MAX_ORDER_AMOUNT  , min : MIN_ORDER_AMOUNT })
            // let orderprice = get_random_float ( { max : marketinfo?.LIMIT_PRICE_MAX , min: marketinfo?.LIMIT_PRICE_MIN  })
            // let orderamount= get_random_float ( { max : marketinfo?.LIMIT_AMOUNT_MAX , min : marketinfo?.LIMIT_AMOUNT_MIN })
            let { useremail , apikey } = get_random_from_arr ( arr_useremail_apikeys )
            await post_order ( { idxbin ,
              useremail , apikey ,
              currency : marketinfo?.base ,
              pair : marketinfo?.quote ,
              type : 'limit',
              side : 'buy' ,
              amount : orderamount ,
              price : orderprice , tickersymbol_snake
            })
          }
        }
      }
      else { }
    }
    catch {}
//    process.exit ( 1 )
  }
}
// main ( { MAX_STOP_SYMBOL_ITER_AT : 10 } )
main ( { MAX_STOP_SYMBOL_ITER_AT : 5  } )
// main ( { MAX_STOP_SYMBOL_ITER_AT : 1  } )
module.exports = {
  main ,
  get_user_apikeys_from_db
}
/* 
QUERY MARKET INFO => TRADE PAIR ,  MIN ORDER AMOUNT , DECIMALS
FETCH BINANCE TICKER 
SET BIN SIZE , MIN STEP SIZE ALONG PRICE AXIS
PLACE LIMIT SELL ORDERS
PLACE LIMIT BUY ORDERS
*/
