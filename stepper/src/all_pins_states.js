var five = require("johnny-five");
var _ = require('lodash');

var monitor_all_pins = function (pin_arr) {
  pin_arr.forEach(pin => {
    ["high", "low"].forEach(function(type) {
      pin.on(type, function() {
        console.log("Circuit Event: ", type, " on pin ", pin.addr);
      });
    });// high low forEach 
  });//pins.forEach
}


var pin_arr = function () {
    nums = _.range(50)
    pin_arr = []
    nums.forEach(num => {
        var tmp_pin = new five.Pin({
            pin: num,
            // type: "digital",
            mode: five.Pin.INPUT
        });
        pin_arr.push(tmp_pin)
    })
    return pin_arr
}

var pins_state = function (pin_arr) {

}


new five.Board().on("ready", function() {
    pin_arr = pin_arr();

    pin_arr.forEach(pin => {
        console.log(pin.addr);
    });



    pin_arr[5].query(function(state) {
        console.log(state);
        // pin_arr[5].low();
    });


    monitor_all_pins(pin_arr);
/*
    ["high", "low"].forEach(function(type) {
      pin_arr[5].on(type, function() {
        console.log("Circuit Event: ", type, " on pin 5");
      });
    });// high low forEach 
*/
    // monitor_all_pins(pin_arr)
})