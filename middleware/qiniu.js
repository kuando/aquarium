/**
 * Created by Frank on 15/12/20.
 */
'use strict';
const qn = require('qiniu');
const _ = require('lodash');
const config = require('../config/config').qiniu;
const DEFAULT_LIMIT = 1024 * 1024 * 5;
qn.conf.ACCESS_KEY = config.accessKey;
qn.conf.SECRET_KEY = config.secretKey;

/**
 * 生成token
 * @param policy
 * @returns {boolean}
 */
function generateToken(policy) {
    if (typeof policy !== 'object') {
        return false;
    }
    policy = _.assign({
        scope: config.bucket
    }, policy);
    let putPolicy = new qn.rs.PutPolicy2(policy);
    return putPolicy.token();
}


module.exports = {
    token: function (opts) {
        opts = opts || {};
        let limit = opts.limit || DEFAULT_LIMIT;
        let mimeLimit = opts.mimeLimit;
        return function (req, res, next) {
            let policy = {
                fsizeLimit: limit,  //5M
                saveKey: '$(etag)$(ext)'
            };
            if (mimeLimit) {
                policy.mimeLimit = mimeLimit;
            }
            req.token = generateToken(policy);
            next();
        }
    }
};
