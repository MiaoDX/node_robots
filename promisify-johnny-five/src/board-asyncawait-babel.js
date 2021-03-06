/**
 * Use babel to translate read pin value asynchronously with ES7 async/await
 * And get promise return value with `await`
 */

/*
Try to use babel and make a cleaner way to promisify the functions.
$ babel src/board-asyncawait-babel.js -o dist/board-asyncawait-babel.js
$ node dist/board-asyncawait-babel.js

OR JUST EMBRACE `async` with nodejs 7.x

$ node --harmony src/board-asyncawait-babel.js // notice the difference that we do not need `babel` to translate the js file.

*/

require("babel-core/register"); // when use nodejs 7.x and `--harmony` switch, we do need to include this.
var Promise = require("bluebird");

var five = Promise.promisifyAll(require("johnny-five"));

var board = new five.Board({
});

var get_pin_value = async function (pin_num) {
  return await pin_num.readAsync();
};


board.on("ready", function() {
  console.log("Ready!");

  var pin13 = new five.Pin(13);

  this.loop(1000, async function(){

    try {
      const pin_value = await get_pin_value(pin13);
      console.log(pin_value);
      console.log("This should after pin_value");
    }
    catch (err) {
        console.log(err.message);
    }


  });

}); // board





