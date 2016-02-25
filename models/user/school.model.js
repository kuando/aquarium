/**
 * Created by Administrator on 2016/1/14.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * ѧУ����ģ��Schema
 * @type {Schema}
 */
var schoolSchema = new Schema({

    // 用户名,用户登陆系统所用的名字
    username: {
        type: String,
        trim: true,
        unique: true,
        required: '用户名不能为空',
        index: true
    },

    // 密码
    password: {
        type: String,
        trim: true
    },

    // 加密盐值
    salt: {
        type: String
    },

    // 显示名字,也就是真实姓名
    displayName: {
        type: String,
        trim: true
    },

    // 联系方式
    contact: {
        type: String,
        trim: true,
        required: '联系方式不能为空'
    },

    // 学校名字
    schoolName: {
        type: String,
        trim: true,
        required: '学校名称不能为空'
    },

    // 所在省
    province: {
        type: String,
        trim: true,
        required: '所在省份不能为空'
    },

    // 所在市
    city: {
        type: String,
        trim: true,
        required: '所在城市不能为空'
    },

    // 所在区/县
    area: {
        type: String,
        trim: true
    },

    address: {
        type: String,
        trim: true
    },


    scale: {
        type: Number,
        required: '规模不能为空'
    },


    qrcode: {
        type: String
    },


    privateQrcode: {
        type: String
    },

    avatar: {
        type: String
    },


    state: {
        type: Number,
        enum: [0, 1],
        default: 0
    },


    createdTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    School: mongoose.model('School', schoolSchema)
};