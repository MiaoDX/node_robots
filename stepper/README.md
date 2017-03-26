Control stepper with johnny-five.


## Enable pin

Set enable_pin high to release the stepper, low to action, well, I am shocked, maybe lack proper background, See [RAMPS 1.4 test code in RAMPS_1.4 wiki](http://reprap.org/wiki/RAMPS_1.4) for reference.

And if we stop stepper by set enable pin high alone, and then put it to low, the stepper will still run (the left steps). So we make stepper back and forth one step to stop the stepper.(The johnny-five will provide nice stop function in the coming future)

## Changelog

0324.Add running_status property and use events.EventEmitter to stop the stepper by normal or limit.

0326.STOP by move stepper back and forth one step.