
const db = require( '../models' )
const axios = require( 'axios' )
const { getRandomInt  , get_random_float } = require ( '../utils/math' )
const { parse_orderbook } = require ( '../utils/exchanges/binance' )
let list_tp = [ 'BTC_USDT' ]
// let list_tp = [ 'BTC_USDT' , 'ETH_USDT' ]
const BIN_EP_SPOT_TICKER = `https://api.binance.com/api/v3/ticker/price?symbol=`
// EX: `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
// resp.data => { symbol: 'BTCUSDT', price: '57727.99000000' }

const BIN_EP_ORDERBOOK = `https://api.binance.com/api/v3/depth` // ?limit=10&symbol=`
// https://api.binance.com/api/v3/depth?limit=10&symbol=BTCUSDT

let N_BINANCE_ORDERBOOK_QUERY_COUNT = 40
// let N_ORDER_BINS_A_SIDE = 10
let N_ORDER_BINS_A_SIDE = 40
// let N_ORDER_BINS_A_SIDE = 100
let N_MAX_ORDERS_A_BIN = 2
let MAX_ORDER_AMOUNT = 10 
let MIN_ORDER_AMOUNT = 0.1
let DIVIDER_4_STEPSIZE = 10000
const place_order = ( { type , price , amount } )=>{ // type : 'buy'  , 'sell'
  console.log ( 'ORDER' , type , price , amount )
}

const main = async ( )=>{
  for ( let idxsymbols = 0 ; idxsymbols < list_tp?.length ; idxsymbols ++ ){
    let tickersymbol = list_tp [ idxsymbols ]
    tickersymbol = tickersymbol.replace ( /_/g, '' )
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
          let border_low = midprice + ( 1 + idxbin ) * stepsize
          let border_high= midprice + ( 2 + idxbin ) * stepsize
          let n_orders = getRandomInt ( 1 , N_MAX_ORDERS_A_BIN )
          for ( let idxorder = 0 ; idxorder < n_orders ; idxorder ++ ){
            let orderprice = get_random_float ( { max : border_high , min: border_low })
            let orderamount= get_random_float ( { max : MAX_ORDER_AMOUNT , min : MIN_ORDER_AMOUNT })
             place_order ( { type: 'sell' , price : orderprice , amount : orderamount })
          }
        }
        /** BUY  */
        for ( let idxbin = 0 ; idxbin < N_ORDER_BINS_A_SIDE ; idxbin ++ ) {
          let border_low = midprice - ( 2 + idxbin ) * stepsize
          let border_high= midprice - ( 1 + idxbin ) * stepsize
          let n_orders = getRandomInt ( 1 , N_MAX_ORDERS_A_BIN )
          for ( let idxorder = 0 ; idxorder < n_orders ; idxorder ++ ){
            let orderprice = get_random_float ( { max : border_high , min: border_low })
            let orderamount= get_random_float ( { max : MAX_ORDER_AMOUNT , min : MIN_ORDER_AMOUNT })
            await place_order ( { type: 'buy' , price : orderprice , amount : orderamount })
          }
        }
      }
      else { }
    }
    catch {}
  }
}

main ()

/* 
QUERY MARKET INFO => TRADE PAIR ,  MIN ORDER AMOUNT , DECIMALS
FETCH BINANCE TICKER 
SET BIN SIZE , MIN STEP SIZE ALONG PRICE AXIS
PLACE LIMIT SELL ORDERS
PLACE LIMIT BUY ORDERS
*/
