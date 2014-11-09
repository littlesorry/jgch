var express = require('express');
var router = express.Router();

var service = require('../service/service');

/* GET users listing. */
router.get('/', function(req, res) {
    service
    .addRefer(req.query.sourceId, req.query.targetId)
    .then(function() {
        res.json({
            status: "ok"
        });
    }).catch(function() {
        res.json({
            status: "error"
        });
    });
});

module.exports = router;
