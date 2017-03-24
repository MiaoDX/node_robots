// var five = require("johnny-five");
var Promise = require("bluebird");
var five = Promise.promisifyAll(require("johnny-five"));
var StepperDecorated = require("./stepper_decorate");

var temporal = require("temporal");


var ready_to_stop = function (stepper_decorate) {
  const stop_pin_1 = stepper_decorate.stop_pin_1;
  const stop_pin_2 = stepper_decorate.stop_pin_2;

  [stop_pin_1, stop_pin_2].forEach(pin_num => {
    pin_num.on("high", _=> {
      console.log("pin ", pin_num.addr, "is high!!");
    })
  })

}


new five.Board().on("ready", function() {
  const test_move_pin = new five.Pin({
    pin: 3,
    type: "digital",
    mode: five.Pin.INPUT
  });

  const stop_pin_1 = new five.Pin({
    pin: 5,
    type: "digital",
    mode: five.Pin.INPUT
  });

  const stop_pin_2 = new five.Pin({
    pin: 6,
    type: "digital",
    mode: five.Pin.INPUT
  });

  var enable_pin = new five.Pin({
    pin: 30,
    type: "digital",
    mode: five.Pin.OUTPUT
  });
  
  const stepper_1 = new five.Stepper({
    type: five.Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: 36,
      dir: 34
    }
  });  

  const stepper_decorate_1 = new StepperDecorated(stepper_1, enable_pin, stop_pin_1, stop_pin_2);

  // pin 3
  test_move_pin.on("high", async function() {
    console.log("Test move is high, prepare to move!!");
    
    // stepper_decorate_1.move(20000);
    
    // await stepper_decorate_1.async_move(20000);
    
    stepper_decorate_1.promise_move(20000)
    .then(status => {
      console.log("We got status: ", status);
    })
    .catch(e => {
      console.log("Something wrong, ", e);
    })
  });


  // pin 5
  stop_pin_1.on("high", function() {
    console.log("Stop pin is high, Just stop!!");
    stepper_decorate_1.stop(stop_pin_1.pin);
    console.log("Stop Done!!");
  });

  // pin6`
  stop_pin_2.on("high", function() {
    console.log("Limit STOP PIN IS HIGH!");
    stepper_decorate_1.trigger_stop_by_limit(stop_pin_2.pin);
    console.log("Stop Done!!");
  });


  temporal.loop(8000, function(loop) {
    enable_pin.query(function(state) {
      console.log('temporal enable_pin value: ', state.value);
    });
  });
});
