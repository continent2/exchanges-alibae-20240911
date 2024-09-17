
const db = require( '../models' )
const axios = require( 'axios')
let list_tp = [ 'BTC_USDT' , 'ETH_USDT' ]
const BIN_EP_SPOT_TICKER = `https://api.binance.com/api/v3/ticker/price?symbol=`
// EX: `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`

const main = async ( { } )=>{
  
}

main ()

/* 
QUERY MARKET INFO => TRADE PAIR ,  MIN ORDER AMOUNT , DECIMALS
FETCH BINANCE TICKER 
SET BIN SIZE , MIN STEP SIZE ALONG PRICE AXIS
PLACE LIMIT SELL ORDERS
PLACE LIMIT BUY ORDERS
*/
