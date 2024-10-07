var express = require('express');
var router = express.Router();
const db=require( '../../models' )
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require( '../configs/common')
const { getipaddress }=require( '../../utils/session' )
const { deletejfields } = require( '../../utils/common' )
const LOGGER = console.log
const { findone , createrow } = require( '../../utils/db' )
const { respok , resperr } = require( '../../utils/rest' )
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
} )
router.post("/login", async (req, res) => {   
  let { username ,pw  } = req.body //  let { phonenumber,		phonecountrycode2letter , phonenationalnumber ,pw, code } = req.body
  LOGGER("m9m9hptxoA", req.body ); // log gerwin.info ( req.body )//  respok(res);return //  if (us ername && pw) {  } 
  let respuser
  // let { nettype } =req.query
  // //	if ( nettype ){} else { resperr( res, 'NETTYPE-NOT-SPECIFIED' ) ; return }
  // if ( nettype ){} else { resperr( res, messages.MSG_NETTYPE_NOT_SPECIFIED ) ; return }
  // let NETTYPE = nettype 
  // phonenumber = get_normal_phonenumber ( req?.body ) 
  // if ( phonenumber ) {}
  // else { resperr ( res , messages.MSG_ARGMISSING , null , { reason : 'PLEASE-SPECIFY-phonenationalnumber-AND-phonecountry2letter-OR-phonenumber' } ) ; return }    
  if ( username && pw ) {		respuser = 	 await findone("users", { username , pw , active : 1 } ) // , nettype 
  }
  // else if ( code ) {
  //   let resp = await db[ 'verifycode'].findOne ({ raw : true, where : { receiver : phonenumber , code , expiry : {[Op.gte] : moment().unix() } } } )
  //   if ( resp ) {}
  //   else { resperr ( res, messages.MSG_ARGINVALID ) ; return }
  //   respuser = 	 await findone("users", { phonenumber ,  nettype } )
  // }
  else { resperr ( res,messages.MSG_ARGMISSING , '10001' ) ; return 
  }

  // if ( pw || code ) {  } 
  // else {    resperr(res, messages.MSG_ARGMISSING, '10002' , { reason : 'pw or code'} );
  //   return;
  // }   //  let isaddressvalid = WAValidator.validate(address , cryptotype.toLowerCase() ) //  if(isaddressvalid){} else {   resperr(res , messaegs.MSG_ARGINVALID);return  //  }
//  let respuser = await findone("users", { use rname, pw , pwhash : sha256(pw) , nettype }) // .then(async (resp) => {
//pwhash : sha256(pw) ,
  // .then(async (resp) => {
    if (respuser ) {
    } else {
      resperr(res, messages.MSG_VERIFYFAIL);
      LOGGER(messages.MSG_VERIFYFAIL);
      return;
    }
    // let { icanlogin } = respuser
    // if (+ icanlogin) {
    // } else {
    //   resperr(res, messages.MSG_USER_LOGIN_FORBIDDEN ) // MSG_AUTH_FAILED);
    //   LOGGER(messages.MSG_USER_LOGIN_FORBIDDEN ) // MSG_AUTH_FAILED);
    //   return;
    // }
  let useruuid = respuser?.uuid
    // let respacct = await findone("accounts", { useruuid } ) // : phonenumbwe })
    // let respsetting = await findone ( 'settings' , { key_:'GIVE-PRIVATEKEY' , active : 1 } )
    // if ( + respsetting?.value_) { }
    // else { delete respacct?.privatekey }
    //		let jacct= {}
    //	jacct= { address : respacct.address , nett ype : 'ETH-TESTNET' }
//    const token = generaterandomstr(TOKENLEN);
    let ipaddress = getipaddress(req);
//    let resptokenenv = await findone ( 'tokens' , { nettype : NETTYPE , active:1 , istoken : 1 } )
    respuser = deletejfields ( respuser , ['id','pw','pwhash' ] )
    let token = await createJWT ( respuser )
    let respsession = await createrow( "sessionkeys" , {
      username , // : phonenumber ,
      token : token?.token ,
//      useragent: getuseragent(req).substr(0, 900),
      ipaddress,
      useruuid 
    }) // .then(async (resp) => {
      respok(res, null, null, {
        respdata: token,
        payload: {
          token,
          // account: {
          //   nettype : NETTYPE // "ETH-TESTNET": 
          //   , address :				respacct.address,
          //   ... respacct
          // },
          // tokenenv : resptokenenv 	
        },
      });
      // createrow("logactions", {
      //   username : phonenumber ,
      //   unixtime: moment().unix(),
      //   type: MAP_USER_ACTIONS["LOGIN"],
      //   typestr: "LOGIN",
      //   ipaddress: getipaddress(req),
      // });
//    });
//  });
  });
module.exports = router;

const  createJWT = async(jfilter) => {
  let userwallet;
  let userinfo = await db['users'].findOne({
    raw: true,
    where: {      ...jfilter,
    }, /**    attributes: [      'id',      'firstname',      'lastname',      'email',      'phone',      'level',      'referercode',      'isadmin',      'isbranch',      'profileimage',      'countryNum',      'language',      'mailVerified',      'phoneVerified',    ], */
  });
  if (!userinfo) {
    return false;
  }
	LOGGER(`@userinfo` , userinfo)  ; // logg erwin.info ( STRINGER(userinfo ))
  let token = jwt.sign(
    {      type: 'JWT',
      ... userinfo, //      wallet: userwallet,
    },
    JWT_SECRET, //    process.env.JWT_SECRET,
    {      expiresIn: '30000h',    // expiresIn: '24h',
      issuer: 'EXPRESS',
    }
  ); //	de lete userinfo[ 'pw' ]
  return {
    token, // tokenId: 
    ...userinfo,
    userinfo,
  };
}