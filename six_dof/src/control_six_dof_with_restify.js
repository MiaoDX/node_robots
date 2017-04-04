var Promise = require("bluebird");
var five = Promise.promisifyAll(require("johnny-five"));

var StepperDecorated = require("../../stepper/src/stepper_decorate");
var SixDofPlatform = require("./six_dof_platform");

var temporal = require("temporal");

var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'control_stepper_with_pin.js',
  streams: [
    { stream: process.stdout },
    { path: 'stepper.log'}
  ]
});


var board = new five.Board();

var assemble_six_dof_platform = function () {
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

    var enable_pin_x = new five.Pin({
      pin: 38,
      type: "digital",
      mode: five.Pin.OUTPUT
    });

    var enable_pin_y = new five.Pin({
      pin: 56,
      type: "digital",
      mode: five.Pin.OUTPUT
    });

    var enable_pin_z = new five.Pin({
      pin: 62,
      type: "digital",
      mode: five.Pin.OUTPUT
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

    const stepper_x = new five.Stepper({
      type: five.Stepper.TYPE.DRIVER,
      stepsPerRev: 200,
      pins: {
        step: 54,
        dir: 55
      }
    });  

    const stepper_y = new five.Stepper({
      type: five.Stepper.TYPE.DRIVER,
      stepsPerRev: 200,
      pins: {
        step: 60,
        dir: 61
      }
    });  

    const stepper_z = new five.Stepper({
      type: five.Stepper.TYPE.DRIVER,
      stepsPerRev: 200,
      pins: {
        step: 46,
        dir: 48
      }
    });  


    const stepper_decorate_x = new StepperDecorated(stepper_x, enable_pin_x, stop_pin_1, stop_pin_2, 'stepper_x');
    const stepper_decorate_y = new StepperDecorated(stepper_y, enable_pin_y, stop_pin_1, stop_pin_2, 'stepper_y');
    const stepper_decorate_z = new StepperDecorated(stepper_z, enable_pin_z, stop_pin_1, stop_pin_2, 'stepper_z');

    var useable_stepper = [true, true, true, false, false, false];
    const six_dof_platform = new SixDofPlatform(stepper_decorate_x, stepper_decorate_y, stepper_decorate_z, null, null, null, useable_stepper);

    return six_dof_platform;
};




var move_steps = function(req) {

  var steps_x = parseInt(req.params.steps_x);
  var steps_y = parseInt(req.params.steps_y);
  var steps_z = parseInt(req.params.steps_z);
  var steps_roll = parseInt(req.params.steps_roll);
  var steps_pitch = parseInt(req.params.steps_pitch);
  var steps_yaw = parseInt(req.params.steps_yaw);

  var move_steps_arr = [steps_x, steps_y, steps_z, steps_roll, steps_pitch, steps_yaw];

  return move_steps_arr;
}



function getDecorateSixDofPlatform() {

  async function decorateSixDofPlatform(server) {
    
    await board.onAsync("ready");
    console.log('board is ready');

    var six_dof_platform = assemble_six_dof_platform();
    var all_enable_pins = six_dof_platform.get_all_enable_pins();

    temporal.loop(5000, function(loop) {
      all_enable_pins.forEach(enable_pin => {
        enable_pin.query(function(state) {
        log.info('temporal enable_pin:%s, value:%s', enable_pin.pin,  state.value);
      });
      });
    });


    server.get('/move/:steps_x/:steps_y/:steps_z/:steps_roll/:steps_pitch/:steps_yaw', async function (req, res, next) {

      var move_steps_arr = move_steps(req);
      log.info("Got move command with steps: %s, prepare to move!!", move_steps_arr);

      var move_results = await six_dof_platform.async_move(move_steps_arr);
      res.send(move_results);

      next();
    });
  };

  return decorateSixDofPlatform;
};


exports.getDecorateSixDofPlatform = getDecorateSixDofPlatform;