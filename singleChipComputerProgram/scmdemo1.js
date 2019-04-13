const rpio = require('rpio');

rpio.open(31, rpio.OUTPUT);
rpio.open(33, rpio.OUTPUT);
rpio.open(35, rpio.OUTPUT);
rpio.open(37, rpio.OUTPUT);

rpio.write(31, rpio.LOW);
rpio.write(33, rpio.LOW);
rpio.write(35, rpio.LOW);
rpio.write(37, rpio.LOW);

const arr = [31,33,35,37];
let i=0;
let j=1;
while(1){
	console.log(i);
	console.log(j);
	console.log(arr[i]);
	console.log(arr[j]);
	rpio.write(arr[i], rpio.HIGH);
	rpio.write(arr[j], rpio.HIGH);
	rpio.write(arr[i], rpio.LOW);
	i++;
	i=i%4;
	j++;
	j=j%4;
}