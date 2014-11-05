(function () {
	var ns = Q.use("rolling");

	var R = ns.R = {};

	R.assets = [
		{id: "page1", width: 372, src: "assets/page_1.png"},
		{id: "page2", width: 372, src: "assets/page_2.png"},
		{id: "page2b", width: 372, src: "assets/page_2b.png"},
		{id: "button", width: 372, src: "assets/button.png"}
	];

	R.init = function(images) {
		this.images = images;
	};

	R.getImage = function(id) {
		try {
			return this.images[id].image;
		} catch (e) {
			alert(e);
		}
	}

})();