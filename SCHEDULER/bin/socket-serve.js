#!/usr/bin/env node

const app = require('express')();
var http = require('http');
const jwt = require('jsonwebtoken');
const STRINGER = JSON.stringify;
const CJSON = require('circular-json')
const CSTRINGER = CJSON.stringify;
const express = require('express');
const socketrouter = express.Router();
const LOGGER = console.log;
const PARSER = JSON.parse;
const db = require('../../models')
const { moverow, findall, findone } = require('../../utils/db');
const path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
var logger = require('morgan');
const cors = require('cors');
app.use(cors());
app.use(logger('dev'));
socketrouter.post( '/test/socketmessage' , (req, res) => {
  // /:title //	let { title } = req.params
  let str = STRINGER(req.body);
  req.params && LOGGER('@params', STRINGER(req.params));
  LOGGER('@socket req.body', req.body);
  io.emit('MESSAGE', str);
//  io.emit('message', str);
//  app.io.emit('message', str);
//  app.io_ws.emit('message', str);
  res.status(200).send({ status: 'OK' });
});
const KEY_USER2SOCKETID = 'U2S';
// const KEY_S2U = 'USERNAME2SOCKID';
const KEY_S2U = 'S2U';
app.use('/socket', socketrouter); // const { PORT_NUMBER_ SOCKET } = require('../configs/configs');
// const PORT_N UMBER_SOCKET = 38677; //  37521
const https = require('https');
const fs = require('fs');
const cliredisa = require('async-redis').createClient();
const cron = require('node-cron');
const moment = require('moment');
const messenger = require( 'messenger' )
const { // URL_SELF_DEF_BASE // , UUID_NAMESPACE, 
	SCHEDULER
}=require('../../configs/scheduler')
const msgreceiver = messenger.createListener( SCHEDULER?.PORT_INTERNAL_MESSENGER )
// const {
  // bindUsernameSocketid,
//  unbindsocket,
//  deleteSocketid,
//  unbindsocketid,
// } = require('../utils/sockets');
// const { bindsocket, unbindsocket } = require('../utils/sockets');
// let jusername_socket = {};
///////////////////////
// var p ort = normalizePo rt(process.env.PO RT ,, POR T_NUMBER_SOCKET);
msgreceiver.on ( 'MSG_ACTION_ON_WORKER' , async ( messagehandle , data )=>{ LOGGER( {messagehandle , data })
  let { actiontype , workertype } = data
  io.emit ( 'MSG_ACTION_ON_WORKER' , STRINGER ( {
    actiontype , workertype
  }))
} )

false && msgreceiver.on ( 'MSG_ACTION_ON_WORKER' , async ( messagehandle , data )=>{ LOGGER( {messagehandle , data })
//	let { uid0 , uid1 , contents , threaduuid , timestamp  } = data
  let { actiontype , workertype } = data
	let list = await findall ( 'mapsockets' , { userid : uid1 , active : 1 } )
	let N = list?.length
	if ( N > 0 ) {}
	else { return }
	let respsender = await findone ( 'users' , { id: uid0} )
//	let respsender = await findone ( 'users' , { id: uid0} )
	for ( let idx = 0 ; idx< N ; idx ++ ){
		let { socketid } = list[ idx ] 
//		app.io.to( socketid ).emit('MESSAGE', STRINGER( { 
		io.to( socketid ).emit('MESSAGE', STRINGER( { 
			from : { uid: uid0 , urlprofileimage: respsender?.urlprofileimage , username: respsender?.username } ,
			to : uid1 ,
			contents ,
			threaduuid ,
			timestamp
		} ) )	
	}	
} )
const socketio = require('socket.io');
/*
const server_https = https
  .createServer(
    {	key: fs.readFileSync('/etc/nginx/ssl/chitchat1.net/chitchat1.net.key' ).toString(),
      cert:fs.readFileSync('/etc/nginx/ssl/chitchat1.net/chitchat1.net.crt').toString(),
    },
    app
  )
  .listen(PORT_NUMBE R_SOCKET + 10)
const io = socketio( server_https )
LOGGER(`wss listening ${PORT_NUMBE R_SOCKET + 10}`); // const server_http= http	.createServer(	 app	) // server_http.listen( PORT_NUM BER_SOCKET)
*/

const server = http.createServer( app ).listen ( SCHEDULER?.PORT_SOCKET )
LOGGER(`ws listening ${ SCHEDULER?.PORT_SOCKET }`); // const server_http= http	.createServer(	 app	) // server_http.listen( PORT_NUMB ER_SOCKET)
const io = socketio( server )

