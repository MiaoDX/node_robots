/**
 * Use `asyncawait` lib to read pin value asynchronously, and more, read many pins value.
 * And get promise return value with `await`
 * More, we exports the get_pins_value to be used in other file.
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

const get_pins_value = function (pins) {
    pins_value_promise = [];
    pins.forEach(pin => {
      pins_value_promise.push(get_pin_value(pin));
    })
    return pins_value_promise;
}


// The board's pins will not be accessible until
// the board has reported that it is ready

board.on("ready", function() {
  console.log("Ready!");


  var pins_num = [2,2,2,3]; // We even can access to same pin more than once!! Pretty useful since we may want to listen to this pin value change while doing other stuff.
  var pins = [];
  
  pins_num.forEach(num => {
    pins.push(new five.Pin(num));
  })

  this.loop(1000, async (function(){

    let pins_value_promise = get_pins_value(pins);

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

exports.get_pin_value = get_pin_value;
exports.get_pins_value = get_pins_value;