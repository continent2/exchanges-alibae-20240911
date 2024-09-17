
const db = require( '../models' )
const axios = require( 'axios' )
const { getRandomInt  , get_random_float } = require ( '../utils/math' )
let list_tp = [ 'BTC_USDT' , 'ETH_USDT' ]
const BIN_EP_SPOT_TICKER = `https://api.binance.com/api/v3/ticker/price?symbol=`
// EX: `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
// resp.data => { symbol: 'BTCUSDT', price: '57727.99000000' }

const BIN_EP_ORDERBOOK = `https://api.binance.com/api/v3/depth?limit=10&symbol=`
// https://api.binance.com/api/v3/depth?limit=10&symbol=BTCUSDT

let N_ORDER_BINS_A_SIDE = 100
let N_MAX_ORDERS_A_BIN = 2
const place_order_sell =async ( { } )=>{
}

const main = async ( { } )=>{

  for ( let idxsymbols = 0 ; idxsymbols < list_tp?.length ; idxsymbols ++ ){
    let tickersymbol = list_tp [ idxsymbols ]
    tickersymbol = tickersymbol.replace ( /_/g, '' )
    let ep = `${ BIN_EP_SPOT_TICKER }${ tickersymbol }`
    try {
      let resp = await axios.get ( ep )
      if ( resp?.data?.price ){
        let { price : midprice } = resp?.data        
        let stepsize = +price / N_ORDER_BINS_A_SIDE
        for ( let idxbin = 0 ; idxbin < N_ORDER_BINS_A_SIDE ; idxbin ++ ) {
          let border_low = midprice + ( 1 + idxbin ) * stepsize
          let border_high= midprice + ( 2 + idxbin ) * stepsize
          let n_orders = getRandomInt ( 1 , N_MAX_ORDERS_A_BIN )
          for ( let idxorder = 0 ; idxorder < n_orders ; idxorder ++ ){
            let orderprice = get_random_float ( { max : border_high , min: border_low })
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
