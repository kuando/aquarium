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


module.exports = {

    findEventById: (req, res) => {
        Event.findByIdAndUpdate(req.params.eventId, {$inc: {visit: 1}})
            .populate('schoolId', 'schoolName')
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
            })
            .catch((err)=> {
                console.error(err);
                res.sendStatus(400);
            });
    },

    addLikeCount: (req, res)=> {
        Event.findByIdAndUpdate(req.params.eventId, {$inc: {like: 1}}).select('like').exec()
            .then(() => {
                res.sendStatus(200);
            })
            .catch((err)=> {
                console.error(err);
                res.sendStatus(400);
            });
    },


    saveEnrolledName: (req, res)=> {
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
            .catch((err)=> {
                console.error(err);
                res.sendStatus(400);
            });
    },

    findVideoById: (req, res)=> {
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
        }).catch((err)=> {
            console.error(err);
            res.sendStatus(400);
        });
    },

    addVideoLikeCount: (req, res)=> {
        Classroom.update(
            {
                _id: req.params.eventId,
                courses: {
                    $elemMatch: {
                        _id: req.params.videoId
                    }
                }
            },
            {$inc: {'courses.$.like': 1}}).exec(function (err) {
            if (err) {
                console.error(err);
                return res.sendStatus(400);
            }
            res.sendStatus(200);
        });
    },


    voteRules: (req, res)=> {
        let voteId = req.params.voteId;
        let Vote = Event.discriminators['vote'];
        Vote.findById(voteId).select('prize participation explanation')
            .lean().exec()
            .then((vote)=> {
                if (!vote) {
                    return Promise.reject(new Error('投票不存在'));
                }
                res.locals.vote = vote;
                res.render('vote/vote-rules');
            });
    },

    voteEnroll: (req, res)=> {
        res.render('vote/vote-enroll');
    },

    voteRank: (req, res)=> {
        res.render('vote/vote-rank');
    },

    votePlayer: (req, res)=> {
        let Vote = Event.discriminators['vote'];
        let playerId = req.params.playerId;
        let voteId = req.params.voteId;
        Vote.findById(voteId).select('requireFollow followTip schoolId')
            .populate('schoolId','schoolName privateQrcode')
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
                res.locals.rank = rank;
                res.render('vote/vote-detail');
            }).catch((err)=> {
            console.log('error is ', err);
        });
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
    let skip = req.query.skip || 0;
    return VotePlayer.find({vote: event})
        .limit(limit).skip(skip).exec()
        .then((players)=> {
            res.locals.players = players;
            return VotePlayer.count({vote: event}).exec();
        })
        .then((count)=> {
            res.locals.vote = event;
            res.locals.totalPlayer = count;
            req.pagePath = 'vote/index';
            return renderEvent(req, res);
        });
}

