var restify = require('restify');
var control_stepper = require('./control_stepper_with_restify.js');

var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'control_stepper_with_restify.js',
  streams: [
    { stream: process.stdout },
    { path: 'restify.log'}
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


var decorateServerStepper = control_stepper.getDecorateServerStepper();
decorateServerStepper(server);


server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});