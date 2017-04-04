# Six_dof platform

We want to make one 6-dof platform to perform the movements of a camera, and that's why we dig into the `johnny-five` library for such a long time.

six_dof_platform consists of 6 steppers (the one decorated with enable_pin), and can perform movements.

Now, we only provide something like:

``` js
server.get('/move/:steps_x/:steps_y/:steps_z/:steps_roll/:steps_pitch/:steps_yaw', [...])
```

In fact, that's almost all we want for an easy usage.