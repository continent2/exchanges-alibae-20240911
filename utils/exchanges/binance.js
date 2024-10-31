
// const BIN_EP_ORDERBOOK = `https://api.binance.com/api/v3/depth?limit=10&symbol=`
// https://api.binance.com/api/v3/depth?limit=10&symbol=BTCUSDT
const axios = require ( 'axios' )
const rediscli=require( 'async-redis' ).createClient()
const moment = require ( 'moment' )
const URL = `https://api.binance.com/api/v3`
const MAP_FUNCTION_NAME_TO_PATH = {
  VOLUME_AND_TICKER : `ticker/24hr`
}
const { KEYNAMES }  = require ('../../configs/keynames' ) 
const KEYNAME_REF_VOLUME = KEYNAMES?.REDIS?.REF_VOLUME
const STRINGER = JSON.stringify
const MAP_FUNCTION_NAME_TO_ENDPOINT = ( name )=>{  return `${ URL }/${ MAP_FUNCTION_NAME_TO_PATH[ name] }`
}
const db = require ( '../../models' )

const get_ref_volume_and_ticker = async ( { isreturnvalue } )=>{
  let resp = await axios.get ( MAP_FUNCTION_NAME_TO_ENDPOINT ( 'VOLUME_AND_TICKER' ) )
  let {status} = resp ; status = +status
  if ( Number.isFinite( status ) && status >= 200 && status < 400 ){ 
    let timestamp = moment().unix()
    for ( let dataitem of resp?.data ){
      let { symbol , lastPrice , volume , quoteVolume } = dataitem
      await rediscli.hset ( KEYNAME_REF_VOLUME , symbol , STRINGER( {
        price : lastPrice , 
        volumeinbase : volume ,
        volumeinquote: quoteVolume ,
        timestamp
      } ) )
      await db['tradevolumes'].create  ( {
        symbolref : symbol , // : '',
        price : lastPrice  ,
        volumeinbase : volume ,
        volumeinquote : quoteVolume ,
        timestamp
      })
    }
    if ( isreturnvalue ) { return resp?.data }
    else {}
  }
  else { return null }
}
const sumreduce = (a,b)=>{
  if ( Number.isFinite(a) && Number.isFinite(b) ){ return (a + b) }
  else if ( Number.isFinite(b) ){ return (b) }
  else if ( Number.isFinite(a) ){ return (a) }
  else { return 0}
}
const get_mean_order_amount_from_orderbook = ( {j_ob_ex })=>{
  let sum = [ 0, 0]
  sum[ 0 ] = j_ob_ex?.bids.map(el => +el[ 1]).reduce ( (a,b) => a+b , 0 )
  sum[ 1 ] = j_ob_ex?.asks.map(el => +el[ 1]).reduce ( (a,b) => a+b , 0 )
  let N = j_ob_ex?.bids?.length + j_ob_ex?.asks?.length
  return ( sum[ 0 ] + sum[ 1 ]) / N
}
const parse_orderbook = ({ j_ob })=>{
  let buy_prices = j_ob?.bids.map ( elem => +elem[ 0 ])
  buy_prices.sort() // ascending
  let buy_price_head = buy_prices[ buy_prices?.length -1 ]
  let sell_prices = j_ob?.asks.map ( elem => +elem[ 0 ])
  sell_prices.sort() // ascending
  let sell_price_head = sell_prices[ sell_prices?.length -1 ]
  let midprice = ( buy_price_head + sell_price_head ) / 2
  let buy_volume =  j_ob?.bids.map(e=>+e[1]).reduce (sumreduce , 0 ) // ( a , b ) => sumreduce(a[ 1 ] , b[ 1 ] ) , 0 )
  let sell_volume = j_ob?.asks.map(e=>+e[1]).reduce (sumreduce , 0 ) // reduce ( ( a , b ) => sumreduce(a[ 1 ] , b[ 1 ] ) , 0 )
  return { buy_price_head , sell_price_head , midprice , buy_volume , sell_volume , total_volume: buy_volume + sell_volume }
}
/* return val : {
  buy_price_head: 58532,
  sell_price_head: 58533,
  midprice: 58532.5,
  buy_volume: 6.2794,
  sell_volume: 2.01002,
  total_volume: 8.28942
} */
let j_spot_ticker_resp = { symbol: 'BTCUSDT', price: '57727.99000000' }
const BINANCE_EP_ORDERBOOK = `https://api.binance.com/api/v3/depth` // ?limit=10&symbol=`
const get_orderbook = async ( { base , quote , limit } ) =>{
  if ( +limit && +limit >=1 ){} else { LOGGER('!!! INVALID ARG@get_orderbook'); return null }
  let resp  = await axios.get ( `${ BINANCE_EP_ORDERBOOK }?limit=${ limit }&symbol=${ base }${ quote }` )
  if ( +resp?.status < 400 ){ }
  else { LOGGER( ) ; return null }
}

module.exports= { 
  get_ref_volume_and_ticker ,
  parse_orderbook , 
  get_mean_order_amount_from_orderbook ,
  get_orderbook
} //  j_ob_ex ,

let j_ob_ex = {
  "lastUpdateId": 51764995056,
  "bids": [
    [
      "58532.00000000",
      "5.59225000"
    ],
    [
      "58531.96000000",
      "0.00021000"
    ],
    [
      "58531.80000000",
      "0.34177000"
    ],
    [
      "58531.12000000",
      "0.00010000"
    ],
    [
      "58531.11000000",
      "0.00010000"
    ],
    [
      "58531.10000000",
      "0.06843000"
    ],
    [
      "58531.04000000",
      "0.00010000"
    ],
    [
      "58530.51000000",
      "0.11115000"
    ],
    [
      "58530.50000000",
      "0.13660000"
    ],
    [
      "58530.22000000",
      "0.02869000"
    ]
  ],
  "asks": [
    [
      "58532.01000000",
      "1.43844000"
    ],
    [
      "58532.02000000",
      "0.00010000"
    ],
    [
      "58532.03000000",
      "0.00019000"
    ],
    [
      "58532.04000000",
      "0.01763000"
    ],
    [
      "58532.49000000",
      "0.00019000"
    ],
    [
      "58532.50000000",
      "0.00431000"
    ],
    [
      "58532.96000000",
      "0.00019000"
    ],
    [
      "58532.97000000",
      "0.10707000"
    ],
    [
      "58532.98000000",
      "0.44127000"
    ],
    [
      "58533.00000000",
      "0.00063000"
    ]
  ]
}

  // let buy_volume =  j_ob?.bids.reduce ( (a,b)=> { +a[ 1 ] + +b[ 1 ] } , 0 )
  // let sell_volume = j_ob?.asks.reduce ( (a,b)=> +a[ 1 ] + +b[ 1 ] , 0 )
