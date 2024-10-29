const axios= require( 'axios' )
const { get_random_from_arr } = require ( '../common')
const { KEYNAMES } = require('../../configs/keynames')
let URL = `http://localhost:4000/api`
const dbcustom = require ( '../../models-custom' )
const rediscli = require ( 'async-redis').createClient() 
const MAP_FUNCTION_NAME_TO_PATH = {
  TRADEPAIRS  : `queries/rows/markethasassets/active/1/0/10000/id/DESC` ,
  ORDERBOOK   : `orderbooks/orderbook` , // /:market/:asset/:N` ,
  ORDER       : `orders/order` , // /:market/:asset/:type/:amount/:price` ,
  TICKERS     : `tickers` , // 
  TICKER      : `tickers` , // /tickers/{market}/{asset}
}
const LOGGER = console.log
const MAP_FUNCTION_NAME_TO_ENDPOINT = ( name )=>{
  return `${ URL }/${ MAP_FUNCTION_NAME_TO_PATH [ name ]}`
}
const get_tickers = async () =>{
  let resp = await axios.get ( MAP_FUNCTION_NAME_TO_ENDPOINT( 'TICKERS' ) )
  let jtickers = {}
  if ( resp?.data?.status == 'OK' ) {}
  else { return null }
  let { list } = resp?.data 
  for ( let idx = 0 ; idx < list?.length ; idx ++ ){
    let { symbol , price } = list [ idx ]
    jtickers [ symbol ]  = price
  }
  return jtickers
}
const get_trade_pairs = async () =>{
  let resp  = await axios.get ( MAP_FUNCTION_NAME_TO_ENDPOINT ( 'TRADEPAIRS' ))
  if ( resp?.data?.status == 'OK' && resp?.data?.list?.length ) { return resp?.data }
  else { console.log ( `ERROR AT get_trade_pairs`) ; return null }
}
const fetch_tradepairs_local = async ()=>{
  let list_tp = await dbcustom[ 'markethasassets' ].findAll ({ raw: true , where : {    active : 1  } } )
  return list_tp
}
const get_orderbook = async ( { base , quote , limit } ) =>{
  if (+limit && +limit >=1){} else { LOGGER('!!! INVALID ARG@get_orderbook'); return null }
  let resp  = await axios.get ( `${ MAP_FUNCTION_NAME_TO_ENDPOINT ( 'ORDERBOOK' )}/${ market }/${ asset }/${ limit }` )
  if ( resp?.data?.status == 'OK'){}
  else { LOGGER( ) ; return null }
}
/* {
  "status": "OK",
  "message": null,
  "code": null,
  "list":[
  {
  "id": 1,
  "createdat": "2024-10-28T05:37:42.000Z",
  "updatedat": "2024-10-28T05:56:26.000Z",
  "asset": "BTC",
  "market": "USDT",
  "symbol": "BTC_USDT",
  "price": "300",
  "laststrikeprice": "300",
  "amount": null,
  "timestampmili": 1730094986623,
  "amountasset": "0.5",
  "amountmarket": "150"
  }
  ]
  } */
/** 
 * const BIN_EP_SPOT_TICKER = `https://api.binance.com/api/v3/ticker/price?symbol=`
// EX: `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
// resp.data => { symbol: 'BTCUSDT', price: '57727.99000000' }
const BIN_EP_ORDERBOOK = `https://api.binance.com/api/v3/depth` // ?limit=10&symbol=`
 */
