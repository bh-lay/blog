exports.init = function(grunt) {

  var path = require('path');
  var format = require('util').format;
  var iduri = require('cmd-util').iduri;
  var ast = require('cmd-util').ast;

  var exports = {};

  exports.jsonParser = function(fileObj, options) {
    var dest = fileObj.dest + '.js';
    grunt.log.verbose.writeln('Transport ' + fileObj.src + ' -> ' + dest);

    var id = unixy(options.idleading + fileObj.name.replace(/\.js$/, ''));
    var data = fileObj.srcData || grunt.file.read(fileObj.src);
    var code = format('define("%s", [], %s)', id, data);
    var astCache = ast.getAst(code);

    data = astCache.print_to_string(options.uglify);
    grunt.file.write(dest, data);

    // create debug file
    if (!options.debug) {
      return;
    }
    dest = dest.replace(/\.json\.js$/, '-debug.json.js');

    astCache = ast.modify(astCache, function(v) {
      var ext = path.extname(v);
      if (ext && options.parsers[ext]) {
        return v.replace(new RegExp('\\' + ext + '$'), '-debug' + ext);
      } else {
        return v + '-debug';
      }
    });
    data = astCache.print_to_string(options.uglify);
    grunt.file.write(dest, data);
  };
  return exports;
};

function unixy(uri) {
  return uri.replace(/\\/g, '/');
}
