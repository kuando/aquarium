/**
 * Created by Frank on 16/1/11.
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const eventSchema = new Schema({

    // 标题
    title: {
        type: String,
        required: '标题不能为空'
    },

    // 封面图片
    coverImage: {
        type: String,
        required: '封面不能为空'
    },

    // 详情
    content: {
        type: String
    },

    // 报名表单 (如果存在说明需要报名,否则不需要)
    enroll: {
        type: ObjectId,
        ref: 'Enroll'
    },

    // 阅读量
    visit: {
        type: Number,
        default: 0
    },

    // 赞
    like: {
        type: Number,
        default: 0
    },

    // 分享量
    share: {
        type: Number,
        default: 0
    },

    //创建人
    creator: {
        type: ObjectId,
        required: '创建人不能为空'
    },

    state: {
        type: Number,
        default: 0
    },

    //标签
    tags: [String],

    //创建人角色
    creatorRole: {
        type: Number,
        required: '创建人角色不能为空'
    },

    //模版类型
    template: {
        type: String,
        required: '模版不能为空',
        enum: ['article', 'activity', 'audition', 'classroom','vote']
    },

    schoolId: {
        type: ObjectId,
        ref:'School',
        required: true
    },

    createdTime: {
        type: Date,
        default: Date.now
    }

});


eventSchema.post('remove', (event)=> {

    //如果存在报名,删除该活动后,一并删除报名信息
    mongoose.model('Enroll').remove({
        event: event._id
    }).exec();

    //如果存在任务,则删除任务信息
    mongoose.model('ScoreTask').remove({
        event: event._id
    }).exec();

});


const Event = mongoose.model('Event', eventSchema);

Event.discriminator('activity', require('./template/activity.model'));
Event.discriminator('article', require('./template/article.model'));
Event.discriminator('audition', require('./template/audition.model'));
Event.discriminator('classroom', require('./template/classroom.model'));
Event.discriminator('vote', require('./template/vote.model'));


