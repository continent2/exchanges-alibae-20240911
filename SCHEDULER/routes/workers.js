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
  CHARGER : 'CHARGER' , 
  MARKETMAKER : 'MARKETMAKER' ,
  SYNCER : 'SYNCER' ,
  DRIFTER : 'DRIFTER' ,
}
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
