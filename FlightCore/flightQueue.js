// Flight queue singletone, handling command order and criticality, if u may.

module.exports = (function () {

    var flightQueue = function () {
        // All the commands currently in the queue
        this.data = [];
        // Dispatch object
        this.dispatch = null;
        // comman types:x
        // @type 0 - essential command. Affects the whole
        // @type 1 -  direction command. Is supposed to have angle variable.
        // @type 2 -  turn command. Is supposed to have angle variable, commanded manually.
        this.commands = [
            { name: "Take Off", type: 0, delay: 3000 },
            { name: "Land", type: 0, delay: 3000 },
            { name: "Turn", type: 2, delay: 1000}, // ???
            { name: "Forward", type: 1, angle: 0, delay: -1},
            { name: "Backward", type: 1, angle: 180, delay: -1},
            { name: "Left", type: 1, angle: 270, delay: -1},
            { name: "Right", type: 1, angle: 90, delay: -1}
        ];

        this.init = function (dispatch) {
            if (dispatch !== undefined)
                this.dispatch = dispatch;
            else
                throw new Error('Tried to init flightQueue with no dispatch object!');
        };

        // An outer access point for the queue. Add new command to the queue and let it handle the stuff.
        this.add = function (commandName, delay) {
            var foundCommand = false;

            for (var i = 0; i < this.commands.length; i++) {
                // if we found a command in the commands list
                if (this.commands[i].name == commandName) {
                    // if it supplies a custom delay
                    if (delay !== undefined)
                        this.data.push({ name: commandName, delay: delay }); else  // if it doesn't, just push it to the commands array.
                        this.data.push(this.commands[i]);
                    foundCommand = true;
                    break;
                }
            }
            if (!foundCommand) {
                throw new Error('Unknown Command!');
            } else {
                // if the drone is already busy, then, well,
                // we just leave and hope that callback will be there for us. Right?
                // If our command is urgent, let's force send it anyway.
                if (this.dispatch)
                    if ((!$droneDispatch.isBusy()) || (this.data[0].type === 0))
                        this.processCommand(); else
                        console.log('Well, we added stuff to the unInited flightQueue. Good for us, right.');
            }

        };

        this.processCommand = function () {
            var that = this;

            // do stuff after time.
            $droneDispatch.process(this.data[0], function (executedCommand) {
                // If for some fucked up reason we now have different command
                // as our first-to-go command, throw up about that.
                if (executedCommand !== this.data[0])
                    throw new Error("Queue modified/deleted while processing command!");
                // If not, just shift the shit out of it, and process next command if there is any.
                that.data.shift();
                if (data.length > 0)
                    that.processCommand();
            });
        };

        this.remove = function (commandName) {
            var foundCommand = false;
            for (var i = 0; i < this.commands.length; i++) {
                if (this.commands[i].name == commandName) {
                    this.data.splice(i, 1);
                    foundCommand = true;
                    break;
                }
            }
            if (!foundCommand)
                return false;
            else
                return true;
        };
    };


    // returning singletone
    return new flightQueue();
}());

