const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const app = express();

// config
const mongodbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/market-db';

// Connect to DB
mongoose.set('debug', true);

mongoose.connect(mongodbUri, {useNewUrlParser: true})
    .then(() => {
      console.log('[mongoose] connection established');
    })
    .catch((err) => {
      console.error('[mongoose] connection error ' + err);
      process.exit(1);
    });

// Models
require('./models/Order');
require('./models/User');
require('./models/Product');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Routes
app.use(require('./routes/routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.send();
});

module.exports = app;
