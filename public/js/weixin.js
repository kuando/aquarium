/**
 * Created by Frank on 16/3/5.
 */
'use strict';
var url = location.href;
var eventId = $('#eventId').val();
$.get("/wx/sdk?url=" + url.split('#')[0], function (data) {
    url = new YouAreI(url);
    var query = url.query_get();
    var task = query.task;
    var student = query.student;
    var taskData = {};
    if (task && student) {
        taskData.student = student;
        taskData.task = task;
    }
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appid, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(function () {
        wx.onMenuShareTimeline({
            link: url.query_set({followFlag: 0}).to_string(),
            success: function () {
                if (eventId && eventId !== '') {
                    $.ajax({
                        url: '/events/' + eventId + '/share',
                        method: 'PUT',
                        data: taskData
                    }).then(function () {

                    });
                }
            },
            cancel: function () {

            }
        });
    });
});