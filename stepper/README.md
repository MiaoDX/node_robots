Control stepper with johnny-five.


## First of all.

Set enable_pin high to release the stepper, low to action, well, I am shocked, maybe lack proper background, See [RAMPS 1.4 test code in RAMPS_1.4 wiki](http://reprap.org/wiki/RAMPS_1.4) for reference.

## Changelog

0324. Add running_status property and use events.EventEmitter to stop the stepper by normal or limit.