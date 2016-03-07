'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * 学生数据模型Schema
 * @type {Schema}
 */
var studentSchema = new Schema({
    // 用户名,用户登陆系统所用的名字
    username: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        required: '学号不能为空'
    },
    //密码
    password: {
        type: String,
        required: '密码不能为空'
    },
    // 姓名
    displayName: {
        type: String,
        trim: true
    },

    // 性别
    gender: {
        type: String,
        trim: true,
        enum: ['男', '女']
        //enum: ['男', '女'] //(0:女 1:男)
    },

    // 头像
    avatar: {
        type: String,
        trim: true
    },
    // 生日
    birthday: {
        type: Date
    },
    // 联系方式
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    // 家长
    parent: {
        type: String,
        trim: true,
        default: ''

    },
    // 积分
    score: {
        type: Number,
        default: 0
    },

    // 就读公办学校
    onSchool: {
        type: String,
        default: ''
    },
    grade: {
        type: String,
        default: ''
    },
    //备注
    remark: {
        type: String,
        trim: true
    },
    // 班级
    classes: [{
        type: ObjectId,
        ref: 'Class'
    }],
    //状态
    state: {
        type: Number,
        enum: [0, 1], //(0:可用 1:禁用 2:无班级)
        default: 0
    },
    openids: [String],

    // 完成作业数量
    finishedHomeworkCount: {
        type: Number,
        default: 0
    },
    // 完成预习数量
    finishedPreviewsCount: {
        type: Number,
        default: 0
    },
    // 创建时间
    createdTime: {
        type: Date,
        default: Date.now
    },
    // 所在培训学校编号
    schoolId: {
        type: ObjectId
    }
});


studentSchema.index({schoolId: 1, state: 1});
studentSchema.index({openids: 1});
studentSchema.index({classes: 1});
mongoose.model('Student', studentSchema);

