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
const dbalibae =require('../models-alibae')
const { conv_array_to_object , uuid }= require( '../utils/common')
const { findall  , upsert } = require ('../utils/db')
const { get_trade_pairs } = require( '../utils/exchanges/alibae')
const LOGGER = console.log 
const asyncredis = require("async-redis")
const moment = require('moment')
const { URL_REDIS_CONN  } = require ( '../configs/redis' )
const { KEYNAMES } = require('../configs/keynames')
const redisclihash = asyncredis.createClient( ) // URL_REDIS_CONN?.LOCAL )
const redisclimsg  = asyncredis.createClient( URL_REDIS_CONN?.DEFAULT )
const { io } = require( 'socket.io-client' )

let h_interval 
let CHARGE_PERIOD_IN_SEC = 60
let CHARGE_UPTO_TARGET_AMOUNT = 100_0000_0000
let CHARGE_INITIAL_DELAY_IN_SEC = 1
const N_COUNT_BOTS =  1
// const N_COUNT_BOTS = 15
let arr_bot_names = [... Array( N_COUNT_BOTS ).keys()].map( el => 'BOT'+(''+el).padStart(3, '0' ) )
let arr_bot_emails= arr_bot_names.map ( el => `${ el }@gmail.com` )
let arr_bot_ids = arr_bot_emails

function generateApiKey(length = 64) {  const characters =    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let apiKey = "";
  for (let i = 0; i < length; i++) {    apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return apiKey;
}
const ensure_exists_or_create_users = async () => {
  for ( let idxbot = 0 ; idxbot< arr_bot_emails?.length ; idxbot ++ ){
    let email = arr_bot_emails [ idxbot ]
    let respuser = await dbalibae[ 'user' ].findOne( {raw: true, where : { email } })
    let timenow = dbalibae.sequelize.fn( 'NOW' )
    if ( respuser ){ }
    else {
      respuser = await dbalibae[ 'user' ].create ({ 
        id : uuid() ,
        email  ,
        roleId : 4,
        status : 'ACTIVE' ,
        createdAt : timenow ,
        updatedAt : timenow
      })
    }
    let respapikey = await dbalibae[ 'api_key' ].findOne ( { raw: true , where : { userId :respuser?.id  } } )
    if ( respapikey ){ }
    else {  respapikey = await dbalibae[ 'api_key' ].create ( {
      id : respuser?.id ,
      userId: respuser?.id,
      name: generateApiKey ( 10 ),
      key: generateApiKey( 64 ), 
      permissions: '[\"trade\",\"deposit\",\"transfer\",\"futures\",\"withdraw\"]' ,
      ipWhitelist:  '[]',
      createdAt : timenow ,
      updatedAt : timenow ,
    })}
    await redisclihash.hset ( KEYNAMES?.REDIS?.APIKEY , arr_bot_emails[ idxbot ] , respapikey?.key )
  }
}
// const newKey = await models.apiKey.create({
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
  let { currency , pair , metadata } = tpdata
  let tpdatacustom = { 
    base : currency ,
    quote : pair ,
    symbol : `${ currency }_${ pair }` ,
    PRECISION_PRICE : + metadata?.precision?.price ,
    PRECISION_AMOUNT : + metadata?.precision?.amount  ,
    LIMIT_AMOUNT_MIN : + metadata?.limits?.amount?.min ,
    LIMIT_AMOUNT_MAX : + metadata?.limits?.amount?.max ,
    LIMIT_PRICE_MIN :  + metadata?.limits?.price?.min,
    LIMIT_PRICE_MAX :  + metadata?.limits?.price?.max ,
    binancesymbol : `${ currency }${ pair }` 
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
    j_assets_unique [ listtp_raw[idxtp].currency ]  = 1
    j_assets_unique [ listtp_raw[idxtp].pair     ]  = 1
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
   LOGGER ( {count : arr_assets?.length , arr_assets } )
//   process.exit ( 1 )
  for ( let idxbot = 0 ; idxbot < arr_bot_ids?.length ; idxbot ++ ){
    let botid = arr_bot_ids [ idxbot ]
    let respuser = await dbalibae[ 'user'].findOne ( {raw: true , where : { email : botid }} )
    for ( let idxasset = 0 ; idxasset < arr_assets?.length ; idxasset ++ ){
      await upsert ( { db: dbalibae , 
        table : 'wallet' ,
        values : { status : 1 , 
          balance : CHARGE_UPTO_TARGET_AMOUNT  ,
          createdAt : dbalibae.sequelize.fn('NOW') ,
          updatedAt : dbalibae.sequelize.fn('NOW') ,
        },
        condition : { userId : respuser?.id , 
          type : 'SPOT' , 
          currency : arr_assets[ idxasset ] } ,
      })
    }
  }
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
  /**  TRADING PAIRS */
  // LOGGER ( { listtp_raw  } )
  await form_tp_datas ( { listtp_raw } )
//  for ( let idxbot = 0 ; idxbot < arr_bot_emails?.length ; idxbot ++ ) {   }
}
const create_common_channel_subscriber = async (  )=>{
  let resp = await redisclimsg.subscribe ( KEYNAMES?.REDIS?.CHANNEL_NAME_COMMON , strmessage => { 
    LOGGER ( { strmessage } )
    let message = JSON.parse ( strmessage )
    if ( message && message?.receiver == KEYNAMES?.REDIS?.RECEIVERS?.CHARGER ){
      if ( message.action ){ 
        switch ( message.action ){
          case KEYNAMES?.REDIS?.ACTIONS?.RESTART : 
          case KEYNAMES?.REDIS?.ACTIONS?.START :
            main ()
          break
          default :           break
        }
      }
    } else {}
  })
  return resp
}
const init = async ()=>{
  let respsettings = await findall ( 'settings' , { group : 'CHARGE' , active : 1 } )
  let jsettings = conv_array_to_object ( {arr: respsettings , keyfieldname : 'key' , valuefieldname:'value'})
  if (jsettings[ 'CHARGE_PERIOD_IN_SEC' ] && Number.isFinite( +jsettings[ 'CHARGE_PERIOD_IN_SEC' ] ) ){ CHARGE_PERIOD_IN_SEC = +jsettings['CHARGE_PERIOD_IN_SEC'] } // 
  else {}
  if (jsettings[ 'CHARGE_UPTO_TARGET_AMOUNT' ] && Number.isFinite ( +jsettings[ 'CHARGE_UPTO_TARGET_AMOUNT' ] ) ){ CHARGE_UPTO_TARGET_AMOUNT = +jsettings['CHARGE_UPTO_TARGET_AMOUNT'] }
  else {}
  if (jsettings[ 'CHARGE_INITIAL_DELAY_IN_SEC' ] && Number.isFinite ( +jsettings[ 'CHARGE_INITIAL_DELAY_IN_SEC' ] ) ){ CHARGE_INITIAL_DELAY_IN_SEC = +jsettings['CHARGE_INITIAL_DELAY_IN_SEC'] }
  else {}
  await create_common_channel_subscriber ()
}
const main = async () => {
  await init () //  process.exit ( 1 )
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
main ()
module.exports = {
  main
}

