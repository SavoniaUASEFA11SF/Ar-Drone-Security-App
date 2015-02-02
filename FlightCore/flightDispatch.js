/* A middleware for dispatching the drone commands from flightQueue to the drone
 * Iterated 30.01.2015
 * /// Lordink
 */

module.exports = (function () {

    var flightDispatch = function () {

        this.flightState = require("./flightState.js");
        this.flightQueue = null;

        this.init = function ( flightQueue, conf ) {
           this.flightQueue = flightQueue;

           setInterval(this.process, conf.dispatchProcessRate);
        };

        this.process = function () {

        };

        this.isBusy = function () {
            if (this.flightState.get() == 'takingOff' || this.flightState.get() == 'landing')
                return true; 
            else
                return false;
        };

        this.isFlying = function () {
            if (this.flightState.get() == 'airborne')
                return true; 
            else
                return false;
        };
    };

    return new flightDispatch();

}());
