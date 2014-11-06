(function() {
	var ns = Q.use("rolling");

	var wechat = ns.wechat = {};

    var imgUrl = "https://open.weixin.qq.com/cgi-bin/openproxy?url=http%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz%2FzUOpE4ibVNqnZX3gGh6nibibJHyia4YkibGpwBibrShgTBe3AVe4INlQrtfAMledicscUUOS8TKh6Vl5022XvFCUN4ibPA%2F0";
    var shareLink = "http://jgch.autobund.com.cn:9000/wechat/";

	var descContent = "我赢取了好途邦的洗车代金券！离免费代金券只差一步，快来赢取！【好途邦】";

    var wxData = {
        "appId": "",
        "imgUrl" : imgUrl,
        "link" : shareLink,
        "desc" : descContent,
        "title" : "好途邦"
    };

    WeixinApi.ready(function(Api) {
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

        // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
        Api.shareToFriend(wxData, callbacks);
        // 点击分享到朋友圈，会执行下面这个代码
        Api.shareToTimeline(wxData, callbacks);
        // 点击分享到腾讯微博，会执行下面这个代码
        Api.shareToWeibo(wxData, callbacks);
        // iOS上，可以直接调用这个API进行分享，一句话搞定
        Api.generalShare(wxData,callbacks);
    });
})();