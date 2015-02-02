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
        $flightQueue = require('./FlightCore/flightQueue.js'),
        $stateManager = require('./FlightCore/stateManager.js');


    //A middleware between flight queue and drone. Uses state manager to control the situtation and make non-ambiguous decisions.
    var $droneDispatch = require('./FlightCore/flightDispatch.js');
    Node._flightData = $flightData;
    Node._stateManager = $stateManager;

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

            if(delay === undefined){
                $flightQueue.add(direction);
                return true;
            } else {
                $flightQueue.add(direction, delay);
                return true;
            }
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
    var init = function () {
        var arDrone = {},
            control = {},
            error  = null;

        try {
            arDrone = require('ar-drone');
            control = arDrone.createUdpControl();
        } catch (err) {
            console.log("------------------------------------------- _init error: " + err.message);
            error = err;
        }

        //ref object
        $flightData.$ref = {};
        $flightData.$pcmd = {};

        $flightData.$arDrone = arDrone;
        $flightData.$udpController = control;

        if(error)
            return false;

        $stateManager.refreshIntervalId = setInterval($stateManager.refreshLoop, 1000);
        return true;
    };

    Node.init = init;
})();
