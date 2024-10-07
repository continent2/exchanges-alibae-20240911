var express = require('express');
var router = express.Router();
const { messages }=require('../../configs/messages')
const { respok , resperr }=require('../../utils/rest')
const messenger = require( 'messenger' )
const { SCHEDULER }=require( '../../configs/scheduler' )
const msgsender = messenger.createSpeaker ( + SCHEDULER?.PORT_INTERNAL_MESSENGER )
const db = require( '../../models' );
const { getipaddress } = require('../../utils/session');
const { upsert, upsert_sane, findall, findone } = require('../../utils/db')
const moment = require ( 'moment' )
const LOGGER  = console.log

router.get ( '/statuses' , async ( req,res) =>{
  let respworkers = await findall( 'workers' , {} )
  let list = respworkers
  let timenow = moment().unix()
  let THRESHOLD_TELL_WORKER_ALIVE_OR_DEAD_IN_SEC = 150
  let respsetting = await findone ( 'settings' , {
    key : 'THRESHOLD_TELL_WORKER_ALIVE_OR_DEAD_IN_SEC',
    active : 1
  }) 
  if ( Number.isFinite( +respsetting?.value )){ THRESHOLD_TELL_WORKER_ALIVE_OR_DEAD_IN_SEC = +respsetting?.value }
  else {} 
  list = list.map ( el => { let lastping
    if ( Number.isFinite( lastping = +el[ 'lastping'] ) ){      let timedelta = timenow - lastping
      if ( timedelta < THRESHOLD_TELL_WORKER_ALIVE_OR_DEAD_IN_SEC ){
              el['status'] = 'ALIVE'
      }
      else {  el['status'] = 'DEAD' }      
    }
    else { el['status'] = 'UNKNOWN' }
    return el 
  })
  respok ( res, null , null , { list })
} ) 
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
const ARR_WORKERS = [ 'CHARGER' , 'MARKETMAKER' , 'SYNCER' , 'DRIFTER' ]
const syncedtimeout = ( { delay_in_sec }) => new Promise(resolve => {
  setTimeout(() => { //    console.log("2nd");
    resolve();
  }, 1000 * +delay_in_sec )
})
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
} )
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
} )
router.post ( '/ping' , async (req,res) =>{
  let { name , } = req?.body
  if ( MAP_WORKERTYPE[ name ]){ }
  else { resperr(res, messages?.MSG_ARGINVALID) ; return }
  const ipaddress  = getipaddress( req )
  const timestamp = moment().unix()
  const timestampstr = moment().toISOString()
  await upsert_sane  ( {
    db , // :'' , 
    table : 'workers' ,
    values : { 
      lastping : timestamp ,
      lastpingstr : timestampstr ,
    } ,
    condition : { name } ,
  } )
  respok ( res , null , null , { name , lastping , lastpingstr }) 
} )
module.exports = router

