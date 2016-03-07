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



    $Controls.on(event, "#followSponsor", function () {
        $("#followModal").fadeIn()
    });




});