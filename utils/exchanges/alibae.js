const axios= require( 'axios' )
const URL = `https://alibae.io/api`

const MAP_FUNCTION_NAME_TO_PATH = {
    TRADE_PAIRS : `exchange/market?eco=false`,
    ORDERBOOK : `exchange/orderbook` ,
    ORDER : `exchange/order` ,
}
const MAP_FUNCTION_NAME_TO_ENDPOINT = ( name )=>{
    return `${ URL }/${ MAP_FUNCTION_NAME_TO_PATH[ name ]  }`
}
const get_trade_pairs = async ()=>{
    let resp =await axios.get ( MAP_FUNCTION_NAME_TO_ENDPOINT ( 'TRADE_PAIRS' ) )
    if ( resp.status == 200 && resp?.data?.length ) { return resp?.data } 
    else { console.log(`ERROR AT get_trade_pairs` ) ; return null }
}

const get_orderbook = async ( { base , quote } )=>{
    let resp = await axios.get ( `${ MAP_FUNCTION_NAME_TO_ENDPOINT ( 'ORDERBOOK' ) }/${ base }/${ quote }`) // ???
    if ( resp?.status == 200 ){ return resp?.data }
    else { console.log (`ERROR AT get_orderbook`) ; return null }
}
const post_order = async ( {
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
    let resp = await axios.post ( `${ MAP_FUNCTION_NAME_TO_ENDPOINT( 'ORDER')}` , { 
      currency ,
      pair ,
      type ,
      side ,
      amount ,
      price    })
    if ( resp?.status == 200 ){ return resp?.data }
    else { console.log( `ERROR AT post_order`) ; return null }
}
module.exports = { 
    MAP_FUNCTION_NAME_TO_ENDPOINT ,
    get_trade_pairs ,
    post_order
}
