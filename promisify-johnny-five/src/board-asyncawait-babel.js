/*
Try to use babel and make a cleaner way to promisify the functions.
$ babel src/board-babel-asyncawait.js -o dist/board-babel-asyncawait.js
$ node dist/board-babel-asyncawait.js
*/

require("babel-core/register");
var Promise = require("bluebird");

var five = Promise.promisifyAll(require("johnny-five"));

var board = new five.Board({
});


board.on("ready", function() {
  console.log("Ready!");

  var pin13 = new five.Pin(13);

  this.loop(1000, async function(){

    try {
      const pin_status = await pin13.readAsync();
      console.log(pin_status);
      console.log("This should after pin_status");
    }
    catch (err) {
        console.log(err.message);
    }
  });

}); // board






