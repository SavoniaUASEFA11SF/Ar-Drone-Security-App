//Ar drone flight logic core
//5.10.2014
///Lordink

/*
 * @property notation specifics:
 * _ (underscore) for the beginning of inner function and objects, exposed for testing
 * $ for public-intended variables
 * ///Lordink
 */

(function () {
    ///Slight sugar for ease of definition
    var Node = module.exports;

    //Internal flight controlling methods
    var $flightData = {},
        stateControl = new stateManager('off'),
        $flightQueue = new flightQueue();

    Node._flightData = $flightData;
    Node.$flightState = stateControl;

    Node.getFlightQueue = function () {
        return $flightQueue;
    };

    // fly("forward")
    // fly("forward", 500)
    // fly({ angle: 120, duration: 500});
    function fly(direction, delay)  {
      if (typeof direction === "string") {

        if ((direction !== "Forward") && (direction !== "Backwards") && (direction != "Left") && (direction != "Right")) {
          return false;
        }
        if(delay === undefined)
          $flightQueue.add(direction);
        else
          $flightQueue.add(direction, delay);
        return true;
        }
        //TODO: check the fact that angle and duration do exist! Otherwise, you get a thow TypeError, which is not what we want.
        if (!isNaN(direction.angle) && !isNaN(direction.duration))  {
          $flightQueue.add("Custom Direction", direction);
          return true;
        }
        else
          return false;
    }
    Node.fly = fly;

    //Initialize drone variables and connection here.
    function init() {
        var arDrone = {},
            control = {},
            error  = null;

        try {
            arDrone = require('ar-drone');
            control = arDrone.createUdpControl();
        } catch (err) {
            console.log(" _init error: " + err.message);
            error = err;
        }

        //ref object
        $flightData.$ref = {};
        $flightData.$pcmd = {};

        $flightData.$arDrone = arDrone;
        $flightData.$udpController = control;

        if(error)
          return false;

        stateControl.refreshIntervalId = setInterval(stateControl.refreshLoop, 1000);
        return true;
    }

    Node.init = init;

    //Singleton for the state control
    function stateManager(state) {

        //Allowed states:
        this.states = ['off', 'takingOff', 'airborne', 'landing'];
        //The state to be executed
        this.currentState = null;
        //future container for the refresh interval id, which is needed to stop the refresh loop
        this.refreshIntervalId = null;

        if (state === undefined || (this.states.indexOf(state) === -1))
            this.currentState = 'off';
        else
            this.currentState = state;
        ///Will be instantiated for each object, but we have singleton, so no problem there.
        this.get = function () {
            return this.currentState;
        };
        this.set = function (newState) {
            if (this.states.indexOf(newState) === -1){
                throw new Error("Unknown state!");
            }

            //Translate the state information into ref and pcmd object
           this.currentState = newState;

           $flightData.$ref = {}; //TODO
           $flightData.$pcmd = {}; //TODO

           this.processDroneData();
        };
       //Send our pcmd and ref packages to drone controller
        this.processDroneData = function(){
           $flightData.$udpController.ref($flightData.$ref);
           $flightData.$udpController.pcmd($flightData.$pcmd);

           $flightData.$udpController.flush();
        };

        //setInterval'd loop, invoked from the init function. Is capable of killing itself, if needed.
        this.refreshLoop = function(){

        };
    }

    Node._stateManager = stateManager;

    stuf = new flightQueue();
    stuf.add("forward");

    function flightQueue() {
        this.data = [];
        this.commands = [
            { name: "Take Off",         delay: 3000 },
            { name: "Land",             delay: 3000 },
            { name: "Forward",          delay: -1},
            { name: "Backwards",        delay: -1},
            { name: "Left",             delay: -1},
            { name: "Right",            delay: -1},
        ];
        this.add = function (commandName, delay) {
          var foundCommand = false;
            for (var i = 0; i < this.commands.length; i++) {
                if (this.commands[i].name == commandName) {
                  if (delay !== undefined)  {
                    this.data.push({ name: commandName, delay: delay });
                  }
                  else 
                    this.data.push(this.commands[i]);

                    break;
                }
            }
          if (!foundCommand)  {
            throw new Error ('Unknown Command!');
          }
        };

        this.remove = function (commandName) {
          var foundCommand = false;
            for (var i = 0; i < this.commands.length; i++) {
                if (this.commands[i].name == commandName) {
                    this.data.splice(i, 1);
                    foundCommand = true;
                    break;
                }
            }
            if (!foundCommand)  {
              return false; }
              else {
                return true; }
        };

    }

    Node._flightQueue = flightQueue;

})();
