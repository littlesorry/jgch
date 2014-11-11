(function() {
	var ns = Q.use("rolling");

	var positions = [
		{x: 0.1535, y: 0.357}
		,{x: 0.306, y: 0.357}
		,{x: 0.461, y: 0.357}
		,{x: 0.616, y: 0.357}
		,{x: 0.770, y: 0.357}
		,{x: 0.151, y: 0.462}
		,{x: 0.306, y: 0.462}
		,{x: 0.461, y: 0.462}
		,{x: 0.616, y: 0.462}
		,{x: 0.770, y: 0.462}
	];

	var Flower = ns.Flower = function(number, sX, sY) {
		number > 10 && (number = 10);

		var flowers = [];
		for (var i = 0; i < number; i++) {
			var flower = new Q.Bitmap({"id": "flower" + i, "image": ns.R.getImage("orangeFlower")});
			flower.x = positions[i].x * ns.game.width;
			flower.y = positions[i].y * ns.game.height;
			flower.scaleX = sX;
			flower.scaleY = sY;

			flowers.push(flower);
		}

		return flowers;
	};

})();