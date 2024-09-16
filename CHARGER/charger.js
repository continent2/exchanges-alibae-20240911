/* SET MIN BALANCE REQUIREMENT
FOREACH ( TRADING PAIR) =>  FOREACH (CURRENCY)
FOREACH ( BOT OF CURRENCY )
EVERY 1 MINUTE, FETCH BOT I’S BALANCE
BALANCE < REQUIRED ?
CHARGE , NOP 
*/

const db= require ( '../models')
const { conv_array_to_object }= require( '../utils/common')
const { findall } = require ('../utils/db')
let CHARGE_PERIOD_IN_SEC = 60
let CHARGE_UPTO_TARGET_AMOUNT = 100_0000_0000
const main = async ()=>{
  let resp = await findall ( 'settings' , {} )
  let jsettings = conv_array_to_object ( {arr: resp , keyfieldname : 'key' , valuefieldname:'value'})
  if (jsettings[ 'CHARGE_PERIOD_IN_SEC' ] && +jsettings[ 'CHARGE_PERIOD_IN_SEC' ] ){ CHARGE_PERIOD_IN_SEC = +jsettings['CHARGE_PERIOD_IN_SEC'] }
  else {}
  if (jsettings[ 'CHARGE_UPTO_TARGET_AMOUNT' ] && +jsettings[ 'CHARGE_UPTO_TARGET_AMOUNT' ] ){ CHARGE_UPTO_TARGET_AMOUNT = +jsettings['CHARGE_UPTO_TARGET_AMOUNT'] }
  else {}
  let h = setInterval ( async ()=>{
    
  } ,  CHARGE_PERIOD_IN_SEC )
}

main ()
