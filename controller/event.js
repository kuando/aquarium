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

module.exports = {

    findEventById: (req, res) => {
        let Model = Event;
        let template = req.query.template;
        if (template) {
            Model = Model.discriminators[template];
        }
        Model.findByIdAndUpdate(req.params.eventId, {$inc: {visit: 1}})
            .populate('schoolId', 'schoolName')
            .populate('enroll')
            .exec()
            .then((event)=> {
                if (!event) {
                    return Promise.reject(new Error('活动不存在'));
                }
                if (!event.enroll) {
                    return {record: event};
                }
                return EnrollNames.find({enroll: event.enroll}).then((names)=> {
                    return {
                        list: names,
                        record: event
                    };
                });
            })
            .then((ret)=> {
                ret.moment = moment;
                return res.render(ret.record.template, ret);
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
        console.log('find video');
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

    vote: (req, res)=> {
        res.render('vote/vote');
    },

    voteRules: (req, res)=> {
        res.render('vote/vote-rules');
    },

    voteEnroll: (req, res)=> {
        res.render('vote/vote-enroll');
    },

    voteRank: (req, res)=> {
        res.render('vote/vote-rank');
    },

    votePlayer: (req, res)=> {
        res.render('vote/vote-detail');
    }

};