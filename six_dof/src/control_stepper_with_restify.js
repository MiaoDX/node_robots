// var five = require("johnny-five");
var Promise = require("bluebird");
var five = Promise.promisifyAll(require("johnny-five"));
var StepperDecorated = require("../../stepper/src/stepper_decorate");

var temporal = require("temporal");

var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'control_stepper_with_pin.js',
  streams: [
    { stream: process.stdout },
    { path: 'stepper.log'}
  ]
});


var get_pin_value = async function (pin_num) {
  return await pin_num.queryAsync();
};


var board = new five.Board();

function getDecorateServerStepper() {

  async function decorateServerStepper(server) {
    
    await board.onAsync("ready");
    console.log('board is ready');

    var enable_pin = new five.Pin({
      pin: 38,
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

    const stepper_1 = new five.Stepper({
      type: five.Stepper.TYPE.DRIVER,
      stepsPerRev: 200,
      pins: {
        step: 54,
        dir: 55
      }
    });  


    const stepper_decorate_1 = new StepperDecorated(stepper_1, enable_pin, stop_pin_1, stop_pin_2);

    temporal.loop(5000, function(loop) {
      enable_pin.query(function(state) {
        log.info('temporal enable_pin value: ', state.value);
      });
    });

    server.get('/move/:steps', async function (req, res, next) {
      var steps = parseInt(req.params.steps);

      log.info("Got move command with steps: %s, prepare to move!!", steps);

      let status = await stepper_decorate_1.async_move(steps);
      
      log.info("We got status: ", status);
      log.info("We got status: ", status.key);

      var s = status.key;
      res.send(s);
      
      next();
    });



  };

  return decorateServerStepper;
};


exports.getDecorateServerStepper = getDecorateServerStepper;