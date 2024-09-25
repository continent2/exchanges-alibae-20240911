/* BOT- RUNTIME - DRIFT

1-1-1)REFERENCE THE LAST FETCHED TICKER PRICE OR MIDPRICE
1-1-2)REFERENCE THE LAST FETCHED VOLUME POWER
1-2-1)SET ORDER AMOUNT DISTR IN REFERENCE TO MARKET PRICE
1-2-2)SET ORDER FREQUENCY DISTR ACCORDINGLY
2-1)SET LIMIT : MARKET ORDER FREQ RATIO = 7 : 3
2-2)SET LIMIT : MARKET AMOUNT RATIO = 1 : 1 
3)POISSON => POST ORDER
*/
const { default: axios } = require('axios')
const { API_PATH } = require('../configs/binance' )
const poissonProcess = require('poisson-process')
const axios = require ( 'axios' )
const { parse_orderbook } = require( '../utils/exchanges/binance' )
const { place_order } = require ( '../utils/exchanges/common' )
const { gaussian, gaussian_with_polarity } = require ( '../utils/math' )
const rediscli = require ( 'async-redis' ).createClient()
const { KEYNAMES } = require( '../configs/keynames' )
const { get_tickers, get_orderbook, post_order, post_order_with_random_pick_bot } = require ( '../utils/exchanges/alibae' )
const { gaussian } = require ( '../utils/math' )
// let list_tradepair = [ 'BTC_USDT' ]
let N_BINANCE_ORDERBOOK_QUERY_COUNT = 40
let THRESHOLD_DELTA_TO_TRIGGER_SYNC_IN_PERCENT = 1.3 // PERCENT
let AVERAGE_DRIFT_ORDER_INTERVAL_IN_SEC = 5 // DEV 
let DIVIDER_FOR_RANDOM_PRICE_DIST = 30
const LIMIT_TO_MARKET_RATIO = [ 0.7 , 0.3 ]
let BUY_TO_SELL_RATIO = [ 0.5 , 0.5 ]
const ORDER_PRICE_DIST_STDEV = 0.25 // THAT MUCH FROM THE MEAN
const decide_limit_market_random = ()=>{
  let randsign = Math.sign ( Math.random() - LIMIT_TO_MARKET_RATIO[ 0 ] )
  switch ( randsign ){
    case -1 : return 'limit' ; break
    case +1 : return 'market'; break
   }
}
const decide_buy_sell_random = ()=>{
  let randsign = Math.sign ( Math.random() - LIMIT_TO_MARKET_RATIO[ 0 ] )
  switch ( randsign ){
    case -1 : return 'buy' ; break 
    case +1 : return 'market' ; break
  }
}
// AMOUNT @SELL SIDE => SHORT BASE
// AMOUNT @BUY  SIDE => SHORT QUOTE
const ORDER_AMOUNT_MEAN_DEFAULT_FALLBACK = +0.01
const decide_amount_random = async ( { tickersymbol } )=>{
  let mean_amount = ORDER_AMOUNT_MEAN_DEFAULT_FALLBACK
  let resp = await rediscli.hget ( KEYNAMES?.REDIS?.REF_MEAN_ORDER_AMOUNT , tickersymbol )
  if ( resp ) {     mean_amount = +resp  }
  else { }
  let amount  = gaussian ( mean_amount , ORDER_PRICE_DIST_STDEV * mean_amount )
  return amount
}
const decide_price_random = ( { pricemean , pricestdevnorm , side })=>{
  const MAP_SIDE_POLARITY = { sell : +1 , buy : -1 , SELL : +1 , BUY : -1 }
  return gaussian_with_polarity ( { 
    mean: pricemean ,
    stdev: pricestdevnorm ,
    polarity : MAP_SIDE_POLARITY [ side ]
  } )
}
const main = async ()=>{
  let pp_sync = poissonProcess.create( AVERAGE_DRIFT_ORDER_INTERVAL_IN_SEC * 1000 , async () => {
    let jtickersymbol_ref_strikeprices = await rediscli.hgetall ( KEYNAMES?.REDIS?.REF_STRIKEPRICE )
    let jtickersymbol_ref_midprices = await rediscli.hgetall ( KEYNAMES?.REDIS?.REF_MIDPRICE )
    let jtradepairs             = await rediscli.hgetall ( KEYNAMES?.REDIS?.TRADEPAIRS )
    let arr_tps = Object.keys ( jtradepairs )
    let refprice 
    let currency , pair , type ,  side , amount , price 
    let amountinbase  , amountinquote
    for ( let idx = 0 ; idx < arr_tps?.length ; idx ++ ){
      let tickersymbol = arr_tps [ idx ]
      let [ base , quote ] = tickersymbol.split ( /_/g )
      refprice = jtickersymbol_ref_midprices[ tickersymbol] ? jtickersymbol_ref_midprices[ tickersymbol] : jtickersymbol_ref_strikeprices [ tickersymbol]
      currency = base
      pair = quote
      type = decide_limit_market_random()
      side = decide_buy_sell_random ()
      amountinbase = await decide_amount_random ( { tickersymbol } ) // THE BINANCE WAY
      price = decide_price_random ( { 
        pricemean : refprice ,
        pricestdevnorm: ORDER_PRICE_DIST_STDEV, 
        side 
      } )
      amountinquote = amountinbase / price
      await post_order_with_random_pick_bot ( {
        currency ,
        pair ,
        type ,
        side ,
        amount : side == 'sell' ? amountinbase : amountinquote ,
        price : type == 'limit' ? price : null ,
      }) 
    }
  })
  pp_sync.start()
}
main ()

module.exports = { 
  main
}
