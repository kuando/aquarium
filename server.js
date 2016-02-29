/**
 * Created by Frank on 16/2/23.
 */
'use strict';


if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

require('./config/mongo');
require('./config/redis');
const app = require('./config/express');
const config = require('./config/config');

app.listen(config.port, function () {
    console.log('application started on port ' + config.port);
    console.log('application started on env ' + process.env.NODE_ENV);
});