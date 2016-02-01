/**
 * Created by Administrator on 2016/1/18.
 */
$(document).ready(function () {

    $('#register').bind('click', function () {
        $("#mask-bg").show();
        $("#mask-sh").show();
        $('html,body').animate({scrollTop: '0px'}, 100);
        $('html').toggleClass('alpha');
    });

    $('#okay').bind('click', function () {
        var name = $('.r-name').val();
        var phone = $('.r-phone').val();
        var enroll = $('.r-enroll').val();
        var schoolId = $('.r-schoolId').val();
        if (name === '') {
            alert('请输入姓名！');
            return;
        }
        if (phone === '') {
            alert('请输入联系方式！');
            return;
        }
        if(checkMobile(phone)) return;
        var $fields = $('.r-field')
            , len = $fields.size()
            , fields = new Array(len);
        $fields.each(function (index) {
            if ($(this).val() === '') {
                fields[index] = '';
            } else {
                fields[index] = $(this).val();
            }

        });
        var createdTime = new Date();
        $.post("/enrollment", {
            name: name,
            phone: phone,
            fields: fields,
            enroll: enroll,
            schoolId: schoolId,
            createdTime:createdTime
        }, function (data) {
            alert('您已成功报名！');
            removeMask();
            if(data.result){
                appendRegisteredInfo(data.result);
            }
        }).error(function (data) {
            if (data.status == 401) {
                alert('您已经报过名了！');
                removeMask();
            }
            return;
        });

    });

    //点赞
    $('.like').bind('click', function () {
        var _id = $('.r-id').val();
        var like = $('#like').text();
        $.post("/praise", {
            _id: _id,
            like: parseInt(like)
        }, function () {
            $('#like').text(parseInt(like) + 1);
        }).error(function () {
            alert('网络故障，请稍后重试！');
            return;
        });
    });

    $('#quit').bind('click', function () {
        removeMask();
    });

    function checkMobile(str) {
        var re = /^1\d{10}$/
        if (!re.test(str)) {
            alert('请输入正确的手机号');
            return true;
        }
    }

    //清除遮罩
    function removeMask() {
        $("#mask-bg").hide();
        $("#mask-sh").hide();
        $('html').removeClass('alpha');
    }

    //添加报名过后的信息
    function appendRegisteredInfo(item){
        var registered =
            '<div class="item">' +
            '<img src="/images/thumb.png" alt="" width="23px" height="23px"/>' +
            '<div class="value">' +
            '<label>' + item.name + '</label>' +
            '</div>' +
            '<div class="date">'+ new Date(item.createdTime).Format('yyyy-MM-dd hh:mm') +'</div>' +
        '</div>';
        $('.register-board').append(registered);
    }
});