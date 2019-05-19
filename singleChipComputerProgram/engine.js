const mongoose = require('mongoose');
const rpio = require('rpio');
const dburl = "mongodb://new-user_0:553744@monitoringusersverify-shard-00-00-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-01-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-02-fjxrl.azure.mongodb.net:27017/deviceMsg?ssl=true&replicaSet=monitoringUsersVerify-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(dburl, { useNewUrlParser: true ,useCreateIndex: true,})
.then(() => console.log("Mongodb of deviceMsg connected"))
.catch(err => console.log(err));

rpio.open(36, rpio.OUTPUT);
rpio.open(38, rpio.OUTPUT);
rpio.open(40, rpio.OUTPUT);

rpio.write(40, rpio.HIGH);
rpio.write(38, rpio.LOW);
rpio.write(36, rpio.LOW);

const runForward = function(){
	rpio.write(38, rpio.HIGH);
	rpio.write(36, rpio.LOW);
}
const runReverse = function(){
	rpio.write(38, rpio.LOW);
	rpio.write(36, rpio.HIGH);
}
const runForwardSlow = function(){
	rpio.write(36, rpio.LOW);
	rpio.write(38, rpio.HIGH);
	setTimeout(()=>rpio.write(38, rpio.LOW), 60)
}
const runReverseSlow = function(){
	rpio.write(38, rpio.LOW);
	rpio.write(36, rpio.HIGH);
	setTimeout(()=>rpio.write(36, rpio.LOW), 60)
}
const stop = function(){
	rpio.write(38, rpio.LOW);
	rpio.write(36, rpio.LOW);
}

let runSlow;
let lastIsForward;
let lastIsSlow;

let deviceSchema = mongoose.Schema({
    id: String,
    status: Boolean,
    type: String,
	 isSlow: Boolean,
	 isForward: Boolean
});

const engine= mongoose.model('status', deviceSchema); 

const find = function(){
  engine.find({type: 'engine'}, function(err, res){
    if(err) throw err;
	 let engine = res[0]; 	
	 if(engine.status){
		if(engine.isSlow){
			if(runSlow){
				if(lastIsForward !== engine.isForward){
					clearInterval(runSlow);
					if(engine.isForward){
					runSlow = setInterval(runForwardSlow, 100);
					}else{
						runSlow = setInterval(runReverseSlow, 100);
					}
				}
			}else{
				if(engine.isForward){
					runSlow = setInterval(runForwardSlow, 100);
				}else{
					runSlow = setInterval(runReverseSlow, 100);
				}
			}
		lastIsForward = engine.isForward;
		}else{
			if(runSlow){
				clearInterval(runSlow);
				runSlow = 0;
			}
			if(engine.isForward){
				console.log('runForward');
				runForward();
			}else{
				console.log('reverse');
				runReverse();
			}
		}
	 }else{
		if(runSlow)clearInterval(runSlow);
		stop();
	}
  })
}
console.log('ready');
const Interval = setInterval(find,2000);


