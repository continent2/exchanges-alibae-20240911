var express = require('express');
var router = express.Router();
const { messages }=require('../../configs/messages')
const { respok , resperr }=require('../../utils/rest')
const messenger = require( 'messenger' )
const { SCHEDULER }=require( '../../configs/scheduler' )
const msgsender = messenger.createSpeaker ( SCHEDULER?.PORT_INTERNAL_MESSENGER )
const LOGGER  = console.log
router.get ( '/status' , async (req,res)=>{
  respok ( res, 'SCHEULER-OK') ; return 
})
const MAP_ACTIONTYPE= { START : 'START', start: 'START' , STOP : 'STOP', stop : 'STOP' }
const MAP_WORKERTYPE ={ 
  CHARGER :     'CHARGER' , 
  MARKETMAKER : 'MARKETMAKER' ,
  SYNCER :      'SYNCER' ,
  DRIFTER :     'DRIFTER' ,
}
const syncedtimeout = ( { delay_in_sec }) => new Promise(resolve => {
  setTimeout(() => { //    console.log("2nd");
    resolve();
  }, 1000 * +delay_in_sec )
})

const ARR_WORKERS = [ 'CHARGER' , 'MARKETMAKER' , 'SYNCER' , 'DRIFTER' ]
const coordinate_worker_starting = async ()=>{
  let actiontype = 'START'
  msgsender.request ( 'MSG_ACTION_ON_WORKER', { actiontype , workertype: ARR_WORKERS [ 0 ] } , ()=>{} )
  await syncedtimeout ( {delay_in_sec : 5 } )
  msgsender.request ( 'MSG_ACTION_ON_WORKER', { actiontype , workertype: ARR_WORKERS [ 1 ] } , ()=>{} )
  await syncedtimeout ( {delay_in_sec : 5 } )
  msgsender.request ( 'MSG_ACTION_ON_WORKER', { actiontype , workertype: ARR_WORKERS [ 2 ] } , ()=>{} )
  await syncedtimeout ( {delay_in_sec : 5 } )
  msgsender.request ( 'MSG_ACTION_ON_WORKER', { actiontype , workertype: ARR_WORKERS [ 3 ] } , ()=>{} )
  await syncedtimeout ( {delay_in_sec : 5 } )
}

router.post ( '/action/:actiontype' , async (req,res)=>{
  let { actiontype , }=req?.params
  if ( MAP_ACTIONTYPE[ actiontype] ){}
  else { resperr( res, messages?.MSG_ARGINVALID ) ; return }
  actiontype = MAP_ACTIONTYPE [ actiontype ]
  switch ( actiontype ){
    case 'START' : await coordinate_worker_starting()
    break
    case 'STOP' :{
      for ( let workertype of ARR_WORKERS ){
        msgsender.request ( 'MSG_ACTION_ON_WORKER', { actiontype , workertype } , ()=>{} )
      }
    }            
    break
  }
  respok ( res, 'INITIATED')
})
router.post ( '/action/:actiontype/:workertype' , async (req,res)=>{
  let { actiontype , workertype }=req?.params
  if ( MAP_ACTIONTYPE[ actiontype] ){}
  else { resperr( res, messages?.MSG_ARGINVALID ) ; return }
  actiontype = MAP_ACTIONTYPE [ actiontype ]
  if ( MAP_WORKERTYPE [ workertype ]){}
  else { resperr( res, messages?.MSG_ARGINVALID ) ; return }
  workertype = MAP_WORKERTYPE [ workertype ]  
  switch ( actiontype ){
    case 'START' : 
    case 'STOP' : 
      msgsender.request ( 'MSG_ACTION_ON_WORKER' , { actiontype , workertype } , 
        respdata=>{ LOGGER ( { respdata } );
        respok ( res, messages?.MSG_ACTED_ON_WORKER )
        return
      } )	
    break
  }
})
module.exports = router;
