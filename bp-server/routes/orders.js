var express = require('express');
var router = express.Router();
const dbalibae = require( '../../models-alibae' )
const {v4: uuid }= require( 'uuid' )
/* GET users listing. */
const LOGGER = console.log
router.get ( '/' , async (req,res) => {
  console.log ( 'HIT EP')
  res.status(200 ).send ({ status : 'OK' , message: 'ALRIGHT' })
})
router.post('/order', async (req, res, next) => {
  let { 
    currency ,
    pair ,
    type ,
    side ,
    amount ,
    price ,  
  } = req?.body
  LOGGER( { ... req?.body })
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
  } )
  res.status(200).send ( { status : 'OK' , message:'CREATED' , created: respcreate })
  return 
})

module.exports = router;
