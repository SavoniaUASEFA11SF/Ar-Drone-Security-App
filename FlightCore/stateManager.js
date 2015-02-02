module.exports = (function() {

    var stateManager = function () {
      
      //Allowed states:
      this.states = ['off', 'takingOff', 'airborne', 'landing'];
      //The state to be executed
      this.currentState = 'off';
      //future container for the refresh interval id, which is needed to stop the refresh loop
      this.refreshIntervalId = null;

      ///Will be instantiated for each object, but we have singleton, so no problem there.
      this.get = function () {
          return this.currentState;
      };
      this.set = function (newState) {
         // var ref  = $flightData.$ref,
         //    pcmd = $flightData.$pcmd;

          if (this.states.indexOf(newState) === -1){
              throw new Error("Unknown state!");
          }

          //Translate the state information into ref and pcmd object
         this.currentState = newState;
      };
    };


    return new stateManager();
}());
