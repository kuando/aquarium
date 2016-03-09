/**
 * Created by Frank on 16/2/23.
 */
'use strict';

const event = require('../controller/event');
const qiniu = require('../middleware/qiniu');
const sdk = require('../middleware/sdk');

module.exports = function (app) {

    // 获取指定活动
    app.get('/events/:eventId([a-f0-9]{24})', event.findEventById);

    //点赞服务
    app.post('/events/:eventId([a-f0-9]{24})/like', event.addLikeCount);

    //报名
    app.post('/events/:eventId([a-f0-9]{24})/enrollNames', event.saveEnrolledName);

    //分享
    app.post('/events/:eventId([a-f0-9]{24})/share', event.share);

    //视频点赞服务
    app.post('/events/:eventId([a-f0-9]{24})/videos/:videoId/like', event.addVideoLikeCount);

    //点播课程
    app.get('/events/:eventId([a-f0-9]{24})/videos/:videoId', event.findVideoById);

    // 投票首页
    app.get('/votes/:eventId([a-f0-9]{24})', sdk.getSignature, event.findEventById);

    //投票规则
    app.get('/votes/:voteId([a-f0-9]{24})/rules', event.voteRules);

    //搜索结果页面
    app.get('/votes/:voteId([a-f0-9]{24})/search', event.searchVotePlayer);

    //投票报名
    app.get('/votes/:voteId([a-f0-9]{24})/enroll', qiniu.token(), event.voteEnroll);

    //在线报名
    app.post('/votes/:voteId([a-f0-9]{24})/enrolls', event.doEnroll);

    //投票排行
    app.get('/votes/:voteId([a-f0-9]{24})/rank', event.voteRank);

    //投票详情
    app.get('/votes/:voteId([a-f0-9]{24})/players/:playerId([a-f0-9]{24})', event.votePlayer);

    //投票
    app.post('/votes/:voteId([a-f0-9]{24})/players/:playerId([a-f0-9]{24})', event.doVote);


};