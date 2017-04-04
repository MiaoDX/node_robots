var restify = require('restify');
var control_six_dof = require('./control_six_dof_with_restify.js');

var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'control_stepper_with_restify.js',
  streams: [
    { stream: process.stdout },
    { path: 'six_dof_platform.log'}
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


var decorateSixDofPlatform = control_six_dof.getDecorateSixDofPlatform();
decorateSixDofPlatform(server);


server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});