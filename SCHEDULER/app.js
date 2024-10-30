var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const workersrouter = require ( './routes/workers' )
const usersrouter = require ( './routes/users' )
const targetexchangesrouter =require( './routes/targetexchanges' )
const tradepairsrouter =  require( './routes/tradepairs')
const queriesrouter = require ( './routes/queries' )
const settingsrouter = require ( './routes/settings' )
var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger ('dev') )
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter)
app.use( '/workers', workersrouter )
app.use( '/users', usersrouter )
app.use( '/users', usersrouter )
app.use( '/targetexchanges', targetexchangesrouter )
app.use( '/tradepairs', tradepairsrouter )
app.use( '/queries', queriesrouter )
app.use( '/settings', settingsrouter )
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
} )
// error handler
app.use ( function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
const moment= require( 'moment' )
console.log ( `${  moment().toISOString() }@exbot`)
let h = setInterval( ()=>{
  console.log ( `${  moment().toISOString() }@exbot`)
} , 60 * 1000 )
module.exports = app;
