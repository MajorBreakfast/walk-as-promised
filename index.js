var RSVP = require('rsvp');

var walkSync = require('walk-sync'),
    walkAsPromised = require('./walk'),
    walkAsPromisedCStyle = require('./walk-c-style');


var folder = __dirname + '/';


// Note: first one always runs slower!

RSVP.resolve()
.then(runWalkSync)
.then(runWalkAsPromised)
.then(runWalkAsPromisedCStyle)
.then(runWalkSync)
.then(runWalkAsPromised)
.then(runWalkAsPromisedCStyle)

function runWalkSync() {
  var start = Date.now();
  var result = walkSync(folder, '/');
  console.log('Sync took ' + (Date.now() - start) + ' ms');
}

function runWalkAsPromised() {
  var start = Date.now()
  return walkAsPromised(folder, '/')
  .then(function(result) {
    console.log('walkAsPromised took ' + (Date.now() - start) + ' ms');
  });
}

function runWalkAsPromisedCStyle() {
  var start = Date.now()
  return walkAsPromisedCStyle(folder, '/')
  .then(function(result) {
    console.log('walkAsPromisedCStyle took ' + (Date.now() - start) + ' ms');
  });
}