/**
 * Our six_dof_platform
 * Demo of use many stepper_decorate to form a platform
 * and control it via RESTful API
 */

var _ = require('lodash');


var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'six_dof_platform.js',
  streams: [
    { stream: process.stdout },
    { path: 'six_dof_platform.log'}
  ]
});

class SixDofPlatform {

    /**
     * 
     * @param {*} x_stepper 
     * [...]
     * @param {True of False to indicate whether the stepper is useable} useable_stepper 
     */
    constructor(x_stepper, y_stepper, z_stepper, roll_stepper, pitch_stepper, yaw_stepper, useable_stepper=[]) {
        log.info('Prepare to construct six_dof_platform');
        this.x_stepper = x_stepper;
        this.y_stepper = y_stepper;
        this.z_stepper = z_stepper;
        this.roll_stepper = roll_stepper;
        this.pitch_stepper = pitch_stepper;
        this.yaw_stepper = yaw_stepper;
        

        this.useable_stepper = useable_stepper;
        this.steppers = [x_stepper, y_stepper, z_stepper, roll_stepper, pitch_stepper, yaw_stepper];


        this.init(); // init platform before doing anything else
        log.info('Construct of the six_dof_platform done.');
    } // constructor




    init() {
        // make sure the steppers are correct
        for (var i of _.range(this.steppers.length) ){
            if( (this.useable_stepper[i] === true && this.steppers[i] !== null) || (this.useable_stepper[i] === false && this.steppers[i] === null) ){
                // seems right
            }
            else {
                log.warn('Seems that the stepper declared is not consistent');
            }
        };


        // possible init move



        // stop after init
        this.steppers.forEach(function(stepper) {
            if(stepper != null) {
                stepper.stop();
            }
        });
    };

    async async_move(steps_arr) {
        let move_results = await this.promise_move_many_steppers(steps_arr);
        log.info("Done moving, move_results: %s", move_results);
        return move_results;
    };

    valid_steps(steps_arr) {
        for (var i of _.range(this.steppers.length) ){
            if(this.useable_stepper[i] === false &&  steps_arr[i] !== 0 ){
                log.warn('Seems that the stepper movement is not consistent, see stepper %d for more info', i);
            }
        };
    }

    promise_move_many_steppers(steps_arr) {        
        log.info('Prepare to move with:%s ', steps_arr);

        this.valid_steps(steps_arr);
        
        var stepper_move_promises = [];
        for (var i of _.range(this.steppers.length) ) {
            if(this.useable_stepper[i]){
                stepper_move_promises.push(this.steppers[i].async_move(steps_arr[i]));
            }
        }

        return Promise.all(stepper_move_promises);
    };

    get_all_enable_pins() {
        var enable_pins = [];
        for (var i of _.range(this.steppers.length) ) {
            if(this.useable_stepper[i]){
                enable_pins.push(this.steppers[i].enable_pin);
            }
        }

        return enable_pins;
    }


};

module.exports = SixDofPlatform;