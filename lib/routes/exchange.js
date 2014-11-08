var express = require('express');
var router = express.Router();

var service = request('../service/service');

/* GET users listing. */
router.get('/', function(req, res) {
    service
        .doExchange(req.session.openId, req.params.memberId)
        .then(function(status) {
            req.json({
                "status": status
            });
    });
});

module.exports = router;
