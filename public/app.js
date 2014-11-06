(function() {

	var ns = Q.use("rolling");

	var game = window.game = ns.game = {
		frames: 0,
		events: Q.supportTouch ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"],

		state: "not_completed"
	};

	function buildBackground(id, imageId) {
		var page = new Q.Bitmap({"id": id, "image": ns.R.getImage(imageId)});
        var sX = game.stage.width/page.width;
		var sY = game.stage.height/page.height;
        page.scaleX = sX;
        page.scaleY = sY;
        page.x = 0;
        page.y = 0;

        return page;
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

		var timer = new Q.Timer(1000 / 30);
		timer.addListener(this.stage);
		timer.addListener(Q.Tween);
		timer.start();
		this.timer = timer;


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
			this.startPage = buildBackground("startPage", "page1");

			var playBtn = new Q.Button({id:"playBtn", image: ns.R.getImage("button")});
			playBtn.setUpState({rect:[0,0,450,67]});
			playBtn.setOverState({rect:[0,0,450,67]});
			playBtn.width= 450;
			playBtn.height = 67;
			playBtn.scaleX = this.startPage.scaleX;
			playBtn.scaleY = this.startPage.scaleY;
			playBtn.x = this.width * 0.15;
			playBtn.y = this.height * 0.53;
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
		if(this.startRollingPage == null) {
			this.startRollingPage = buildBackground("startRollingPage", "page2");

			var startRollingBtn = new Q.Button({id:"startRollingBtn", image: ns.R.getImage("button")});
			startRollingBtn.setUpState({rect:[0,0,450,67]});
			startRollingBtn.setOverState({rect:[0,0,450,67]});
			startRollingBtn.width= 450;
			startRollingBtn.height = 67;
			startRollingBtn.scaleX = this.startRollingPage.scaleX;
			startRollingBtn.scaleY = this.startRollingPage.scaleY;
			startRollingBtn.x = this.width * 0.15;
			startRollingBtn.y = this.height * 0.53;
			startRollingBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage2b();
			});

			this.startRollingBtn = startRollingBtn;

			var leftStick = new Q.Bitmap({
									"id": "leftStick",
									"image": ns.R.getImage("leftStick")
								});
	        leftStick.scaleX = this.startRollingPage.scaleX;
	        leftStick.scaleY = this.startRollingPage.scaleY;
	        leftStick.x = this.width * 0.15;
	        leftStick.y = this.height * 0.70;

	        this.leftStick = leftStick;

			var rightStick = new Q.Bitmap({"id": "rightStick", "image": ns.R.getImage("rightStick")});
	        rightStick.scaleX = this.startRollingPage.scaleX;
	        rightStick.scaleY = this.startRollingPage.scaleY;
	        rightStick.x = this.width * 0.60;
	        rightStick.y = this.height * 0.70;

	        this.rightStick = rightStick;

			var leftWave = new Q.Bitmap({"id": "leftWave", "image": ns.R.getImage("wave")});
	        leftWave.scaleX = this.startRollingPage.scaleX;
	        leftWave.scaleY = this.startRollingPage.scaleY;
	        leftWave.x = this.width * 0.28;
	        leftWave.y = this.height * 0.68;

	        this.leftWave = leftWave;

			var rightWave = new Q.Bitmap({"id": "rightWave", "image": ns.R.getImage("wave")});
	        rightWave.scaleX = this.startRollingPage.scaleX;
	        rightWave.scaleY = this.startRollingPage.scaleY;
	        rightWave.x = this.width * 0.55;
	        rightWave.y = this.height * 0.675;
	        rightWave.alpha = 0

	        this.rightWave = rightWave;
		}
		
		this.stage.addChild(
					this.startRollingPage
					, this.startRollingBtn
					, this.leftWave
					, this.rightWave
					, this.leftStick
					, this.rightStick);
		this.stage.step();

    	Q.Tween.to(this.rightWave
					, {alpha: 1}
					, {
						time: 600
						, loop: true
						, reverse: true
    				}
    	);

		Q.Tween.to(this.leftWave
					, {alpha: 0}
					, {
						time: 600
						, loop: true
						, reverse: true
    				}
    	);

    	Q.Tween.to(this.leftStick
					, {y: this.leftStick.y - 20}
					, {
						time: 600
						, loop: true
						, reverse: true
    				}
    	);

    	Q.Tween.to(this.rightStick
					, {y: this.rightStick.y - 20}
					, {
						time: 600
						, delay: 600
						, loop: true
						, reverse: true
    				}
    	);
	};

	game.displayPage2b = function() {	
		if(this.stopRollingPage == null) {
			this.stopRollingPage = buildBackground("stopRollingPage", "page2b");

			var stopRollingBtn = new Q.Button({id:"stopRollingBtn", image: ns.R.getImage("button")});
			stopRollingBtn.setUpState({rect:[0,0,450,67]});
			stopRollingBtn.setOverState({rect:[0,0,450,67]});
			stopRollingBtn.width= 450;
			stopRollingBtn.height = 67;
			stopRollingBtn.scaleX = this.stopRollingPage.scaleX;
			stopRollingBtn.scaleY = this.stopRollingPage.scaleY;
			stopRollingBtn.x = this.width * 0.15;
			stopRollingBtn.y = this.height * 0.53;
			stopRollingBtn.on(game.EVENTS.TAP, function(e) {
				game.state = "complete";
				game.displayPage3();
			});

			this.stopRollingBtn = stopRollingBtn;
		}
		
		this.stage.addChild(
					this.stopRollingPage
					, this.stopRollingBtn);
		this.stage.step();
	};

	game.displayPage3 = function() {
		if(this.congratulationMask == null) {
			this.congratulationMask = buildBackground("congratulationMask", "page3");

			var confirmCongratulationBtn = new Q.Button({id:"confirmCongratulationBtn", image: ns.R.getImage("button")});
			confirmCongratulationBtn.setUpState({rect:[0,0,575,525]});
			confirmCongratulationBtn.setOverState({rect:[0,0,575,525]});
			confirmCongratulationBtn.width= 575;
			confirmCongratulationBtn.height = 525;
			confirmCongratulationBtn.scaleX = this.congratulationMask.scaleX;
			confirmCongratulationBtn.scaleY = this.congratulationMask.scaleY;
			confirmCongratulationBtn.x = this.width * 0.05;
			confirmCongratulationBtn.y = this.height * 0.14;
			confirmCongratulationBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage4();
			});

			this.confirmCongratulationBtn = confirmCongratulationBtn;
		}
		
		this.stage.addChild(
					this.congratulationMask
					, this.confirmCongratulationBtn);
		this.stage.step();
	};

	game.displayPage4 = function() {	
		if(this.couponPage == null) {
			var couponPage = new Q.Bitmap({id:"couponPage", image: ns.R.getImage("page4")});
	        var sX = this.stage.width/couponPage.width;
			var sY = this.stage.height/couponPage.height;
	        couponPage.scaleX = sX;
	        couponPage.scaleY = sY;
	        couponPage.x = 0;
	        couponPage.y = 0;
			this.couponPage = buildBackground("couponPage", "page4");

			var shareBtn = new Q.Button({id:"shareBtn", image: ns.R.getImage("button")});
			shareBtn.setUpState({rect:[0,0,450,67]});
			shareBtn.setOverState({rect:[0,0,450,67]});
			shareBtn.width= 450;
			shareBtn.height = 67;
			shareBtn.scaleX = this.couponPage.scaleX;
			shareBtn.scaleY = this.couponPage.scaleY;
			shareBtn.x = this.width * 0.15;
			shareBtn.y = this.height * 0.665;
			shareBtn.on(game.EVENTS.TAP, function(e) {
				if (WeixinApi.openInWeixin()) {
					game.state = 'do_share';
					game.displayPage5();
				} else {
					alert("请在微信中访问本游戏。");					
				}
			});

			this.shareBtn = shareBtn;

			// TODO, second button not used


			var exchangeBtn = new Q.Button({id:"exchangeBtn", image: ns.R.getImage("button")});
			exchangeBtn.setUpState({rect:[0,0,450,67]});
			exchangeBtn.setOverState({rect:[0,0,450,67]});
			exchangeBtn.width= 450;
			exchangeBtn.height = 67;
			exchangeBtn.scaleX = this.couponPage.scaleX;
			exchangeBtn.scaleY = this.couponPage.scaleY;
			exchangeBtn.x = this.width * 0.15;
			exchangeBtn.y = this.height * 0.84;
			exchangeBtn.on(game.EVENTS.TAP, function(e) {
				game.displayPage6();
			});

			this.exchangeBtn = exchangeBtn;
		}
		
		this.stage.addChild(
					this.couponPage
					, this.shareBtn
					, this.exchangeBtn);
		this.stage.step();
	};

	game.displayPage5 = function() {	
		if(this.sharePage == null) {
			this.sharePage = buildBackground("sharePage", "page5");
		}
		
		this.stage.addChild(
					this.sharePage);
		this.stage.step();
	};


	game.hidePage5 = function() {	
		if(this.sharePage) {
			this.stage.removeChildById("sharePage");
			this.stage.step();
		}
	};

	game.displayPage6 = function() {
		if(this.exchangePage == null) {
			this.exchangePage = buildBackground("exchangePage", "page6");

			var doSubmitBtn = new Q.Button({id:"doSubmitBtn", image: ns.R.getImage("button")});
			doSubmitBtn.setUpState({rect:[0,0,310,85]});
			doSubmitBtn.setOverState({rect:[0,0,310,85]});
			doSubmitBtn.width= 310;
			doSubmitBtn.height = 85;
			doSubmitBtn.scaleX = this.exchangePage.scaleX;
			doSubmitBtn.scaleY = this.exchangePage.scaleY;
			doSubmitBtn.x = this.width * 0.51;
			doSubmitBtn.y = this.height * 0.585;
			doSubmitBtn.on(game.EVENTS.TAP, function(e) {
				game.stage.removeChildById("exchangePage");
				game.stage.removeChildById("doSubmitBtn");
				game.stage.removeChildById("cancelSubmitBtn");
				$("#memberIdInput").remove();
			});

			this.doSubmitBtn = doSubmitBtn;


			var cancelSubmitBtn = new Q.Button({id:"cancelSubmitBtn", image: ns.R.getImage("button")});
			cancelSubmitBtn.setUpState({rect:[0,0,310,85]});
			cancelSubmitBtn.setOverState({rect:[0,0,310,85]});
			cancelSubmitBtn.width= 310;
			cancelSubmitBtn.height = 85;
			cancelSubmitBtn.scaleX = this.exchangePage.scaleX;
			cancelSubmitBtn.scaleY = this.exchangePage.scaleY;
			cancelSubmitBtn.x = this.width * 0.05;
			cancelSubmitBtn.y = this.height * 0.585;
			cancelSubmitBtn.on(game.EVENTS.TAP, function(e) {
				game.stage.removeChildById("exchangePage");
				game.stage.removeChildById("doSubmitBtn");
				game.stage.removeChildById("cancelSubmitBtn");
				$("#memberIdInput").remove();
			});

			this.cancelSubmitBtn = cancelSubmitBtn;
		}
		
	    var phoneNumInput = Q.createDOM("input"
					, {
						id:"memberIdInput"
						, type: "text"
						, maxlength: 15
						, placeholder: "卡号"
						, style : {
							position:"absolute",
							top : (game.height * 0.375) + "px",
							left: (game.width * 0.45) + "px",
							width: (game.width * 0.38)+ "px",
							height: 40 * game.cancelSubmitBtn.scaleY + "px",
							background: "transparent",
							border: "none",
							"text-align": "left",
							"padding-left": "5px",
							"color": "#333",
							"z-index": $("#doSubmitBtn").css("z-index"),
							"font": "20px 黑体"
						}
					});

		this.stage.addChild(
			this.exchangePage
			, this.doSubmitBtn
				, this.cancelSubmitBtn);
		this.stage.step();

    	$("body").prepend(phoneNumInput);
	};

	$(function() {
		game.bootstrap();
	});

})();