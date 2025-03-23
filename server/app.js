var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter= require('./routes/admin');

var app = express();

const db=require('./database/db')


app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a secure secret
  resave: false, // Avoid resaving unchanged sessions
  saveUninitialized: false, // Don't save empty sessions
  cookie: {
      httpOnly: true, // Prevent client-side access
      secure: process.env.NODE_ENV === 'production', // Ensure HTTPS in production
      maxAge: 3600000 // 1 hour in milliseconds
  }
}));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
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
