/**
 * Created by Frank on 16/3/7.
 */
'use strict';
require('imagesloaded');
require('hammer-timejs');
require('twbs-pagination');
require('./vote-common');

$(document).ready(function () {
    var $container = $('#masonry');
    $container.imagesLoaded(function () {
        $container.masonry({
            columnWidth: '.item',
            itemSelector: '.item'
        });
    });

    var totalPlayer = $("#totalPlayer").val();
    var key = $("#key").val();
    var totalPages = Math.ceil(totalPlayer / 20);
    $('.pagination').twbsPagination({
        first: '首页',
        prev: '<<',
        next: '>>',
        last: '末页',
        href: '?page={{number}}&key=' + key,
        totalPages: totalPages,
        visiblePages: 5,
        onPageClick: function (event, page) {
            $('#page-content').text('Page ' + page);
        }
    });
});