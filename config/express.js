/**
 * Created by Administrator on 2016/1/12.
 */
'use strict';

const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const xmlParser = require('express-xml-bodyparser');
const requireDir = require('require-dir');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(xmlParser());

if (process.env.NODE_ENV !== 'development') {
    app.set('views', path.join(__dirname, '../dist/views'));
    app.set('view cache', true);
} else {
    app.set('views', path.join(__dirname, '../views'));
    app.use(express.static(path.join(__dirname, '../public')));
}

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//初始化 server models
requireDir('../models', {
    recurse: true
});

//初始化 server router
require('../routes')(app);

module.exports = app;


