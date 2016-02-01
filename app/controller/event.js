/**
 * Created by Administrator on 2016/1/15.
 */
'use strict'

let mongoose = require('mongoose');
let School = mongoose.model('School');
let Event = mongoose.model('Event');
let Classroom = Event.discriminators['classroom'];
let EnrollNames = mongoose.model('EnrollNames');

module.exports = {


    findEventById: function (eventId) {
        return Event.findById(eventId).populate('schoolId', 'schoolName').exec();
    },


    findAllErolledNameList:(enrollId)=>{
        return EnrollNames.find({'enroll':enrollId}).exec();
    },


    addVisitCount:(eventId, updated)=>{
        let update = { $set: { visit: updated}};
        Event.update({_id:eventId},update,{},(error) => {});
    },


    addPrasiseCount:(eventId, updated)=> {
        let update = {$set: {like: updated}};
        Event.update({_id: eventId}, update, {},(error) => {});
    },


    saveEnrolledName:(entity)=>{
        let enrolledNameEntity = new EnrollNames(entity);
        return enrolledNameEntity.save();

    },


    findEnrollNamesByPhone:(enroll, phone)=>{
        return EnrollNames.findOne({'enroll': enroll, 'phone': phone}, '').exec();
    },


    findVideoByEventVideoId:(eventId, videoId) =>{
        return Classroom.find(
            {"_id": eventId},
            {"courses": {
                $elemMatch: {
                    "_id": videoId
                }
            }}).exec();

    },

    increaseVideoVisitCount:(eventId, videoId, updateVisit)=>{
        Classroom.update({
            _id: eventId,
            'courses': {
                $elemMatch: {
                    _id: videoId
                }
            }
        }, {
            $set: {
                'courses.$.visit': updateVisit
            }
        }).exec();

    },

    increaseVideoLikeCount:(eventId, videoId, updateLike)=>{
        Classroom.update({
            _id: eventId,
            'courses': {
                $elemMatch: {
                    _id: videoId
                }
            }
        }, {
            $set: {
                'courses.$.like': updateLike
            }
        }).exec();

    }
};