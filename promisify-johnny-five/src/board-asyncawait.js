/**
 * Use `asyncawait` lib to read pin value asynchronously
 * And get promise return value with `await`
 */

var Promise = require("bluebird");
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var five = Promise.promisifyAll(require("johnny-five"));

var board = new five.Board({
});


const get_pin_value = async (function (pin_num) {
  return await (pin_num.readAsync());
})



// The board's pins will not be accessible until
// the board has reported that it is ready

board.on("ready", function() {
  console.log("Ready!");

  var pin13 = new five.Pin(13);

  this.loop(2000, async (function(){
    try {
      const pin_value = await (get_pin_value(pin13));
      console.log(pin_value);
      console.log("This should after pin_value");
    }
    catch (err) {
       console.log(err.message);
    }
  }));

});
