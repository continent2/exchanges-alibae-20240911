
var express = require('express');
var router = express.Router()
const { findone, updaterows , countrows_scalar } = require ( '../../utils/db' )
const { respok , resperr }=require('../../utils/rest');
const { messages } = require('../../configs/messages');
const MAP_PROHIBITED = { users : 1 }
const ISFINITE = Number.isFinite
const db = require ( '../../models' )
const MAP_ORDER_BY_VALUES = {  ASC: 1, asc : 1 ,   DESC: 1, desc :1 ,};
router.get( '/rows/:tablename/:fieldname/:fieldval/:offset/:limit/:orderkey/:orderval',
// auth ,
async (req, res) => {
  let { tablename, fieldname, fieldval, offset, limit, orderkey, orderval } =
    req.params;
  let {
    itemdetail,
    userdetail,
    filterkey,
    filterval,
    jfilters,
    nettype,
    date0,
    date1, notmyown , searchkey
  } = req.query;
  let jfilters_in
  if ( jfilters && KEYS(jfilters).length > 0 )  { jfilters_in = { ... jfilters } }
//  let { id , uuid : useruuid } = req.decoded
//  let uid = id
  console.log( 'req.query' , req.query);  //  const username = getusernamefromsession(req);//    fieldexists(tablename, fieldname).then(async (resp) => {
    offset = +offset;
    limit = +limit;
    if (ISFINITE(offset) && offset >= 0 && ISFINITE(limit) && limit >= 1) {
    } else {
      resperr(res, messages.MSG_ARGINVALID, null, {
        payload: { reason: 'offset-or-limit-invalid' },
      });
      return;
    }
    if (MAP_ORDER_BY_VALUES[orderval]) {
    } else {
      resperr(res, messages.MSG_ARGINVALID, null, {
        payload: { reason: 'orderby-value-invalid' },
      });
      return;
    }
    let jfilter = {};
    if ( fieldname == '_' ) {}
    else {       jfilter[fieldname] = fieldval }
    if (filterkey && filterval) {
            jfilter[filterkey] = filterval;
    } else {
    }
    if ( jfilters_in ) {
      jfilter = { ... jfilter , ... jfilters_in }
    }
    if (searchkey) {
      let liker = convliker(searchkey);
      let jfilter_02 = expand_search(tablename, liker);
      jfilter = { ...jfilter, ...jfilter_02 };
      console.log('jfilter', jfilter);
    } else {
    }
    if (date0) {
      jfilter = {
        ...jfilter,
        createdat: {
          [Op.gte]: moment(date0).format('YYYY-MM-DD HH:mm:ss'),
        },
      };
    }
    if (date1) {
      jfilter = {
        ...jfilter,
        createdat: {
          [Op.lte]: moment(date1).format('YYYY-MM-DD HH:mm:ss'),
        },
      };
    }
    // if(+notmyown) {  }
    // else {  jfilter [ 'useruuid' ] = useruuid
    // }
    if (tablename =='notifies' ) {
      jfilter= { [Op.or] : [
        { ... jfilter } ,
        { iscommon : 1 }
      ] }
    }
    let list_00 = await      db[tablename ]
      .findAll({
        raw: true,
        where: { ...jfilter },
        offset,
        limit,
        order: [[orderkey, orderval]],
      })
  let count = await countrows_scalar(tablename, jfilter);
  respok ( res, null,null, { list : list_00 , payload : { count  } } )
  return
  }
)

module.exports = router
