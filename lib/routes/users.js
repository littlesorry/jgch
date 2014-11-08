var express = require('express');
var router = express.Router();

var service = request('../service/service');

/* GET users listing. */
router.get('/', function(req, res) {
    service.createUser(req.session.openId).then(function() {
        req.json({
            "status": "ok"
        });
    }).catch(function(err) {
        req.json({
            "status": "error"
        });
    });
});

router.get('/referCount', function(req, res) {
    service.getReferCount(req.session.openId).then(function(count) {
        req.json({
            "count": count
        });
    }).catch(function(err) {
        req.json({
            "status": "error"
        });
    });
});

module.exports = router;
