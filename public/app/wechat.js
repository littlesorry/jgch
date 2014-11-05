(function() {
	var ns = Q.use("rolling");

	var wechat = ns.wechat = {};

    var imgUrl = "http://game.womsalon.com/monkey/images/shareimg_l_update.png";
    var shareLink = "http://jgch.autobund.com.cn:9000/wechat/";

	var title = "好途邦";
	var descContent = "我赢取了好途邦的洗车代金券！离免费代金券只差一步，快来赢取！【好途邦】";

    var timelineData = {
        "appId": "wx770d10bc9719912f",
        "imgUrl" : imgUrl,
        "link" : shareLink,
        "desc" : descContent,
        "title" : title
    };

    WeixinApi.ready(function(Api) {
        var weiboData = {
            "content": descContent,
            "url": lineLink
        };

        var callbacks = {
            ready : function() {
            },
            cancel : function(resp) {
            },
            fail : function(resp) {
            },
            confirm : function(resp) {
            	if (ns.game.state === 'do_share') {
            		ns.game.state = 'complete';
            		ns.game.hidePage5();
            	}
            },
            all : function(resp,shareTo) {
            }
        };

        Api.generalShare(timelineData,callbacks);
        Api.shareToFriend(timelineData, callbacks);
        Api.shareToTimeline(timelineData, callbacks);
        Api.shareToWeibo(timelineData, callbacks);
    });
})();