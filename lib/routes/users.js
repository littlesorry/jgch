var express = require('express');
var router = express.Router();

var service = require('../service/service');

/* GET users listing. */
router.get('/', function(req, res) {
    service.createUser(req.query.openId || req.session.openId).then(function() {
        res.json({
            "status": "ok"
        });
    }).catch(function(err) {
        res.json({
            "status": "error"
        });
    });
});

router.get('/referCount', function(req, res) {
    service.getReferCount(req.query.openId || req.session.openId).then(function(count) {
        res.json({
            "count": count
        });
    }).catch(function(err) {
        res.json({
            "status": "error"
        });
    });
});

module.exports = router;
