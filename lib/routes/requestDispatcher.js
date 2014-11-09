var express = require('express');

var users = require('./users');
var wechat = require('./wechat');
var enter = require('./enter');
var exchange = require('./exchange');
var refer = require('./refer');


var requestDispatcher = module.exports = function(app) {
    var route = express.Router();

    // wechat entry does not need login check
    route.use('/wechat', wechat);
    
    route.use(require('../middleware/wechatMiddleware'));
    route.use('/users', users);
    route.use('/enter', enter);
    route.use('/exchange', exchange);
    route.use('/_refer', refer);

    // catch 404 and forward to error handler
    route.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(route);
};
