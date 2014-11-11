db.users.ensureIndex( { "openId": 1 }, { unique: true, dropDups: true } );
db.refers.ensureIndex( { "sourceOpenId": 1, "targetOpenId": 1 }, { unique: true, dropDups: true } );
db.exchanges.ensureIndex( { "openId": 1 }, { unique: true, dropDups: true } );

db.refers.ensureIndex({"targetOpenId": 1}, {background: true});