const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const passport = require('passport');

const config = require('./helpers/config')
const { handle404Error, handleDevErrors } = require('./helpers/errorHandler');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

mongoose.connect(config.DB, {
    useCreateIndex: true,
    useNewUrlParser: true
}).then(
    () => {
        console.log('Database is connected')
    },
    err => {
        console.log('Can not connect to the database' + err)
    }
);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(passport.initialize());
require('./helpers/passport')(passport);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(handle404Error);
app.use(handleDevErrors);


module.exports = app;