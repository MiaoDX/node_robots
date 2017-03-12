// require("babel-core/register");
// var Promise = require("bluebird");

// var five = Promise.promisifyAll(require("johnny-five"));

// var board = new five.Board({
// });

class StepperDecorated {
    constructor(stepper, enable_pin, stop_pin_1, stop_pin_2) {
        console.log('Prepare to construct the decorated stepper');
        this.stepper = stepper;
        this.enable_pin = enable_pin;
        this.stop_pin_1 = stop_pin_1;
        this.stop_pin_2 = stop_pin_2;
        console.log('Construct the decorated stepper done, info');


        this.stop(); // stop when constructor finished
    }

    /**
     * set enable_pin high to release the stepper, while, it's the case
     * See, [RAMPS 1.4 test code in RAMPS_1.4 wiki](http://reprap.org/wiki/RAMPS_1.4)
     */
    stop() {
        this.enable_pin.high(); 
    }

    start() {
        this.enable_pin.low();
    }

    move(steps) {
        
        this.start(); // start first

        if(steps > 0){
            this.stepper.rpm(180).cw().accel(1000).decel(1000).step(steps, function() {
                console.log("Done moving");
                this.stop();
            });
        }
        else {
            this.stepper.rpm(180).ccw().accel(1000).decel(1000).step(-steps, function() {
                console.log("Done moving");
                this.stop();
            });
        }
        
    }


    hello() {
        alert('Hello, ' + this.name + '!');
    }
}

module.exports = StepperDecorated;