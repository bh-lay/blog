/**
 * ast parser and modifier
 * https://spmjs.org
 *
 * copyright (c) 2013 by Hsiaoming Yang
 */

var UglifyJS = require('uglify-js');


/**
 * Ensure it it a parsed UglifyJS ast
 */
function getAst(ast, options) {
  if (isString(ast)) {
    return UglifyJS.parse(ast, options || {});
  }
  return ast;
}
exports.getAst = getAst;


/**
 * Parse everything in `define`.
 *
 * Example:
 *
 *   define('id', ['deps'], fn)
 *
 * Return value:
 *
 *   [{id: 'id', dependencies: ['deps'], factory: fnAst}]
 */
function parse(ast) {
  ast = getAst(ast);
  var meta = [];

  var walker = new UglifyJS.TreeWalker(function(node, descend) {
    // don't collect dependencies in the define in define
    if (node instanceof UglifyJS.AST_Call && node.expression.name === 'define') {
      var define = getDefine(node);
      if (define) {
        meta.push(define);
      }
      return true;
    }
  });
  ast.walk(walker);
  return meta;
}
exports.parse = parse;


/**
 * The first meta data returned by `parse`.
 */
exports.parseFirst = function(ast) {
  return parse(ast)[0];
};


/**
 * Modify `define` and `require` of the given code.
 *
 * Example:
 *
 *   define('id', ['foo'], function(require) {
 *     var bar = require('bar')
 *   })
 *
 * Replace code with:
 *
 *   modify(code, function(value) {
 *     return value + '-debug';
 *   })
 *
 * Return value (`print_to_string` to get the code):
 *
 *   define('id-debug', ['foo-debug'], function(require) {
 *       var bar = require('bar-debug');
 *   })
 */
function modify(ast, options) {
  ast = getAst(ast);

  var idfn, depfn, requirefn, asyncfn;
  if (isFunction(options)) {
    idfn = depfn = requirefn = asyncfn = options;
  } else {
    idfn = options.id;
    depfn = options.dependencies;
    requirefn = options.require;
    asyncfn = options.async;
  }

  if (isObject(depfn)) {
    var alias = depfn;
    depfn = function(value) {
      if (alias.hasOwnProperty(value)) {
        return alias[value];
      } else {
        return value;
      }
    };
  }

  var trans = new UglifyJS.TreeTransformer(function(node, descend) {
    // modify define
    if ((idfn || depfn) && node instanceof UglifyJS.AST_Call && node.expression.name === 'define' && node.args.length) {
      var args = [];
      var meta = getDefine(node);
      if (idfn && isFunction(idfn)) {
        meta.id = idfn(meta.id);
      } else if (idfn && isString(idfn)) {
        meta.id = idfn;
      }
      if (meta.id) {
        args.push(new UglifyJS.AST_String({
          value: meta.id
        }));
      }
      // modify dependencies
      if (meta.dependencyNode && !depfn) {
        args.push(meta.dependencyNode);
      } else if (depfn) {
        var elements = [];
        if (meta.dependencies.length && isFunction(depfn)) {
          meta.dependencies.forEach(function(d) {
            var value = depfn(d);
            if (value) {
              elements.push(
                new UglifyJS.AST_String({value: value})
              );
            }
          });
        } else if (isString(depfn)) {
          elements = [new UglifyJS.AST_String({value: depfn})];
        } else if (Array.isArray(depfn)) {
          elements = depfn.map(function(value) {
            return new UglifyJS.AST_String({
              value: value
            });
          });
        }
        if (meta.dependencyNode) {
          args.push(new UglifyJS.AST_Array({
            start: meta.dependencyNode.start,
            end: meta.dependencyNode.end,
            elements: elements
          }));
        } else {
          args.push(new UglifyJS.AST_Array({elements: elements}));
        }
      } else {
        args.push(new UglifyJS.AST_Array({elements: []}));
      }
      if (meta.factory) {
        args.push(meta.factory);
      }
      node.args = args;
      return node;
    }
  });
  ast = ast.transform(trans);

  if (requirefn || asyncfn) {
    ast = replaceRequire(ast, requirefn, asyncfn);
  }
  return ast;
}
exports.modify = modify;


