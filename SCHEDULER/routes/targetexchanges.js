var express = require('express');
var router = express.Router()
const axios = require ( 'axios' )
const { respok , resperr }=require('../../utils/rest')
// const dbalibae = require( '../../models-alibae' );
const db = require ( '../../models' )
const { get_trade_pairs , fetch_tradepairs_local , load_and_update_active_tradepairs
} = require('../../utils/exchanges/alibae');
const { updaterows , upsert, upsert_sane } = require('../../utils/db');
const conv_mashdiv_currency_pair_to_symbol = ({ currency , pair })=>  `${ currency }_${ pair }`
const STRINGER = JSON.stringify
const LOGGER = console.log



router.get ( '/tradepairs' , async ( req , res )=>{
  let list_tp = await load_and_update_active_tradepairs ()
  respok(res, null , null , { list : list_tp , payload : { count : list_tp?.length }} )
  return 
})

module.exports = router 
