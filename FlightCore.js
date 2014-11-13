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
        $flightQueue = require('./FlightCore/flightQueue.js');


    //A middleware between flight queue and drone. Uses state manager to control the situtation and make non-ambiguous decisions.
    var $droneDispatch = {
            process: function(command, callback){
                //TODO.
                // Logic for processing the fact that first we have to get into air
                // Or fly straight on.
                callback();
            },
            isBusy: function(){
                if(stateControl.get() == 'takingOff' || stateControl.get() == 'landing')
                    return true;
                else
                    return false;
            },
            isFlying: function(){
                if(stateControl.get() == 'airborne')
                    return true;
                else
                    return false;
            }
    };

    Node._flightData = $flightData;
    Node.$flightState = stateControl;
    Node.$droneDispatch = $droneDispatch;

    Node.getFlightQueue = function () {
        return $flightQueue;
    };

    // fly("forward")
    // fly("forward", 500)
    // fly({ angle: 120, duration: 500});
    // TODO: rebuild into callback
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
        }else{
            return false;
        }
    }
    Node.fly = fly;

    // Initialize drone variables and connection here.
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

    // Singleton for the state control
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
            var ref  = $flightData.$ref,
                pcmd = $flightData.$pcmd;

            if (this.states.indexOf(newState) === -1){
                throw new Error("Unknown state!");
            }

            //Translate the state information into ref and pcmd object
           this.currentState = newState;
        };
       //Send our pcmd and ref packages to drone controller
        this.processDroneData = function(){
           $flightData.$udpController.ref($flightData.$ref);
           $flightData.$udpController.pcmd($flightData.$pcmd);

        };
    }

    Node._stateManager = stateManager;
})();
