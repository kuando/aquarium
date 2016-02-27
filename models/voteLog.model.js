'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


//投票纪录数据模型，每条纪录保持一天后会被删除
const voteLogSchema = new Schema({

	// 对应投票ID
	vote: {
		type: ObjectId,
		required: true
	},

	// 投票人唯一标识
	uid: {
		type: String,
		required: true

	},

	// 选手ID
	votePlayer: {
		type: ObjectId,
		required: true
	},

	createdTime: {
		type: Date,
		default: Date.now,
		expires: '24h'
	}

});

mongoose.model('VoteLog', voteLogSchema);