/**
 * Created by Frank on 16/3/4.
 */

'use strict';
const request = require('request-promise');
const Promise = require('bluebird').Promise;
const redis = require('../config/redis');
const wx = require('../config/config').wx;
const jsSHA = require('jssha');
const SDK_ACCESS_TOKEN = 'SDK_ACCESS_TOKEN';
const SDK_TICKET = 'SDK_TICKET';

module.exports = {
    getSignature: function (req, res, next) {
        let url = req.url.split('#')[0];
        getTicket().then((ticket)=> {
            req.sdk = sign(ticket, url);
            next();
        }).catch((err)=> {
            next(err);
        });
    }
};

function getAccessToken() {
    return redis.get(SDK_ACCESS_TOKEN).then((token)=> {
        if (token) {
            return token;
        }
        let appId = wx.componentAppid;
        let secret = wx.componentAppSecret;
        let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`;
        return request.get(url).then((res)=> {
            res = JSON.parse(res);
            if (res.errcode) {
                return Promise.reject(new Error(res.errmsg));
            }
            let accessToken = res.access_token;
            redis.set(SDK_ACCESS_TOKEN, accessToken, 'EX', 7000); //提前200秒过期
            return accessToken;
        })
    });
}

function getTicket() {
    return redis.get(SDK_TICKET).then((ticket)=> {
        if (ticket) {
            return ticket;
        }
        return getAccessToken().then((token)=> {
            let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`;
            return request.get(url).then((res)=> {
                res = JSON.parse(res);
                if (res.errcode !== 0) {
                    return Promise.reject(new Error(res.errmsg));
                }
                let ticket = res.ticket;
                redis.set(SDK_TICKET, ticket, 'EX', 7000);
            });
        })
    })
}


function createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
}

function createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + '';
}

function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort();
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
}

/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 * @returns
 */
function sign(jsapi_ticket, url) {
    var ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    };
    var shaObj = new jsSHA('SHA-1', 'TEXT');
    shaObj.update(raw(ret));
    ret.signature = shaObj.getHash('HEX');
    ret.appid = wx.componentAppid;
    delete ret.jsapi_ticket;
    delete ret.url;
    return ret;
}
