const rpio = require('rpio');
//rpio.open(12, rpio.OUTPUT);
//rpio.write(12, rpio.HIGH);
//setTimeout(()=>rpio.write(12, rpio.LOW), 5000);

rpio.open(31, rpio.OUTPUT);
rpio.open(33, rpio.OUTPUT);
rpio.open(35, rpio.OUTPUT);
rpio.open(37, rpio.OUTPUT);

rpio.write(31, rpio.LOW);
rpio.write(33, rpio.LOW);
rpio.write(35, rpio.LOW);
rpio.write(37, rpio.LOW);

const engineOn1 = function(){
	setTimeout(()=>{
		rpio.write(31, rpio.HIGH);
	})
}

const engineOn2 = function(){
	setTimeout(()=>{
		rpio.write(31, rpio.LOW);
		rpio.write(33, rpio.HIGH);
	},1000)
}

const engineOn3 = function(){
	setTimeout(()=>{
		rpio.write(33, rpio.LOW);
		rpio.write(35, rpio.HIGH);
	},1000)
}

const engineOn4 = function(){
	setTimeout(()=>{
		rpio.write(35, rpio.LOW);
		rpio.write(37, rpio.HIGH);
	},1000)
}

const engineOff = function(){
	setTimeout(()=>{
		rpio.write(31, rpio.LOW);
		rpio.write(33, rpio.LOW);
		rpio.write(35, rpio.LOW);
		rpio.write(37, rpio.LOW);
	})
}


engineOn1();
engineOn2();
engineOn3();
engineOn4();
setTimeout(()=>console.log(1), 5000);
//engineOff();





