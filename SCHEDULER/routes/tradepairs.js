var express = require('express');
var router = express.Router()
const { findone } = require ( '../../utils/db' )
const { respok , resperr }=require('../../utils/rest');
const { messages } = require('../../configs/messages');

router.post ( '/status/:enabledisable/:symbol' , async (req,res)=> {
  let { enabledisable , symbol } = req?.params
  let resptradepair = await findone ( 'tradepairs' , { symbol } )
  if (resptradepair ){}
  else { resperr ( res, messages?.MSG_DATANOTFOUND ); return }
  switch ( enabledisable ){
    case 'enable' : 
      await updaterows ( 'tradepairs' , { id: resptradepair?.id } , { isenabled : 1 } )
    break 
    case 'disable' :
    default : 
      await updaterows ( 'tradepairs' , { id: resptradepair?.id } , { isenabled : 0 } ) 
    break 
  }
  respok ( res, 'UPDATED' )
})
/** router.get ( '/' , (req,res)=>{
  respok(res, 'SCHEDULER-HTTP-ALIVE' )
  return 
})
router.get('/___save', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/
module.exports = router
