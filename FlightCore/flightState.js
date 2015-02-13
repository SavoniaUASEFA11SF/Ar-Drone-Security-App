/* Singleton storage of a drone data and current state
 * Iterated 2.02.2015
 * /// Lordink
 */


module.exports = (function () {

    // The state being on right now
    var $arDrone = null,
        $control = null,
        data     = { ref: {}, pcmd: {} },
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
        return $control;
    };

    var set = function (ref, pcmd) {
        data.ref = ref,
        data.pcmd = pcmd;

        if ($control) {
           $control.ref(data.ref);
           $control.pcmd(data.pcmd);
        } else {
            throw new Error("The control module does not exist! Darn it.");
        }
    };

    var broadcast = function () {
        $control.flush();
    };

    return {
        set: set,
        get: get,
        getData: function () {
            return data;
        },
        error: error
    };
}());
