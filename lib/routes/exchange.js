var express = require('express');
var router = express.Router();

var service = require('../service/service');

/* GET users listing. */
router.get('/', function(req, res) {
    service
        .doExchange(req.query.openId || req.session.openId, req.query.memberId)
        .then(function(status) {
            res.json({
                "status": status
            });
        }).catch(function() {
            res.json({
                "status": "error"
            });
        });
});

module.exports = router;
