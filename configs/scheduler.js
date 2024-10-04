
let URL = 'http://localhost' 
const SCHEDULER = {
  PORT_INTERNAL_MESSENGER : '52913' ,
  PORT_HTTP :               '52923' ,
  PORT_SOCKET :             '52933' ,  
  URL , // : 'http://localhost'
  JWT_SECRET : 'Crc7qVZMeHudu8ii' ,
  URL_SOCKET_COMPLETE : `${ URL }/${ PORT_SOCKET }` ,
  MSG_ACTION_ON_WORKER : 'MSG_ACTION_ON_WORKER' ,
}

module.exports= { 
  SCHEDULER
}
