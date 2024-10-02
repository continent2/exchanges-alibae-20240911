/* BOT- RUNTIME - DRIFT

1-1-1)REFERENCE THE LAST FETCHED TICKER PRICE OR MIDPRICE
1-1-2)REFERENCE THE LAST FETCHED VOLUME POWER
1-2-1)SET ORDER AMOUNT DISTR IN REFERENCE TO MARKET PRICE
1-2-2)SET ORDER FREQUENCY DISTR ACCORDINGLY
2-1)SET LIMIT : MARKET ORDER FREQ RATIO = 7 : 3
2-2)SET LIMIT : MARKET AMOUNT RATIO = 1 : 1 
3)POISSON => POST ORDER
*/
const MODE_TEST_1 = true // 'TEST_1'
const { API_PATH } = require('../configs/binance' )
const poissonProcess = require('poisson-process')
const axios = require ( 'axios' )
const { parse_orderbook } = require( '../utils/exchanges/binance' )
const { place_order } = require ( '../utils/exchanges/common' )
const { gaussian, gaussian_with_polarity } = require ( '../utils/math' )
const rediscli = require ( 'async-redis' ).createClient()
const { KEYNAMES } = require( '../configs/keynames' )
const { get_tickers, get_orderbook, post_order, post_order_with_random_pick_bot } = require ( '../utils/exchanges/alibae' )
const { conv_array_to_object } = require('../utils/common')
const db=require( '../models' )
const LOGGER = console.log
const moment = require( 'moment' )
// let list_tradepair = [ 'BTC_USDT' ]
let AVERAGE_DRIFT_ORDER_INTERVAL_IN_SEC = 5 // DEV 
let LIMIT_TO_MARKET_ORDER_COUNT_RATIO = [ 0.7 , 0.3 ]
let BUY_TO_SELL_FREQ_RATIO = [ 0.5 , 0.5 ]
// let ORDER_PRICE_DIST_STDEV = 0.25 // THAT MUCH AWAY FROM THE MEAN
let ORDER_PRICE_DIST_STDEV = 0.10
let ORDER_AMOUNT_MEAN_DEFAULT_FALLBACK = +0.01
// let N_BINANCE_ORDERBOOK_QUERY_COUNT = 40
// let THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT = 1.3 // PERCENT
// let REFPRICE_DIVIDER_FOR_STDEV_OF_RANDOM_PRICE_DIST = 30

