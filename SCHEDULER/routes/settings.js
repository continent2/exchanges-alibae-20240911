
var express = require('express');
var router = express.Router()
const { findone, updaterows } = require ( '../../utils/db' )
const { respok , resperr }=require('../../utils/rest');
const { messages } = require('../../configs/messages');

router.put ( '/data' , // auth ,   
  async ( req,res)=>{   LOGGER(req.body)
  let tablename = 'settings' //	let { tablename } = req.params
//	let { id , uuid : useruuid } = req.decoded
//	if ( await tableexists ( tablename ) ) {}
	// else { resperr ( res, 'TABLE-DOES-NOT-EXIST' ) ; return }
	// delete req.body [ 'id' ]
	// delete req.body [ 'useruuid' ]
  let arrupdatedata = [ ... req?.body ]
  switch ( arrupdatedata?.length ){
    case 0: resperr( res, messages?.MSG_DATANOTFOUND ) ; return
    break
    default : break
  }
  for ( let el of arrupdatedata ){
    let [ key , value ]  = el    
    let resp = await findone ( tablename , { key , active : 1 } )
    if ( resp ){}
    else { resperr ( res, messages?.MSG_DATANOTFOUND , null , { key }); return }
  }
  let n_rows_changed = 0
  for ( let el of arrupdatedata ){
    let [ key , value ]  = el
    await updaterows ( tablename , { key } , { value } )
    ++ n_rows_changed
  } //	await updaterow ( tablename , { useruuid } , { ... req.body } ) 
	respok ( res , `${ n_rows_changed } ROWS UPDATED` )
})

module.exports = router
