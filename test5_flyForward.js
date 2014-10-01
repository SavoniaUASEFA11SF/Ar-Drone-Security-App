var arDrone = require('ar-drone');
var control = arDrone.createUdpControl();
var start   = Date.now();

var ref = {};
var pcmd = {};

setTimeout(function(){
  console.log('Takeoff...');

  ref.emergency = false;
  ref.fly       = true;
}, 1000);

setTimeout(function(){
  pcmd({front: 0.4});
}, 5000);

setTimeout(function(){
  console.log('Landing ...');
  ref.fly = false;
  pcmd = {};
}, 8000)

setInterval(function(){
  control.ref(ref);
  control.pcmd(pcmd);
  control.flush();
}, 30);
