//1.10.14 14:05
//Testing take off, fly forward and land
///Lordink


var arDrone = require('ar-drone');

var client = arDrone.createClient();

client.takeoff();

client.after(3000, function(){
  this.animate('flipLeft', 15);
  console.log('Now the flip happens');
})
.after(1500, function(){
  console.log('now we stop, okda');
  this.stop();
  this.land();
});
