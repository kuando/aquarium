/**
 * Created by Frank on 16/2/29.
 */
'use strict';

const wx = require('../controller/wx');
const wxMid = require('../middleware/wx');

module.exports = function (app) {

    // 接收微信授权事件
    app.post('/wx/auth/event', wx.authEvent);

    //授权发起页
    app.get('/wx/auth', wxMid.preAuthCode, wx.authPage);

};