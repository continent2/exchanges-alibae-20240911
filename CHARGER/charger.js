/* SET MIN BALANCE REQUIREMENT
FOREACH ( TRADING PAIR) =>  FOREACH (CURRENCY)
FOREACH ( BOT OF CURRENCY )
EVERY 1 MINUTE, FETCH BOT I’S BALANCE
BALANCE < REQUIRED ?
CHARGE , NOP 
*/

const axios = require( 'axios' )
const db = require ( '../models' )
const dbalibae =require('../models-alibae')
const { conv_array_to_object , uuid }= require( '../utils/common')
const { findall  , upsert } = require ('../utils/db')
const { get_trade_pairs } = require( '../utils/exchanges/alibae')
const LOGGER = console.log 
const asyncredis = require("async-redis")
const moment = require('moment')
const rediscli = asyncredis.createClient()

let CHARGE_PERIOD_IN_SEC = 60
let CHARGE_UPTO_TARGET_AMOUNT = 100_0000_0000
const N_COUNT_BOTS = 1
// const N_COUNT_BOTS = 15
let arr_bot_names = [... Array( N_COUNT_BOTS ).keys()].map( el => 'BOT'+(''+el).padStart(3, '0' ) )
let arr_bot_emails= arr_bot_names.map ( el => `${ el }@gmail.com` )
let arr_bot_ids = arr_bot_emails
const ensure_exists_or_create_users = async () => {
  for ( let idxbot = 0 ; idxbot< arr_bot_emails?.length ; idxbot ++ ){
    let email = arr_bot_emails [ idxbot ]
    let resp = await dbalibae[ 'user' ].findOne( {raw: true, where : { email } })
    if ( resp ){ }
    else {
      await dbalibae[ 'user' ].create ({ 
        id : uuid() ,
        email  ,
        roleId : 4,
        status : 'ACTIVE' ,
        createdAt : dbalibae.sequelize.fn('NOW') ,
        updatedAt : dbalibae.sequelize.fn('NOW') 
      })
    } 
  }
}
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
    await rediscli.hset ( 'TRADEPAIRS' , tpdatacustom?.symbol , JSON.stringify( { ... tpdatacustom , timestamp } ) )
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
    await rediscli.hset ( 'ASSETS' , arr_assets[ idx ] , timestamp )
  }
  return
}
const chargeup_user_wallets_by_assets = async ( { j_assets_unique , arr_bot_ids }) => {
   arr_assets = Object.keys( j_assets_unique ) 
   LOGGER ( {arr_assets } )
//   process.exit ( 1 )
  for ( let idxbot = 0 ; idxbot < arr_bot_ids?.length ; idxbot ++ ){
    let botid = arr_bot_ids [ idxbot ]
    let respuser = await dbalibae[ 'user'].findOne ( {raw: true , where : { email : botid }} )
    for ( let idxasset = 0 ; idxasset < arr_assets?.length ; idxasset ++ ){
      upsert ( { db: dbalibae , 
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
const chargeup= async () => {
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
  form_tp_datas ( { listtp_raw } )
//  for ( let idxbot = 0 ; idxbot < arr_bot_emails?.length ; idxbot ++ ) {   }
}
const main = async () => {
  let resp = await findall ( 'settings' , {} )
  let jsettings = conv_array_to_object ( {arr: resp , keyfieldname : 'key' , valuefieldname:'value'})
  if (jsettings[ 'CHARGE_PERIOD_IN_SEC' ] && +jsettings[ 'CHARGE_PERIOD_IN_SEC' ] ){ CHARGE_PERIOD_IN_SEC = +jsettings['CHARGE_PERIOD_IN_SEC'] }
  else {}
  if (jsettings[ 'CHARGE_UPTO_TARGET_AMOUNT' ] && +jsettings[ 'CHARGE_UPTO_TARGET_AMOUNT' ] ){ CHARGE_UPTO_TARGET_AMOUNT = +jsettings['CHARGE_UPTO_TARGET_AMOUNT'] }
  else {}
//  process.exit ( 1 )
  await ensure_exists_or_create_users ( )
//  process.exit ( 1 )
  let h = setInterval ( async ()=>{
    await chargeup ()
  } ,  CHARGE_PERIOD_IN_SEC )

// let h = setTimeout ( async ()=>{
  //   await chargeup ()
  // } ,  10 )

}

main ()
