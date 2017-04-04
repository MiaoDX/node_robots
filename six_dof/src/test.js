var restify = require('restify');


var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'test.js',
  streams: [
    { stream: process.stdout },
    { path: 'test.log'}
  ]
});

var server = restify.createServer({
    log: log
});
server.use(restify.requestLogger())

server.on('after', restify.auditLogger({
    log: log
}));

server.use(function (req, res, next) {
    req.log.info('We got request:%s', req);
    next();
});

server.get('/move/:steps_x/:steps_y/:steps_z/:steps_roll/:steps_pitch/:steps_yaw', async function (req, res, next) {
    // var steps_x = parseInt(req.params.steps_x);
    // var steps_y = parseInt(req.params.steps_y);
    // var steps_z = parseInt(req.params.steps_z);
    // var steps_roll = parseInt(req.params.steps_roll);
    // var steps_pitch = parseInt(req.params.steps_pitch);
    // var steps_yaw = parseInt(req.params.steps_yaw);

    log.info('params, %s', req.params.length);


    


    // var move_steps_arr = move_steps(req.params);

    // log.info("Got move command with steps: %s, prepare to move!!", move_steps_arr);
    
    res.send(req.params);
      
});


server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});