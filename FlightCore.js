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
   var  $flightQueue    = require('./FlightCore/flightQueue.js'),
        $flightDispatch = require('./FlightCore/flightDispatch.js'),
        $flightState   = require('./FlightCore/flightState.js'),
        conf = {
            dispatchProcessRate: 100 // ms
        };

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
        } else if (typeof direction === "object") {

            $flightQueue.add("Custom Direction", direction);
            return true;
        } else {
            return false;
        }
    };

    // Initialize drone variables and connection here.
    var init = function () {

        return $flightDispatch.init( { dispatchProcessRate: 100 });

    };

    var getFlightQueue = function () {
        return $flightQueue;
    };

    return {
        fly: fly,
        init: init,
        // For unit-testing purposes only:
        $flightDispatch: $flightDispatch,
        $flightState: $flightState,
        getFlightQueue: getFlightQueue
    };
})();
