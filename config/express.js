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

if (process.env.NODE_ENV !== 'development') {
    app.set('views', path.join(__dirname, '../dist/views'));
    app.set('view cache', true);
    app.use(express.static(path.join(__dirname, '../dist')));
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

app.use(function (err, req, res, next) {
    console.error(err);
    let accept = req.accepts('html', 'text', 'json');
    let status = err.status || 500;
    switch (accept) {
        case 'html':
            return res.render(`error/${status}`);
        case 'json':
        case 'text':
            return res.statusCode(status).send(err.message);
    }
    return next();
});

// 如果没有路由匹配,直接跳转404
app.use(function (req, res) {
    res.render('error/404');
});

module.exports = app;


