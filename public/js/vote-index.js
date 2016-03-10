'use strict';

require('bootstrap/dist/js/bootstrap');
require('imagesloaded');
require('hammer-timejs');
require('twbs-pagination');
require('./vote-common');

function getDateStr() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDay() + 1;
    return year + '-' + month + '-' + day;
}

$(document).ready(function () {
    var $container = $('#masonry');

    $container.imagesLoaded(function () {
        $container.masonry({
            columnWidth: '.item',
            itemSelector: '.item'
        });
    });
    var followFlag = $("#followFlag").val();
    var totalPlayer = $("#totalPlayer").val();
    var eventId = $('#eventId').val();
    var totalPages = Math.ceil(totalPlayer / 20);
    $('#pagination').twbsPagination({
        first: '首页',
        prev: '<<',
        next: '>>',
        last: '末页',
        href: '?page={{number}}',
        totalPages: totalPages,
        visiblePages: 5,
        onPageClick: function (event, page) {
            $('#page-content').text('Page ' + page);
        }
    });

    //如果followFlag为1,说明是从公共号进入,设置count为0,保证一天内都可以正常投票
    var voteCountKey = eventId + getDateStr();
    var voteCount = window.localStorage.getItem(voteCountKey);
    if (followFlag === '1' && voteCount === null) {
        window.localStorage.setItem(voteCountKey, 0);
    }

    //投票分享
    var url = location.href;
    var title = $('#shareTitle').val();
    var coverImage = $("#coverImage").val();
    $.post("/wx/sdk", {url: url.split('#')[0]}, function (data) {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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
                imgUrl: coverImage,
                success: function () {
                    if (eventId && eventId !== '') {
                        $.ajax({
                            url: '/events/' + eventId + '/share',
                            method: 'POST'
                        }).then(function () {

                        });
                    }
                }
            });
            wx.onMenuShareAppMessage({
                title: title,
                desc: '快来参加' + title,
                imgUrl: coverImage,
                link: url,
                success: function () {
                    if (eventId && eventId !== '') {
                        $.ajax({
                            url: '/events/' + eventId + '/share',
                            method: 'POST'
                        }).then(function () {

                        });
                    }
                }
            })
        });
    });
});