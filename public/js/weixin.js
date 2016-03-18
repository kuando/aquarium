/**
 * Created by Frank on 16/3/5.
 */
'use strict';
var url = location.href;
var eventId = $('#eventId').val();
$.post("/wx/sdk", {url: url.split('#')[0]}, function (data) {
    wx.config({
        appId: data.appid, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function () {
        wx.onMenuShareTimeline({
            title: title,
            link: url,
            success: function () {
                if (eventId && eventId !== '') {
                    $.post('/events/' + eventId + '/share');
                }
            }
        });
    });
});