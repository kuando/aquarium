'use strict';

module.exports = {
    port: 4000,
    app: {
        title: '360家校云',
        description: '360家校云',
        keywords: ''
    },
    db: {
        uri: 'mongodb://10.165.69.183,10.162.219.31,10.251.192.170/hizuoye-pro',
        options: {
            db: {native_parser: true},
            replset: {
                rs_name: 'rs1',
                poolSize: 10,
                socketOptions: {
                    keepAlive: 1,
                    connectTimeoutMS: 30000
                }
            },
            server: {
                poolSize: 20,
                socketOptions: {
                    keepAlive: 1,
                    connectTimeoutMS: 30000
                }
            },
            user: 'hizuoyeAdmin',
            pass: 'dk12345!@#$%'
        }
    },

    redis: {
        host: 'a97582a7d76211e4.m.cnbja.kvstore.aliyuncs.com',
        port: 6379,
        prefix: 'wx-production',
        auth_pass: 'a97582a7d76211e4:Mooc1988'
    },

    weixin: {
        appid: 'wxe68418f13df6bb70',
        appSecret: '0556a946d4a4abc3fb2b6377596620f9'
    },

    qiniu: {
        accessKey: 'SPJ9b_qmVxy0FQU-93J4xb5EbHv9Z4Jn_-78f8gr',
        secretKey: 'NOFnKRTsd1RjjYoyT1qPAgHyczBmAjl-s26GXpA4',
        bucket: 'yirgacheffe',
        visitUrl: 'http://7rfll3.com1.z0.glb.clouddn.com'
    }
};
