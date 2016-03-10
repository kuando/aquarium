/**
 * Created by Frank on 16/3/2.
 */
'use strict';
require('jquery-weui/dist/js/jquery-weui');
require('hammer-timejs');
require('./vote-common');

$(document).ready(function () {
    var $inputField = $('#imageFile');
    var $imageCount = $("#imageCount");
    var $charCount = $('#charCount');
    var $brief = $("#brief");
    var voteId = $("#voteId").val();
    var images = [];
    $('.weui_uploader_input_wrp').click(function (event) {
        var count = parseInt($imageCount.text());
        if (count >= 3) {
            $.alert('最多上传3张图片');
            event.preventDefault();
        }
    });

    if (window.File && window.FileReader && window.FormData) {
        $inputField.on('change', function (e) {
            var file = e.target.files[0];
            if (file) {
                if (/^image\//i.test(file.type)) {
                    readFile(file);
                } else {
                    $.alert('只能上传图片!');
                }
            }
        });
    } else {
        $.alert('图片无法上传,请安装最新版本微信');
    }

    //读取本地图片用于预览
    function readFile(file) {
        var reader = new FileReader();
        reader.onloadend = function () {
            sendFile(file, reader.result);
        };
        reader.onerror = function () {
            $.alert('读取图片出错啦');
        };
        reader.readAsDataURL(file);
    }

    function sendFile(file, dataUrl) {
        var $imgList = $("#imgUpload");
        var $progress = $('<div class="weui_uploader_status_content">0%</div>');
        var $img = $('<li class="weui_uploader_file weui_uploader_status" style="background-image:url(' + dataUrl + ')"></li>');
        $img.append($progress);
        $imgList.before($img);
        var token = $("#token").val();
        var formData = new FormData();
        formData.append('file', file);
        formData.append('token', token);
        $.ajax({
            url: 'http://upload.qiniu.com/',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        $progress.html(Math.round(percentComplete * 100) + "%");
                    }
                }, false);
                return xhr;
            }
        }).then(function (res) {
            var count = parseInt($imageCount.text()) + 1;
            $imageCount.text(count);
            $img.removeClass('weui_uploader_status');
            $img.html('');
            images.push(res.key);
        });
    }

    function countChar() {
        var content = $brief.val().trim();
        var count = content.length;
        $charCount.html(count);
        if (count > 200) {
            $.alert('最多两百字');
            $brief.val(content.substr(0, 200));
        }
    }

    $brief.on('keydown', countChar);
    $brief.on('keyup', countChar);
    $("#submitEnroll").click(function () {
        var name = $('#name').val();
        var phone = $("#phone").val();
        var brief = $brief.val();
        if (name.trim() === '') {
            return $.alert('姓名不能为空');
        }
        if (phone.trim() === '') {
            return $.alert('手机不能为空');
        }
        if (images.length === 0) {
            return $.alert('至少上传一张图片');
        }
        if (brief.trim() === '') {
            return $.alert('描述不能为空');
        }
        $.ajax({
            url: '/votes/' + voteId + '/enrolls',
            method: 'POST',
            data: {
                name: name,
                phone: phone,
                images: images,
                brief: brief
            },
            dataType: 'json',
            beforeSend: function () {
                $.showLoading("正在报名中...");
            },
            success: function () {
                $.alert('报名成功！请等待审核通过', function () {
                    self.location.href = '/votes/' + voteId;
                });
            },
            error: function (xhr) {
                $.alert(xhr.responseText || '报名失败!');
            },
            complete: function () {
                $.hideLoading();
            }
        });
    });
});