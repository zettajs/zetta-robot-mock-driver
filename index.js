var Device = require('zetta-device');
var util = require('util');

var TIMEOUT = 3000;

var Robot = module.exports = function() {
  Device.call(this);
  this.direction = 0;
  this.speed = 0;
  this.walkingStyle = ''; // strut, skip, normal
  this.saying = '';
};
util.inherits(Robot, Device);

Robot.prototype.init = function(config) {
  config
    .name('Robot')
    .type('robot')
    .state('standing')
    .monitor('speed')
    .monitor('direction')
    .monitor('saying')
    .monitor('walkingStyle')
    .when('closing-door', {allow: []})
    .when('closing-window', {allow: []})
    .when('opening-door', {allow: []})
    .when('opening-window', {allow: []})
    .when('sitting-down', {allow: []})
    .when('standing-up', {allow: []})
    .when('sitting', {allow: ['stand']})
    .when('standing', {allow: ['sit', 'walk', 'open-door', 'close-door', 'open-window', 'close-window']})
    .when('walking', {allow: []})
    .map('close-door', this.closeDoor)
    .map('close-window', this.closeWindow)
    .map('open-door', this.openDoor)
    .map('open-window', this.openWindow)
    .map('sit', this.sit)
    .map('stand', this.stand)
    .map('sit-down', this.sitDown)
    .map('stand-up', this.standUp)
    .map('walk', this.walk, [{name: 'direction', type: 'text'}, {name: 'speed', type: 'text'}, {name: 'duration', type: 'text'}, {name: 'walkingStyle', type: 'text'}, {name: 'warningMessage', type: 'text'}]);
};

Robot.prototype.closeDoor = function(cb) {
  this._performLongOperation('closing-door', 'standing', TIMEOUT, cb);
}
Robot.prototype.closeWindow = function(cb) {
  this._performLongOperation('closing-window', 'standing', TIMEOUT, cb);
}
Robot.prototype.openDoor = function(cb) {
  this._performLongOperation('opening-door', 'standing', TIMEOUT, cb);
}
Robot.prototype.openWindow = function(cb) {
  this._performLongOperation('opening-window', 'standing', TIMEOUT, cb);
}
Robot.prototype.sit = function(cb) {
  this._performLongOperation('sitting-down', 'sitting', TIMEOUT, cb);
  cb();
}
Robot.prototype.stand = function(cb) {
  this.speed = 0;
  this._performLongOperation('standing-up', 'standing', TIMEOUT, cb);
  cb();
}
Robot.prototype.walk = function(direction, speed, duration, walkingStyle, warningMessage, cb) {
  this.state = 'walking';
  this.direction = direction;
  this.speed = speed;
  this.walkingStyle = walkingStyle;
  this.saying = warningMessage;
  cb();

  var self = this;
  setTimeout(function(){
    self.walkingStyle = '';
    self.saying = '';
    self.speed = 0;
    self.state = 'standing';
    cb();
  }, duration);
}

Robot.prototype._performLongOperation = function(initState, finalState, delay, cb) {
  this.state = initState;
  cb();

  var self = this;
  setTimeout(function(){
    self.state = finalState;
    cb();
  }, delay);
}