function getDefine(node) {
  var id, factory, dependencyNode, dependencies = [];
  // don't collect dependencies in the define in define
  if (node instanceof UglifyJS.AST_Call && node.expression.name === 'define') {
    if (!node.args || !node.args.length) return null;

    if (node.args.length === 1) {
      factory = node.args[0];
      if (factory instanceof UglifyJS.AST_Function) {
        dependencies = getRequires(factory);
      }
    } else if (node.args.length === 2) {
      factory = node.args[1];
      var child = node.args[0];
      if (child instanceof UglifyJS.AST_Array) {
        // define([], function(){});
        dependencies = map(child.elements, function(el) {
          if (el instanceof UglifyJS.AST_String) {
            return el.getValue();
          }
        });
        dependencyNode = child;
      }
      if (child instanceof UglifyJS.AST_String) {
        // define('id', function() {});
        id = child.getValue();
        dependencies = getRequires(factory);
      }
    } else {
      factory = node.args[2];
      var firstChild = node.args[0], secondChild = node.args[1];
      if (firstChild instanceof UglifyJS.AST_String) {
        id = firstChild.getValue();
      }
      if (secondChild instanceof UglifyJS.AST_Array) {
        dependencies = map(secondChild.elements, function(el) {
          if (el instanceof UglifyJS.AST_String) {
            return el.getValue();
          }
        });
        dependencyNode = secondChild;
      } else if ((secondChild instanceof UglifyJS.AST_Null) || (secondChild instanceof UglifyJS.AST_Undefined)) {
        if (factory instanceof UglifyJS.AST_Function) {
          dependencies = getRequires(factory);
        }
      }
    }
  }
  return {
    id: id, dependencies: dependencies, factory: factory,
    dependencyNode: dependencyNode
  };
}

/**
 * Return everything in `require`.
 *
 * Example:
 *
 *   define(function(require) {
 *     var $ = require('jquery')
 *     var _ = require('lodash')
 *   })
 *
 * Return value:
 *
 *   ['jquery', 'lodash']
 */
function getRequires(ast) {
  ast = getAst(ast);

  var deps = [];

  var walker = new UglifyJS.TreeWalker(function(node, descend) {
    if (node instanceof UglifyJS.AST_Call && node.expression.name === 'require') {
      var args = node.expression.args || node.args;
      if (args && args.length === 1) {
        var child = args[0];
        if (child instanceof UglifyJS.AST_String) {
          deps.push(child.getValue());
        }
        // TODO warning
      }
      return true;
    }
  });

  ast.walk(walker);
  return deps;
}

/**
 * Replace every string in `require`.
 *
 * Example:
 *
 *   define(function(require) {
 *     var $ = require('jquery');
 *     require.async('foo', function(foo){
 *       // callback
 *     });
 *   })
 *
 * Replace requires in this code:
 *
 *   replaceRequire(code, function(value) {
 *     if (value === 'jquery') return 'zepto';
 *     return value;
 *   }, function(value) {
 *     if (value === 'foo') return 'app/foo';
 *     return value;
 *   })
 */
function replaceRequire(ast, requirefn, asyncfn) {
  ast = getAst(ast);

  var makeFunction = function(fn) {
    if (isFunction(fn)) {
      return fn;
    }

    if (isObject(fn)) {
      var alias = fn;
      return function(value) {
        if (alias.hasOwnProperty(value)) {
          return alias[value];
        } else {
          return value;
        }
      };
    }

    return function(value){
      return value;
    };
  }

  var replaceChild = function(node, fn) {
    var args = node.args[0],
      children = args instanceof UglifyJS.AST_Array ? args.elements : [args];

    children.forEach(function(child){
      if (child instanceof UglifyJS.AST_String) {
        child.value = fn(child.getValue());
      }
    });
  }

  requirefn = makeFunction(requirefn);
  asyncfn = makeFunction(asyncfn);

  var trans = new UglifyJS.TreeTransformer(function(node, descend) {
    // require('foo')
    if (requirefn && node instanceof UglifyJS.AST_Call && node.expression.name === 'require' && node.args.length) {
      return replaceChild(node, requirefn);
    }

    // require.async('foo', function(foo){ // callback })
    if (asyncfn && node instanceof UglifyJS.AST_Call && node.start.value === 'require' && node.expression.property === 'async' && node.args.length) {
      return replaceChild(node, asyncfn);
    }
  });
  return ast.transform(trans);
}

function isString(str) {
  return typeof str === 'string';
}
function isFunction(fn) {
  return typeof fn === 'function';
}
function isObject(obj) {
  return (typeof obj === 'object' && !Array.isArray(obj));
}
function map(obj, fn, context) {
  var results = [];
  if (obj === null) return results;
  if (obj.map === Array.prototype.map) return obj.map(fn, context);

  for (var i = 0; i < obj.length; i++) {
    results[i] = fn.call(context, obj[i], i, obj);
  }
  return results;
}
