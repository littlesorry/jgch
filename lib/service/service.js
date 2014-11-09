var Promise = require("bluebird");

var data = require("../data/data");
var DuplicateException = require('../data/exception/duplicateException');


var service = module.exports = {

};

service.getUserCount = function(openId) {
    return data("user").count({
        "openId": openId
    });
};

service.createUser = function(openId) {
    return data("user").insert({
        "openId": openId,
        "createTime": new Date()
    }).then(function() {
        return data("refer").insert({
            "sourceOpenId": openId,
            "targetOpenId": openId,
            "createTime": new Date()
        });
    });
};

service.addRefer = function(sourceOpenId, targetOpenId) {
    if (sourceOpenId === targetOpenId) {
        return Promise.reject(new Error("can not refer to itself"));
    }

    return data("refer").insert({
        "sourceOpenId": sourceOpenId,
        "targetOpenId": targetOpenId,
        "createTime": new Date()
    });
};

service.getReferCount = function(openId) {
    return data("refer").count({
        "targetOpenId": openId
    });
};

service.doExchange = function(openId, memberId) {
    return data("exchange").insert({
        "openId": openId,
        "memberId": memberId
    }).then(function() {
        return "ok";
    }).catch(DuplicateException, function(err) {
        return "fail";
    });
};