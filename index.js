var RSVP = require('rsvp');

var walkSync = require('walk-sync'),
    walkAsPromised = require('./walk-promises'),
    walkAsPromisedCStyle = require('./walk-c-style'),
    walkFlattenAfterwards = require('./walk-flatten-afterwards'),
    walkCallbacks = require('./walk');


var folder = __dirname + '/../';


// Note: first one always runs slower!

RSVP.resolve()
.then(runWalkSync)
.then(runWalkAsPromised)
.then(runWalkAsPromisedCStyle)
.then(runWalkFlattenAfterwards)
.then(runWalkCallbacks)
.then(runWalkSync)
.then(runWalkAsPromised)
.then(runWalkAsPromisedCStyle)
.then(runWalkFlattenAfterwards)
.then(runWalkCallbacks)

function runWalkSync() {
  var start = Date.now();
  var result = walkSync(folder, '/');
  console.log('Sync took ' + (Date.now() - start) + ' ms for ' + result.length + ' files');
}

function runWalkAsPromised() {
  var start = Date.now()
  return walkAsPromised(folder, '/')
  .then(function(result) {
    console.log('walkPromises took ' + (Date.now() - start) + ' ms for ' + result.length + ' files');
  });
}

function runWalkAsPromisedCStyle() {
  var start = Date.now()
  return walkAsPromisedCStyle(folder, '/')
  .then(function(result) {
    console.log('walkAsPromisedCStyle took ' + (Date.now() - start) + ' ms for ' + result.length + ' files');
  });
}

function runWalkFlattenAfterwards() {
  var start = Date.now()
  return walkFlattenAfterwards(folder, '/')
  .then(function(result) {
    console.log('walkFlattenAfterwards took ' + (Date.now() - start) + ' ms for ' + result.length + ' files');
  });
}

function runWalkCallbacks() {
  var start = Date.now()
  return walkCallbacks(folder, '/')
  .then(function(result) {
    console.log('walkCallbacks took ' + (Date.now() - start) + ' ms for ' + result.length + ' files');
  });
}