const decide_limit_market_random = ()=>{
  let randsign = Math.sign ( Math.random() - LIMIT_TO_MARKET_ORDER_COUNT_RATIO[ 0 ] )
  switch ( randsign ){
    case -1 : return 'limit' ; break
    case +1 : return 'market'; break
   }
}
const decide_buy_sell_random = ()=>{
  let randsign = Math.sign ( Math.random() - LIMIT_TO_MARKET_ORDER_COUNT_RATIO[ 0 ] )
  switch ( randsign ){
    case -1 : return 'buy' ; break 
    case +1 : return 'sell' ; break
  }
}
// AMOUNT @SELL SIDE => SHORT BASE
// AMOUNT @BUY  SIDE => SHORT QUOTE
const decide_amount_random = async ( { tickersymbol } )=>{
  let mean_amount = +ORDER_AMOUNT_MEAN_DEFAULT_FALLBACK
  let resp = await rediscli.hget ( KEYNAMES?.REDIS?.REF_MEAN_ORDER_AMOUNT , tickersymbol )
  if ( resp ) {     mean_amount = +resp  }
  else { }
//  let amount  = gaussian ( { mean : mean_amount , stdev : ORDER_PRICE_DIST_STDEV } )
//  return amount  
  let amount  = gaussian ( { mean : mean_amount , stdev : ORDER_PRICE_DIST_STDEV * mean_amount } )
  return Math.abs( amount ) 
}
const decide_price_random = ( { pricemean , pricestdevnorm , side })=>{
  const MAP_SIDE_POLARITY = { sell : +1 , buy : -1 , SELL : +1 , BUY : -1 }
  let price =  gaussian_with_polarity ( { 
    mean: pricemean ,
    stdev: pricestdevnorm ,
    polarity : MAP_SIDE_POLARITY [ side ]
  } )
  return  price
//  return pricemean + MAP_SIDE_POLARITY[ side ] * Math.abs( price_percent)  
//  return ( 1 + MAP_SIDE_POLARITY[ side ] * Math.abs( price_percent)  )*pricemean
}
const parse_setting_params=async ()=>{
  let respsettings = await db[ 'settings'].findAll ( { raw: true , where : { group: 'DRIFT' , active : 1 } } )
  let jsettings = conv_array_to_object( { arr: respsettings , keyfieldname : 'key' , valuefieldname : 'value' })
  if ( jsettings[ 'AVERAGE_DRIFT_ORDER_INTERVAL_IN_SEC' ] && Number.isFinite( +jsettings[ 'AVERAGE_DRIFT_ORDER_INTERVAL_IN_SEC' ])){ AVERAGE_DRIFT_ORDER_INTERVAL_IN_SEC = +jsettings[ 'AVERAGE_DRIFT_ORDER_INTERVAL_IN_SEC' ] }
  else {}
  if ( jsettings[ 'LIMIT_TO_MARKET_ORDER_COUNT_RATIO' ] ){ LIMIT_TO_MARKET_ORDER_COUNT_RATIO = JSON.parse( jsettings[ 'LIMIT_TO_MARKET_ORDER_COUNT_RATIO' ] )  }
  else {}
  if ( jsettings[ 'BUY_TO_SELL_FREQ_RATIO' ] ){ BUY_TO_SELL_FREQ_RATIO = JSON.parse( jsettings[ 'BUY_TO_SELL_FREQ_RATIO' ] ) }
  else {}
  if ( jsettings[ 'ORDER_PRICE_DIST_STDEV' ] && Number.isFinite( +jsettings[ 'ORDER_PRICE_DIST_STDEV' ])){ ORDER_PRICE_DIST_STDEV = +jsettings[ 'ORDER_PRICE_DIST_STDEV' ] }
  else {}
  if ( jsettings[ 'ORDER_AMOUNT_MEAN_DEFAULT_FALLBACK' ] && Number.isFinite( +jsettings[ 'ORDER_AMOUNT_MEAN_DEFAULT_FALLBACK' ])){ ORDER_AMOUNT_MEAN_DEFAULT_FALLBACK = +jsettings[ 'ORDER_AMOUNT_MEAN_DEFAULT_FALLBACK' ] }
  else {}
}
const fs=require('fs')
// const get_refprice = async ()=>{  }
const main = async ()=>{
  await parse_setting_params()
  let fstream = fs.createWriteStream( "log-bot-drift.txt", {flags:'a'})
  let pp_sync = poissonProcess.create( AVERAGE_DRIFT_ORDER_INTERVAL_IN_SEC * 1000 , async () => {
    let jtickersymbol_ref_strikeprices = await rediscli.hgetall ( KEYNAMES?.REDIS?.REF_STRIKEPRICE )
    let jtickersymbol_ref_midprices = await rediscli.hgetall ( KEYNAMES?.REDIS?.REF_MIDPRICE )
    let jtradepairs             = await rediscli.hgetall ( KEYNAMES?.REDIS?.TRADEPAIRS )
    let arr_tps 
    switch ( MODE_TEST_1 ){
      case true : arr_tps = [ 'BTC_USDT' ] ; break
      default :   arr_tps = Object.keys ( jtradepairs ); break
    }    
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
      LOGGER ( { amountinbase })
      let price = decide_price_random ( { 
        pricemean : refprice ,
        pricestdevnorm: +ORDER_PRICE_DIST_STDEV * +refprice, 
//        pricestdevnorm: +ORDER_PRICE_DIST_STDEV , // / +refprice, 
        side 
      } )
      amountinquote = +amountinbase * +price
//      amountinquote = amountinbase / +price
      let orderdata = {
        currency ,
        pair ,
        type ,
        side ,
        amount : side == 'sell' ? amountinbase : amountinquote ,
        price : type == 'limit' ? price : null ,
      }
      if ( fstream ){
        fstream.write ( 'POST ORDER:' + `${ JSON.stringify( orderdata )}\n`)
      }
      else {
        await post_order_with_random_pick_bot ( orderdata )
      } 
    }
  })
  pp_sync.start()
}
//false && main ()
main()

module.exports = { 
  main ,
  decide_amount_random ,
  decide_price_random
}
