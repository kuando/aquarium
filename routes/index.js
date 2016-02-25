/**
 * Created by Frank on 16/2/23.
 */
'use strict';

const event = require('../controller/event');

module.exports = function (app) {

    // 获取指定活动
    app.get('/events/:eventId', event.findEventById);

    //点赞服务
    app.post('/events/:eventId/like', event.addLikeCount);

    //报名服务
    app.post('/events/:eventId/enrollNames', event.saveEnrolledName);

    //视频点赞服务
    app.post('/events/:eventId/videos/:videoId/like', event.addVideoLikeCount);

    //点播课程
    app.get('/events/:eventId/videos/:videoId', event.findVideoById);


    //投票
    app.get('/vote', event.vote);

    //投票规则
    app.get('/vote/rules', event.voteRules);

    //投票报名
    app.get('/vote/enroll', event.voteEnroll);

    //投票排行
    app.get('/vote/rank', event.voteRank);

    //投票详情
    app.get('/vote/detail', event.votePlayer);

};