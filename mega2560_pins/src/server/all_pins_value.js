var five = require("johnny-five");
var _ = require('lodash');


var board = new five.Board();

var monitor_all_pins = function (pin_arr, socket) {
  pin_arr.forEach(pin => {
    ["high", "low"].forEach(function(type) {
      pin.on(type, function() {
        let change_pin_value = {
            addr: pin.addr,
            type: type,
        };
        console.log(change_pin_value, 'ready to send to client');
        socket.emit('pin_value_change', change_pin_value);
      });
    });// high low forEach 
  });//pins.forEach
};


var pin_arr = function () {
    digital_nums = _.range(54);
    analog_nums = _.range(16);

    pin_arr = []
    digital_nums.forEach(num => {
        var tmp_pin = new five.Pin({
            pin: num,
            // type: "digital",
            mode: five.Pin.INPUT
        });
        pin_arr.push(tmp_pin)
    });

    analog_nums.forEach(num => {
        var tmp_pin = new five.Pin({
            pin: "A"+num,
            // type: "digital",
            mode: five.Pin.INPUT
        });
        pin_arr.push(tmp_pin)
    });

    return pin_arr;
};


var init_pins_value = function (pin_arr) {
    
    pins_value = {};
    pin_arr.forEach(pin => {
        // console.log(pin.addr);
        pin.read(function(error, value) {
            // console.log(value);
            pins_value[pin.addr] = value;
        });
    });

    return pins_value;
};

function getDecorateIOAllPins() {
  function decorateIOAllPins(io) {
  	board.on('ready', function() {
        console.log('board is ready');
        pin_arr = pin_arr();

        // for (var pin of pin_arr){
        //     console.log(pin.addr);
        // }
        

        init_pins_value = init_pins_value(pin_arr);

        console.log(init_pins_value);
        
        io.on('connection', function (socket) {
            console.log('sockets on connection');
            monitor_all_pins(pin_arr, socket);
        });
    });
  };

  return decorateIOAllPins;
};



exports.pin_arr = pin_arr;
exports.monitor_all_pins = monitor_all_pins;
exports.getDecorateIOAllPins = getDecorateIOAllPins;