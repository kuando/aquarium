/**
 * Created by Frank on 16/3/5.
 */
'use strict';
$(document).ready(function () {

    function getDateStr() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDay() + 1;
        return year + '-' + month + '-' + day;
    }

    $(".share-modal").on('click', "#closeShare", function () {
        $("#shareModal").fadeOut();
    });

    $(".follow-modal").on('click', "#closeFollow", function () {
        $("#followModal").fadeOut();
    });

    //投票
    $("#doVote").on('click', function () {
        var requireFollow = $('#requireFollow').val();
        var followFlag = $('#followFlag').val();
        var needFollow = requireFollow === 'true' && followFlag === 'false';
        if (needFollow) {
            $("#followModal").fadeIn();
            return;
        }
        var voteId = $("#voteId").val();
        var state = $("#state").val();
        var playerId = $("#playerId").val();
        if (state === 1) {
            return alert('投票已经结束');
        }
        //每天只能投一次票
        var voteCountKey = voteId + getDateStr();
        var voteCount = window.localStorage.getItem(voteCountKey);
        if (voteCount !== null) {
            voteCount = parseInt(voteCount);
        }
        if (voteCount !== null && voteCount >= 3) {
            return alert('每天只能投三票哦,明天再来吧!');
        }
        var hasVoteKey = playerId + getDateStr();
        var hasVote = window.localStorage.getItem(hasVoteKey);
        if (hasVote !== null) {
            return alert('今天已经投过这个选手啦');
        }
        $.ajax({
            url: '/votes/' + voteId + '/players/' + playerId,
            method: 'PUT'
        }).then(function () {
            alert('投票成功！');
            window.localStorage.setItem(hasVoteKey, true);
            voteCount = voteCount === null ? 1 : (voteCount + 1);
            window.localStorage.setItem(voteCountKey, voteCount);
            window.location.href = '/votes/' + voteId;
        });
    });
});
