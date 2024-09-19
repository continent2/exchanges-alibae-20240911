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
let list_tradepair = [ 'BTC_USDT' ]
let N_BINANCE_ORDERBOOK_QUERY_COUNT = 40
let THRESHOLD_DELTA_TO_TRIGGER_SYNC_IN_PERCENT = 1.3 // PERCENT

let AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC = 75 
const get_local_strikeprice = async ( { tickersymbol })=>{
}
const is_trigger_sync = async ({ local_price , ref_price , }) =>{
  local_price = +local_price
  ref_price = +ref_price  
  let delta_normd = ( ref_price - local_price ) / ref_price
  if ( Math.abs ( delta_normd ) > THRESHOLD_DELTA_TO_TRIGGER_SYNC_IN_PERCENT / 100 ) { return true }
  else { return false }
}

const sweep_counter_orders = async ( { tickersymbol , localprice , targetprice } ) =>{
  let delta = localprice - targetprice
  let signdelta = Math.sign ( delta )
  switch ( signdelta ) {
    case +1 : // DO SELL ( BASE CURRENCY )=> FIND BUYS , (QUOTE AMOUNT)*PRICE = BASE AMOUNT
{      let resporders = await db[ 'orders' ].findAndCountAll ( { raw: true, where : {
        tickersymbol ,
        type : 'BUY' // SHORT QUOTE CURRENCY , LONG BASE/ASSET CURRENCY
      } , offset : 0 
      , order : [ [ 'price' , 'ASC' ] , [ 'id' , 'ASC' ]] // 
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
  let pp = poissonProcess.create( AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC * 1000 , async () => {
    console.log( 'SYNCING' )
    for ( let idxtp = 0 ; idxtp< list_tradepair?.length ; idxtp ++ ){
      let aproms = []
      let tickersymbol = list_tradepair[ idxtp ]
      tickersymbol = tickersymbol.replace ( /_/g, '' )
      aproms[ aproms?.length ] = axios.get ( `${ API_PATH?.BIN_EP_SPOT_TICKER  }${ tickersymbol }` )
      aproms[ aproms?.length ] = axios.get ( `${ API_PATH?.BIN_EP_ORDERBOOK    }` , { params : { limit : N_BINANCE_ORDERBOOK_QUERY_COUNT , symbol : tickersymbol }} )
      let aresps = await Promise.all ( aproms )
      let strikeprice , midprice , j_ob , j_ob_stats
      if ( aresps [ 0 ] && aresps [0].data && aresps [0].data?.price ){   strikeprice = +aresps [0].price }
      if ( aresps [ 1 ] && aresps [1].data && aresps [1].data?.bids  ){   
        j_ob = aresps [1].data
        j_ob_stats = parse_orderbook( { j_ob } )
        midprice = j_ob_stats?.midprice
      }
      let local_strikeprice = await get_local_strikeprice ( { tickersymbol } )
      if ( is_trigger_sync ( { local_price : local_strikeprice , ref_price : strikeprice } )) {        
        await sweep_counter_orders ( { tickersymbol , 
          localprice : local_strikeprice , 
          targetprice : strikeprice 
        } ) 
      }
      else {}
    }
    
  })
  pp.start()
}
main ()
