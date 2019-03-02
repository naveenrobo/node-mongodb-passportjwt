const express = require('express');
const mongoose = require('mongoose');

const fs = require('fs')
const morgan = require('morgan')
const path = require('path')
var rfs = require('rotating-file-stream')

const passport = require('passport');

const config = require('./helpers/config')
const {
    handle404Error,
    handleDevErrors
} = require('./helpers/errorHandler');
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

var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = rfs('access.log', {
    interval: '1d',
    path: logDirectory
})
app.use(morgan('combined', {
    stream: accessLogStream
}))

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