/* app.io = require('socket.io')(
  server_https, //, { cors: { origin: "*" } }  // {}
  {	cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      transports: ['websocket', 'polling'],
      credentials: true,
    },
    allowEIO3: true,
  }
); // SOCKET */
app.set('socketio', io);
const sha256 = require('js-sha256');
const getconnectionkey = (userid, socket) => {
  return sha256(
    `${userid}_${      socket.handshake.address || socket.request.connection.remoteAddress    }_${socket.request.headers['user-agent']}`
  );
};
const query_is_connection_on = async (connectionkey) => {
  let resp = await db['mapsockets'].findOne({
    raw: true,
    where: { connectionkey },
  });
  return resp;
}
const TOKEN_SECRET = SCHEDULER?.JWT_SECRET  // 'pjMMUmvq7S'
io
// app.io
/*  .use((socket, next) => { LOGGER( STRINGER( socket ))
    if (socket.handshake.query && socket.handshake.query.token) {		// console.log('socket.handshake.query.token', socket.handshake.query.token);      // console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
      jwt.verify(
        socket.handshake.query.token,	// process.env.JWT_SECRET,
        TOKEN_SECRET ,
        (err, decoded) => {
          if (err) {
            return next(new Error('Auth err'));
          } else { LOGGER( STRINGER(decoded) )
          }		// console.log('============================', decoded);
          socket.decoded = decoded;
          next();
        }
      );
    } else {
      LOGGER('err: connection');
      socket.decoded = false;
      next();
    }
  }) */
  .on('connection', async (socket) => { // LOGGER( CSTRINGER( socket ) )
    let userid;
    await jwt.verify(
      socket.handshake.query.token,
      TOKEN_SECRET ,
      (err, decoded) => { LOGGER( CSTRINGER( decoded )) 
        if (err) {		// return next(new Error('Auth err'));
        }
        socket.decoded = decoded;
        if (socket.decoded.id) {				userid = decoded.id;
        }
        if (socket.decoded.demo_uuid) {	userid = decoded.demo_uuid;
        }
      }
    );    // console.log('userid', userid);
    let connectionkey = getconnectionkey(userid, socket);
    let respconnection = await query_is_connection_on(connectionkey);
    // if (respconnection) {    //   socket.disconnect(true);    //   return;	// } else {    // }
    let { id: socketid } = socket;
    if (userid) {	// bindUs ernameSocketid(userid, socket.id);
      cliredisa.hset( KEY_S2U , socketid, userid); // username      // console.log(KEY_S2U, socketid, userid);
      await db['mapsockets'].create({
        userid,
        useragent:
          socket?.request?.headers && socket?.request?.headers['user-agent']
            ? socket.request.headers['user-agent'].substr(0, 200)
            : null,
        ipaddress: socket.handshake.address,
        connectionkey,
				socketid ,
				active : 1
      });
    }
    const address = socket.request.connection.remoteAddress; // getipsocket(socket) // socket.request.connection.remoteAddress // socket.handshake.address
    const port = socket.request.connection.remotePort; //  LOGGER(socket.request.connection)
    // LOGGER(`=====socket.id},${address},${port}, socket connected=======`);
    // LOGGER('rz9TWxHI6C', socket.request._query);	    // LOGGER(socket.handshake.query);
/**	socket.emit('test', 'wss connected');let { username } = socket.request._query;	if (username) { //    bindsocket(username, socketid); //    jusern ame_socket[username] = socket;	//		cliredisa.hset ( KEY_S2U , socketid , username )	}
*/
    socket.on('disconnect', async () => {       const address = socket.request.connection.remoteAddress;LOGGER(`!disconnect ${address}`)
      // LOGGER(`${socket.id},${address},${port} socket DISconnected`); //   username && unbindsocket(username);
      try {        moverow('mapsockets', { connectionkey }, 'logmapsockets', {});
      } catch (err) {        LOGGER(err);
      }
      //		try { await db['mapsockets'].destroy ( { where : { connectionkey } } ) }      //	catch(err){ LOGGER(err) }
      setTimeout(async (_) => {		// await cliredisa.hdel(KEY_S2U, socketid); //      delete juser name_socket[username];
      }, 1000);
    });
  }); // app.io.e mit('test', 'TESTTTTTTTTTTTTTTTT');

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}
/////////////////////////
if (false) {
  const server_http = require('http').createServer(app);
  server_http.listen(PORT_NUMB_ER_SOCKET, (_) => {
    console.log(`ws listening ${PORT_NUMB_ER_SOCKET}`);
  });
  app.io_ws = require('socket.io')(server_http, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      transports: ['websocket', 'polling'],
      credentials: true,
    },
    allowEIO3: true,
  });
  app.set('socket.io_ws', app.io_ws);
  app.io_ws.on('connection', (socket) => {
    socket.emit('test', 'ws connected');
    const address = socket.request.connection.remoteAddress; // getipsocket(socket) // socket.request.connection.remoteAddress // socket.handshake.address
    const port = socket.request.connection.remotePort; //  LOGGER(socket.request.connection)
    LOGGER(`${socket.id},${address},${port}, socket connected`);
    LOGGER('rz9TWxHI6C', socket.request._query);
    LOGGER(socket.handshake.query);
    let { username } = socket.request._query;
    let { id: socketid } = socket;
    if (username) {
      cliredisa.hset(KEY_S2U, socketid, username); //    bindsocket(username, socketid); //    juserna me_socket[username] = socket;
    }
    socket.on('disconnect', () => {
      const address = socket.request.connection.remoteAddress;
      LOGGER(`${socket.id},${address},${port} socket DISconnected`); //		username &&    unbindsocket(username);
      cliredisa.hdel(KEY_S2U, socketid);
      setTimeout((_) => {
        //      delete juser name_socket[username];
      }, 1000);
    });
  });
}
