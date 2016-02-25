/**
 * Created by Administrator on 2016/1/15.
 */
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/**
 * 报名数据模型
 */
var enrollNamesSchema = new mongoose.Schema({

    // 姓名
    name: {
        type: String,
        required: true
    },
    // 电话
    phone: {
        type: String,
        required: true
    },

    // 对应报名
    enroll: {
        type: ObjectId,
        required: true
    },

    // 报名自定义域
    fields: [String],

    schoolId: {
        type: ObjectId,
        required: true
    },

    createdTime: {
        type: Date,
        default: Date.now
    }

});

mongoose.model('EnrollNames', enrollNamesSchema);
