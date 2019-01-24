var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var winston = require('./config/winston');


//for loading the sendgrid API key:
require('dotenv').config({path: path.join(__dirname, 'sendgrid.env')})

//for the reCAPTCHA part:
const bodyParser = require('body-parser');
const request = require('request');

var indexRouter = require('./routes/index');
var contactRouter = require('./routes/contact');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Middleware for the reCAPTCHA part:
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/', indexRouter);
app.use('/contact', contactRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
