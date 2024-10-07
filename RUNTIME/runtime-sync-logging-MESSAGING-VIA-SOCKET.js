/* SET EAGERNESS = 0.8? (EAGER=
    30초 ~ 2분 사이 랜덤한 시간 간격으로 BINANCE 시세 FETCH
    CALCULATE DELTA =PRICE_{BINANACE} - PRICE_{ LOCAL } ) 
    IF DELTA >=THRESHOLD
    CATCH UP / FOLLOW MARKET PRICE BY PLACING MARKET ORDERS
    RANDOM MARKOV DRIFT
*/
const MODE_TEST_1 = true // 'TEST_1'
const { API_PATH } = require('../configs/binance' )
const poissonProcess = require('poisson-process')
const axios = require ( 'axios' )
const { parse_orderbook , get_mean_order_amount_from_orderbook } = require( '../utils/exchanges/binance' )
const { place_order } = require ( '../utils/exchanges/common' )
const { gaussian } = require ( '../utils/math' )
const rediscli = require ( 'async-redis' ).createClient()
const { get_tickers, get_orderbook, post_order, post_order_with_random_pick_bot } = require ( '../utils/exchanges/alibae' )
const { conv_array_to_object } = require('../utils/common')
const db= require( '../models' )
const { updaterows } = require ( '../utils/db' )
const moment = require( 'moment' )
const { enqueue_act_count_log } =require( '../utils/common' )
// let list_tradepair = [ 'BTC_USDT' ]
let N_BINANCE_ORDERBOOK_ORDER_QUERY_COUNT_A_SIDE = 40
let THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT = 1.3 // PERCENT
let AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC = 75
let poisson_process_for_sync
const { SCHEDULER } = require( '../configs/scheduler' )
let socket
const create_common_channel_socket = async ()=>{
  socket = io( SCHEDULER?.URL_SOCKET_COMPLETE )
  socket.on ( SCHEDULER?.MSG_ACTION_ON_WORKER , data =>{
    let { actiontype , workertype } = PARSER ( data )
    if ( workertype ){ ;   } 
    else { return }
      switch ( workertype ){
        case 'SYNCER' : 
          switch ( actiontype ){
            case 'START' :
              poisson_process_for_sync.start() // define_poisson_process ()
            break 
            case 'STOP' : // { if ( h_interval){ clearInterval ( h_interval ) ; }              }
              poisson_process_for_sync.stop()
            break
          }
        break
        default : break 
      }
  })
}
// let REFPRICE_D IVIDER_FOR_STDEV_OF_RANDOM_PRICE_DIST = 30
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
  let delta_normd_to_percent = 100 * ( ref_price - local_price ) / ref_price
  if ( fstream ){
    fstream.write ( `${moment().toISOString() }, ISTRIGGER: ${ JSON.stringify( {local_price, ref_price,delta: ref_price-local_price , delta_normd_to_percent } ) }\n` )
  }
  if ( Math.abs ( delta_normd_to_percent ) > THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT  ) { return true }
  else { return false }
}
const LOGGER  = console.log
const sweep_up_counter_orders = async ( { tickersymbol , localprice , targetprice } ) =>{
  let n_orders_placed = 0
  let delta = localprice - targetprice
  let absdelta= Math.abs ( localprice - targetprice )
  let signdelta = Math.sign ( delta )
  let [ base , quote ]  = tickersymbol.split ( /_/g )
  let LIMIT_ORDERBOOK_QUERY_COUNT = 10
//  let LIMIT_ORDERBOOK_QUERY_COUNT = 100
//  let LIMIT_ORDERBOOK_QUERY_COUNT = 1000 
  switch ( signdelta ) {
    case +1 : // DO MARKET SELL ( BASE CURRENCY )=> FIND BUYS , (QUOTE AMOUNT)*PRICE = BASE AMOUNT
    // SHORT BASE , LONG QUOTE
    // COUNTER ORDER : LONG BASE , SHORT QUOTE
{     let resporders = await get_orderbook ({ base  , quote  , limit : +LIMIT_ORDERBOOK_QUERY_COUNT })
      LOGGER( { resporders })
/*  let respo rders = await db[ 'orders' ].findAndCountAll ( { raw: true, where : {        tickersymbol ,        type : 'BUY' // SHORT QUOTE CURRENCY , LONG BASE/ASSET CURRENCY
      } , offset : 0       , order : [ [ 'price' , 'ASC' ] , [ 'id' , 'ASC' ] ] // 
    }) */
      let minabsdeltaprice = absdelta
//      let minabsdeltaprice = +1_0000_0000_0000_0000
      let idxatmin
//      let amountinbase = 0
      for ( let idxorder = 0 ; idxorder < resporders?.bids?.length ; idxorder ++ ){
        let order = resporders?.bids[ idxorder ]
        let [ price , amount ] = order
//        let { price , amount } = order ; 
        price = + price
        amount = + amount
        let absdeltaprice = Math.abs ( price - targetprice )
        LOGGER ( { achieved_delta : minabsdeltaprice  , achievable_delta : absdeltaprice} )
        if ( minabsdeltaprice > absdeltaprice ){ LOGGER (  `DECREASEABLE DELTA BY SELL` )
//          amountinbase += amount * price
          let amountinbase = amount * price
          let orderdata = {
            tickersymbol ,             //            apikey : '' ,
            currency : base ,
            pair : quote ,
            type : 'market' ,
            side : 'sell' ,             //            price : null , 
            amount : amountinbase
          }
          if ( fstream ){
            fstream.write ( `${moment().toISOString()},`+'POST ORDER:'+ `${ JSON.stringify ( orderdata )}`+'\n')
          } else {
            await post_order_with_random_pick_bot ( orderdata )
          }
          minabsdeltaprice = absdeltaprice
          idxatmin = idxorder
          ++ n_orders_placed
        }
        else if ( minabsdeltaprice <= absdeltaprice ) {  LOGGER(`NO ACTIONS`) // THE REST CASES
          break
        }
      }      
}
    break 
    case -1 : // DO MARKET BUY  => FIND LIMIT SELLS (OF )
    // SHORT QUOTE , LONG BASE
    // COUNTER ORDER : LONG QUOTE , SHORT BASE 
{     /** let respord ers = await db[ 'orders'].findAndCountAll ( { raw: true,  where : {          tickersymbol ,          type : 'SELL' ,        } , offset : 0         , order : [ [ 'price' , 'DESC'] , ['id' , 'ASC' ]]
      }) */
      let resporders = await get_orderbook ( { base , quote , limit : +LIMIT_ORDERBOOK_QUERY_COUNT })
      let minabsdeltaprice = absdelta // +10000_0000_0000_0000
      let idxatmin
//      let amountinquote = 0
      for ( let idxorder = 0 ; idxorder < resporders?.asks?.length ; idxorder ++ ){
        let order = resporders?.asks[ idxorder ]
        let [ price , amount ] = order
//        let { price , amount } = order        
        price = + price
        amount = + amount
        let absdeltaprice = Math.abs ( price - targetprice )
        LOGGER ( { achieved_delta : minabsdeltaprice , achievable_delta : absdeltaprice} )         
        if ( minabsdeltaprice > absdeltaprice ){  LOGGER (  `DECREASEABLE DELTA BY BUY` )
          let amountinquote = +amount * +price
//          let amountinquote = amount / price
          let orderdata = {
            tickersymbol ,      //            apikey : '' ,
            currency : base ,
            pair : quote ,
            type : 'market' ,
            side : 'buy' ,    //            price : null , 
            amount : amountinquote            
          }
          if ( fstream ){
            fstream.write ( 'POST ORDER:' + `${ JSON.stringify ( orderdata )}`+'\n')
          } else {
            await post_order_with_random_pick_bot ( orderdata )
          }
          minabsdeltaprice = absdeltaprice
          idxatmin = idxorder
          ++ n_orders_placed
        }
        else if ( minabsdeltaprice <= absdeltaprice ){ // NOP
          break
        }
      }
}
    break
    case 0 : // PRICE ALREADY SYNC'ED => NOTHING TO DO ?
    break
  }
  return n_orders_placed
}
const fs=require('fs')
let fstream = fs.createWriteStream( "log-bot-sync.txt", {flags:'a'} )
const define_poisson_process = async ()=>{
  fstream = fs.createWriteStream( "log-bot-sync.txt", {flags:'a'} )
  let respsettings = await db[ 'settings'].findAll ( { raw: true , where : { group: 'SYNC' , active : 1 } } )
  let jsettings = conv_array_to_object ( { arr : respsettings, keyfieldname : 'key', valuefieldname : 'value' })
  if ( jsettings[ 'N_BINANCE_ORDERBOOK_ORDER_QUERY_COUNT_A_SIDE' ] && Number.isFinite(+jsettings[ 'N_BINANCE_ORDERBOOK_ORDER_QUERY_COUNT_A_SIDE' ]) ){ N_BINANCE_ORDERBOOK_ORDER_QUERY_COUNT_A_SIDE = +jsettings[ 'N_BINANCE_ORDERBOOK_ORDER_QUERY_COUNT_A_SIDE' ] }
  else {}
  if ( jsettings[ 'THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT' ] && Number.isFinite(+jsettings[ 'THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT' ]) ){ THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT = +jsettings[ 'THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT' ] }
  else {}
  if ( jsettings[ 'AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC' ] && Number.isFinite(+jsettings[ 'AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC' ]) ){ AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC = +jsettings[ 'AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC' ] }
  else {}
  fstream.write ( `${moment().toISOString()}, STARTING SYNC WITH T=${ AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC }`+'\n' )

  poisson_process_for_sync = poissonProcess.create( AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC * 1000 , async () => {
    console.log(    `SYNCING TO REF with AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC:${AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC}, THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT:${THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT}` )
    fstream.write ( `SYNCING TO REF with AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC:${AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC}\n, THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT(%):${THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT}\n` )
    let { j_ticker_symbols , arr_ticker_symbols , list_tradepair } = await get_tickersymbols ()
    switch ( MODE_TEST_1 ){
      case true : list_tradepair = [ 'BTC_USDT' ] ; break
      default : break
    }
    /** LOCAL PRICE */
    let j_tickersymbol_prices = await get_tickers ()
    let n_orders_placed = 0
    /** FETCH REF - BINANCE */
    for ( let idxtp = 0 ; idxtp< list_tradepair?.length ; idxtp ++ ) {
      let aproms = []
      let tickersymbol = list_tradepair[ idxtp ]
      let tickersymbol_binance = tickersymbol.replace ( /_/g, '' )
      aproms[ aproms?.length ] = axios.get ( `${ API_PATH?.BIN_EP_SPOT_TICKER  }${ tickersymbol_binance }` )
      aproms[ aproms?.length ] = axios.get ( `${ API_PATH?.BIN_EP_ORDERBOOK    }` , { params : { limit : N_BINANCE_ORDERBOOK_ORDER_QUERY_COUNT_A_SIDE , symbol : tickersymbol_binance }} )
      let aresps = await Promise.all ( aproms )
      let ref_strikeprice , midprice , j_ob , j_ob_stats
      if ( aresps [ 0 ] && aresps [0].data && aresps [0].data?.price ){ ref_strikeprice = +aresps [0].data?.price
        await rediscli.hset ( 'REF_STRIKEPRICE' , tickersymbol , ref_strikeprice )
        fstream.write ( `${moment().toISOString()},`+'FETCH REF-STRIKE:' + `${ tickersymbol },${ ref_strikeprice }`+'\n' )
      }
      if ( aresps [ 1 ] && aresps [1].data && aresps [1].data?.bids  ){
        j_ob = aresps [1].data
        j_ob_stats = parse_orderbook( { j_ob } )
        midprice = j_ob_stats?.midprice
        await rediscli.hset ( 'REF_MIDPRICE' , tickersymbol , midprice )
        let mean_order_amount = get_mean_order_amount_from_orderbook ( { j_ob_ex : aresps[ 1 ].data }  )
        await rediscli.hset ( 'REF_MEAN_ORDER_AMOUNT' , tickersymbol , mean_order_amount )
        fstream.write ( `${moment().toISOString()},`+'FETCH REF-MID:' + `${ tickersymbol },${ midprice }`+'\n' )
      }
      let local_strikeprice = j_tickersymbol_prices [ tickersymbol ] // let local_strikeprice = await get_local_strikeprice ( { tickersymbol } )
      fstream.write ( `${moment().toISOString()},`+'LOCAL PRICE:' + `${ tickersymbol },${ local_strikeprice }`+'\n' )
      let b_istrigger_sync = await is_trigger_sync ( { local_price : local_strikeprice , ref_price : ref_strikeprice } )
      fstream.write (`${moment().toISOString() }, b_istrigger_sync: ${ b_istrigger_sync }\n`)
      if ( b_istrigger_sync ) {
        n_orders_placed += await sweep_up_counter_orders ( { 
          tickersymbol , 
          localprice : local_strikeprice , 
          targetprice : ref_strikeprice 
        } )
//        process.exit ( 1 )
      } // DO SYNC
      else {
        LOGGER ( `LOG@bot runtime: delta within threshold , ${ local_strikeprice } , ${ ref_strikeprice }`)
      } // DO NOT SYNC
    }
    if ( n_orders_placed >0 ){
      await updaterows ( 'workers' , { name: MAP_WORKERTYPE[ 'SYNCER' ] } , { lastacttimestamp : moment().unix() } ) // timestamp
      enqueue_act_count_log ( { workertype : MAP_WORKERTYPE[ 'SYNCER' ] , n_orders_placed })
    }
    else {}
  })
  
}

