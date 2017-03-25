var Enum = require('enum');
var events = require('events'); 
let stepper_status = new Enum(['RUNNING', 'NORMAL_STOP', 'LIMIT_STOP']);

class StepperDecorated {
    constructor(stepper, enable_pin, stop_pin_1, stop_pin_2) {
        console.log('Prepare to construct the decorated stepper');
        this.stepper = stepper;
        this.enable_pin = enable_pin;
        this.stop_pin_1 = stop_pin_1;
        this.stop_pin_2 = stop_pin_2;
        
        // we use status and one status_emitter to return RUNNING status after one success movement or a out-of-limit one.
        this.status = stepper_status.NORMAL_STOP;
        this.status_emitter = new events.EventEmitter();

        console.log('Construct the decorated stepper done, info');

        this.stop(); // stop when constructor finished
    }

    /**
     * set enable_pin high to release the stepper, while, it's the case
     * See, [RAMPS 1.4 test code in RAMPS_1.4 wiki](http://reprap.org/wiki/RAMPS_1.4)
     *
     * 
     * The boundary case is stepper stopped by LIMIT but we resend a move command, just failed to action.
     * So, the stop should be move 1 step and back 1 step. [SURELY UGLY]
     */
    stop(emitter_status = stepper_status.NORMAL_STOP) { // default status is NORMAL_STOP
        var that = this;
        console.log("STOP BY STATUS: ", emitter_status.key);
        that.status = emitter_status;

        that.stepper.rpm(180).ccw().step(1, function() {
            that.stepper.cw().step(1, function() {
                console.log("Done moving CCW AND CW to make a stop");
                that.enable_pin.high();
            });
        });
    }

    trigger_stop_by_limit(stop_pin_num) {
        console.log("STOP BY LIMIT, STOP_PIN: ", stop_pin_num);
        this.status_emitter.emit('limit_stop_emitter');
    }

    start() {
        this.status = stepper_status.RUNNING;
        this.enable_pin.low();
    }

    move(steps) {
        this.start(); // start first

        var direction = steps >= 0?1:0;
        steps = Math.abs(steps);

        this.stepper.rpm(180).direction(direction).accel(1000).decel(1000).step(steps, function() {
            console.log("Done moving");
            this.stop();
        });
    }


    async async_move(steps) {
        var that = this;
        let status = await this.promise_move_resolve_status(steps);
        that.stop(status);
        console.log("Done moving, now status: ", that.status.key);
        return status;
    };

    promise_move(steps) {
        var that = this;
        return new Promise((resolve, reject) => {
            this.promise_move_resolve_status(steps)
            .then(status => {
                that.stop(status);
                resolve(status);
            });
        });
    };


    promise_move_resolve_status(steps) {
        var that = this;
        
        that.start(); // start first
        var direction = steps >= 0?1:0;
        steps = Math.abs(steps);

        return new Promise((resolve, reject) => {
            this.stepper.rpm(180).direction(direction).accel(1000).decel(1000).step(steps, function() {
                // this.normal_stop(); // chances are that this will stop stepper at a unsure time, so stop when status_emitter triggered
                resolve(stepper_status.NORMAL_STOP);
            });

            //emitter can only be triggered by limit
            that.status_emitter.once('limit_stop_emitter', () => {
                resolve(stepper_status.LIMIT_STOP);
            });

        });
    };

}

module.exports = StepperDecorated;