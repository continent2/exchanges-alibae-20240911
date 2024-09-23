
/* QUERY MARKET INFO => TRADE PAIR ,  MIN ORDER AMOUNT , DECIMALS
FETCH BINANCE TICKER
SET BIN SIZE , MIN STEP SIZE ALONG PRICE AXIS
PLACE LIMIT SELL ORDERS
PLACE LIMIT BUY ORDERS
*/
const db = require( '../models' )
const axios = require( 'axios' )
const { getRandomInt  , get_random_float } = require ( '../utils/math' )
const { parse_orderbook } = require ( '../utils/exchanges/binance' )
const rediscli = require('async-redis').createClient()  // const { place_order } = require ( '../utils/exchanges/alibae' )
let list_tradepair = [ 'BTC_USDT' ]
// let list_tradepair = [ 'BTC_USDT' , 'ETH_USDT' ]
const BIN_EP_SPOT_TICKER = `https://api.binance.com/api/v3/ticker/price?symbol=`
// EX: `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
// resp.data => { symbol: 'BTCUSDT', price: '57727.99000000' }

const BIN_EP_ORDERBOOK = `https://api.binance.com/api/v3/depth` // ?limit=10&symbol=`
// https://api.binance.com/api/v3/depth?limit=10&symbol=BTCUSDT

let N_BINANCE_ORDERBOOK_QUERY_COUNT = 40
// let N_ORDER_BINS_A_SIDE = 10
let N_ORDER_BINS_A_SIDE = 40
// let N_ORDER_BINS_A_SIDE = 100
// let N_MAX_ORDERS_A_BIN = 2
let N_MAX_ORDERS_A_BIN = 1
let MAX_ORDER_AMOUNT = 10 
let MIN_ORDER_AMOUNT = 0.1
let DIVIDER_4_STEPSIZE = 10000
const place_order = ( { idxbin , side , type , tickersymbol_snake , price , amount } )=>{ // type : 'buy'  , 'sell'
  console.log ( 'ORDER' ,idxbin , tickersymbol_snake , side , type , price , amount )
}
/** {
  XVG_ETH: '{"base":"XVG","quote":"ETH","symbol":"XVG_ETH","PRECISION_PRICE":8,"PRECISION_AMOUNT":0,"LIMIT_AMOUNT_MIN":1,"LIMIT_AMOUNT_MAX":90000000,"LIMIT_PRICE_MIN":1e-8,"LIMIT_PRICE_MAX":1000}',
  XRP_TRY: '{"base":"XRP","quote":"TRY","symbol":"XRP_TRY","PRECISION_PRICE":2,"PRECISION_AMOUNT":0,"LIMIT_AMOUNT_MIN":1,"LIMIT_AMOUNT_MAX":92141578,"LIMIT_PRICE_MIN":0.01,"LIMIT_PRICE_MAX":1000}',
  BTC_ARS: '{"base":"BTC","quote":"ARS","symbol":"BTC_ARS","PRECISION_PRICE":0,"PRECISION_AMOUNT":5,"LIMIT_AMOUNT_MIN":0.00001,"LIMIT_AMOUNT_MAX":67,"LIMIT_PRICE_MIN":1,"LIMIT_PRICE_MAX":1356378240}',
*/
const fetch_ticker_symbols = async ()=>{
  let j_ticker_symbols = await rediscli.hgetall ( 'TRADEPAIRS' )
  return j_ticker_symbols
}
const main = async ( { MAX_STOP_SYMBOL_ITER_AT } )=>{
  let j_ticker_symbols  = await fetch_ticker_symbols ()
  let arr_ticker_symbols = Object.keys ( j_ticker_symbols )
  if( true ) {  list_tradepair = arr_ticker_symbols }
  else {    list_tradepair = [ 'BTC_USDT' ] }
  let max_iter_symbols 
  if ( MAX_STOP_SYMBOL_ITER_AT ){ max_iter_symbols = MAX_STOP_SYMBOL_ITER_AT }
  else { max_iter_symbols = list_tradepair?.length }
  for ( let idxsymbols = 0 ; idxsymbols < max_iter_symbols ; idxsymbols ++ ){
    let tickersymbol_snake = list_tradepair [ idxsymbols ]
    let tickersymbol = tickersymbol_snake.replace ( /_/g, '' )
    let marketinfo = JSON.parse ( j_ticker_symbols [ tickersymbol_snake ] )
    let ep = `${ BIN_EP_ORDERBOOK }` //    let ep = `${ BIN_EP_SPOT_TICKER }${ tickersymbol }`
    try {
      let resp = await axios.get ( ep , { params : { limit : N_BINANCE_ORDERBOOK_QUERY_COUNT , symbol : tickersymbol }} )
      if ( resp?.data?.asks?.length ){ //        let { price : midprice } = resp?.data
        let { midprice , buy_volume , sell_volume } = parse_orderbook ( { j_ob : resp?.data })
        console.log ( { midprice , buy_volume , sell_volume } )         
        let stepsize = +midprice / DIVIDER_4_STEPSIZE
        // let stepsize = +midprice / N_ORDER_BINS_A_SIDE
        /** SELL */
        for ( let idxbin = 0 ; idxbin < N_ORDER_BINS_A_SIDE ; idxbin ++ ) {
          let bin_border_low  = midprice + ( 1 + idxbin ) * stepsize
          let bin_border_high = midprice + ( 2 + idxbin ) * stepsize
          let bin_mid         = midprice + ( 1.5+idxbin ) * stepsize
//          LOGGER( { bin_border_low , bin_border_high , bin_mid })
  //        continue
          let n_orders = getRandomInt ( 1 , N_MAX_ORDERS_A_BIN )
          for ( let idxorder = 0 ; idxorder < n_orders ; idxorder ++ ){
            let orderprice = get_random_float ( { max : bin_border_high , min: bin_border_low })
            let orderamount= get_random_float ( { max : MAX_ORDER_AMOUNT , min : MIN_ORDER_AMOUNT })
             await place_order ( {   idxbin ,
              currency : marketinfo?.base ,
              pair : marketinfo?.quote ,
              type : 'limit',
              side : 'sell' ,
              amount : orderamount ,
              price : orderprice , tickersymbol_snake
             })
          }
        }
        process.exit ( 1 )
        /** BUY  */
        for ( let idxbin = 0 ; idxbin < N_ORDER_BINS_A_SIDE ; idxbin ++ ) {
          let bin_border_low = midprice - ( 2 + idxbin ) * stepsize
          let bin_border_high= midprice - ( 1 + idxbin ) * stepsize
          let n_orders = getRandomInt ( 1 , N_MAX_ORDERS_A_BIN )
          for ( let idxorder = 0 ; idxorder < n_orders ; idxorder ++ ){
            let orderprice = get_random_float ( { max : bin_border_high , min: bin_border_low })
            let orderamount= get_random_float ( { max : MAX_ORDER_AMOUNT , min : MIN_ORDER_AMOUNT })
            await place_order ( {
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
    process.exit ( 1 )
  }
}

main ( { MAX_STOP_SYMBOL_ITER_AT : 1 })

/* 
QUERY MARKET INFO => TRADE PAIR ,  MIN ORDER AMOUNT , DECIMALS
FETCH BINANCE TICKER 
SET BIN SIZE , MIN STEP SIZE ALONG PRICE AXIS
PLACE LIMIT SELL ORDERS
PLACE LIMIT BUY ORDERS
*/
