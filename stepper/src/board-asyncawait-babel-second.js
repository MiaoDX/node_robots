/*
Try to use babel and make a cleaner way to promisify the functions.
$ babel src/board-asyncawait-babel-second.js -o dist/board-asyncawait-babel-second.js
$ node dist/board-asyncawait-babel-second.js
*/

require("babel-core/register");
var Promise = require("bluebird");

var five = Promise.promisifyAll(require("johnny-five"));

var board = new five.Board({
});

const get_pin_status = (async function (pin_num) {
  return await (pin_num.readAsync());
})

board.on("ready", function() {
  console.log("Ready!");

  var pin13 = new five.Pin(13);

  this.loop(1000, async function(){

    try {
      const pin_status = await get_pin_status(pin13);
      console.log(pin_status);
      console.log("This should after pin_status");
    }
    catch (err) {
        console.log(err.message);
    }

  });

}); // board






