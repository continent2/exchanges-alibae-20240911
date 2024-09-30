const axios= require( 'axios' )
const { get_random_from_arr } = require ( '../common')
const { KEYNAMES } = require('../../configs/keynames')
const URL = `http://88.222.24.147:58405`
// const APIKEY = '2UTcRUf0yIDCOHxgO6KfndhLE4erZxBJMOwc1nHuIhFexRPGVjoSa5xIBUxKs1Nk'
const rediscli = require ( 'async-redis' ).createClient()
const MAP_FUNCTION_NAME_TO_PATH = {
    // TRADEPAIRS  : `exchange/market?eco=false`,
    // ORDERBOOK   : `exchange/orderbook` ,
    ORDER       : `/orders/order` ,
    // TICKERS     : `api/exchange/ticker`,
}
const MAP_FUNCTION_NAME_TO_ENDPOINT = ( name )=>{
  return `${ URL }/${ MAP_FUNCTION_NAME_TO_PATH[ name ]  }`
} // https://alibae.io/api/exchange/market?eco=false

module.exports = { 
  MAP_FUNCTION_NAME_TO_ENDPOINT ,
}
