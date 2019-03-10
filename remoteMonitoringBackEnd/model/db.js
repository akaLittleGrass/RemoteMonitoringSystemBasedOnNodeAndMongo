const MongoClient = require('mongodb').MongoClient;

function _connectDB(callback) {
    var url = "mongodb://new-user_0:8551524@monitoringusersverify-shard-00-00-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-01-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-02-fjxrl.azure.mongodb.net:27017/test?ssl=true&replicaSet=monitoringUsersVerify-shard-0&authSource=admin&retryWrites=true";
    MongoClient.connect(url, function (err,db) {
        if(err) {
            callback(err,null);
            return;
        }
        callback(err,db);
    });
}
exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err,db) {
            if(err) {
                callback(err,null);
                return;
            }
            db.collection(collectionName).insertOne(json, function (err, result) {
                callback(err, result);
                db.close();//关闭数据库
            })
        });
}

exports.find = function (collectionName,json,callback) {
    var result = [];   //结果数组
    if(arguments.length != 3) {
        callback("find函数接受三个参数",null);
        return ;
    }
    //链接数据库，链接之后查找所有
    _connectDB(function (err,db) {
        var cursor = db.collection(collectionName).find(json);
        cursor.each(function (err, doc) {
            if(err) {
                callback(err,null);
                return;
            }
           if(doc != null) {
               result.push(doc); //放入结果数组
           }else {
               //遍历结束，没有更多的文档
                callback(null,result);
           }
        });
    });
}

//let User = mongoose.model('User', userSchema);
//module.exports = User;