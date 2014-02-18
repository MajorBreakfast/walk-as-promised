var fs = require('fs'),
    RSVP = require('rsvp'),
    stat = RSVP.denodeify(fs.stat),
    readdir = RSVP.denodeify(fs.readdir),
    Promise = RSVP.Promise;

module.exports = walk;
function walk(baseDir, relativePath) {
  return readdir(baseDir + '/' + relativePath)
    .then(function(entries) {
      var files = new Array(entries.length),
          filesCount = 0,
          folderPromises = new Array(entries.length),
          folderPromisesCount = 0;

      var statPromises = entries.map(function(entry) {
        return stat(baseDir + '/' + relativePath + entry);
      });

      return Promise.all(statPromises)
        .then(function(stati) {
          for (var i = 0; i < entries.length; i++) {
            if (stati[i].isDirectory()) {
              folderPromises[folderPromisesCount++] = walk(baseDir, relativePath + entries[i] + '/');
            } else {
              files[filesCount++] = entries[i];
            }
          };

          return Promise.all(folderPromises);
        })
        .then(function(subentries) {

          // How long is the result array?
          var sum = 1 + filesCount;
          for (var a = 0; a < folderPromisesCount; a++) { sum += subentries[a].length; };
          // Create an array of the correct size aand populate it
          var offset = 0;
          var output = new Array(sum);
          output[offset++] = relativePath; // Root folder
          for (var b = 0; b < filesCount; b++) { output[offset++] = files[b]; }; // Files
          for (var c = 0; c < folderPromisesCount; c++) { // Entries of subfolders
            for (d = 0; d < subentries[c].length; d++) { output[offset++] = subentries[c][d]; };
          };

          return output;
        });
    });
};