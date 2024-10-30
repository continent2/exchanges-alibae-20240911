/* SET MIN BALANCE REQUIREMENT
FOREACH ( TRADING PAIR) =>  FOREACH (CURRENCY)
FOREACH ( BOT OF CURRENCY )
EVERY 1 MINUTE, FETCH BOT I’S BALANCE
BALANCE < REQUIRED ?
CHARGE , NOP 
*/
let MODE_DEV_PROD = 'DEV' // 'PROD'
const axios = require( 'axios' )
const db = require ( '../models' )
const dbcustom =require( '../models-custom' )
const { conv_array_to_object , uuid, enqueue_act_count_log }= require( '../utils/common')
const { findall  , upsert, findone, updaterows } = require ('../utils/db')
const { get_trade_pairs } = require( '../utils/exchanges/custom')
const LOGGER = console.log 
const asyncredis = require( "async-redis" )
const moment = require('moment')
const { URL_REDIS_CONN  } = require ( '../configs/redis' )
const { KEYNAMES } = require('../configs/keynames')
const { MAP_WORKERTYPE } = require ( '../configs/common' )
const redisclihash = asyncredis.createClient( ) // URL_REDIS_CONN?.LOCAL )
const crypto = require ( 'crypto' )
// const redisclimsg  = asyncredis.createClient( URL_REDIS_CONN?.DEFAULT )
const { io } = require( 'socket.io-client' )
const PARSER = JSON.parse 
let h_interval 
let CHARGE_PERIOD_IN_SEC = 60
let CHARGE_UPTO_TARGET_AMOUNT = 100_0000_0000
let CHARGE_INITIAL_DELAY_IN_SEC = 1
const N_COUNT_BOTS =  1
// const N_COUNT_BOTS = 15
let arr_bot_names = [... Array( N_COUNT_BOTS ).keys()].map( el => 'BOT'+(''+el).padStart(3, '0' ) )
let arr_bot_emails = arr_bot_names.map ( el => `${ el }@gmail.com` )
// let arr_bot_ids = arr_bot_emails
let arr_bot_ids = arr_bot_names
const { SCHEDULER } = require( '../configs/scheduler' )
let socket
const create_common_channel_socket = async ( )=>{
  socket = io( SCHEDULER?.URL_SOCKET_COMPLETE )
  socket.on ( SCHEDULER?.MSG_ACTION_ON_WORKER , data =>{
    let { actiontype , workertype } = PARSER ( data )
    if ( workertype ){ ;   } 
    else { return }
      switch ( workertype ){
        case 'CHARGER' : 
          switch ( actiontype ){
            case 'START' :
              main ()
            break 
            case 'STOP' : { if ( h_interval ){ clearInterval ( h_interval ) ; }
              }
            break
          }
        break
        default : break 
      }
  })
}
/* function generateApiKey(length = 64) {  const characters =    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";  let apiKey = "";   for (let i = 0; i < length; i++) {    apiKey += characters.charAt(Math.floor(Math.random() * characters.length));  };  return apiKey; } */
const cleanup_key = str=>{
  str=  str.replace ( /-----BEGIN PRIVATE KEY-----/g, '' )
  str=  str.replace ( /-----END PRIVATE KEY-----/g, '' )
  str=  str.replace ( /-----BEGIN PUBLIC KEY-----/g, '' )
  str=  str.replace ( /-----END PUBLIC KEY-----/g, '' )
  str=  str.replace ( /\n/g, '' )
  return str
}
const create_api_key = async ()=>{   let format = 'pem'
  let resp = crypto.generateKeyPairSync('ed25519', {    publicKeyEncoding: {      type: 'spki',      format , // : 'pem'
    },
    privateKeyEncoding: {      type: 'pkcs8',      format, // : 'pem'
    }  } )
  return { publickey : cleanup_key ( resp?.publicKey ) , privatekey : cleanup_key ( resp?.privateKey ) }  // , (err, publickey, privatekey ) => {  LOGGER({ err })    return { publickey, privatekey }  }   )
}
const ensure_exists_or_create_users = async () => { LOGGER ( { arr_bot_emails })
  for ( let idxbot = 0 ; idxbot< arr_bot_emails?.length ; idxbot ++ ){
    let email = arr_bot_emails [ idxbot ]
    let respuser = await dbcustom[ 'users' ].findOne( {raw: true, where : { email } })
    let timenow = dbcustom.sequelize.fn( 'NOW' )
    let useruuid = uuid()
    if ( respuser ){ }
    else { //      let transaction = await db.sequelize.transaction( )
      respuser = await dbcustom[ 'users' ].create ( {  //        id : uuid() ,
        email  ,//        roleId : 4,
        username : arr_bot_names [ idxbot ] ,
        active : 1 , // status : 'ACTIVE' ,
        uuid : useruuid  //        createdAt : timenow ,  //      updatedAt : timenow ,        
      } // , { transaction } 
      ) //      await transaction.commit()
      respuser = respuser?.dataValues
      useruuid = respuser?.uuid
    }
    let respapikey = await dbcustom[ 'apikeys' ].findOne ( { raw: true , where : { useruuid  } } ) // userId :respuser?.id  } } )    
    if ( respapikey ){ }
    else {  //      let transaction = await db.sequelize.transaction( )
      respapikey = await create_api_key ( )
//      await createrow( 'apikeys', { useruuid , uuid : uuid() ,  apikey: respcreatekey?.publickey , secretkey : respcreatekey?.privatekey , active : 1 } )
      await dbcustom[ 'apikeys'].create ( { useruuid , uuid : uuid() ,  apikey: cleanup_key ( respapikey?.publickey )  , secretkey : cleanup_key ( respapikey?.privatekey )  , active : 1 } )
/*      respapikey = await dbcustom[ 'apikeys' ].create ( {        id : respuser?.id ,        userId: respuser?.id,        name: generateApiKey ( 10 ),        key: generateApiKey( 64 ),         permissions: '[\"trade\",\"deposit\",\"transfer\",\"futures\",\"withdraw\"]' ,        ipWhitelist:  '[]',
        createdAt : timenow ,        updatedAt : timenow ,      } // , { transaction } 
      ) */ //      await transaction.commit()
    }
//  await redisclihash.hset ( KEYNAMES?.REDIS?.APIKEY , arr_bot_emails[ idxbot ] , respapikey?.publickey || respapikey?.apikey  )
    await redisclihash.hset ( KEYNAMES?.REDIS?.APIKEY , useruuid  , respapikey?.publickey || respapikey?.apikey  )
  }
}
// const newKey = await models.apiKey.cre ate({
//   userId: user.id,
//   name: name,
//   key: generateApiKey(), // Use the custom API key generator
//   permissions: permissions || [],
//   ipWhitelist: ipWhitelist || [],
// });
// INSERT INTO `api_key` VALUES ('a11b4812-52d7-40f5-be0e-0a42e43c78de','8febbd91-84c5-4f60-a44b-5aea1e19a38a','2UTcRUf0yIDCOHxgO6KfndhLE4erZxBJMOwc1nHuIhFexRPGVjoSa5xIBUxKs1Nk','2024-09-13 02:57:10','2024-09-13 02:57:10',NULL,'AK00','[\"trade\",\"deposit\",\"transfer\",\"futures\",\"withdraw\"]','[]'),('b0d2d138-fc81-4a8a-99d2-d95ca0b09df9','6735bea0-bb0f-4abd-9eee-a3a7dbfd84c1','yKrMdX4jAvHkinhGwSFnJXVzfc5gy5fRh7jzWst4HHBErVrdt2xLTBiCAMZCSNLH','2024-09-20 06:52:16','2024-09-20 06:52:16',NULL,'alibot','[\"trade\"]','[]');

