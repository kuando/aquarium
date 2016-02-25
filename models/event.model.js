/**
 * Created by Administrator on 2016/1/14.
 */
'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

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

    //创建人角色
    creatorRole: {
        type: Number,
        required: '创建人角色不能为空'
    },

    //模版类型
    template: {
        type: String,
        required: '模版不能为空',
        enum: ['article', 'activity', 'audition', 'classroom']
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

const Event = mongoose.model('Event', eventSchema);
Event.discriminator('activity', require('./template/activity.model'));
Event.discriminator('article', require('./template/article.model'));
Event.discriminator('audition', require('./template/audition.model'));
Event.discriminator('classroom', require('./template/classroom.model'));