
const resperrwithstatus =(res,statuscode,msg,code )=>res.status(statuscode).send({	status:'ERR'	, message:msg,code:code})
const respok=(res,msg,code,jdata)=>res.status(200).send({status:'OK',message:msg,code:code,... jdata})
//	const resperr=(res,msg,code , reason )=>res.status(200).send({status:'ERR',message:msg,code:code , reason })
const resperr=(res,msg,code , jdata )=>res.status(200).send({status:'ERR',message:msg,code:code , ... jdata })
const resplist=(res,msg,code,list)=>res.status(200).send({status:'OK',message:msg,code:code,list:list})

module.exports={
  resperrwithstatus , 
  respok,
  resperr,
  respreqinvalid:resperr,
  resplist
}
