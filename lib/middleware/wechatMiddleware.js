var config = require('config');
var handlebars = require('handlebars');

var appConfig = config.get("app");
var urlTpl = handlebars.compile(appConfig.integration.wechatOAuthURL);

handlebars.registerHelper('encode', function(string){
  return encodeURIComponent( string );  
});

module.exports = function(req, res, next) {
    if (appConfig.wechatRequired && !req.session.wecharCredential) {
        res.redirect(
            urlTpl({
                "appId": appConfig.integration.wechatAppId,
                "callbackURL": appConfig.integration.wechatCallbackURL,
                "state": req.session.id
            })
        );
        return;
    }
    next();
};
