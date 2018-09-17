var ip = require('ip');
var LCD = require('lcdi2c');

const lcd = new LCD(1, 0x27, 16, 2);
const ip_addr = ip.address()

lcd.clear();
lcd.print("hello :)");

console.log(ip_addr)
