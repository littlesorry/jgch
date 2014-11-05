var debug = require('debug')('jgch');
var app = require('../app');

app.set('port', 9000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
