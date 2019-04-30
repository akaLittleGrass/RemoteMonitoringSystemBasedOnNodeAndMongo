const mongoose = require('mongoose');
const dburl = "mongodb://new-user_0:553744@monitoringusersverify-shard-00-00-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-01-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-02-fjxrl.azure.mongodb.net:27017/deviceMsg?ssl=true&replicaSet=monitoringUsersVerify-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(dburl, { useNewUrlParser: true ,useCreateIndex: true,})
.then(() => console.log("Mongodb of deviceMsg connected"))
.catch(err => console.log(err));

let deviceSchema = mongoose.Schema({
    id: String,
    status: Boolean,
    type: String
});

const Devices = mongoose.model('status', deviceSchema); 
let status1, status2, status3;
const find = function(){
  Devices.find({type: 'switch'}, function(err, devices){//查询数据库中IO控制字段
    if(err) throw err;
    for(let value of devices){
      switch(value.id){
        case 'device1':
        if(status1 !== value.status){
          console.log('status1 was changed');
          status1 = value.status;//设置相关IO引脚状态
        }
        break;
        case 'device2':
        if(status2 !== value.status){
          console.log('status2 was changed');
          status2 = value.status;//设置相关引脚IO状态
        }
        break;
        case 'device3':
        if(status3 !== value.status){
          console.log('status3 was changed');
          status3 = value.status;//设置相关引脚IO状态
        }
        break;
      }
    }
  find();
  })
}
find();