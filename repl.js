//Repl.js
//Test project for ar drone.

(function(){
	var arDrone = require('ar-drone');
	var client  = arDrone.createClient();

	client.createRepl();
})();
