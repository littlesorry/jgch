var express = require('express');
var router = express.Router();
var config = require('config');
var request = require('request');

var service = request('../service/service');

var urlTpl = handlebars.compile(config.app.integration.wechatAccessTokenURL);

router.get('/', function(req, res) {
    request(urlTpl({
        "appId": config.app.integration.wechatAppId,
        "secret": config.app.integration.wechatAppScret,
        "code": req.params.code
    })).on("response", function(response) {
        var credential = JSON.parse(response.body);
        /**
            access_token    网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同
            expires_in  access_token接口调用凭证超时时间，单位（秒）
            refresh_token   用户刷新access_token
            openid  用户唯一标识，请注意，在未关注公众号时，用户访问公众号的网页，也会产生一个用户和公众号唯一的OpenID
            scope   用户授权的作用域，使用逗号（,）分隔
         */
        req.session.credential = credential;
        req.session.openId = credential.openid;

        service.addRefer(credential.openid, req.params.state);
        res.rediect('/?openId=' + credential.openid);
    });
});

module.exports = router;
