var express = require('express');

var routes = require('./index');
var users = require('./users');
var wechat = require('./wechat');


var requestDispatcher = module.exports = function(app) {
    var route = express.Router();

    route.use(require('../middleware/wechatMiddleware'));
    route.use('/', routes);
    route.use('/users', users);
    route.use('/wechat', wechat);

    // catch 404 and forward to error handler
    route.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(route);
};
