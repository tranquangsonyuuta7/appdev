var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const database = require('./database/models/index');
const session = require("express-session");
const flash = require("connect-flash");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var staffRouter = require('./routes/trainingStaff');
var authRouter = require('./routes/auth');
const { verifyAdmin, verifyStaff } = require('./middlewares/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('dotenv').config()

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24; // milisecond
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: { maxAge: oneDay },
  })
);

app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/admin',verifyAdmin, adminRouter);
app.use('/admin', adminRouter);
// app.use('/trainingStaff',verifyStaff ,staffRouter);
app.use('/trainingStaff',staffRouter);
app.use('/auth' ,authRouter);

database.testConnection();

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
