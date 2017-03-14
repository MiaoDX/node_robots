var all_pins_states = require('./server/all_pins_value.js')

var io = require('socket.io')();

var decorateIOAllPins = all_pins_states.getDecorateIOAllPins();
decorateIOAllPins(io);

io.listen(8080);