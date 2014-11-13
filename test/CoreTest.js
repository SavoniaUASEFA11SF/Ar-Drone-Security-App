"use strict";

var chai = require("chai"),
    expect = chai.expect,
    assert = chai.assert,
    should = chai.should(),
    FC = require("../FlightCore.js");

describe('Ar-Drone FlightCore', function () {
    describe('upon initialization', function () {

        it('should have an empty flight data and flight control before initialization', function () {
            expect(FC._flightData).to.be.empty;
            expect(FC.$flightControl).to.be.empty;
        });

        it('should init without an error.', function () {
            expect(FC.init).to.not.throw(Error);
        });

        it('should have a flightQueue available as a singleton', function(){
            //Check, if it's truly a singleton (i.e. the same object, no matter how much times you call for it)
            expect(FC.getFlightQueue()).to.be.equal(FC.getFlightQueue());
        });

        //TODO beforeEach separate require core.
    });

    describe('Drone command facades', function(){
       describe('fly() facade', function(){

         it('should return false and not throw an error, if called with no arguments',function(){
            var fly_Empty = function(){
                return FC.fly();
            };
            expect(fly_Empty).to.not.throw(Error);
            //Just check fo false
            expect(FC.fly()).to.equal(false);
         });

          it('should accept string "Forward" as an argument and return true, as it adds to a queue.', function(){
              var fly_with_String = function(){
                FC.fly("Forward");
              };
              expect(fly_with_String).to.not.throw(Error);
              expect(FC.fly("Forward")).to.equal(true);
          });
       });
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
            var setWrongState = function () { stateMan.set('stuff'); };

            expect(setWrongState).to.throw("Unknown state!");
        });

        it('should be running upon FlightCore init and have an "off" state', function () {
            expect(FC.$flightState).to.exist;
            expect(FC.$flightState.get()).to.equal('off');
        });
    });

    describe('drone flight queue', function () {
        var cQ, 
         takeOffCommand = { name: "Take Off", type: 0, delay: 3000 },
         landCommand = { name: "Land", type: 0, delay: 3000 },
         forwardCommand = {name: "Forward", delay: -1},
         backwardsCommand = {name: "Backwards", delay: -1},
         leftCommand = {name: "Left", delay: -1},
         rightCommand = {name: "Right", delay: -1};



        beforeEach(function(done){
            cQ = require('../FlightCore/flightQueue.js');
            // Make sure the data is empty,as we can't really prevent node from caching stuff for us.
            cQ.data = [];
            done();
        });

        it('should successfully instantiate the queue and its data should be an empty array.', function () {
            expect(cQ).to.not.be.undefined;
            expect(cQ.data).to.exist;
            expect(cQ.data.length).to.be.empty;
          //  expect(cQ.data.length).to.equal(0);
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

        it('should return null, if an unknown command is added', function(){
            var wrong = function(){ return cQ.add("Stuff"); };
            expect(wrong).to.throw(Error);
        });

        it("would be able to remove the element from the queue after we added it there, and will return null if we try to remove non-existing element", function(){
            cQ.add("Take Off");
            var removed = cQ.remove("Take Off");
            expect(cQ.data).to.be.empty;
            removed.should.be.ok;

            var removedWrong = cQ.remove("Stuff");
            removedWrong.should.not.be.ok;
        });

        it('would accept addition of Forward, Backwards, Left and Right commands, after which the commands should be in its data array', function(){
            cQ.add("Forward");
            cQ.data.length.should.be.equal(1);

            cQ.add("Backwards");
            cQ.data.length.should.be.equal(2);

            cQ.add("Left");
            cQ.data.length.should.be.equal(3);

            cQ.add("Right");
            cQ.data.length.should.be.equal(4);
        });
    });
});
