'use strict';

module.exports = {
    port: 4000,
    app: {
        title: '360家校云开发环境',
        description: '360家校云',
        keywords: ''
    },
    db: {
        uri: 'mongodb://182.92.217.85/hizuoye',
        options: {}
    },
    redis: {
        host: 'localhost',
        port: 6379,
        prefix: 'wx-develop',
        options: {}
    },
    wx: {
        componentAppid: 'wxb3c90f78f7013645',
        componentAppSecret: '0c79e1fa963cd80cc0be99b20a18faeb',
        encodingAESKey: 'gV9Zf9mndKz6sKEWaphp5893V58TmMFPGCAM4gceNF9',
        verifyToken: 'lovekuando'
    },

    qiniu: {
        accessKey: 'SPJ9b_qmVxy0FQU-93J4xb5EbHv9Z4Jn_-78f8gr',
        secretKey: 'NOFnKRTsd1RjjYoyT1qPAgHyczBmAjl-s26GXpA4',
        bucket: 'yirgacheffe',
        visitUrl: 'http://7rfll3.com1.z0.glb.clouddn.com'
    }
};
