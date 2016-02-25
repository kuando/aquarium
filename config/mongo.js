'use strict';
/**
 * Module dependencies.
 */
var db = require('./config').db;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Create the database connection
mongoose.connect(db.uri, db.options);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + db.uri);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
    console.log('process exit ...');
    process.exit(0);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.error('Mongoose default connection disconnected');
    console.warn('process exit ...');
    process.exit(0);
});

// When the connection is open
mongoose.connection.on('open', function () {
    console.log('Mongoose default connection is open');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
