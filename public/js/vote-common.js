/**
 * Created by Admin on 2016/2/3.
 */
'use strict';

$(document).ready(function () {

    $('#loading').fadeOut();
    var event = 'click';



    $(".vote-menu").on(event, "#openSearchModal", function () {
        $("#searchModal").fadeIn()
    });

    $("#searchModal").on(event, "#closeSearch", function () {
        $("#searchModal").fadeOut()
    });

    $('.search-btn').click(function () {
        var searchText = $(this).closest('.input-group').find('input').val();
        var voteId = $("#voteId").val();
        if (searchText.trim() === '') {
            alert('请输入选手名字或者编号');
        } else {
            self.location.href = "/votes/" + voteId + '/search?key=' + searchText;
        }
    });

});