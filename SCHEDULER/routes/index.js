var express = require('express');
var router = express.Router();
const { respok , resperr }=require('../../utils/rest')


router.get ( '/' , (req,res)=>{
  respok(res, 'SCHEDULER-HTTP-ALIVE' )
  return 
})
router.get('/___save', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
