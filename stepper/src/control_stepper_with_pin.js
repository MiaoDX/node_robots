// var five = require("johnny-five");
var Promise = require("bluebird");
var five = Promise.promisifyAll(require("johnny-five"));
var StepperDecorated = require("./stepper_decorate");

var temporal = require("temporal");


var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'control_stepper_with_pin.js',
  streams: [
    { stream: process.stdout },
    { path: 'stepper.log'}
  ]
});


var ready_to_stop = function (stepper_decorate) {
  const stop_pin_1 = stepper_decorate.stop_pin_1;
  const stop_pin_2 = stepper_decorate.stop_pin_2;

  [stop_pin_1, stop_pin_2].forEach(pin_num => {
    pin_num.on("high", _=> {
      log.info("pin ", pin_num.addr, "is high!!");
    })
  })

}


new five.Board().on("ready", function() {
  const test_move_pin = new five.Pin({
    pin: 3,
    type: "digital",
    mode: five.Pin.INPUT
  });
  
  const test_enable_pin = new five.Pin({
    pin: 4,
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
    pin: 38,
    type: "digital",
    mode: five.Pin.OUTPUT
  });
  

  /**
  #define X_STEP_PIN         54
  #define X_DIR_PIN          55
  #define X_ENABLE_PIN       38
  #define X_MIN_PIN           3
  #define X_MAX_PIN           2

  #define Y_STEP_PIN         60
  #define Y_DIR_PIN          61
  #define Y_ENABLE_PIN       56
  #define Y_MIN_PIN          14
  #define Y_MAX_PIN          15

  #define Z_STEP_PIN         46
  #define Z_DIR_PIN          48
  #define Z_ENABLE_PIN       62
  #define Z_MIN_PIN          18
  #define Z_MAX_PIN          19
   */

  const stepper_1 = new five.Stepper({
    type: five.Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: 54,
      dir: 55
    }
  });  

  const stepper_decorate_1 = new StepperDecorated(stepper_1, enable_pin, stop_pin_1, stop_pin_2);

  // pin 3
  test_move_pin.on("high", async function() {
    log.info("Test move is high, prepare to move!!");
    
    // stepper_decorate_1.move(20000);
    
    let status = await stepper_decorate_1.async_move(2000);
    log.info("We got status: ", status);
    
    // stepper_decorate_1.promise_move(4000)
    // .then(status => {
    //   log.info("We got status: ", status);
    // })
    // .catch(e => {
    //   log.info("Something wrong, ", e);
    // })

  });


  // pin 4
  test_enable_pin.on("high", function() {
    log.info("Enable the enable_pin");
    // stepper_decorate_1.stop();
    enable_pin.low();
    log.info("Enable_pin enabled !!");
  });



  // pin 5
  stop_pin_1.on("high", function() {
    log.info("Stop pin is high, Just stop!!");
    stepper_decorate_1.stop();
    log.info("Stop Done!!");
  });

  // pin6
  stop_pin_2.on("high", function() {
    log.info("Limit STOP PIN IS HIGH!");
    stepper_decorate_1.trigger_stop_by_limit(stop_pin_2.pin);
    log.info("Stop Done!!");
  });


  temporal.loop(8000, function(loop) {
    enable_pin.query(function(state) {
      log.info('temporal enable_pin value: ', state.value);
    });
  });
});
