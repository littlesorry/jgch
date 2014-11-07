var config = require('config');
var mongoose = require('mongoose');
var Promise = require('bluebird');

var dataConfig = config.get("data");

mongoose.connect(dataConfig.db.url);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    console.info('mongodb ready');
});

var modelPool = {};
for(var model in dataConfig.models) {
    modelPool[model] = mongoose.model(model, dataConfig.models[model]);
}

var data = module.exports = function(type) {
    var Model = modelPool[type];
    return {
        "_model": Model,
        find: function(criteria) {
            
        },
        findOne: function(criteria) {

        }, 
        get: function(id) {

        },
        insert: function(data) {
            return new Promise(function(resolve, reject) {

                new Model(data).save();
            });
        }
    };
};

