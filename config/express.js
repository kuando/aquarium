/**
 * Created by Administrator on 2016/1/12.
 */
'use strict';

const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const requireDir = require('require-dir');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || 4000);

app.set('views', path.join(__dirname, '../views'));

app.engine('.html', ejs.__express);

app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, '../public')));


//初始化 server models
requireDir('../models', {
    recurse: true
});

//初始化 server router
require('../routes')(app);

module.exports = app;


