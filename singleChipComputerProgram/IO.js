const mongoose = require('mongoose');
const rpio = require('rpio');
const dburl = "mongodb://new-user_0:553744@monitoringusersverify-shard-00-00-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-01-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-02-fjxrl.azure.mongodb.net:27017/deviceMsg?ssl=true&replicaSet=monitoringUsersVerify-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(dburl, { useNewUrlParser: true ,useCreateIndex: true,})
.then(() => console.log("Mongodb of deviceMsg connected"))
.catch(err => console.log(err));

rpio.open(16, rpio.OUTPUT);
rpio.write(16, rpio.LOW);
rpio.open(18, rpio.OUTPUT);
rpio.write(18, rpio.LOW);

let deviceSchema = mongoose.Schema({
    id: String,
    status: Boolean,
    type: String
});

const Devices = mongoose.model('status', deviceSchema); 
let status1, status2;
const find = function(){
  Devices.find({type: 'switch'}, function(err, devices){
    if(err) throw err;
    for(let value of devices){
      switch(value.id){
        case 'device1':
	        if(status1 !== value.status){
	          console.log('status1 was changed');
	          status1 = value.status;
	          if(status1 === true){
					rpio.write(16, rpio.HIGH);
				}else if(status1 === false){
					rpio.write(16, rpio.LOW);
				}
        	  }
        break;
        case 'device2':
	        if(status2 !== value.status){
	          console.log('status2 was changed');
	          status2 = value.status;
				if(status2 === true){
					rpio.write(18, rpio.HIGH);
				}else if(status2 === false){
					rpio.write(18, rpio.LOW);
				}
        	}
        break;
      }
    }
  })
}
const Interval = setInterval(find,2000);
