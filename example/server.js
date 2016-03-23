var zetta = require('zetta');
var Robot = require('../index');
var style = require('./apps/style');

zetta()
  .use(Robot)
  .use(style)
  .link('http://demo.zettaapi.org')
  .listen(1337);
