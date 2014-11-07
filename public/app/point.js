(function() {
	var ns = Q.use("rolling");

	var positions = [
		{x: 0.822, y: 0.586}
		,{x: 0.792, y: 0.727}
		,{x: 0.714, y: 0.847}
		,{x: 0.586, y: 0.947}
		,{x: 0.467, y: 0.779}
		,{x: 0.320, y: 0.676}
		,{x: 0.094, y: 0.817}
		,{x: 0.144, y: 0.622}
		,{x: 0.323, y: 0.363}
		,{x: 0.341, y: 0.126}
		,{x: 0.470, y: 0.292}
		,{x: 0.467, y: 0.574}
		,{x: 0.588, y: 0.520}
		,{x: 0.586, y: 0.263}
		,{x: 0.656, y: 0.123} 
		,{x: 0.834, y: 0.027}
		,{x: 0.684, y: 0.225}
		,{x: 0.784, y: 0.317}
		,{x: 0.792, y: 0.502}
	];

	var Point = ns.Point = function(props) {
		Point.superClass.constructor.call(this, props);
	};

	Q.inherit(Point, Q.Bitmap);

	Point.prototype.startRolling = function(baseX, baseY) {
		var idx = 0;
		var self = this;
		this.timer = setInterval(function() {
			idx++;
			self.x = positions[idx % positions.length].x * baseX;
			self.y = positions[idx % positions.length].y * baseY;
		}, 64);
	};

	Point.prototype.stopRolling = function() {
		clearInterval(this.timer);
	};
})();