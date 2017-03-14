// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));

// app.title = '笛卡尔坐标系上的热力图';
var x_axis = _.range(35);
var y_axis = _.range(22);

var pins = {
            // upper
            'SLC':[0,0], 'SDA':[0,1], 'AREF':[0,2], '13':[0,4], '12':[0,5], '11':[0,6], '10':[0,7], '9':[0,8], '8':[0,9],
            '7':[0,12], '6':[0,13], '5':[0,14], '4':[0,15], '3':[0,16], '2':[0,17], '1':[0,18], '0':[0,19],
            '14':[0,22], '15':[0,23], '16':[0,24], '17':[0,25], '18':[0,26], '19':[0,27], '20':[0,28], '21':[0,29],

            // the right side
            '22':[2,33], '24':[3,33], '26':[4,33], '28':[5,33], '30':[6,33], '32':[7,33], '34':[8,33], '36':[9,33], '38':[10,33], '40':[11,33], '42':[12,33], '44':[13,33], '46':[14,33], '48':[15,33], '50':[16,33], '52':[17,33],
            '23':[2,34], '25':[3,34], '27':[4,34], '29':[5,34], '31':[6,34], '33':[7,34], '35':[8,34], '37':[9,34], '39':[10,34], '41':[11,34], '43':[12,34], '45':[13,34], '47':[14,34], '49':[15,34], '51':[16,34], '53':[17,34],

            // the bottom
            '5V':[20,3], 'RESET':[20,4], '3.3V':[20,5], '5V':[20,6], 'VIN':[20,9],
            'A0':[20,12], 'A1':[20,13], 'A2':[20,14], 'A3':[20,15], 'A4':[20,16], 'A5':[20,17], 'A6':[20,18], 'A7':[20,19],
            'A8':[20,22], 'A9':[20,23], 'A10':[20,24], 'A11':[20,25], 'A12':[20,26], 'A13':[20,27], 'A14':[20,28], 'A15':[20,29],


            // some common one(the voltage)
            'GND1':[0,3], 'GND2':[18,34], 'GND3':[20,7], 'GND4':[20,8],
            '5V1':[1,33], '5V2':[1,34], '5v3':[20,3], '3.3V':[20,5], '5V4':[20,6], 'GND3':[20,7], 'GND4':[20,8],
    }


var pins_map = new Map();
var pins_value_map = new Map();
for (var pin_name in pins){
    pins_map.set(pin_name, pins[pin_name]);
    pins_value_map.set(pin_name, 0); // be default, all pins are set to zero
}


// in official doc, it seems we can not customize the label, but in fact, we can!!
// https://ecomfe.github.io/echarts-doc/public/en/option.html#series-heatmap.data.label.normal
// We try via:
// http://echarts.baidu.com/option.html#tooltip.formatter
// or more specifically, http://echarts.baidu.com/option.html#series-line.label.normal.formatter
// the second one have only one para, which is what we want--`params.dataIndex`

// to save the data, if we save the name in the last dimension, it can be treated as the last dim, and become data to show.
// to make things easy, just save it to another list.
data_value = []
pins_map.forEach(function (x_y, pin_name, map) {
    data_value.push([x_y[1], x_y[0], pins_value_map.get(pin_name)])
});

data_name_position = []
data_name = []
pins_map.forEach(function (x_y, name, map) {
    // console.log(x_y, name)



    pin_name_to_possible_number = parseInt(name);

    if(! isNaN(pin_name_to_possible_number) && pin_name_to_possible_number >= 22){ // the right side
        if(pin_name_to_possible_number%2 == 0){
            data_name_position.push([x_y[1]-1, x_y[0], 0, `_`+name]); // the left line of the right side should have label left to them(WELL...)
        }
        else{
            data_name_position.push([x_y[1]+1, x_y[0], 0, `_`+name]);
        }
    }
    
    else if(name.indexOf('GND')>=0 || name.indexOf('5V')>=0 || name.indexOf('3.3V')>=0){
        data_name_position.push([x_y[1], x_y[0], 0, `_`+name]);
    }
    else {
        data_name_position.push([x_y[1], x_y[0]+1, 0, `_`+name]);
    }
});

option = {
    tooltip: {
        position: 'top'
    },
    animation: false,
    grid: {
        height: '90%',
        y: '5%'
    },
    xAxis: {
        type: 'category',
        data: x_axis,
        splitArea: {
            show: true
        }
    },
    yAxis: {
        type: 'category',
        data: y_axis,
        inverse: true,
        splitArea: {
            show: true
        }
    },
    visualMap: {
        min: 0,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
    },
    series: [{
        name: 'Pin Value',
        type: 'heatmap',
        data: data_value,
        label: {
            normal: {
                // show: true,
                show: false,
            }
        },
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                // shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    },
    {
        name: 'Pin name',
        type: 'heatmap',
        data: data_name_position,
        label: {
            normal: {
                show: true,
                formatter: function (params) {
                    // return data_name[params.dataIndex];
                    return data_name_position[params.dataIndex][3].substr(1)
                }
            }                
        },
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }
    ]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);


function setNewOption(pin_state){
    console.log('enter setNewOption');
    console.log('we got: ', pin_state);
    let type = pin_state.type, pin_name = pin_state.addr.toString(); // ATTENTION, every toString is a devil -.-
    let value = type=="high"?1:0;


    pins_value_map.set(pin_name, value);
    data_value = []
    pins_map.forEach(function (x_y, pin_name, map) {
        data_value.push([x_y[1], x_y[0], pins_value_map.get(pin_name)]);
    });

    option.series[0]['data'] = data_value;
    
    myChart.setOption(option);
    console.log('out setNewOption');
}