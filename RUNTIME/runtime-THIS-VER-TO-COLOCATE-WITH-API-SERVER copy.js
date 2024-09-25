/* SET EAGERNESS = 0.8? (EAGER=
    30초 ~ 2분 사이 랜덤한 시간 간격으로 BINANCE 시세 FETCH
    CALCULATE DELTA =PRICE_{BINANACE} - PRICE_{ LOCAL } ) 
    IF DELTA >=THRESHOLD
    CATCH UP / FOLLOW MARKET PRICE BY PLACING MARKET ORDERS
    RANDOM MARKOV DRIFT
*/
const { default: axios } = require('axios')
const { API_PATH } = require('../configs/binance' )
const poissonProcess = require('poisson-process')
const axios = require ( 'axios' )
const { parse_orderbook } = require( '../utils/exchanges/binance' )
const { place_order } = require ( '../utils/exchanges/common' )
const { gaussian } = require ( '../utils/math' )
const rediscli = require ( 'async-redis' ).createClient()
const { get_tickers } = require ( '../utils/exchanges/alibae' )
// let list_tradepair = [ 'BTC_USDT' ]
let N_BINANCE_ORDERBOOK_QUERY_COUNT = 40
let THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT = 1.3 // PERCENT
let AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC = 75
let REFPRICE_DIVIDER_FOR_STDEV_OF_RANDOM_PRICE_DIST = 30
const get_local_strikeprice = async ( { tickersymbol } )=>{
}
const get_tickersymbols = async ()=>{   // let j_ticker_symbols  = await fetch_ticker_symbols ()
  let list_tradepair
  let j_ticker_symbols = await rediscli.hgetall ( 'TRADEPAIRS' )
  let arr_ticker_symbols = Object.keys ( j_ticker_symbols )
  if( true ) {  list_tradepair = arr_ticker_symbols }
  else {    list_tradepair = [ 'BTC_USDT' ] }
  return  { j_ticker_symbols , arr_ticker_symbols , list_tradepair } 
}
const is_trigger_sync = async ({ local_price , ref_price , }) =>{
  local_price = +local_price
  ref_price = +ref_price  
  let delta_normd = ( ref_price - local_price ) / ref_price
  if ( Math.abs ( delta_normd ) > THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT / 100 ) { return true }
  else { return false }
}
const generate_random_limit_order = async ( {
    targetprice , 
  })=>{
  let REFPRICE_DIVIDER_FOR_STDEV_OF_RANDOM_PRICE_DIST = 30
  let price = gaussian ({ mean : targetprice , stdev : targetprice / REFPRICE_DIVIDER_FOR_STDEV_OF_RANDOM_PRICE_DIST })
  let amount = Math.random ()
  await place_order ( { type : ( price < targetprice ) ? 'limitbuy' : 'limitsell' , 
    tickersymbol , 
    price , 
    amount // : amountinquote
  })
}
const sweep_up_counter_orders = async ( { tickersymbol , localprice , targetprice } ) =>{
  let delta = localprice - targetprice
  let signdelta = Math.sign ( delta )
  switch ( signdelta ) {
    case +1 : // DO MARKET SELL ( BASE CURRENCY )=> FIND BUYS , (QUOTE AMOUNT)*PRICE = BASE AMOUNT
{      let resporders = await db[ 'orders' ].findAndCountAll ( { raw: true, where : {
        tickersymbol ,
        type : 'BUY' // SHORT QUOTE CURRENCY , LONG BASE/ASSET CURRENCY
      } , offset : 0 
      , order : [ [ 'price' , 'ASC' ] , [ 'id' , 'ASC' ] ] // 
    })
      let minabsdeltaprice = +10000_0000_0000_0000
      let idxatmin
      let amountinbase = 0
      for ( let idxorder = 0 ; idxorder < resporders?.length ; idxorder ++ ){
        let order = resporders [ idxorder ]
        let { price , amount } = order ; price = +price
        let absdeltaprice = Math.abs ( price - targetprice )
        if ( minabsdeltaprice < absdeltaprice ){ 
          amountinbase += amount * price
          idxatmin = idxorder 
          minabsdeltaprice = absdeltaprice
        }
        else if ( minabsdeltaprice >= absdeltaprice ) {  // THE REST CASES
          break
        }
      }
      await place_order ( { type : 'marketsell', 
        tickersymbol , 
        price : null , 
        amount : amountinbase })
}
    break 
    case -1 : // DO BUY  => FIND SELLS (OF )
      let resporders = await db[ 'orders'].findAndCountAll ( { raw: true,  where : {
          tickersymbol ,
          type : 'SELL' ,
        } , offset : 0 
        , order : [ [ 'price' , 'DESC'] , ['id' , 'ASC' ]]
      })
      let minabsdeltaprice = +10000_0000_0000_0000
      let idxatmin
      let amountinquote = 0
      for ( let idxorder = 0 ; idxorder < resporders?.length ; idxorder ++ ){
        let order = resporders [ idxorder ]
        let { price , amount } = order ; price = +price
        let absdeltaprice = Math.abs ( price - targetprice )
        if ( minabsdeltaprice < absdeltaprice ){
          amountinquote += amount / price
          idxatmin = idxorder
          minabsdeltaprice = absdeltaprice
        }
        else if ( minabsdeltaprice >= absdeltaprice ){
          break
        }
      }
      await place_order ( { type : 'marketbuy', 
        tickersymbol , 
        price : null , 
        amount : amountinquote
      })
    break
    case 0 : // PRICE ALREADY SYNC'ED => NOTHING TO DO ?
    break
  }
}
const main = async ()=>{
  let pp_sync = poissonProcess.create( AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC * 1000 , async () => {
    console.log( 'SYNCING TO REF' )
    let { j_ticker_symbols , arr_ticker_symbols , list_tradepair } = await get_tickersymbols ()
    /** LOCAL PRICE */
    let j_tickersymbol_prices = await get_tickers ()
    /** FETCH REF - BINANCE */
    for ( let idxtp = 0 ; idxtp< list_tradepair?.length ; idxtp ++ ) {
      let aproms = []
      let tickersymbol = list_tradepair[ idxtp ]
      let tickersymbol_binance = tickersymbol.replace ( /_/g, '' )
      aproms[ aproms?.length ] = axios.get ( `${ API_PATH?.BIN_EP_SPOT_TICKER  }${ tickersymbol_binance }` )
      aproms[ aproms?.length ] = axios.get ( `${ API_PATH?.BIN_EP_ORDERBOOK    }` , { params : { limit : N_BINANCE_ORDERBOOK_QUERY_COUNT , symbol : tickersymbol_binance }} )
      let aresps = await Promise.all ( aproms )
      let ref_strikeprice , midprice , j_ob , j_ob_stats
      if ( aresps [ 0 ] && aresps [0].data && aresps [0].data?.price ){ ref_strikeprice = +aresps [0].price }
      if ( aresps [ 1 ] && aresps [1].data && aresps [1].data?.bids  ){
        j_ob = aresps [1].data
        j_ob_stats = parse_orderbook( { j_ob } )
        midprice = j_ob_stats?.midprice
      }
      let local_strikeprice = j_tickersymbol_prices [ tickersymbol ] // let local_strikeprice = await get_local_strikeprice ( { tickersymbol } )      
      if ( is_trigger_sync ( { local_price : local_strikeprice , ref_price : ref_strikeprice } )) {        
        await sweep_up_counter_orders ( { tickersymbol , 
          localprice : local_strikeprice , 
          targetprice : ref_strikeprice 
        } )
      } // DO SYNC
      else {
        LOGGER ( `LOG@bot runtime: delta within threshold , ${ local_strikeprice } , ${ ref_strikeprice }`)
      } // DO NOT SYNC
    }    
  })
  pp_sync.start()
}
main ()