let j_tp_data_custom ={}
let arr_tp_data = []
const form_tp_data= tpdata=>{
  let { market , asset ,  } = tpdata
//  let { currency , pair , metadata } = tpdata
  let tpdatacustom = { 
    base : asset , // currency ,
    quote : market , // pair ,
    symbol : `${ asset }_${ market }` , // `${ currency }_${ pair }` ,
    // PRECISION_PRICE : + metadata?.precision?.price ,
    // PRECISION_AMOUNT : + metadata?.precision?.amount  ,
    // LIMIT_AMOUNT_MIN : + metadata?.limits?.amount?.min ,
    // LIMIT_AMOUNT_MAX : + metadata?.limits?.amount?.max ,
    // LIMIT_PRICE_MIN :  + metadata?.limits?.price?.min,
    // LIMIT_PRICE_MAX :  + metadata?.limits?.price?.max ,
    binancesymbol : `${ asset }${ market }` 
  }
  j_tp_data_custom[ `${ tpdata?.currency }_${tpdata?.pair }`] = tpdatacustom
  return tpdatacustom
}
const form_tp_datas = async ( { listtp_raw } ) => { // j_tp_data_custom
  let timestamp = moment().unix()
  for ( let idxtp = 0 ; idxtp< listtp_raw?.length ; idxtp ++ ) {
    let tpdata = listtp_raw [ idxtp ]     // 
    let tpdatacustom = form_tp_data ( tpdata )
    await redisclihash.hset ( 'TRADEPAIRS' , tpdatacustom?.symbol , JSON.stringify( { ... tpdatacustom , timestamp } ) )
  }
}
let j_assets_unique = {} // entries in this has duplicates removed
let arr_assets
const get_assets_unique =( { listtp_raw })=>{
  let j_assets_unique = {} // entries in this has duplicates removed
  for ( let idxtp = 0 ; idxtp < listtp_raw?.length ; idxtp ++ ){
    LOGGER ( listtp_raw[idxtp] )
    j_assets_unique [ listtp_raw[idxtp].market ]  = 1
    j_assets_unique [ listtp_raw[idxtp].asset  ]  = 1
    // j_assets_unique [ listtp_raw[idxtp].currency ]  = 1
    // j_assets_unique [ listtp_raw[idxtp].pair     ]  = 1
  }
  return j_assets_unique
}
const set_redis_assets_unique = async ( { j_assets_unique } )=>{
  let arr_assets = Object.keys( j_assets_unique )
  let timestamp = moment().unix()
  for ( let idx = 0 ; idx < arr_assets?.length ; idx++ ){
    await redisclihash.hset ( 'ASSETS' , arr_assets[ idx ] , timestamp )
  }
  return
}
const chargeup_user_wallets_by_assets = async ( { j_assets_unique , arr_bot_ids }) => {
   arr_assets = Object.keys( j_assets_unique ) 
   LOGGER ( {count : arr_assets?.length , arr_assets } ) //   process.exit ( 1 )
  let n_orders_placed = 0
  for ( let idxbot = 0 ; idxbot < arr_bot_ids?.length ; idxbot ++ ){
    let botid = arr_bot_ids [ idxbot ]
    let respuser = await dbcustom[ 'users'].findOne ( {raw: true , where : { username : botid }} ) // email : botid }} )
    for ( let idxasset = 0 ; idxasset < arr_assets?.length ; idxasset ++ ){
      await upsert ( { db: dbcustom ,
        table : 'holdings', // wallet' ,
        values : { active : 1 , // status : 1 ,           // balance : CHARGE_UPTO_TARGET_AMOUNT  ,
          amountchar : CHARGE_UPTO_TARGET_AMOUNT ,
          amountfloat : CHARGE_UPTO_TARGET_AMOUNT ,
          availchar : CHARGE_UPTO_TARGET_AMOUNT ,
          availchar : CHARGE_UPTO_TARGET_AMOUNT ,
          lockedchar : 0 ,
          lockedfloat : 0 ,
        },
        condition : { // userId : respuser?.id , //          type : 'SPOT' ,           currency : arr_assets[ idxasset ] 
          useruuid : respuser?.uuid , // username : // botid
          asset : arr_assets [ idxasset]
        } ,
      })
      ++ n_orders_placed
    }
  }
  if ( n_orders_placed > 0 ){
    await updaterows ( 'workers' , { name: MAP_WORKERTYPE[ 'CHARGER' ] } , { lastacttimestamp : moment().unix() , lastacttimestr : moment().toISOString() } )
    enqueue_act_count_log ( { workertype : MAP_WORKERTYPE[ 'CHARGER' ] , n_orders_placed  } )
  } else {}
}
const chargeup = async () => {
  let listtp_raw = await get_trade_pairs ()
  let listtp_custom
  if ( listtp_raw ){}
  else { LOGGER (`ERROR AT charger.js => no tp returned`) ; return }
  j_tp_data_custom= {}
  /**  ASSETS */
  let j_assets_unique = get_assets_unique ( { listtp_raw } )
  LOGGER ( { j_assets_unique , KEYS : Object.keys( j_assets_unique ).length })
//  process.exit ( 1 )
  await set_redis_assets_unique ( { j_assets_unique } )
  /** CHARGE UP */
//  process.exit ( 1 )
  await chargeup_user_wallets_by_assets ( { j_assets_unique , arr_bot_ids })
//  await updaterows ( 'workers' , { name: MAP_WORKERTYPE[ 'CHARGER' ] } , { lastacttimestamp : moment().unix() } )
  /**  TRADING PAIRS */
  // LOGGER ( { listtp_raw  } )
  await form_tp_datas ( { listtp_raw } )  
//  for ( let idxbot = 0 ; idxbot < arr_bot_emails?.length ; idxbot ++ ) {   }
}
// const create_common_channel_subscriber = async (  )=>{
//   let resp = await redisclimsg.subscribe ( KEYNAMES?.REDIS?.CHANNEL_NAME_COMMON , strmessage => { 
//     LOGGER ( { strmessage } )
//     let message = JSON.parse ( strmessage )
//     if ( message && message?.receiver == KEYNAMES?.REDIS?.RECEIVERS?.CHARGER ){
//       if ( message.action ){ 
//         switch ( message.action ){
//           case KEYNAMES?.REDIS?.ACTIONS?.RESTART : 
//           case KEYNAMES?.REDIS?.ACTIONS?.START :
//             main ()
//           break
//           default :           break
//         }
//       }
//     } else {}
//   })
//   return resp
// }
const init_settings = async ()=>{
  let respsettings = await findall ( 'settings' , { group : 'CHARGE' , active : 1 } )
  let jsettings = conv_array_to_object ( {arr: respsettings , keyfieldname : 'key' , valuefieldname:'value'})
  if (jsettings[ 'CHARGE_PERIOD_IN_SEC' ] && Number.isFinite( +jsettings[ 'CHARGE_PERIOD_IN_SEC' ] ) ){ CHARGE_PERIOD_IN_SEC = +jsettings['CHARGE_PERIOD_IN_SEC'] } // 
  else {}
  if (jsettings[ 'CHARGE_UPTO_TARGET_AMOUNT' ] && Number.isFinite ( +jsettings[ 'CHARGE_UPTO_TARGET_AMOUNT' ] ) ){ CHARGE_UPTO_TARGET_AMOUNT = +jsettings['CHARGE_UPTO_TARGET_AMOUNT'] }
  else {}
  if (jsettings[ 'CHARGE_INITIAL_DELAY_IN_SEC' ] && Number.isFinite ( +jsettings[ 'CHARGE_INITIAL_DELAY_IN_SEC' ] ) ){ CHARGE_INITIAL_DELAY_IN_SEC = +jsettings['CHARGE_INITIAL_DELAY_IN_SEC'] }
  else {}
//  await create_common_channel_socket()
//  await create_common_channel_subscriber ()
}
const main = async () => {
  await init_settings () //  process.exit ( 1 )
  await ensure_exists_or_create_users ( ) //  process.exit ( 1 )
  let h_timeout = setTimeout ( async ()=>{
    await chargeup ( )
    if ( MODE_DEV_PROD == 'DEV') { process.exit ( 1 ) }  // 'PROD'
  } ,  CHARGE_INITIAL_DELAY_IN_SEC * 1000 ) //    if ( MODE_DEV_PROD == 'DEV') { process.exit ( 1 ) }  // 'PROD'
  if ( h_interval ) { clearInterval ( h_interval ) }
  h_interval = setInterval ( async ()=>{
    await chargeup ()
  } , CHARGE_PERIOD_IN_SEC * 1000 )
}
true && main ()
try {create_common_channel_socket()} 
catch(err){console.log(err) }
module.exports = {
  main
}
// const { MAP_WORKERTYPE } = require ( '../configs/common' )
let h_interval_ping
const init_ping= async()=>{
  let ALIVE_PING_PERIOD_IN_SEC = 60
  let respsetting = await findone( 'settings' , { key: 'ALIVE_PING_PERIOD_IN_SEC' , active : 1 })
  if ( Number.isFinite( +respsetting?.value ) ){ ALIVE_PING_PERIOD_IN_SEC = +respsetting?.value }
  else {}
  try { axios.post ( `${ SCHEDULER?.URL }:${ SCHEDULER?.PORT_HTTP }/workers/ping` , { name : MAP_WORKERTYPE?.CHARGER }).then( console.log ) } 
  catch ( err ){ console.log ( err ) }
  h_interval_ping = setInterval ( async () => {
    try { axios.post ( `${ SCHEDULER?.URL }:${ SCHEDULER?.PORT_HTTP }/workers/ping` , { name : MAP_WORKERTYPE?.CHARGER }).then( console.log ) } 
    catch ( err ){ console.log ( err ) }
  } , ALIVE_PING_PERIOD_IN_SEC * 1000 )
}
init_ping()
