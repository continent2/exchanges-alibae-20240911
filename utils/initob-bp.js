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
const {v4: uuid }= require( 'uuid' )
const dbalibae = require( '../models-alibae' )
const BIN_EP_ORDERBOOK = `https://api.binance.com/api/v3/depth` // ?limit=10&symbol=`
let N_BINANCE_ORDERBOOK_QUERY_COUNT = 200
const LOGGER  = console.log
const main = async ()=>{
  for ( let idxtp = 0 ; idxtp < list_tradepair?.length ; idxtp ++ ) {
    let tickersymbol_snake = list_tradepair [ idxtp ]
    let tickersymbol = tickersymbol_snake.replace ( /_/g , '' )
    let ep = `${ BIN_EP_ORDERBOOK }`
    let resp = await axios.get ( ep , { params : { limit : N_BINANCE_ORDERBOOK_QUERY_COUNT ,
       symbol : tickersymbol }} )
    if ( resp?.data?.asks?.length ){ //        let { price : midprice } = resp?.data
      LOGGER ( resp?.data?.asks )
      let [ currency , pair] =tickersymbol_snake.split ( /_/g )
      for ( let order of resp?.data?.asks ){
        let timenow = new Date().toISOString()
        let amount = +order[ 1 ] / +order [ 0 ] 
        await dbalibae[ 'exchange_order' ].create ( { 
          symbol : `${currency}/${pair}` ,
          type : 'limit',
          side : 'sell',
          amount , // : +order[ 1 ] / +order [ 0 ] ,
          price  : +order[ 0 ],
          id : uuid() ,
          userId : 'b1c6cc9b-42c9-40ec-8606-f1329e57e358' ,
          createdAt : timenow ,
          updatedAt : timenow ,
          status : 'OPEN' ,
          timeInForce : 'GTC' ,
          filled : 0 ,
          remaining : amount ,
          cost : 0 ,
          fee : 0 , 
          feeCurrency : pair ,  
        })
      }
    }
    else {}
    for ( let order of resp?.data?.bids ){
      let timenow = new Date().toISOString()
      let amount = +order[ 1 ] // / +order [ 0 ] 
      await dbalibae[ 'exchange_order' ].create ( { 
        symbol : `${currency}/${pair}` ,
        type : 'limit',
        side : 'buy',
        amount , // : +order[ 1 ] / +order [ 0 ] ,
        price  : +order[ 0 ],
        id : uuid() ,
        userId : 'b1c6cc9b-42c9-40ec-8606-f1329e57e358' ,
        createdAt : timenow ,
        updatedAt : timenow ,
        status : 'OPEN' ,
        timeInForce : 'GTC' ,
        filled : 0 ,
        remaining : amount ,
        cost : 0 ,
        fee : 0 , 
        feeCurrency : pair ,  
      })
    }
  }
//    list_tradepair = [ 'BTC_USDT' ] 
}

main ()
