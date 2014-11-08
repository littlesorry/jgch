var Promise = require("bluebird");

var data = require("../data/data");


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
        "createTime": new Date();
    });
};

service.addRefer = function(sourceOpenId, targetOpenId) {
    return data("refer").insert({
        "sourceOpenId": sourceOpenId,
        "targetOpenId" targetOpenId,
        "createTime": new Date()
    });
};

service.getReferCount = function(openId) {
    return data("refer").count({
        "targetOpenId": openId
    });
};