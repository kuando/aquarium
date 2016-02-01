/**
 * Created by Administrator on 2016/1/23.
 */
'use strict';

module.exports = {

    app: {
        title: '360家校云测试环境',
        description: '云端作业平台',
        keywords: '教育, 在线作业'
    },

    db: {
        uri: 'mongodb://localhost:27017/hizuoye',
        options: {}
    },

    redis: {
        host: '127.0.0.1',
        port: 6379,
        options: {}
    },

    qn: {
        accessKey: 'SPJ9b_qmVxy0FQU-93J4xb5EbHv9Z4Jn_-78f8gr',
        secretKey: 'NOFnKRTsd1RjjYoyT1qPAgHyczBmAjl-s26GXpA4',
        bucket: 'yirgacheffe',
        visitUrl: 'http://7rfll3.com1.z0.glb.clouddn.com'
    },
    apiBase: 'http://testapi.hizuoye.com'
};