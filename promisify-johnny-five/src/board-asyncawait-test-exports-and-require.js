/**
 * Test we can use `require` to call the promisified methods
 */

var board_asyncawait = require('./board-asyncawait-many-pins.js');

// var Promise = require("bluebird");
var async = require('asyncawait/async');
var await = require('asyncawait/await');

// var five = Promise.promisifyAll(require("johnny-five"));
var five = require("johnny-five");
var board = new five.Board({
});

// The board's pins will not be accessible until
// the board has reported that it is ready

board.on("ready", function() {
  console.log("Ready!");


  var pins_num = [2,3,4,5,6,7,8,9];
  var pins = [];
  
  pins_num.forEach(num => {
    pins.push(new five.Pin(num));
  })

  this.loop(1000, async (function(){

    let pins_value_promise = board_asyncawait.get_pins_value(pins);

    try {
      const pins_value = await (Promise.all(pins_value_promise));
      console.log(pins_value);
      console.log("This should after pins_value");
    }
    catch (err) {
       console.log(err.message);
    }

  }));

});