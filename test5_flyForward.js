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
  pcmd = {front: 0.1};
}, 5000);

setTimeout( function () {
    pcmd = {front: 0.0};
}, 8000);

setTimeout(function(){
  console.log('Landing ...');
  ref.fly = false;
  pcmd = {};
}, 12000) //TODO delay in a way that he fuken lands 

setInterval(function(){
  control.ref(ref);
  control.pcmd(pcmd);
  control.flush();
}, 30);

setTimeout( function () {
   control.ref({fly: false});
   return;
})