const init = async()=>{
  await define_poisson_process ()
  await create_common_channel_socket ()
}
init()
/* const generate_random_limit_order = async ( {
  targetprice , 
})=>{
  let REFPRICE_DIVIDER_FOR_STDEV_OF_ RANDOM_PRICE_DIST = 30
  let price = gaussian ({ mean : targetprice , stdev : targetprice / REFPRICE_DIVIDER_FOR_S TDEV_OF_RANDOM_PRICE_DIST })
  let amount = Math.random ()
  await place_order ( { type : ( price < targetprice ) ? 'limitbuy' : 'limitsell' , 
    tickersymbol , 
    price , 
    amount // : amountinquote
  })
} */

module.exports = {
  define_poisson_process
}
const { MAP_WORKERTYPE } = require ( '../configs/common' )
let h_interval_ping
const init_ping= async()=>{
  let ALIVE_PING_PERIOD_IN_SEC = 60
  let respsetting = await findone( 'settings' , { key: 'ALIVE_PING_PERIOD_IN_SEC' , active : 1 })
  if ( Number.isFinite( +respsetting?.value ) ){ ALIVE_PING_PERIOD_IN_SEC = +respsetting?.value }
  else {}
  h_interval_ping = setInterval ( async () => {
    axios.post ( SCHEDULER?.PORT_HTTP , { name : MAP_WORKERTYPE?.SYNCER }).then( console.log )
  } , ALIVE_PING_PERIOD_IN_SEC * 1000 )
}
init_ping()
