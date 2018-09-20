const ip = require('ip');
const LCD = require('lcdi2c');

const lcd = new LCD(1, 0x27, 16, 2);
const ipAddress = ip.address();

lcd.clear();
lcd.print('hello :)');

console.log(ipAddress);
