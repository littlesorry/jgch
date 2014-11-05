(function () {
	var ns = Q.use("rolling");

	var R = ns.R = {};

	R.assets = [
		{id: "page1", width: 640, src: "assets/page_1.png"},
		{id: "page2", width: 640, src: "assets/page_2.png"},
		{id: "page2b", width: 640, src: "assets/page_2b.png"},
		{id: "page3", width: 640, src: "assets/page_3.png"},
		{id: "page4", width: 640, src: "assets/page_4.png"},
		{id: "page4b", width: 640, src: "assets/page_4b.png"},
		{id: "page4c", width: 640, src: "assets/page_4c.png"},
		{id: "page5", width: 640, src: "assets/page_5.png"},
		{id: "page6", width: 640, src: "assets/page_6.png"},
		{id: "page6a", width: 640, src: "assets/page_6a.png"},
		{id: "page6b", width: 640, src: "assets/page_6b.png"},
		{id: "button", width: 423, src: "assets/button.png"}
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