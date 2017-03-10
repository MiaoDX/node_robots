// require("babel-core/register");
// var Promise = require("bluebird");

// var five = Promise.promisifyAll(require("johnny-five"));

// var board = new five.Board({
// });

class StepperDecorated {
    constructor(stepper, enable_pin, stop_pin_1, stop_pin_2) {
        this.stepper = stepper;
        this.enable_pin = enable_pin;
        this.stop_pin_1 = stop_pin_1;
        this.stop_pin_2 = stop_pin_2;
    }

    stop() {
        console.log("Move to the board, just stop!");
        this.enable_pin.low();
        // this.stepper.pins.dir.low();
        // this.stepper.pins.step.low();
    }

    start() {
        console.log("Prepare to start the stepper");
        this.enable_pin.high();
    }

    move(steps) {
        if(steps > 0){
            this.stepper.rpm(180).cw().accel(1000).decel(1000).step(steps, function() {
                console.log("Done moving");
            });
        }
        else {
            this.stepper.rpm(180).ccw().accel(1000).decel(1000).step(-steps, function() {
                console.log("Done moving");
            });
        }
        
    }


    hello() {
        alert('Hello, ' + this.name + '!');
    }
}

module.exports = StepperDecorated;