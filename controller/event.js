/**
 * Created by Administrator on 2016/1/15.
 */
'use strict';
const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const Classroom = Event.discriminators['classroom'];
const EnrollNames = mongoose.model('EnrollNames');
const VotePlayer = mongoose.model('VotePlayer');
const Task = mongoose.model('ScoreTask');
const TaskRecord = mongoose.model('TaskRecord');
const Student = mongoose.model('Student');


module.exports = {

    findEventById: (req, res, next) => {
        Event.findByIdAndUpdate(req.params.eventId, {$inc: {visit: 1}})
            .populate('schoolId', 'schoolName').populate('enroll')
            .exec()
            .then((event)=> {
                if (!event) {
                    return Promise.reject(new Error('活动不存在'));
                }
                req.event = event;
                switch (event.template) {
                    case 'article':
                        return renderEvent(req, res);
                    case 'activity':
                    case 'classroom':
                    case 'audition':
                        return renderEnrolledEvent(req, res);
                    case 'vote':
                        return renderVoteEvent(req, res);
                    default:
                        return Promise.reject(new Error('活动类型错误'));
                }
            }).catch(next);
    },

    addLikeCount: (req, res, next)=> {
        Event.findByIdAndUpdate(req.params.eventId, {$inc: {like: 1}}).select('like').exec()
            .then(() => {
                res.sendStatus(200);
            })
            .catch(next);
    },


    saveEnrolledName: (req, res, next)=> {
        Event.findById(req.params.eventId).select('enroll schoolId').exec()
            .then((event)=> {
                if (!event || !event.enroll) {
                    return Promise.reject(new Error('活动不存在或没有报名'));
                }
                return event;
            })
            .then((event)=> {
                let data = _.assign(req.body, {enroll: event.enroll, schoolId: event.schoolId});
                return new EnrollNames(data).save()
            })
            .then((enrollName)=> {
                res.json({result: enrollName});
            })
            .catch(next);
    },

    findVideoById: (req, res, next)=> {
        let eventId = req.params.eventId;
        let videoId = req.params.videoId;
        Classroom.findOneAndUpdate({
            _id: eventId,
            courses: {
                $elemMatch: {_id: videoId}
            }
        }, {$inc: {'courses.$.visit': 1}}).exec().then((classroom)=> {
            if (!classroom || classroom.courses.length === 0) {
                return Promise.reject(new Error('视频不存在'));
            }
            return res.render('video', {
                item: classroom.courses[0],
                eventId: classroom._id
            });
        }).catch(next);
    },

    addVideoLikeCount: (req, res, next)=> {
        Classroom.update({
                _id: req.params.eventId,
                courses: {
                    $elemMatch: {
                        _id: req.params.videoId
                    }
                }
            },
            {$inc: {'courses.$.like': 1}})
            .exec()
            .then(()=> {
                res.sendStatus(200);
            }).catch(next);
    },


    voteRules: (req, res, next)=> {
        let voteId = req.params.voteId;
        let Vote = Event.discriminators['vote'];
        Vote.findById(voteId).select('prize participation explanation theme')
            .lean().exec()
            .then((vote)=> {
                if (!vote) {
                    return Promise.reject(new Error('投票不存在'));
                }
                res.locals.vote = vote;
                res.render('vote/vote-rules');
            }).catch(next);
    },

    voteEnroll: (req, res, next)=> {
        let Vote = Event.discriminators['vote'];
        let voteId = req.params.voteId;
        res.locals.token = req.token;
        Vote.findById(voteId)
            .select('voteEnroll prize participation explanation theme')
            .exec().then((vote)=> {
            if (!vote) {
                return Promise.reject(new Error('投票不存在'));
            }
            res.locals.vote = vote;
            res.render('vote/vote-enroll');
        }).catch(next);
    },

    //报名
    doEnroll: (req, res, next)=> {
        let Vote = Event.discriminators['vote'];
        let voteId = req.params.voteId;
        let phone = req.body.phone;
        if (!phone || phone === '') {
            return res.status(400).json({
                err: '手机不能为空'
            });
        }
        VotePlayer.count({
            phone: phone,
            vote: voteId
        }).exec().then((count)=> {
            if (count > 0) {
                return res.status(400).json({
                    err: '一个手机号只能报一次名'
                });
            }
            return Vote.findByIdAndUpdate(voteId, {
                    $inc: {
                        playerCounter: 1
                    }
                }, {new: true})
                .select('status voteEnroll playerCounter')
                .exec().then((vote)=> {
                    if (!vote) {
                        return Promise.reject(new Error('投票不存在'));
                    }
                    if (vote.status === 1) {
                        return Promise.reject(new Error('投票已经结束'));
                    }
                    if (!vote.voteEnroll) {
                        return Promise.reject(new Error('投票已停止报名'));
                    }
                    let votePlayer = new VotePlayer(req.body);
                    votePlayer.sequence = vote.playerCounter + '';
                    votePlayer.isAudit = false;
                    votePlayer.source = 'enroll';
                    votePlayer.vote = vote;
                    return votePlayer.save();
                }).then((player)=> {
                    res.json(player);
                })
        }).catch(next);
    },

    voteRank: (req, res, next)=> {
        let Vote = Event.discriminators['vote'];
        let voteId = req.params.voteId;
        Vote.findById(voteId)
            .select('_id theme')
            .exec().then((vote)=> {
            if (!vote) {
                return Promise.reject(new Error('投票不存在'));
            }
            res.locals.vote = vote;
            return VotePlayer.where('vote', voteId)
                .where('isAudit', true)
                .sort('-poll').limit(50).exec();
        }).then((players)=> {
            res.locals.players = players;
            res.render('vote/vote-rank');
        }).catch(next);
    },

    votePlayer: (req, res, next)=> {
        let Vote = Event.discriminators['vote'];
        let playerId = req.params.playerId;
        let voteId = req.params.voteId;
        res.locals.followFlag = req.query.followFlag === '1';
        Vote.findById(voteId).select('requireFollow followTip schoolId theme')
            .populate('schoolId', 'schoolName privateQrcode')
            .exec()
            .then((vote)=> {
                if (!vote) {
                    return Promise.reject(new Error('投票不存在'));
                }
                res.locals.vote = vote;
                return VotePlayer.findById(playerId).lean().exec();
            })
            .then((player)=> {
                if (!player) {
                    return Promise.reject(new Error('选手不存在'));
                }
                res.locals.player = player;
                return VotePlayer
                    .where('vote', voteId)
                    .where('poll').gt(player.poll)
                    .count().exec();
            })
            .then((rank)=> {
                res.locals.rank = rank + 1;
                res.render('vote/vote-player');
            })
            .catch(next);
    },

    doVote: (req, res, next)=> {
        let Vote = Event.discriminators['vote'];
        let voteId = req.params.voteId;
        let playerId = req.params.playerId;
        Vote.findByIdAndUpdate(voteId, {
            $inc: {totalPoll: 1}
        }).select('_id').exec().then((vote)=> {
            if (!vote) {
                return Promise.reject(new Error('投票不存在'));
            }
            return VotePlayer.update({_id: playerId}, {$inc: {poll: 1}}).exec();
        }).then(()=> {
            res.sendStatus(200);
        }).catch(next);
    },

    //活动分享
    share: (req, res)=> {
        let eventId = req.params.eventId;
        //活动分享量加1
        Event.update({_id: eventId}, {$inc: {share: 1}}).exec();
        //如果是任务分享,则给对应学生增加积分
        let task = req.body.task;
        let student = req.body.student;
        if (task && student) {
            Task.findById(task).then((task)=> {
                if (!task) {
                    return Promise.reject(new Error('任务不存在'));
                }
                let scoreAward = task.scoreAward;
                return Student.findByIdAndUpdate(student, {$inc: {score: scoreAward}})
                    .select('_id schoolId')
                    .exec().then((st)=> {
                        if (!st) {
                            return Promise.reject(new Error('学生不存在'));
                        }
                        let taskRecord = new TaskRecord({
                            task: task,
                            student: st,
                            schoolId: st.schoolId
                        });
                        return taskRecord.save();
                    })
            }).catch((err)=> {
                console.error(err);
            });
        }
        res.sendStatus(200);
    }
};


// 渲染活动页面
function renderEvent(req, res) {
    let event = req.event;
    res.locals.record = event;
    res.locals.moment = moment;
    res.render(req.pagePath || event.template);
}

// 渲染包含报名的活动页面
function renderEnrolledEvent(req, res) {
    let event = req.event;
    let enroll = event.enroll;
    EnrollNames.find({enroll: enroll}).then((names)=> {
        res.locals.list = names;
        renderEvent(req, res);
    });
}

// 渲染投票页面
function renderVoteEvent(req, res) {
    let event = req.event;
    let limit = req.query.limit || 20;
    let page = req.query.page || 1;
    let search = req.query.search;
    let query = VotePlayer.find({vote: event, isAudit: true});
    let skip = (page - 1) * 20;
    query.limit(limit).skip(skip);
    if (search && !_.isEmpty(search)) {
        let exp = new RegExp(search);
        query.or([{name: exp}, {sequence: exp}])
    }
    return query.exec().then((players)=> {
            res.locals.players = players;
            return query.count().exec();
        })
        .then((count)=> {
            res.locals.vote = event;
            res.locals.totalPlayer = count;
            req.pagePath = 'vote/index';
            return renderEvent(req, res);
        });
}

