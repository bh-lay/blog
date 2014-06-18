var path = require('path');
var format = require('util').format;
var css = require('cmd-util').css;
var cssParse = require('css').parse;
var cssStringify = require('css').stringify;

exports.init = function(grunt) {
  var ast = require('cmd-util').ast;
  var iduri = require('cmd-util').iduri;

  var exports = {};

  exports.css2jsParser = function(fileObj, options) {
    // don't transport debug css files
    if (/\-debug\.css$/.test(fileObj.src)) return;
    grunt.log.verbose.writeln('Transport ' + fileObj.src + ' -> ' + fileObj.dest);

    // transport css to js
    var data = fileObj.srcData || grunt.file.read(fileObj.src);
    var id = unixy(options.idleading + fileObj.name.replace(/\.js$/, ''));

    data = css2js(data, id, options, fileObj);
    data = ast.getAst(data).print_to_string(options.uglify);
    var dest = fileObj.dest + '.js';
    grunt.file.write(dest, data);

    if (!options.debug) {
      return;
    }
    dest = dest.replace(/\.css\.js$/, '-debug.css.js');

    data = ast.modify(data, function(v) {
      var ext = path.extname(v);
      if (ext && options.parsers[ext]) {
        return v.replace(new RegExp('\\' + ext + '$'), '-debug' + ext);
      } else {
        return v + '-debug';
      }
    });
    data = data.print_to_string(options.uglify);
    grunt.file.write(dest, data);
  };

  // the real css parser
  exports.cssParser = function(fileObj, options) {
    var data = fileObj.srcData || grunt.file.read(fileObj.src);
    data = css.parse(data);

    grunt.log.verbose.writeln('Transport ' + fileObj.src + ' -> ' + fileObj.dest);
    var ret = css.stringify(data[0].code, function(node) {
      if (node.type === 'import' && node.id) {
        if (node.id.charAt(0) === '.') {
          return node;
        }
        if (/^https?:\/\//.test(node.id)) {
          return node;
        }
        if (!iduri.isAlias(options, node.id)) {
          grunt.log.warn('alias ' + node.id + ' not defined.');
        } else {
          node.id = iduri.parseAlias(options, node.id);
          if (!/\.css$/.test(node.id)) {
            node.id += '.css';
          }
          return node;
        }
      }
    });

    var id = unixy(options.idleading + fileObj.name.replace(/\.js$/, ''));
    var banner = format('/*! define %s */', id);
    grunt.file.write(fileObj.dest, [banner, ret].join('\n'));

    var dest = fileObj.dest.replace(/\.css$/, '-debug.css');

    ret = css.stringify(data[0].code, function(node) {
      if (node.type === 'import' && node.id) {
        var alias = node.id;
        if (alias.charAt(0) === '.') {
          node.id = alias.replace(/(\.css)?$/, '-debug.css');
          return node;
        }
        if (/^https?:\/\//.test(node.id)) {
          return node;
        }
        alias = iduri.parseAlias(options, alias);
        if (/\.css$/.test(alias)) {
          node.id = alias.replace(/\.css$/, '-debug.css');
        } else {
          node.id = alias + '-debug.css';
        }
        return node;
      }
    });
    id = id.replace(/(\.css)?$/, '-debug.css');
    banner = format('/*! define %s */', id);
    grunt.file.write(dest, [banner, ret].join('\n'));
  };

  return exports;
};


// helpers
function unixy(uri) {
  return uri.replace(/\\/g, '/');
}

function parseRules(rules, prefix) {
  return rules.map(function(o) {
    if (o.selectors) {
      o.selectors = o.selectors.map(function(selector) {
        // handle :root selector {}
        if (selector.indexOf(':root') === 0) {
          return ':root ' + prefix + selector.replace(':root', ' ');
        }
        return prefix + selector;
      });
    }
    if (o.rules) {
      o.rules = parseRules(o.rules, prefix);
    }
    return o;
  });
}

function css2js(code, id, options, fileObj) {
  // ex. arale/widget/1.0.0/ => arale-widget-1_0_0
  var styleId = unixy((options || {}).idleading || '')
    .replace(/\/$/, '')
    .replace(/\//g, '-')
    .replace(/\./g, '_');
  var prefix = ['.', styleId, ' '].join('');

  var addStyleBox = false;
  if (options.styleBox === true) {
    addStyleBox = true;
  } else if (options.styleBox && options.styleBox.length) {
    options.styleBox.forEach(function(file) {
      if (file === fileObj.name) {
        addStyleBox = true;
      }
    });
  }

  // if outside css modules, fileObj would be undefined
  // then dont add styleBox
  if (addStyleBox && styleId && fileObj) {
    var data = cssParse(code);
    data.stylesheet.rules = parseRules(data.stylesheet.rules, prefix);
    code = cssStringify(data);
  }

  // remove comment and format
  var cleancss = require('clean-css');
  code = cleancss.process(code, {
    keepSpecialComments: 0,
    removeEmpty: true
  });

  // transform css to js
  // spmjs/spm#581
  var tpl = [
    'define("%s", [], function() {',
    "seajs.importStyle('%s')",
    '});'
  ].join('\n');

  // spmjs/spm#651
  code = code.split(/\r\n|\r|\n/).map(function(line) {
    return line.replace(/\\/g, '\\\\');
  }).join('\n');

  code = format(tpl, id, code.replace(/\'/g, '\\\''));
  return code;
}

exports.css2js = css2js;
