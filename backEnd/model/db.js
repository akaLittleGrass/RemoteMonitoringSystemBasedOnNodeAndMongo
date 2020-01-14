const MongoClient = require('mongodb').MongoClient;

function _connectDB(callback) {
    const url = "mongodb://new-user_0:553744@monitoringusersverify-shard-00-00-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-01-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-02-fjxrl.azure.mongodb.net:27017/test?ssl=true&replicaSet=monitoringUsersVerify-shard-0&authSource=admin&retryWrites=true";
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(err, db);
    });
}
exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        db.collection(collectionName).insertOne(json, function (err, result) {
            callback(err, result);
            db.close();
        })
    });
}

exports.find = function (collectionName, json, callback) {
    const result = [];
    if (arguments.length != 3) {
        callback("find函数接受三个参数", null);
        return;
    }
    _connectDB(function (err, db) {
        const cursor = db.collection(collectionName).find(json);
        cursor.each(function (err, doc) {
            if (err) {
                callback(err, null);
                return;
            }
            if (doc != null) {
                result.push(doc);
            } else {
                callback(null, result);
            }
        });
    });
}

