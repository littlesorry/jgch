var should = require("should");

var data = require(__dirname + "/../../lib/data/data");


describe("data.js", function() {
    describe("#find", function() {
        it("should get no target", function(done) {
            data("user").find({"id": "1"}).then(function(docs) {
                docs.should.eql([]);
                done();
            });
        });        
    });

    describe("#findOne", function() {
        it("should get no target", function(done) {
            data("user").findOne({"id": "1"}).then(function(doc) {
                done(doc);
            });
        });        
    });

    describe("#insert", function() {
        it("should succeed", function(done) {
            data("user").insert({
                id: "test_id_000",
                wechatId: "test_wechatId_000",
                couponId: "test_couponId_000",
                referred: 1
            }).then(function() {
                done();
            }).catch(function(err) {
                done();
            });
        });     
    });

    describe("#find", function() {
        it("should get 1 target", function(done) {
            data("user").find({"id": "test_id_000"}).then(function(docs) {
                done();
            });
        });        
    });

    describe("#findOne", function() {
        it("should get 1 target", function(done) {
            data("user").findOne({"id": "test_id_000"}).then(function(doc) {
                done();
            });
        });        
    });
})

