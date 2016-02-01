/**
 * Created by Administrator on 2016/1/12.
 */
'use strict';

var express = require('express')
    , path = require('path')
    , ejs = require('ejs')
    , db = require('./db/mongo')
    , bodyParser = require('body-parser')
    , models = require('./app/model/index')
    , routes = require('./routes/router')
    , app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

//基本路由
app.get('/event/:eventId', routes.event);

//容错路由
app.get('/error', routes.errorPage);

//点赞服务
app.post('/praise', routes.addLikeCount);

//报名服务
app.post('/enrollment', routes.saveEnrolledName);

//视频点赞服务
app.post('/view/praise', routes.addVideoLikeCount);

//点播课程
app.get('/event/:eventId/view/:videoId', routes.turnToVideo);

//投票
app.get('/castvote', routes.castVote);

//投票详情
app.get('/castvote/detail', routes.castVoteDetail);


app.listen(app.get('port'),function () {
    console.log('application started on port ' + app.get('port'));
});
