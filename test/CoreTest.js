"use strict";

var  chai   = require("chai"),
    expect = chai.expect,
    assert = chai.assert,
    should = chai.should(),
    FC     = require("../FlightCore.js");

describe('Ar-Drone FlightCore module', function(){
    describe('upon initialization', function(){

        it('should have an empty flight data and flight control before initialization', function(){
            expect(FC._flightData).to.be.empty;
            expect(FC.$flightControl).to.be.empty;
        });

        it('should init without an error.', function(){
            expect(FC.init).to.not.throw(Error);
        });

        //TODO beforeEach separate require core.
    });


    describe('state manager', function(){

        it('should have get/set functions', function(){
            var stateMan = new FC._stateManager();

            stateMan.should.respondTo('get');
            stateMan.should.respondTo('set');
        });

        it('should succesfully set its own state, if it exists in a set of allowed states', function(){
            var stateMan = new FC._stateManager();

            /* Iterate over every state in the array of allowed states,
            *  set it as current state and check, if get() returns the selected allowed state.
            */
            for(var i = 0; i < stateMan.states.length; i++){
                stateMan.set(stateMan.states[i]);
                stateMan.get().should.equal(stateMan.states[i]);
            }
        });

        it('should throw an error while setting its state to the unknown state.', function(){
            var stateMan = new FC._stateManager();
            var setWrongState = function(){ stateMan.set('stuff'); }

            expect(setWrongState).to.throw("Unknown state!");
        })

        it('should be running upon FlightCore init and have an "off" state', function(){
            expect(FC.$flightState).to.exist;
            expect(FC.$flightState.get()).to.equal('off');
        });
    });

    describe('drone flight queue', function(){
      it('should successfully instantiate the queue and its data should be an empty array.',function(){
        var cQ = new FC._flightQueue();
        expect(cQ).to.not.be.undefined;
        expect(cQ.data).to.be.empty;
      });
    });
})
