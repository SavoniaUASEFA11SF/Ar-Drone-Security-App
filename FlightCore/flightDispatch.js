/* A middleware for dispatching the drone commands from flightQueue to the drone
 * Iterated 30.01.2015
 * /// Lordink
 */

module.exports = (function () {


    var flightState = require("./flightState.js"),
        flightQueue = require("./flightQueue.js"),

        init = function (conf) {
            if (flightState.error)
                return flightState.error;

            setInterval(this.process, conf.dispatchProcessRate);
            return null;
        },

        process = function () {

        },

        isBusy = function () {
            if (flightState.get() == 'takingOff' || flightState.get() == 'landing')
                return true;
            else
                return false;
        },

        isFlying = function () {
            if (flightState.get() == 'airborne')
                return true;
            else
                return false;
        };

    return {
        isBusy  : isBusy,
        isFlying: isFlying,
        init    : init
    };

}());
