var fs = require('fs'),
    RSVP = require('rsvp');

module.exports = walk;
function walk(dir, options) {

  // Default options
  options = options || {}
  var processDirectory = options.processDirectory ||
    function(baseDir, relativePath, stat, entries, callback) {
      callback(null, Array.prototype.concat.apply([relativePath + '/'], entries));
    }
  var processFile = options.processFile ||
    function(baseDir, relativePath, stat, callback) {
      callback(null, [relativePath]);
    }

  function fly(relativePath, j, callback) {
    // Note: j is just an index that gets passed through (Needed for recursive calling)

    fs.stat(dir + '/' + relativePath, function(err, stat) {

      if (stat.isDirectory()) { // Directory

        fs.readdir(dir + '/' + relativePath, function(err, entries) {

          if (entries.length > 0) { // Full directory
            var entriesLeft = entries.length;
            for (var i = 0; i < entries.length; i++) {
              fly(relativePath + '/' + entries[i], i, function(err, subentries, i) {
                entries[i] = subentries;
                entriesLeft -= 1;
                if (entriesLeft === 0) {
                  processDirectory(dir, relativePath, stat, entries, function(err, result) {
                    callback(null, result, j);
                  });
                }
              });
            };
          } else { // Empty directory
            processDirectory(dir, relativePath, stat, entries, function(err, result) {
              callback(null, result, j);
            });
          }

        })

      } else { // File
        processFile(dir, relativePath, stat, function(err, result) {
          callback(null, result, j);
        });
      }

    });
  };

  return RSVP.denodeify(fly)('', null)
};