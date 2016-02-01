/**
 * Created by Administrator on 2016/1/15.
 */
'use strict';
var mongoose = require('mongoose');
var Event = mongoose.model('Event');

var activitySchema = new mongoose.Schema({

    // 开始时间
    startTime: {
        type: Date,
        required: true
    },

    // 结束时间
    endTime: {
        type: Date,
        required: true
    },

    // 活动地址
    address: {
        type: String
    }
});

module.exports = activitySchema;
