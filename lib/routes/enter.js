var express = require('express');
var router = express.Router();

var service = require('../service/service');

/* GET users listing. */
router.get('/', function(req, res) {
	var url = '/?openId=' + (req.session.openId || "");

	service
	.getUserCount(req.session.openId)
	.then(function(count) {
		if (count > 0) {
			url += '&status=played';
		}
    	res.redirect(url);
	});
});

module.exports = router;
