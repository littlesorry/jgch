var debug = require('debug')('jgch');
var config = require('config');

var app = require('../app');

var appConfig = config.get('app');

app.set('port', appConfig.runtime.port);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
