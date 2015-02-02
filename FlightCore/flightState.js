/* Singleton storage of a drone data and current state
 * Iterated 30.01.2015
 * /// Lordink
 */


module.exports = (function () {

    var flightState = function () {

        // Allowed states:
        this.states = ['off', 'takingOff', 'airborne', 'landing'];
        // The state being on right now
        this.currentState = 'off';


        // Will be instantiated for each object, but we have singleton, so no problem there.
        this.get = function () {
            return this.currentState;
        };

        this.set = function (newState) {
            var ref = $flightData.$ref, pcmd = $flightData.$pcmd;

            if (this.states.indexOf(newState) === -1) {
                throw new Error("Unknown state!");
            }

            //Translate the state information into ref and pcmd object
            this.currentState = newState;
        };
    }


    return new flightState();
}());
