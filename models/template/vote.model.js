/**
 * Created by Frank on 16/1/11.
 */
'use strict';

const mongoose = require('mongoose');
//投票数据模型
const voteSchema = new mongoose.Schema({

    // 排行榜人数
    rank: {
        type: Number,
        required: true,
        default: 50
    },

    // 开始时间
    startTime: {
        type: Date
    },

    // 截止日期
    endTime: {
        type: Date
    },

    // 首页滑动图片
    slides: [String],

    // 颜色主题 
    theme: {
        type: String,
        default: 'default'
    },

    // 每人投票数量限制 
    voteLimit: {
        type: Number,
        default: 3
    },

    // 是否要求关注
    requireFollow: {
        type: Boolean,
        default: true
    },

    // 关注提示
    followTip: {
        type: String
    },

    // 奖项设置
    prize: {
        type: String
    },

    // 参与方式
    participation: {
        type: String
    },

    voteEnroll: {
        type: Boolean
    },

    // 投票说明
    explanation: {
        type: String
    },

    // 选手序号, 用于产生选手编号
    playerCounter: {
        type: Number,
        default: 0
    },
    // 累计投票
    totalPoll: {
        type: Number,
        default: 0
    }

});

voteSchema.post('remove', (vote) => {

    //删除该投票对应的选手信息
    mongoose.model('VotePlayer').remove({
        vote: vote._id
    }).exec();

});

module.exports = voteSchema;