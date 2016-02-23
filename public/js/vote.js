/**
 * Created by Admin on 2016/2/3.
 */
'use strict'

$(document).ready(function () {
    var $Controls = $(".player-controls");
    //搜索
    $(".vote-menu").on("click","#openSearchModal", function(){
        $("#searchModal").fadeIn()
    });
    $("#searchModal").on("click","#closeSearch", function(){
        $("#searchModal").fadeOut()
    });

    //帮TA拉票
    $Controls.on("click","#sharePlayer", function(){
        $("#shareModal").fadeIn()
    });
    $(".share-modal").on("click","#closeShare", function(){
        $("#shareModal").fadeOut()
    });

    //关注主办方
    $Controls.on("click","#followSponsor", function(){
        $("#followModal").fadeIn()
    });
    $(".follow-modal").on("click","#closeFollow", function(){
        $("#followModal").fadeOut()
    });
});