db.user.ensureIndex( { "openId": 1 }, { unique: true, dropDups: true } );
db.refer.ensureIndex( { "sourceOpenId": 1, "targetOpenId": 1 }, { unique: true, dropDups: true } );