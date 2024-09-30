var express = require('express');
var router = express.Router();
const dbalibae = require( '../../models-alibae' )
const {v4: uuid }= require( 'uuid' )
/* GET users listing. */
router.post('/order', async (req, res, next) => {
  let { 
    currency ,
    pair ,
    type ,
    side ,
    amount ,
    price ,  
  } = req?.body
  if ( currency && pair && type && side && amount ){}
  else { res.status(400).send ( { status:'ERR' , message:'ARG-MISSING' } ) ; return }
  let timenow = new Date().toISOString()
  let respcreate = await dbalibae[ 'exchange_order' ].create ({
    symbol : `${currency}/${pair}` ,
    type ,
    side ,
    amount ,
    price  ,
    id : uuid() ,
    createdAt : timenow ,
    updatedAt : timenow ,
    status : 'OPEN' ,
    timeInForace : 'GTC' ,
    filled : 0 ,
    remaining : amount ,
    cost : 0 ,
    fee : 0 , 
    feeCurrency : pair ,    
  } )
  res.status(200).send ( { status : 'OK' , message:'CREATED' , created: respcreate })
  return 
})

module.exports = router;
