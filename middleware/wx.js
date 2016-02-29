/**
 * Created by Frank on 16/2/29.
 */
'use strict';
const request = require('request-promise');
const Promise = require('bluebird').Promise;
const redis = require('../config/redis');
const wx = require('../config/config').wx;


module.exports = {

    preAuthCode: function (req, res, next) {
        getPreAuthCode().then((code)=> {
            req.preAuthCode = code;
            return next();
        }).catch((err)=> {
            return next(err);
        })
    }
};


//组件token 获取地址
const COMPONENT_TOKEN_API = `https://api.weixin.qq.com/cgi-bin/component/api_component_token`;

// 生成预授权码获取地址
function getPreAuthCodeUrl(token) {
    return `https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${token}`;
}

//组件token缓存key
const COMPONENT_ACCESS_TOKEN = 'COMPONENT_ACCESS_TOKEN';
//验证ticket缓存key
const COMPONENT_VERIFY_TICKET = 'COMPONENT_VERIFY_TICKET';
//预授权码缓存key
const PRE_AUTH_CODE = 'PRE_AUTH_CODE';

/**
 * 获取域授权码
 * @returns {Promise|Promise.<T>|*}
 */
function getPreAuthCode() {
    return redis.get(PRE_AUTH_CODE).then((code)=> {
        if (code) {
            return code;
        }
        return getComponentAccessToken().then((token)=> {
            let url = getPreAuthCodeUrl(token);
            return request.post(url, {
                "component_appid": wx.componentAppid
            });
        }).then((ret)=> {
            let code = ret['pre_auth_code'];
            // 考虑网络延时因素,缓存提前2分钟过期
            let expiresIn = parseInt(ret['expires_in']) - 120;
            redis.set(PRE_AUTH_CODE, code, 'EX', expiresIn);
            return code;
        });
    })
}

/**
 * 获取组件访问token
 * @returns {Promise|Promise.<T>|*}
 */
function getComponentAccessToken() {
    return redis.get(COMPONENT_ACCESS_TOKEN).then((token)=> {
        //先从redis 获取,如果不存在则去微信服务器请求
        if (token) {
            return token;
        }
        return redis.get(COMPONENT_VERIFY_TICKET).then((ticket)=> {
            if (!ticket) {
                return Promise.reject(new Error('ComponentVerifyTicket not ready'));
            }
            let data = {
                "component_appid": wx.componentAppid,
                "component_appsecret": wx.componentAppSecret,
                "component_verify_ticket": ticket
            };
            return request.post(COMPONENT_TOKEN_API, data).then((ret)=> {
                let token = ret.component_access_token;
                // 考虑网络延时因素,缓存提前10分钟秒过期
                let expiresIn = ret['expires_in'] - 120;
                redis.set(COMPONENT_ACCESS_TOKEN, token, 'EX', expiresIn);
                return token
            });
        });
    });
}