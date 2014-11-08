var config = require('config');
var mongoose = require('mongoose');
var Promise = require('bluebird');

var dataConfig = config.get('data');

var db = mongoose.connect(dataConfig.db.url);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('connected', function() {
    console.info('mongodb ready');
});

var modelPool = {};
for(var model in dataConfig.models) {
    var access = modelPool[model] = db.model(model, dataConfig.models[model]);

    access.promiseCalls = {
        "find": Promise.promisify(access.find, access),
        "findOne": Promise.promisify(access.findOne, access),
        "insert": Promise.promisify(access.create, access)
    };
}

var data = module.exports = function(type) {
    var Model = modelPool[type];
    return {
        "_model": Model,
        find: function(criteria) {
            return Model.promiseCalls.find(criteria);
        },
        findOne: function(criteria) {
            return Model.promiseCalls.findOne(criteria);
        }, 
        get: function(id) {

        },
        insert: function(data) {
            return Model.promiseCalls
                    .insert(data)
                    .catch(function(err) {
                        if (err.cause && err.cause.code === 11000) {
                            throw new Error('duplicate key');
                        }
                        throw err;
                    });
        }
    };
};

