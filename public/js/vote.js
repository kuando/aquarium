/**
 * Created by Admin on 2016/2/3.
 */
'use strict';

$(document).ready(function () {
    var event = 'click';

    var $Controls = $(".player-controls");

    $(".vote-menu").on(event, "#openSearchModal", function () {
        $("#searchModal").fadeIn()
    });

    $("#searchModal").on(event, "#closeSearch", function () {
        $("#searchModal").fadeOut()
    });

    $Controls.on(event, "#sharePlayer", function () {
        $("#shareModal").fadeIn()
    });

    $(".share-modal").on(event, "#closeShare", function () {
        $("#shareModal").fadeOut()
    });

    $Controls.on(event, "#followSponsor", function () {
        $("#followModal").fadeIn()
    });

    $(".follow-modal").on(event, "#closeFollow", function () {
        $("#followModal").fadeOut()
    });

    function getDateStr() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDay() + 1;
        return year + '-' + month + '-' + day;
    }

    //投票
    $("#doVote").on(event, function () {
        var requireFollow = $('#requireFollow').val();
        if (requireFollow) {
            alert('请先关注');
            return;
        }
        var voteId = $("#voteId").val();
        var state = $("#state").val();
        var playerId = $("#playerId").val();
        if (state === 1) {
            return alert('投票已经结束');
        }
        //每天只能投一次票
        var key = voteId + getDateStr();
        var hasVote = window.localStorage.getItem(key);
        if (hasVote !== null) {
            return alert('今年已经投过票了,明天再来吧');
        }
        $.ajax({
            url: '/votes/' + voteId + '/players/' + playerId,
            method: 'PUT'
        }).then(function () {
            alert('投票成功');
            window.localStorage.setItem(key, true);
        });
    });
});