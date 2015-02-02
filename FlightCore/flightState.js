/* Singleton storage of a drone data and current state
 * Iterated 2.02.2015
 * /// Lordink
 */


module.exports = (function () {

    // Allowed states:
    var states = ['off', 'takingOff', 'airborne', 'landing'],
    // The state being on right now
        currentState = 'off',
        $arDrone = null,
        $control = null,
        error    = null;

    try {
        $arDrone = require('ar-drone');
        $control = $arDrone.createUdpControl();
    } catch (err) {
        console.log(" ------------------- Ar drone flightState init  error");
        error = err;
    }



    // Will be instantiated for each object, but we have singleton, so no problem there.
    var get = function () {
        return currentState;
    };

    var set = function (newState) {
        var ref = $flightData.$ref, pcmd = $flightData.$pcmd;

        if (states.indexOf(newState) === -1) {
            throw new Error("Unknown state!");
        }

        //Translate the state information into ref and pcmd object
        currentState = newState;
    };

    var broadcast = function () {
        $control.flush();
    };

    return {
        set: set,
        get: get,
        error: error
    };
}());
