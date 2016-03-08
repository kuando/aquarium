$(document).ready(function () {
    var $container = $('#masonry');
    var $carousel = $('#carousel-example-generic');
    $carousel.hammer().on('swipeleft', function () {
        $(this).carousel('next');
    });

    $carousel.hammer().on('swiperight', function () {
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

    //投票分享
    var url = location.href;
    var eventId = $('#eventId').val();
    var title = $('#shareTitle').val();
    var shareUrl = new YouAreI(url).query_set({followFlag: 0}).to_string();
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
                link: shareUrl,
                imgUrl: coverImage,
                success: function () {
                    if (eventId && eventId !== '') {
                        $.ajax({
                            url: '/events/' + eventId + '/share',
                            method: 'PUT'
                        }).then(function () {

                        });
                    }
                }
            });
            wx.onMenuShareAppMessage({
                title: title,
                desc: '快来参加' + title,
                imgUrl: coverImage,
                link: shareUrl,
                success: function () {
                    if (eventId && eventId !== '') {
                        $.ajax({
                            url: '/events/' + eventId + '/share',
                            method: 'PUT'
                        }).then(function () {

                        });
                    }
                }
            })
        });
    });
});