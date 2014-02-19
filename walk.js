var fs = require('fs'),
    _ = require('lodash'),
    RSVP = require('rsvp'),
    Promise = RSVP.Promise;

module.exports = walk;
function walk(baseDir, relativePath) {

  if (relativePath == null) { relativePath = '' }

  // Remove trailing slash
  if (relativePath[relativePath.length -1] === '/') { relativePath = relativePath.slice(0, -1); }

  function fly(baseDir, relativePath, j, callback) {
    // Note: j is just an index that gets passed through

    fs.stat(baseDir + '/' + relativePath, function(err, status) {
      if (status.isDirectory()) {

        // Directory
        fs.readdir(baseDir + '/' + relativePath, function(err, entries) {
          if (entries.length > 0) { // Folder with items in it
            var entriesLeft = entries.length;
            for (var i = 0; i < entries.length; i++) {
              fly(baseDir, relativePath + '/' + entries[i], i, function(err, subentries, i) {
                entries[i] = subentries;
                entriesLeft -= 1;
                if (entriesLeft === 0) {
                  callback(null, [relativePath + '/', entries], j);
                }
              });
            };
          } else { callback(null, relativePath + '/', j) } // Empty folder
        })

      } else { callback(null, relativePath, j); } // File

    });
  };

  return RSVP.denodeify(fly)(baseDir, relativePath, 0).then(_.flatten)
};