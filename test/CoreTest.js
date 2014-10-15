"use strict";

var chai = require("chai"),
    expect = chai.expect,
    assert = chai.assert,
    should = chai.should(),
    FC = require("../FlightCore.js");

describe('Ar-Drone FlightCore module', function () {
    describe('upon initialization', function () {

        it('should have an empty flight data and flight control before initialization', function () {
            expect(FC._flightData).to.be.empty;
            expect(FC.$flightControl).to.be.empty;
        });

        it('should init without an error.', function () {
            expect(FC.init).to.not.throw(Error);
        });

        it('should have a flightQueue available as a singleton', function(){
            FC.getFlightQueue().should.be.instanceOf(FC._flightQueue);

            //Check, if it's truly a singleton (i.e. the same object, no matter how much times you call for it)
            expect(FC.getFlightQueue()).to.be.equal(FC.getFlightQueue());
        })

        //TODO beforeEach separate require core.
    });


    describe('state manager', function () {

        it('should have get/set functions', function () {
            var stateMan = new FC._stateManager;

            stateMan.should.respondTo('get');
            stateMan.should.respondTo('set');
        });

        it('should succesfully set its own state, if it exists in a set of allowed states', function () {
            var stateMan = new FC._stateManager();

            /* Iterate over every state in the array of allowed states,
             *  set it as current state and check, if get() returns the selected allowed state.
             */
            for (var i = 0; i < stateMan.states.length; i++) {
                stateMan.set(stateMan.states[i]);
                stateMan.get().should.equal(stateMan.states[i]);
            }
        });

        it('should throw an error while setting its state to the unknown state.', function () {
            var stateMan = new FC._stateManager();
            var setWrongState = function () { stateMan.set('stuff'); }

            expect(setWrongState).to.throw("Unknown state!");
        })

        it('should be running upon FlightCore init and have an "off" state', function () {
            expect(FC.$flightState).to.exist;
            expect(FC.$flightState.get()).to.equal('off');
        });
    });

    describe('drone flight queue', function () {
        var cQ;
        var takeOffCommand = {name:"Take Off", delay: 3000};
        var landCommand = {name:"Land", delay: 3000};


        beforeEach(function(done){
            //This will fail, until you actually create a _flightQueue function/class.
             cQ = new FC._flightQueue();
            done();
        });

        it('should successfully instantiate the queue and its data should be an empty array.', function () {
            expect(cQ).to.not.be.undefined;
            expect(cQ.data).to.exist;
            expect(cQ.data).to.be.empty;
        });

        it('should have an array of predefined commands, with takeoff and land commands with 3 sec delay defined.', function(){
            expect(cQ.commands).to.exist;
            cQ.commands.should.include(takeOffCommand).and.include(landCommand);
        });

        it('should have add and remove methods to add and remove commands from the current queue.', function(){
            expect(cQ).to.respondTo('add');
            expect(cQ).to.respondTo('remove');
        })

        it('would accept addition of TakeOff and Land commands, after which the commands should be in its data array', function(){
            cQ.add("Take Off");
            cQ.data.length.should.be.equal(1);
            expect(cQ.data).to.include(takeOffCommand);

            cQ.add("Land");
            cQ.data.length.should.be.equal(2);
            expect(cQ.data).to.include(landCommand);
        });

        it('should throw an error, if an unknown command is added', function(){
            var wrong = function(){ cQ.add("Stuff") };
            expect(wrong).to.throw("Unknown Command!");
        });

        it("would be able to remove the element from the queue after we added it there, and will return null if we try to remove non-existing element", function(){
            cQ.add("Take Off");
            var removed = cQ.remove("Take Off");
            expect(cQ.data).to.be.empty;
            removed.should.be.ok;

            var removedWrong = cQ.remove("Stuff");
            removedWrong.should.not.be.ok;
        });
    });
})
