/**
 * Created by Frank on 16/3/5.
 */
'use strict';
require('hammer-timejs');
require('jquery-weui/dist/js/jquery-weui');
require('./vote-common');
$(document).ready(function () {
    function getDateStr() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return year + '-' + month + '-' + day;
    }

    var $Controls = $(".player-controls");
    $Controls.on('click', "#sharePlayer", function () {
        $("#shareModal").fadeIn()
    });
    $Controls.on('click', "#followSponsor", function () {
        $("#followModal").fadeIn()
    });
    $(".share-modal").on('click', "#closeShare", function () {
        $("#shareModal").fadeOut();
    });
    $(".follow-modal").on('click', "#closeFollow", function () {
        $("#followModal").fadeOut();
    });

    //投票
    $("#doVote").on('click', function () {
        var ua = navigator.userAgent.toLowerCase();
        var isNotWeixin = ua.indexOf('micromessenger') === -1;
        if (isNotWeixin) {
            return $.alert("请用微信客户端进行投票！");
        }
        var voteId = $("#voteId").val();
        var playerId = $("#playerId").val();
        var voteCountKey = voteId + getDateStr();
        var voteCount = window.localStorage.getItem(voteCountKey);
        var requireFollow = $('#requireFollow').val();
        if (voteCount === null && requireFollow === 'true') {
            $("#followModal").fadeIn();
            return;
        }
        voteCount = voteCount === null ? 0 : parseInt(voteCount);
        if (voteCount >= 3) {
            return $.alert('每天只能投三票哦,明天再来吧!');
        }
        var hasVoteKey = playerId + getDateStr();
        var hasVote = window.localStorage.getItem(hasVoteKey);
        if (hasVote !== null) {
            return $.alert('今天已经投过这个选手啦');
        }
        $.ajax({
            url: '/votes/' + voteId + '/players/' + playerId,
            method: 'POST',
            dataType: 'json',
            beforeSend: function () {
                $.showLoading("正在投票中...");
            },
            success: function () {
                window.localStorage.setItem(hasVoteKey, true);
                voteCount = voteCount === null ? 1 : (voteCount + 1);
                window.localStorage.setItem(voteCountKey, voteCount);
                $.alert('投票成功!', function () {
                    window.location.href = '/votes/' + voteId;
                });
            },
            error: function (xhr) {
                $.alert(xhr.responseText || '投票失败');
            },
            complete: function () {
                $.hideLoading();
            },
        });
    });

    //投票分享
    var url = location.href;
    var eventId = $('#eventId').val();
    var playerName = $('#playerName').val();
    var sequence = $("#playerSequence").val();
    var desc = "我是" + sequence + "号选手" + playerName + ",快来帮我投票吧!";
    var title = $('#shareTitle').val();
    var coverImage = $("#coverImage").attr('src');
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
                desc: desc,
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
