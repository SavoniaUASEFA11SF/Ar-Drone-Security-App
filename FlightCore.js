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
    var $flightControl = {}, //All the data stream about current drone operations
        $flightData = {},
        stateControl = new stateManager('off'),
        flightQueue = new flightQueue;

    Node._flightData = $flightData;
    Node.$flightControl = $flightControl;
    Node.$flightState = stateControl;

    Node.getFlightQueue = function () {
        return flightQueue;
    };

    //Initialize drone variables and connection here.
    function init() {
        var arDrone = {}, control = {};
        try {
            arDrone = require('ar-drone');
            control = arDrone.createUdpControl();
        } catch (err) {
            console.log(" _init error: " + err.message);
        }

        //ref object
        $flightData.$ref = {};
        $flightData.$pcmd = {};

        $flightControl.$arDrone = arDrone;
        $flightControl.$udpController = control;
    }

    Node.init = init;

    //Singleton for the state control
    function stateManager(state) {

        //Allowed states:
        this.states = ['off', 'takingOff', 'airborne', 'landing'];

        if (state === undefined || (this.states.indexOf(state) === -1))
            state = 'off'; else
            this.currentState = state;
        ///Will be instantiated for each object, but we have singleton, so no problem there.
        this.get = function () {
            return this.currentState;
        };
        this.set = function (newState) {
            if (this.states.indexOf(newState) !== -1)
                this.currentState = newState; else
                throw new Error("Unknown state!");
        };
    }

    Node._stateManager = stateManager;

    function flightQueue() {
        this.data = [];
        this.commands = [
            { name: "Take Off", delay: 3000 },
            { name: "Land",     delay: 3000 }
        ];
        this.add = function (commandName) {

            for (var i = 0; i < this.commands.length; i++) {
                if (this.commands[i].name == commandName) {
                    this.data.push(this.commands[i]);
                    break;
                }
            }
        }

        this.remove = function (commandName) {
            for (var i = 0; i < this.commands.length; i++) {
                if (this.commands[i].name == commandName) {
                    this.data.splice(i, 1);
                    break;
                }
            }
        }

    };

    Node._flightQueue = flightQueue;

})();
