/**
 * Created by Admin on 2016/2/3.
 */
'use strict'

$(document).ready(function () {
    //var $container = $('#masonry');
    //$container.imagesLoaded( function () {
    //    $container.masonry({
    //        columnWidth: '.item',
    //        itemSelector: '.item'
    //    });
    //});
    //ËÑË÷
    $(".vote-menu").on("click","#openSearchModal", function(){
        $("#searchModal").fadeIn()
    });
    $("#searchModal").on("click","#closeSearch", function(){
        $("#searchModal").fadeOut()
    });

    //°ïTAÀ­Æ±
    $(".player-controls").on("click","#sharePlayer", function(){
        $("#shareModal").fadeIn()
    });
    $(".share-modal").on("click","#closeShare", function(){
        $("#shareModal").fadeOut()
    });
});