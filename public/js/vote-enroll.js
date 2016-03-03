/**
 * Created by Frank on 16/3/2.
 */
'use strict';

$(document).ready(function () {
    var $inputField = $('#imageFile');
    var $imageCount = $("#imageCount");
    var $charCount = $('#charCount');
    var $brief = $("#brief");
    var voteId = $("#voteId").val();
    var images = [];

    $('.weui_uploader_input_wrp').click(function (event) {
        var count = parseInt($imageCount.text());
        if (count >= 5) {
            alert('最多上传5张图片');
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
                    alert('只能上传图片!');
                }
            }
        });
    } else {
        alert("File upload is not supported!");
    }

    function readFile(file) {
        var reader = new FileReader();
        reader.onloadend = function () {
            processFile(reader.result, file.type);
        };
        reader.onerror = function () {
            alert('读取图片出错啦');
        };
        reader.readAsDataURL(file);
    }

    function processFile(dataURL, fileType) {
        var maxWidth = 800;
        var maxHeight = 800;
        var image = new Image();
        image.src = dataURL;
        image.onload = function () {
            var width = image.width;
            var height = image.height;
            var shouldResize = (width > maxWidth) || (height > maxHeight);
            if (!shouldResize) {
                sendFile(dataURL);
                return;
            }
            var newWidth;
            var newHeight;
            if (width > height) {
                newHeight = height * (maxWidth / width);
                newWidth = maxWidth;
            } else {
                newWidth = width * (maxHeight / height);
                newHeight = maxHeight;
            }
            var canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            var context = canvas.getContext('2d');
            context.drawImage(this, 0, 0, newWidth, newHeight);
            dataURL = canvas.toDataURL(fileType);
            sendFile(dataURL);
        };

        image.onerror = function () {
            alert('There was an error processing your file!');
        };
    }

    function sendFile(fileData) {
        var $imgList = $(".weui_uploader_files");
        var $progress = $('<div class="weui_uploader_status_content">0%</div>');
        var $img = $('<li class="weui_uploader_file weui_uploader_status" style="background-image:url(' + fileData + ')"></li>');
        $img.append($progress);
        $imgList.prepend($img);
        var token = $("#token").val();
        var formData = new FormData();
        formData.append('file', fileData);
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
            alert('最多两百字');
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
            alert('姓名不能为空');
            return;
        }
        if (phone.trim() === '') {
            alert('手机不能为空');
            return;
        }
        if (images.length === 0) {
            alert('至少上传一张图片');
            return;
        }
        if (brief.trim() === '') {
            alert('描述不能为空');
            return;
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
            error: function (err) {
                if (err.status === 400) {
                    alert(err.responseJSON.err);
                }
            }
        }).then(function (res) {
            alert('报名成功');
        });

    });
});