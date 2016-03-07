$(document).ready(function () {
    var $container = $('#masonry');
    var $carousel = $('#carousel-example-generic');
    $carousel.hammer().on('swipeleft', function(){
        $(this).carousel('next');
    });

    $carousel.hammer().on('swiperight', function(){
        $(this).carousel('prev');
    });

    $container.imagesLoaded(function () {
        $container.masonry({
            columnWidth: '.item',
            itemSelector: '.item'
        });
    });
    var totalPlayer = $("#totalPlayer").val();
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
});