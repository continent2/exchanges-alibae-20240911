const place_order =async ( { type , 
  tickersymbol , 
  price , 
  amount 
  } )=>{ // type : 'buy'  , 'sell'
  console.log ( 'ORDER' , type , tickersymbol , price , amount )
}
module.exports = { place_order }
