var RSVP = require('rsvp'),
    walkSync = require('walk-sync'),
    walkTreeAsPromised = require('./walk-tree');

var folder = __dirname + '/';


(function demo() {
  return RSVP.resolve()
  .then(runWalkSync)
  .then(runWalkTreeAsPromised)
  .then(demo)
})();


function runWalkSync() {
  var start = Date.now();
  var result = walkSync(folder);
  console.log('Sync took ' + (Date.now() - start) + ' ms for ' + result.length + ' files');
}

function runWalkTreeAsPromised() {
  var start = Date.now()
  return walkTreeAsPromised(folder)
  .then(function(result) {
    console.log('walkTreeAsPromised took ' + (Date.now() - start) + ' ms for ' + result.length + ' files');
  });
}