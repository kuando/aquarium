/**
 * Created by Frank on 16/2/23.
 */
'use strict';

module.exports = function (app) {

    require('./event')(app);

    require('./wx')(app);

};