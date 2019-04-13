const rpio = require('rpio');
rpio.open(31, rpio.INPUT);
let a = 31;
rpio.write(37, rpio.HIGH);