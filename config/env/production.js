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
    }
};
