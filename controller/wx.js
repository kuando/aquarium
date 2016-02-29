/**
 * Created by Frank on 16/2/29.
 */
'use strict';
const MsgCrypt = require('../utils/MsgCrypt');
const libxmljs = require('libxmljs');
const redis = require('../config/redis');
const wx = require('../config/config').wx;

module.exports = {

    // 授权页面
    authPage: function (req, res) {
        let preAuthCode = req.preAuthCode;
        res.json({
            preAuthCode: preAuthCode
        });
    },

    // 接受授权事件
    authEvent: function (req, res) {
        let msgSignature = req.query.msg_signature;
        let nonce = req.query.nonce;
        let timestamp = req.query.timestamp;
        let encrypt = req.body.xml.encrypt[0];
        let crypt = new MsgCrypt(wx.verifyToken, wx.encodingAESKey, wx.componentAppid);
        let xmlText = crypt.decryptMsg(msgSignature, timestamp, nonce, encrypt);
        console.log('xmlText is ', xmlText);
        let xmlDoc = libxmljs.parseXml(xmlText);
        let ticket = xmlDoc.get('//ComponentVerifyTicket');
        console.log('ticket is ', ticket);
        redis.set('COMPONENT_VERIFY_TICKET', ticket.text());
        res.send("success");
    }
};