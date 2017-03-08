var Promise = require("bluebird");
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var five = Promise.promisifyAll(require("johnny-five"));

var board = new five.Board({
});

// const get_pin_status = async (function (pin_num) {
//   return await (pin_num.readAsync());
// })

const get_pin_status = async (function (pin_num) {
  return await (pin_num.readAsync());
})



// The board's pins will not be accessible until
// the board has reported that it is ready

board.on("ready", function() {
  console.log("Ready!");

  var pin13 = new five.Pin(13);

  this.loop(2000, async (function(){
    
    try {
      const pin_status = await (get_pin_status(pin13));
      console.log(pin_status);
      console.log("This should after pin_status");
    }
    catch (err) {
       console.log(err.message);
    }
  }));

});
