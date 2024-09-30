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
const post_order = async ( {
  useremail , apikey , 
  currency ,
  pair ,
  type ,
  side ,
  amount ,
  price
}  ) =>{
  if ( currency && pair && type && side && amount ){}
  else { console.log(`ERROR AT post_order : arg missing` ) ; return null }
  if ( Number.isFinite(+amount) ){}
  else { console.log(`ERROR AT post_order : arg invalid-amount` ) ; return null }
  if ( price ){
      if ( Number.isFinite (+price)){}
      else { console.log( `ERROR AT post_order : arg invalid`); return null }
  }
//    red iscli.hget ( )
  let resp = await axios.post ( `${ MAP_FUNCTION_NAME_TO_ENDPOINT( 'ORDER' ) }` , {
    currency ,
    pair ,
    type ,
    side ,
    amount ,
    price } ) // , { headers : { 'X-API-KEY': apikey } } )
  if ( resp?.status == 200 ){ return resp?.data }
  else { console.log( `ERROR AT post_order`) ; return resp }
}

module.exports = { 
  MAP_FUNCTION_NAME_TO_ENDPOINT ,
  post_order ,

}
