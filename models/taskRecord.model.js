/**
 * Created by Frank on 16/1/26.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * 学生每完成一次任务产生一次纪录
 *
 */
var taskCollectSchema = new Schema({

    task: {
        type: ObjectId,
        ref: 'ScoreTask',
        required: true
    },

    student: {
        type: ObjectId,
        required: true,
        ref: 'Student'
    },

    createdTime: {
        type: Date,
        default: Date.now
    },

    schoolId: {
        type: ObjectId,
        required: true
    }

});

taskCollectSchema.index({student: 1, task: 1});

module.exports = {
    TaskRecord: mongoose.model('TaskRecord', taskCollectSchema)
};
