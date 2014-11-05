(function() {

	var ns = Q.use("rolling");

	var game = window.game = ns.game = {
		frames: 0,
		events: Q.supportTouch ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"]
	};

	game.bootstrap = function() {
		var container = Q.getDOM("container");
		var div = document.createElement("div");
		div.style.position = "absolute";
		div.style.width = container.clientWidth + "px";
		div.style.left = "0px";
		div.style.top = (container.clientHeight >> 1) + "px";
		div.style.textAlign = "center";
		div.style.color = "#333";
		div.style.font = Q.isMobile ?  'bold 16px 黑体' : 'bold 16px 黑体';
		div.style.textShadow = Q.isAndroid ? "0 2px 2px #111" : "0 2px 2px #ccc";
		container.appendChild(div);
		this.loader = div;

		//加载图片素材
		var loader = new Q.ImageLoader();
		loader.addEventListener("loaded", Q.delegate(this.onLoadLoaded, this));
		loader.addEventListener("complete", Q.delegate(this.onLoadComplete, this));
		loader.load(ns.R.assets);
	};


	//加载进度条
	game.onLoadLoaded = function(e) {
		this.loader.innerHTML = "正在加载资源中，请稍候...<br>";
		this.loader.innerHTML += "(" + Math.round(e.target.getLoaded() / e.target.getTotal() * 100) + "%)";
	};

		//加载完成
	game.onLoadComplete = function(e) {
		e.target.removeAllEventListeners();
		Q.getDOM("container").removeChild(this.loader);
		this.loader = null;
		
		ns.R.init(e.images);

		this.startup();
	};

	game.startup = function() {
		if(Q.isWebKit && Q.supportTouch)
		{
			document.body.style.webkitTouchCallout = "none";
			document.body.style.webkitUserSelect = "none";
			document.body.style.webkitTextSizeAdjust = "none";
			document.body.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
		}
		
		this.container = Q.getDOM("container");
		this.width = this.container.clientWidth;
		this.height = this.container.clientHeight;

	    //获取URL参数设置
		this.params = Q.getUrlParams();
		
		//初始化context
		var context = null;
		if(this.params.canvas) {
			var canvas = Q.createDOM("canvas", {id:"canvas", width:this.width, height:this.height, style:{position:"absolute"}});
			this.container.appendChild(canvas);
			this.context = new Q.CanvasContext({canvas:canvas});
		} else {
			this.context = new Q.DOMContext({canvas: this.container});
		}
		
		//创建舞台
		this.stage = new Q.Stage({width:this.width, height:this.height, context:this.context, update:Q.delegate(this.update, this)});

		//注册事件
		var em = new Q.EventManager();
		this.EVENTS = {
			TAP: game.events[2]
		};

		em.registerStage(this.stage, this.events);
		
		//显示开始菜单
		this.displayPage1();
	};

	game.update = function(timeInfo) {
		this.frames++;
	};

	game.displayPage1 = function() {	
		if(this.startPage == null) {
			var startPage = new Q.Bitmap({id:"startPage", image: ns.R.getImage("page1")});
	        var sX = this.stage.width/startPage.width;
			var sY = this.stage.height/startPage.height;
	        startPage.scaleX = sX;
	        startPage.scaleY = sY;
	        startPage.x = 0;
	        startPage.y = 0;
			this.startPage = startPage;

			var playBtn = new Q.Button({id:"playBtn", image: ns.R.getImage("button")});
			playBtn.setUpState({rect:[0,0,450,67]});
			playBtn.setOverState({rect:[0,0,450,67]});
			playBtn.width= 450;
			playBtn.height = 67;
			playBtn.scaleX = sX;
			playBtn.scaleY = sY;
			playBtn.x = this.width * 0.15;
			playBtn.y = this.height - (this.height*0.47);
			playBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage2();
			});

			this.playBtn = playBtn;
		}
		
		this.stage.addChild(
					this.startPage
					, this.playBtn);
		this.stage.step();
	};

	game.displayPage2 = function() {	
		game.stage.removeAllChildren();
		if(this.startRollingPage == null) {
			var startRollingPage = new Q.Bitmap({id:"startRollingPage", image: ns.R.getImage("page2")});
	        var sX = this.stage.width/startRollingPage.width;
			var sY = this.stage.height/startRollingPage.height;
	        startRollingPage.scaleX = sX;
	        startRollingPage.scaleY = sY;
	        startRollingPage.x = 0;
	        startRollingPage.y = 0;
			this.startRollingPage = startRollingPage;

			var startRollingBtn = new Q.Button({id:"startRollingBtn", image: ns.R.getImage("button")});
			startRollingBtn.setUpState({rect:[0,0,450,67]});
			startRollingBtn.setOverState({rect:[0,0,450,67]});
			startRollingBtn.width= 450;
			startRollingBtn.height = 67;
			startRollingBtn.scaleX = sX;
			startRollingBtn.scaleY = sY;
			startRollingBtn.x = this.width * 0.15;
			startRollingBtn.y = this.height - (this.height*0.47);
			startRollingBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage2b();
			});

			this.startRollingBtn = startRollingBtn;
		}
		
		this.stage.addChild(
					this.startRollingPage
					, this.startRollingBtn);
		this.stage.step();
	};

	game.displayPage2b = function() {	
		if(this.stopRollingPage == null) {
			var stopRollingPage = new Q.Bitmap({id:"stopRollingPage", image: ns.R.getImage("page2b")});
	        var sX = this.stage.width/stopRollingPage.width;
			var sY = this.stage.height/stopRollingPage.height;
	        stopRollingPage.scaleX = sX;
	        stopRollingPage.scaleY = sY;
	        stopRollingPage.x = 0;
	        stopRollingPage.y = 0;
			this.stopRollingPage = stopRollingPage;

			var stopRollingBtn = new Q.Button({id:"stopRollingBtn", image: ns.R.getImage("button")});
			stopRollingBtn.setUpState({rect:[0,0,450,67]});
			stopRollingBtn.setOverState({rect:[0,0,450,67]});
			stopRollingBtn.width= 450;
			stopRollingBtn.height = 67;
			stopRollingBtn.scaleX = sX;
			stopRollingBtn.scaleY = sY;
			stopRollingBtn.x = this.width * 0.15;
			stopRollingBtn.y = this.height - (this.height*0.47);
			stopRollingBtn.on(game.EVENTS.TAP, function(e) {
				console.log(1);
			});

			this.stopRollingBtn = stopRollingBtn;
		}
		
		this.stage.addChild(
					this.stopRollingPage
					, this.stopRollingBtn);
		this.stage.step();
	};


	$(function() {
		game.bootstrap();
	});

})();