(function() {

    function getURLParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

	var ns = Q.use("rolling");

	var game = window.game = ns.game = {
		frames: 0,
		events: Q.supportTouch ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"],
		params: Q.getUrlParams(),
		state: "not_completed",
		outLink1: "http://mp.weixin.qq.com/s?__biz=MzA4NzI0NTAwNQ==&mid=201028841&idx=1&sn=0adab2e9ffefd724f93c09eabf88051c#rd",
		outLink2: "http://mp.weixin.qq.com/s?__biz=MzA4NzI0NTAwNQ==&mid=201030932&idx=1&sn=d395977806a33991287827e7ce3933db#rd‍"
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
		if (!/debug/.test(location.search) && !game.params.openId) {
			window.location = '/enter/';
			return;
		}

		if (/debug/.test(location.search) && !game.params.openId) {
			game.params.openId = "debug_openId_" + Math.random();
		}

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
		
		if (game.params.refers > 0) {
			this.displayPage4();
		} else {
			this.displayPage1();
		}
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

	function startStickAnime(leftStick, rightStick, leftWave, rightWave) {
    	var t0 = Q.Tween.to(rightWave
					, {alpha: 1}
					, {
						time: 500
						, loop: true
						, reverse: true
    				}
    	);

		var t1 = Q.Tween.to(leftWave
					, {alpha: 0}
					, {
						time: 500
						, loop: true
						, reverse: true
    				}
    	);

    	var t2 = Q.Tween.to(leftStick
					, {y: leftStick.y - 20}
					, {
						time: 500
						, loop: true
						, reverse: true
    				}
    	);

    	var t3 = Q.Tween.to(rightStick
					, {y: rightStick.y - 20}
					, {
						time: 500
						, delay: 500
						, loop: true
						, reverse: true
    				}
    	);

    	return function() {
    		Q.Tween.remove(t0);
	    	Q.Tween.remove(t1);
	    	Q.Tween.remove(t2);
	    	Q.Tween.remove(t3);
	    	Q.Tween.to(rightWave
						, {alpha: 0}
						, {time: 500}
	    	);

			Q.Tween.to(leftWave
						, {alpha: 0}
						, {time: 500}
	    	);
    	};
	};

	game.displayPage2 = function() {	
		if(this.startRollingPage == null) {
			this.startRollingPage = buildBackground("startRollingPage", "page2");

			var startBtnImg = ns.R.getImage("startButton");
			var startRollingBtn = new Q.Button({id:"startRollingBtn", image: startBtnImg});
			startRollingBtn.setUpState({rect:[0,0,startBtnImg.width,startBtnImg.height]});
			startRollingBtn.setOverState({rect:[0,0,startBtnImg.width,startBtnImg.height]});
			startRollingBtn.width= startBtnImg.width;
			startRollingBtn.height = startBtnImg.height;
			startRollingBtn.scaleX = this.startRollingPage.scaleX;
			startRollingBtn.scaleY = this.startRollingPage.scaleY;
			startRollingBtn.x = this.width * 0.133;
			startRollingBtn.y = this.height * 0.53;
			startRollingBtn.on(game.EVENTS.TAP, function(e) {
				var stopAnime = startStickAnime(leftStick, rightStick, leftWave, rightWave);

				var stopButtonImg = ns.R.getImage("stopButton");
				var stopRollingBtn = new Q.Button({id:"stopRollingBtn", image: stopButtonImg});
				stopRollingBtn.setUpState({rect:[0,0,stopButtonImg.width,stopButtonImg.height]});
				stopRollingBtn.setOverState({rect:[0,0,stopButtonImg.width,stopButtonImg.height]});
				stopRollingBtn.width= stopButtonImg.width;
				stopRollingBtn.height = stopButtonImg.height;
				stopRollingBtn.scaleX = game.startRollingPage.scaleX;
				stopRollingBtn.scaleY = game.startRollingPage.scaleY;
				stopRollingBtn.x = game.width * 0.133;
				stopRollingBtn.y = game.height * 0.53;
				stopRollingBtn.on(game.EVENTS.TAP, function(e) {
					game.state = "complete";
					game.point.stopRolling();
					stopAnime();

					var shrink = Q.Tween.to(game.point
						, {alpha: 0.3}
						, {time: 100, loop: true, reverse: true}
			    	);

					setTimeout(function() {
						Q.Tween.remove(shrink);
						game.displayPage3();
					}, 1500);
				});

				game.stopRollingBtn = stopRollingBtn;

				var point = new ns.Point({"id": "point", "image": ns.R.getImage("point")});
				point.scaleX = game.startRollingPage.scaleX;
		        point.scaleY = game.startRollingPage.scaleY;
		        point.x = game.width * 0.822;
		        point.y = game.height * 0.586 * 0.51933;
				
				game.point = point;

				game.stage.addChild(game.stopRollingBtn, game.point);
				game.stage.removeChildById(game.startRollingBtn);
				
				game.point.startRolling(game.width, game.height * 0.51933);
				game.stage.step();
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
				NProgress.start();
				$.get("/users?_=" + Math.random(), function() {
					NProgress.done();
					setTimeout(function() {
						game.displayPage4();
					}, 500);
				});
			});

			this.confirmCongratulationBtn = confirmCongratulationBtn;
		}
		
		this.stage.addChild(
					this.congratulationMask
					, this.confirmCongratulationBtn);

		this.stage.step();
	};

	/**
		50到100, 5个人点亮全部，一个人两朵花
		100到300， 10个人点亮全部，一个人一朵花
		300到1000， 30个人点亮全部，三个人一朵花 
	 */
	game.flowerCount = function() {
		var realRefers = game.params.refers - 1;

		if (realRefers < 5) {
			// x < 5, 50
			return realRefers * 2;
		} else if (realRefers < 15){
			// 5 <= x <= 1*9 + 5, 100
			return (realRefers - 5);
		} else if (realRefers < 44) {
			// 14 < x < 3 * 9 + 2 + 15, 300
			return (realRefers - 15) / 3;
		} else {
			return 10;
		}
	};

	game.getCouponImg = function() {
		var realRefers = game.params.refers - 1;
		if (realRefers < 5) {
			return "page4";
		} else if (realRefers < 15) {
			return "page4b";
		} else if (realRefers < 44) {
			return "page4c"
		}
		return "page4d";
	};

	game.displayInstruction = function() {
		if (this.instructionPage == null) {
			this.instructionPage = buildBackground("instructionPage", "instructionPage");

			var closeInstructionBtn = new Q.Button({id:"closeInstructionBtn", image: ns.R.getImage("button")});
			closeInstructionBtn.setUpState({rect:[0,0,575,525]});
			closeInstructionBtn.setOverState({rect:[0,0,575,525]});
			closeInstructionBtn.width= 575;
			closeInstructionBtn.height = 525;
			closeInstructionBtn.scaleX = this.instructionPage.scaleX;
			closeInstructionBtn.scaleY = this.instructionPage.scaleY;
			closeInstructionBtn.x = this.width * 0.05;
			closeInstructionBtn.y = this.height * 0.27;
			closeInstructionBtn.on(game.EVENTS.TAP, function(e) {
				game.stage.removeChildById("closeInstructionBtn");
				game.stage.removeChildById("instructionPage");
				game.stage.step();
			});

			this.closeInstructionBtn = closeInstructionBtn;
		}

		this.stage.addChild(
			this.instructionPage
			, this.closeInstructionBtn
		);
		this.stage.step();
	};

	game.displayPage4 = function() {	
		if(this.couponPage == null) {
			this.couponPage = buildBackground("couponPage", game.getCouponImg());

			var instructionLink = new Q.Button({id:"instructionLink", image: ns.R.getImage("button")});
			instructionLink.setUpState({rect:[0,0,200,50]});
			instructionLink.setOverState({rect:[0,0,200,50]});
			instructionLink.width= 200;
			instructionLink.height = 50;
			instructionLink.scaleX = this.couponPage.scaleX;
			instructionLink.scaleY = this.couponPage.scaleY;
			instructionLink.x = this.width * 0.13;
			instructionLink.y = this.height * 0.56;
			instructionLink.on(game.EVENTS.TAP, function(e) {
				game.displayInstruction();
			});

			this.instructionLink = instructionLink;

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

			var outerLinkBtn = new Q.Button({id: "outerLinkBtn", image: ns.R.getImage("button")});
			outerLinkBtn.setUpState({rect:[0,0,450,67]});
			outerLinkBtn.setOverState({rect:[0,0,450,67]});
			outerLinkBtn.width= 450;
			outerLinkBtn.height = 67;
			outerLinkBtn.scaleX = this.couponPage.scaleX;
			outerLinkBtn.scaleY = this.couponPage.scaleY;
			outerLinkBtn.x = this.width * 0.15;
			outerLinkBtn.y = this.height * 0.752;
			outerLinkBtn.on(game.EVENTS.TAP, function(e) {
				window.location = game.outLink1;
			});

			this.outerLinkBtn = outerLinkBtn;

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
			this.flowers = ns.Flower(game.flowerCount(), exchangeBtn.scaleX, exchangeBtn.scaleY);
		}
		
		this.stage.addChild(
					this.couponPage
					, this.instructionLink
					, this.shareBtn
					, this.outerLinkBtn
					, this.exchangeBtn);
		for (var i = 0; i < this.flowers.length; i++) {
			this.stage.addChild(this.flowers[i]);
		}
		
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
				if($("#memberIdInput").val().length === 0 ) {
					$("#memberIdInput").css({
						"box-shadow": "0 0 8px #d00"
					});
					return;
				}

				$("#memberIdInput").css({
						"box-shadow": ""
				});
				NProgress.start();
				$.get("/exchange/?_= " + Math.random() + "&memberId=" + $("#memberIdInput").val(), function(response) {
					NProgress.done();
					if (response.status === 'ok') {
						game.submitResultPage = buildBackground("submitResultPage", "page6a");
					} else {
						game.submitResultPage = buildBackground("submitResultPage", "page6b");
					}
					game.stage.addChild(game.submitResultPage);
					game.stage.step();
				})
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

			var outerLinkBtn2 = new Q.Button({id: "outerLinkBtn2", image: ns.R.getImage("button")});
			outerLinkBtn2.setUpState({rect:[0,0,260,50]});
			outerLinkBtn2.setOverState({rect:[0,0,260,50]});
			outerLinkBtn2.width= 260;
			outerLinkBtn2.height = 50;
			outerLinkBtn2.scaleX = this.couponPage.scaleX;
			outerLinkBtn2.scaleY = this.couponPage.scaleY;
			outerLinkBtn2.x = this.width * 0.13;
			outerLinkBtn2.y = this.height * 0.51;
			outerLinkBtn2.on(game.EVENTS.TAP, function(e) {
				window.location = game.outLink2;
			});

			this.outerLinkBtn2 = outerLinkBtn2;
		}
		
	    var phoneNumInput = Q.createDOM("input"
					, {
						id:"memberIdInput"
						, type: "number"
						, maxlength: 15
						, placeholder: "卡号"
						, required: "required"
						, style : {
							position:"absolute",
							top : (game.height * 0.37) + "px",
							left: (game.width * 0.47) + "px",
							width: (game.width * 0.38)+ "px",
							height: 40 * game.cancelSubmitBtn.scaleY + "px",
							background: "#fff",
							border: "1px solid #bfbfbf",
							"text-align": "left",
							"padding-left": "8px",
							"color": "#333",
							"z-index": 9999,
							"font-size": "20px",
							"letter-spacing": "2px"
						}
					});

		this.stage.addChild(
			this.exchangePage
			, this.outerLinkBtn2
			, this.doSubmitBtn
			, this.cancelSubmitBtn);

    	$("body").prepend(phoneNumInput);
    	$("#memberIdInput").attr({
    		"maxlength": 6,
    		"max": "999999",
    		"inputmode": "numeric",
    		"pattern": "[0-9]*"
    	});

		this.stage.step();

	};

	$(function() {
		game.bootstrap();
	});

})();