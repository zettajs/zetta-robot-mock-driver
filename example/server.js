var zetta = require('zetta');
var Robot = require('../index');
var style = require('./apps/style');

zetta()
  .use(Robot)
  .use(style)
  .name('Corktown')
  .link('http://stage.zettaapi.org')
  .listen(1337);
