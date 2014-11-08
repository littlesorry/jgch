db.user.ensureIndex( { "wechat": 1 }, { unique: true, dropDups: true } );
db.refer.ensureIndex( { "sourceUserId": 1, "targetUserId": 1 }, { unique: true, dropDups: true } );