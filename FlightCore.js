//Ar drone flight logic core
//5.10.2014
///Lordink

/*
 * @property notation specifics:
 * _ (underscore) for the beginning of inner function and objects, exposed for testing
 * $ for public-intended variables
 * ///Lordink
 */


module.exports = (function () {

    //Internal flight controlling methods
    var $flightData     = {},
        $flightQueue    = require('./FlightCore/flightQueue.js'),
        $flightDispatch = require('./FlightCore/flightDispatch.js'),
        $flightState   = require('./FlightCore/flightState.js');

    // fly("forward")
    // fly("forward", 500)
    // fly({ angle: 120, duration: 500});
    // TODO: rebuild into callback
    var fly = function (direction, delay) {

        if (typeof direction === "string") {

            if ((direction !== "Forward") && (direction !== "Backwards") && (direction != "Left") && (direction != "Right")) {
                return false;
            }

            if (delay === undefined)
                $flightQueue.add(direction);
            else
                $flightQueue.add(direction, delay);
            return true;
        }

        //TODO: check the fact that angle and duration do exist! Otherwise, you get a thow TypeError, which is not what we want.

        if (!isNaN(direction.angle) && !isNaN(direction.duration)) {

            $flightQueue.add("Custom Direction", direction);
            return true;

        } else {
            return false;
        }
    };

    // Initialize drone variables and connection here.
    var init = function () {
        var arDrone = {},
            control = {},
            error = null;

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

        if (error)
            return false;

        $stateManager.refreshIntervalId = setInterval($stateManager.refreshLoop, 1000);
        return true;
    };

    Node._flightState = $flightState;
    Node.init = init;
    Node.fly = fly;

    Node.getFlightQueue = function () {
        return $flightQueue;
    };

    return {
        fly: fly,
        init: init,
        // For unit-testing purposes only:
        $flightQueue: $flightQueue,
        $flightDispatch: $flightDispatch,
        $flightState: $flightState
    };
})();
