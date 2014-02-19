var fs = require('fs'),
    _ = require('lodash'),
    RSVP = require('rsvp'),
    stat = RSVP.denodeify(fs.stat),
    readdir = RSVP.denodeify(fs.readdir),
    Promise = RSVP.Promise;

module.exports = walk;
function walk(baseDir, relativePath) {

  if (relativePath == null) { relativePath = '' }

  // Remove trailing slash
  if (relativePath[relativePath.length -1] === '/') { relativePath = relativePath.slice(0, -1); }

  function fly(baseDir, relativePath) {
    return stat(baseDir + '/' + relativePath)
      .then(function(status) {
        if (status.isDirectory()) { // Directory
          return readdir(baseDir + '/' + relativePath)
            .then(function (entries) {
              return Promise.all(entries.map(function(entry) {
                return fly(baseDir, relativePath + '/' + entry)
              }));
            })
            .then(function(entries) {
              return [relativePath + '/', entries];
            });
        } else { // File
          return relativePath;
        }
      });
  };

  return fly(baseDir, relativePath).then(_.flatten);
};