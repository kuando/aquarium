/**
 * Created by Administrator on 2016/1/12.
 */
'use strict'

let moment = require('moment');
let event = require('../app/controller/event');

exports.event = function (req, res) {

    let _id = req.params.eventId;
    if(!_id){
        res.redirect('/error');
        return;
    }

    function callback(res, record) {
        res.render(record.template, {
            moment: moment,
            record: record.toJSON()
        });
    }

    event.findEventById(_id).then((record)=> {
        if(!record){
            res.redirect('/error');
            return;
        }
        //阅读 +1
        let visit = record.visit;
        if(visit == null) visit = 0;
        visit += 1;
        event.addVisitCount(_id, visit);
        if (record.enroll) {
            record.populate('enroll', ()=> {
                event.findAllErolledNameList(record.enroll._id)
                    .then((list)=> {
                        res.render(record.template, {
                            list: list,
                            moment: moment,
                            record: record.toJSON()
                        });
                        return null;
                    });
            })
        } else {
            callback(res, record);
        }
    })


};

//保存报名
exports.saveEnrolledName = (req, res)=> {
    let entity = req.body;
    if (req.body.phone) {
        let phone = req.body.phone;
        let enroll = req.body.enroll;
        event.findEnrollNamesByPhone(enroll, phone)
            .then((result)=> {
                if (result == null) {
                    let promise = event.saveEnrolledName(entity);
                    promise.then((item)=> {
                         res.status(200).json({result: item});
                         return null;
                    })
                } else {
                    res.status(401).json({'msg': 'Registered'});
                    return null;
                }
            }).catch((error)=> {
                console.log(error);
                errorHandler(error, res);
            })
    }
};

//点赞
exports.addLikeCount = (req, res)=> {
    let _id = req.body._id;
    let update = parseInt(req.body.like) + 1;
    event.addPrasiseCount(_id, update);
    res.sendStatus(200);
};

//点播视频课程
exports.turnToVideo = (req, res)=> {
    let eventId = req.params.eventId;
    let videoId = req.params.videoId;

    //find video
    if (eventId != null
        || videoId != null) {
        event.findVideoByEventVideoId(eventId, videoId)
            .then((result) => {
                let item = (result[0].courses)[0];
                //阅读 +1
                let updated = parseInt(item.visit) + 1;
                event.increaseVideoVisitCount(eventId, videoId, updated);
                if (result) {
                    return res.render('video', {
                        item: item,
                        eventId:eventId
                    });
                } else {
                    return res.sendStatus(401);
                }
            });
    }
};

//视频点播点赞
exports.addVideoLikeCount = (req, res)=>{
    event.increaseVideoLikeCount(
        req.body.eventId,
        req.body.videoId,
        parseInt(req.body.like) + 1
    );
    res.sendStatus(200);
};

exports.Vote = (req, res)=>{
    res.render('vote/vote');
};

exports.VoteRules = (req, res)=>{
    res.render('vote/vote-rules');
};

exports.VoteEnroll = (req, res)=>{
    res.render('vote/vote-enroll');
};

exports.VoteDetail = (req, res)=>{
    res.render('vote/vote-detail');
};


//错误页面处理
exports.errorPage = (req, res)=>{
    res.render('error');
};


function errorHandler(error, res){
    if (error.name === 'ValidationError') {
        res.sendStatus(400);
    } else {
        res.sendStatus(500);
    }
}




