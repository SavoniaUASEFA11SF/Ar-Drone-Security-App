/* A middleware for dispatching the drone commands from flightQueue to the drone
 * Iterated 30.01.2015
 * /// Lordink
 */

module.exports = (function () {

    var flightDispatch = function () {

        this.stateManager = null;

        this.init = function (stateManager) {
            if (stateManager !== undefined)
                this.stateManager = stateManager; else
                throw new Error('Tried to init flightDispatch without stateManager');
        };

        this.process = function (command, callback) {
            //TODO.
            // Logic for processing the fact that first we have to get into air
            // Or fly straight on.
            callback();
        };

        this.isBusy = function () {
            if (this.stateManager.get() == 'takingOff' || this.stateManager.get() == 'landing')
                return true; else
                return false;
        };

        this.isFlying = function () {
            if (this.stateManager.get() == 'airborne')
                return true; else
                return false;
        };
    };

    return new flightDispatch();

}());
