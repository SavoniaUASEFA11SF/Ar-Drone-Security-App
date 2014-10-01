//1.10.14 12:05
//Testing Take off and land.
///Lordink


var arDrone = require('ar-drone');


(function(Drone){
  //Init some global vars here for the dron dependencies
  var client  = Drone.createClient();

  function init(){
    //Take off the heli. Might actually take a lot of space.
    client.takeoff(); 

    client.after(3000, function(){
      this.stop();
      this.land();
    }); 
  }

  init();

})(arDrone);

