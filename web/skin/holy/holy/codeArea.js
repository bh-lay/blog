/*

By Vilic Vane
http://www.vilic.info/

?2010 Groinup Studio
All rights reserved.

stupid!!!!!

Redistribution and use in source and binary forms,
with or without modification, are permitted provided
that the following conditions are met:
Redistributions of source code must retain the above
copyright notice, this list of conditions and the
following disclaimer.
Redistributions in binary form must reproduce the
above copyright notice, this list of conditions and
the following disclaimer in the documentation and/or
other materials provided with the distribution.
Neither the name of the Groinup Studio nor the names
of its contributors may be used to endorse or promote
products derived from this software without specific
prior written permission.
*/

/* Includes JSON2.js */
if (!this.JSON) { this.JSON = {}; } (function () { function f(n) { return n < 10 ? '0' + n : n; } if (typeof Date.prototype.toJSON !== 'function') { Date.prototype.toJSON = function (key) { return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null; }; String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) { return this.valueOf(); }; } var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' }, rep; function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function (a) { var c = meta[a]; return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4); }) + '"' : '"' + string + '"'; } function str(key, holder) { var i, k, v, length, mind = gap, partial, value = holder[key]; if (value && typeof value === 'object' && typeof value.toJSON === 'function') { value = value.toJSON(key); } if (typeof rep === 'function') { value = rep.call(holder, key, value); } switch (typeof value) { case 'string': return quote(value); case 'number': return isFinite(value) ? String(value) : 'null'; case 'boolean': case 'null': return String(value); case 'object': if (!value) { return 'null'; } gap += indent; partial = []; if (Object.prototype.toString.apply(value) === '[object Array]') { length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || 'null'; } v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']'; gap = mind; return v; } if (rep && typeof rep === 'object') { length = rep.length; for (i = 0; i < length; i += 1) { k = rep[i]; if (typeof k === 'string') { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } } else { for (k in value) { if (Object.hasOwnProperty.call(value, k)) { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } } v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}'; gap = mind; return v; } } if (typeof JSON.stringify !== 'function') { JSON.stringify = function (value, replacer, space) { var i; gap = ''; indent = ''; if (typeof space === 'number') { for (i = 0; i < space; i += 1) { indent += ' '; } } else if (typeof space === 'string') { indent = space; } rep = replacer; if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) { throw new Error('JSON.stringify'); } return str('', { '': value }); }; } if (typeof JSON.parse !== 'function') { JSON.parse = function (text, reviver) { var j; function walk(holder, key) { var k, v, value = holder[key]; if (value && typeof value === 'object') { for (k in value) { if (Object.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v; } else { delete value[k]; } } } } return reviver.call(holder, key, value); } text = String(text); cx.lastIndex = 0; if (cx.test(text)) { text = text.replace(cx, function (a) { return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4); }); } if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) { j = eval('(' + text + ')'); return typeof reviver === 'function' ? walk({ '': j }, '') : j; } throw new SyntaxError('JSON.parse'); }; } } ());

/* Vejis */
var vejis = new function () {
    var vejis = this;

    var Integer = this.Integer = function () { };
    var Null = this.Null = function () { };

    var toString = Object.prototype.toString;
    var _;
    (function () {
        var typeRules = [
            function (o, c) { return c == Object; },
            function (o, c) { return (typeof o == 'string' && c == String); },
            function (o, c) { return (typeof o == 'number' && (c == Number || (parseInt(o) == o && c == Integer))); },
            function (o, c) { return (typeof o == 'boolean' && c == Boolean); },
            function (o, c) { return (o === null && c == Null); }
        ];

        var typeContainRules = [
            function (c1, c2) { return (c1 == Object); },
            function (c1, c2) { return (c1 == Number && c2 == Integer); }
        ];

        _ = vejis._ = function () {
            var overloadList = [];
            var typesList = [];

            if (arguments.length) overloadMethod.apply(null, arguments);

            fn._ = fn.overload = overloadMethod;
            fn._type = Method;
            fn.toString = function () { return '[Vejis Method]' + (overloadList[0] ? ' \n' + overloadList[0] : ''); };

            return fn;

            function fn() {
                var overload;
                if (overload = getOverload(arguments)) {
                    overload._caller = arguments.callee.caller;
                    var returnValue = overload.apply(this, arguments);
                    overload._caller = null;
                    return returnValue;
                }
                error('No overload for the arguments given is found.');
            }

            function overloadMethod() {
                var len = arguments.length - 1;

                if (len < 0) error('Method overloading needs at least 1 argument.')

                var types = [];
                var i;
                for (i = 0; i < len; i++) {
                    var type = arguments[i];
                    if (typeof type != 'function') error('The arguments type needs to be class(function).');
                    types.push(type);
                }

                var overload = arguments[i];
                if (typeof overload != 'function') error('The overload needs to be function.');

                if (existOverload(types)) error('The overload or a overload that can\'t be distinguished from this has already existed.');

                overloadList.push(overload);
                typesList.push(types);
            }

            function getOverload(args) {
                for (var i = 0; i < typesList.length; i++) {
                    var otypes = typesList[i];
                    var olen = otypes.length;
                    if (olen != args.length) continue;
                    for (var j = 0; j < olen; j++)
                        if (!instance(args[j], otypes[j])) break;
                    if (j == olen) return overloadList[i];
                }
                return null;
            }

            function existOverload(types) {
                for (var i = 0; i < typesList.length; i++) {
                    var otypes = typesList[i];
                    var olen = otypes.length;
                    if (olen != types.length) continue;
                    for (var j = 0; j < olen; j++) {
                        var otype = otypes[j];
                        var type = types[j];
                        if (otype != type && !isRelated(otype, type)) break;
                    }
                    if (j == olen) return true;
                }
                return false;
            }
        };

        var Method = vejis.Method = function () {
            if (arguments.callee != this.constructor) error('Operator "new" missing.');
            var method = _.apply(null, arguments);
            return method;
        };

        function instance(o, c) {
            if (o instanceof c) return true;
            for (var i = 0; i < typeRules.length; i++)
                if ((o._type && (o._type == c || ifContains(c, o._type))) || typeRules[i](o, c)) return true;
            return false;
        }

        function isRelated(c1, c2) {
            for (var i = 0; i < typeContainRules.length; i++) {
                var typeContainRule = typeContainRules[i];
                if (typeContainRule(c1, c2) || typeContainRule(c2, c1)) return true;
            }
            return false;
        }

        function ifContains(c1, c2) {
            for (var i = 0; i < typeContainRules.length; i++)
                if (typeContainRules[i](c1, c2)) return true;
            return false;
        }
    })();

    function error(message) {
        if (typeof message != 'string') error('The "message" needs to be string.');
        throw new Error(
            'Vejis Error: \n' +
            message
        );
    }

    var foreach = this.foreach = _(Object, Function, function (eles, fn) {
        if (type.isArray(eles))
            for (var i = 0; i < eles.length; i++)
                fn(eles[i]);
        else if (eles.propertyIsEnumerable && eles.propertyIsEnumerable()) {
            var p = eles.constructor.prototype;
            for (var i in eles)
                if (eles[i] !== p[i]) fn(eles[i]);
        }
        else if (eles[0]) {
            var i = 0;
            if (eles.length)
                for (i = 0; i < eles.length; i++)
                    fn(eles[i]);
            else
                while (eles[i])
                    fn(eles[i++]);
        }
    });

    /******************************************************************/

    /*
    use(Object namespace) 将namespace中的方法和属性复制到window对象下, 不覆盖已有的方法和属性, 无返回值.
    use(Object namespace, Boolean overwrite) 将namespace中的方法和属性复制到window对象下, 指定覆盖或者不覆盖已有的方法和属性, 无返回值.
    */

    (function () {
        var isReady = false,
            queue = [];

        vejis.ready = _(Function, function (fn) {
            if (isReady) fn();
            else queue.push(fn);
        });

        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', ready, false);
            window.addEventListener('load', ready, false);
        }
        else if (document.attachEvent) {
            document.attachEvent('onreadystatechange', ready);
            window.attachEvent('onload', ready);
        }

        function ready() {
            if (isReady) return;
            isReady = true;

            foreach(queue, function (fn) {
                fn();
            })

            queue.length = 0;
        }
    })();


    this.use = _(Object, function (namespace) {
        vejis.use(namespace, false);
    });

    this.use._(Object, Boolean, function (namespace, overwrite) {
        if (!namespace.propertyIsEnumerable) return;
        for (i in namespace)
            if (window[i] === undefined || overwrite)
                try {
                    window[i] = namespace[i];
                } catch (e) { }
    });

    var math = this.math = new function () {
        this.random = _(Integer, function (x) {
            return Math.floor(Math.random() * (x + 1));
        });

        this.random._(Integer, Integer, function (a, b) {
            if (a > b) {
                var bus = b;
                b = a;
                a = bus;
            }
            return Math.floor(Math.random() * (b - a + 1)) + a;
        });
    } ();

    /*
    string 命名空间
    left(String str, Integer len) 获取指定字符串左边指定长度的字符串, 返回值为String.
    ...
    */

    var string = this.string = new function () {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charsCount = chars.length;

        var left = this.left = _(String, Integer, function (str, len) {
            return str.substr(0, len);
        });

        var right = this.right = _(String, Integer, function (str, len) {
            return str.substr(str.length - len);
        });

        var trim = this.trim = _(String, function (str) {
            var re = /(^\s+|\s+$)/g;
            return str.replace(re, '');
        });

        var random = this.random = _(Integer, function (len) {
            if (len < 1) error('"len" must be larger than 0.');
            var s = '';
            var max = charsCount - 1;
            for (var i = 0; i < len; i++)
                s += chars.split('')[math.random(max)];
            return s;
        });

        random._(function () { return random(8); });

        this.enhance = _(function () {
            var p = String.prototype;
            p.left = _(Integer, function (len) { return left(this, len); });
            p.right = _(Integer, function (len) { return right(this, len); });
            p.trim = _(function () { return trim(this); });
            p.escape = _(function () { return escape(this); });
            p.unescape = _(function () { return unescape(this); });
        });
    } ();

    var object = this.object = new function () {
        var clear = this.clear = _(Object, function (o) {
            var p = o.constructor.prototype;
            for (var i in o) o[i] = p[i];
        });

        var clone = this.clone = _(Object, function (o) {
            var nO = new o.constructor();
            for (var i in o) nO[i] = o[i];
            return nO;
        });

        var copy = this.copy = _(Object, Object, function (from, to) {
            return copy(from, to, false);
        });

        copy._(Object, Object, Boolean, function (from, to, overwrite) {
            for (var i in from)
                if (to[i] === undefined || overwrite)
                    to[i] = from[i];
        });

        var isEmpty = this.isEmpty = _(Object, function (o) {
            var p = o.constructor.prototype;
            for (var i in o)
                if (p[i] === undefined) return false;
            return true;
        });

        this.enhance = _(function () {
            var p = Object.prototype;
            p.clear = _(function () { clear(this); });
            p.clone = _(function () { clone(this); });
            p.copyTo = _(Object, function (o) { return copy(this, o); });
            p.copyTo._(Object, Boolean, function (o, overwrite) { return copy(this, o, overwrite); });
            p.isEmpty = _(function () { return isEmpty(this); });
        });
    } ();

    var array = this.array = new function () {
        var exists = this.exists = _(Array, Object, function (arr, value) {
            return indexOf(arr, value) >= 0;
        });

        var indexOf = this.indexOf = _(Array, Object, function (arr, value) {
            for (var i = 0; i < arr.length; i++)
                if (arr[i] === value) return i;
            return -1;
        });


        var remove = this.remove = _(Array, Object, function (arr, value) {
            for (var i = 0; i < arr.length; i++)
                if (arr[i] === value)
                    return arr.splice(i, 1);
            return [];
        });

        remove._(Array, Object, Boolean, function (arr, value, all) {
            if (!all) return remove(arr, value);
            var indexs = [];
            for (var i = 0; i < arr.length; i++)
                if (arr[i] === value) indexs.push(i);
            return removeByIndex(arr, indexs);
        });

        var removeByIndex = this.removeByIndex = _(Array, Integer, function (arr, index) {
            return arr.splice(index, 1);
        });

        removeByIndex._(Array, Array, function (arr, indexs) {
            var removed = [], count = 0;
            for (var i = 0; i < indexs.length; i++)
                removed.push(arr.splice(indexs[i] - count++, 1));
            return removed;
        });

        var removeEmpty = this.removeEmpty = _(Array, function (arr) {
            var indexs = [];
            for (var i = 0; i < arr.length; i++)
                if (arr[i] == null) indexs.push(i);
            return removeByIndex(arr, indexs);
        });

        this.enhance = _(function () {
            var p = Array.prototype;
            p.exists = _(Object, function (value) { return exists(this, value); });
            p.indexOf = _(Object, function (value) { return indexOf(this, value); });
            p.remove = _(Object, function (value) { return remove(this, value); });
            p.remove._(Object, Boolean, function (value, all) { return remove(this, value, all); });
            p.removeByIndex = _(Integer, function (index) { return removeByIndex(this, index); });
            p.removeByIndex._(Array, function (indexs) { return removeByIndex(this, indexs); });
            p.removeEmpty = _(function () { return removeEmpty(this); });
        });
    } ();


    var _event = this._event = new function () {
        var objects = [];
        var holders = [];

        this.add = _(Object, String, Function, function (obj, name, callback) {
            name = name.toLowerCase();

            var index = array.indexOf(objects, obj),
                subHolder;

            if (index < 0) {
                index = objects.length;
                objects.push(obj);
                var holder = {};
                holders.push(holder);
                createListener(holder);
            }
            else {
                var holder = holders[index];
                subHolder = holder[name];
                if (subHolder) {
                    if (array.exists(subHolder, callback)) return false;
                    subHolder.push(callback);
                }
                else createListener(holder);
            }

            return true;

            function createListener(holder) {
                var subHolder = holder[name] = [callback];
                subHolder.handler = handler;
                if (obj.addEventListener) obj.addEventListener(name, handler, false);
                else if (obj.attachEvent) obj.attachEvent('on' + name, handler);
            }

            function handler(ev) {
                var e = window.event || ev;
                onEvent(e, obj, name);
            }
        });

        this.remove = _(Object, String, Function, function (obj, name, callback) {
            name = name.toLowerCase();
            var index = array.indexOf(objects, obj);
            if (index < 0) return false;
            else {
                var holder = holders[index],
                    subHolder;
                if (holder && (subHolder = holder[name])) {
                    var idx = array.indexOf(subHolder, callback);
                    if (idx < 0) return false;
                    else {
                        array.removeByIndex(subHolder, idx);
                        if (!subHolder.length) {
                            var handler = subHolder.handler;
                            if (obj.removeEventListener) obj.removeEventListener(name, handler);
                            else if (obj.detachEvent) obj.detachEvent('on' + name, handler);
                            delete holder[name];
                            if (object.isEmpty(holder)) {
                                array.remove(holders, index);
                                array.remove(objects, index);
                            }
                        }
                        return true;
                    }
                }
                return false;
            }
        });

        function onEvent(e, obj, name) {
            var index = array.indexOf(objects, obj);
            var callbacks = holders[index][name];

            foreach(callbacks, function (callback) {
                callback(e);
            });
        }
    } ();

    var regExp = this.regExp = new function () {
        this.email = /^[a-z0-9]+([\._-][a-z0-9]+)*@[a-z0-9]+([\.-][a-z0-9]+)*\.[a-z]{2,}$/i;
    } ();

    var type = this.type = new function () {
        this.isNumber = _(Object, function (o) { return typeof o == 'number'; });
        this.isInteger = _(Object, function (o) { return (typeof o == 'number' && Math.floor(o) == o); });
        this.isArray = _(Object, function (o) { return toString.call(o) == '[object Array]'; });
        this.isFunction = _(Object, function (o) { return toString.call(o) == '[object Function]'; });
    } ();

    var json = this.json = new function () {
        this.post = _(String, String, Object, Function, function (url, name, value, callback) {
            var data = new xmlhttp.Data();
            data[name] = JSON.stringify(value);
            return xmlhttp.post(url, data, jCallback);

            function jCallback(done, json, status) {
                var value;
                if (done) value = JSON.parse(json);
                else value = null;
                callback(done, value, status);
            }
        });
    } ();

    var xmlhttp = this.xmlhttp = new function () {
        var Data = this.Data = _(function () { });
        Data._(Boolean, function (random) {
            if (random) this['_vejisonce_'] = string.random();
        })

        var create = this.create = _(function () {
            if (window.XMLHttpRequest) return new XMLHttpRequest();
            if (window.ActiveXObject) return new ActiveXObject('Microsoft.XMLHTTP');
            return null;
        });

        this.post = _(String, String, function (url, data) { return post(url, data, null); });
        this.post._(String, String, Function, function (url, data, callback) { return post(url, data, callback); });
        this.post._(String, Data, function (url, data) { return post(url, data.toString(), null); });
        this.post._(String, Data, Function, function (url, data, callback) { return post(url, data.toString(), callback); });

        this.get = _(String, String, function (url, data) { return get(url, data, null); });
        this.get._(String, String, Function, function (url, data, callback) { return get(url, data, callback); });
        this.get._(String, Data, function (url, data) { return get(url, data.toString(), null); });
        this.get._(String, Data, Function, function (url, data, callback) { return get(url, data.toString(), callback); });

        function post(url, data, callback) {
            return request('POST', url, data, callback);
        }

        function get(url, data, callback) {
            url += (/[\?&][^\?&=]+=[^?&=]*$/.test(url) ? '&' : '?') + data;
            return request('GET', url, null, callback);
        }

        function request(method, url, data, callback) {
            var xhr = create();
            var isReady;
            xhr.open(method, url, callback ? true : false);
            if (method == 'POST')
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.send(data);

            if (isReady = ready() && callback) {
                setTimeout(onreadystatechange, 0);
                return xhr;
            }

            if (callback) xhr.onreadystatechange = onreadystatechange;

            return xhr;

            function ready() {
                try { xhr.status; return true; }
                catch (e) { return false; }
            }

            function onreadystatechange() {
                if (isReady || xhr.readyState == 4) {
                    if (xhr.status >= 200) {
                        var text = xhr.responseText ? xhr.responseText : '';
                        callback(xhr.status == 200, text, xhr.status);
                    }
                }
            }
        }

        Data.prototype.toString = function () {
            var datas = [];
            var p = Data.prototype;
            for (var i in this)
                if (p[i] === undefined && !(this[i] instanceof Object))
                    datas.push(i + '=' + encodeURIComponent(this[i]));
            return datas.join('&');
        };

    } ();

    /*
    cookies[String name] 获取cookies集合中名为name的Cookie的值.
    cookies.clear() 清除所有Cookie, 并更新cookies集合, 无返回值.
    cookies.del(String name) 删除相应名称的Cookie, 并更新cookies集合, 无返回值.
    cookies.del(Array names) 批量删除相应名称的Cookie, 并更新cookies集合, 无返回值.
    cookies.get(String name) 更新cookies集合, 获取相应名称的Cookie的值, 返回值为String.
    cookies.refresh() 更新cookies集合, 无返回值.
    cookies.set(String name, String value) 设置相应名称的Cookie的值, 并更新cookies集合, 无返回值.
    cookies.set(String name, String value, Date date) 设置相应名称的Cookie的值与过期时间, 并更新cookies集合, 无返回值.
    cookies.set(Array names, Array values) 批量设置相应名称的Cookie的值, 并更新cookies集合, 无返回值.
    */

    this.cookies = new function () {
        var cookies = {},
            re = /([^; ]+?)=([^; ]*)/g,
            nre = /^[!-\+\--9<>-~]+$/;

        var names = [];

        var refresh = cookies.refresh = _(function () {
            for (var name in cookies)
                if (typeof cookies[name] == 'string')
                    delete cookies[name];
            names.length = 0;
            var str = document.cookie;
            str.replace(re, function (a, name, value) {
                cookies[name] = unescape(value);
                names.push(name);
            });
        });

        cookies.get = _(String, function (name) {
            checkName(name);
            refresh();
            return cookies[name];
        });

        cookies.set = _(String, String, function (name, value) {
            checkName(name);
            document.cookie = name + '=' + escape(value);
            refresh();
        });

        cookies.set._(String, String, Date, function (name, value, date) {
            checkName(name);
            document.cookie = name + '=' + escape(value) + '; expire=' + date.toGMTString();
            refresh();
        });

        cookies.set._(Array, Array, function (names, values) {
            var len = names.length;
            if (len != values.length) error('The length of array "names" needs to be the same as that of "values".');
            for (var i = 0; i < len; i++) {
                var name = names[i], value = values[i];
                if (typeof name != 'string') error('The "names" needs to be array of strings.');
                checkName(name);
                if (typeof value != 'string') error('The "values" needs to be array of strings.');
                document.cookie = name + '=' + escape(value);
            }
            refresh();
        });

        var del = cookies.del = _(String, function (name) {
            checkName(name);
            document.cookie = name + '=; expire=' + getPreGMT();
            refresh();
        });

        cookies.del._(Array, function (names) {
            var t = getPreGMT();
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                if (typeof name != 'string') error('The "names" needs to be array of strings.');
                checkName(name);
                document.cookie = name + '=; expire=' + t;
            }
            refresh();
        });

        cookies.clear = _(function () {
            del(names);
        });

        refresh();

        return cookies;

        function checkName(str) {
            if (!nre.test(str)) error('Illegal cookie name.')
        }

        function getPreGMT() {
            var date = new Date();
            date.setTime(date.getTime() - 1);
            return date.toGMTString();
        }
    } ();

    this.html = new function () {
        var isClass = this.isClass = _(Object, String, function (ele, className) {
            if (!className) error('"className" can not be empty string.');
            var c = ele.className;
            if (!c) return false;
            return eval('/^(.* )?' + className + '( .*)?$/').test(c);
        });

        var gEBCN = this.getElementsByClassName = _(Object, String, String, function (parentEle, tagName, className) {
            var eles = parentEle.getElementsByTagName(tagName);
            var arr = [];
            foreach(eles, function (ele) {
                if (isClass(ele, className)) arr.push(ele);
            });
            return arr;
        });

        gEBCN._(String, String, function (tagName, className) {
            return gEBCN(document, tagName, className);
        });

        gEBCN._(String, function (className) {
            var arr = [];
            var eles = document.all || document.getElementsByTagName('*');
            vejis.foreach(eles, function (ele) {
                if (isClass(ele, className)) arr.push(ele);
            });
            return arr;
        });

        this.createStyleSheet = _(String, function (cssText) {
            if (document.createStyleSheet)
                document.createStyleSheet().cssText = cssText;
            else {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.textContent = cssText;
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        });

    } ();

} ();
/*
By Vilic Vane
http://www.vilic.info/

?2010 Groinup Studio
All rights reserved.

Redistribution and use in source and binary forms,
with or without modification, are permitted provided
that the following conditions are met:
Redistributions of source code must retain the above
copyright notice, this list of conditions and the
following disclaimer.
Redistributions in binary form must reproduce the
above copyright notice, this list of conditions and
the following disclaimer in the documentation and/or
other materials provided with the distribution.
Neither the name of the Groinup Studio nor the names
of its contributors may be used to endorse or promote
products derived from this software without specific
prior written permission.
*/

vejis.ready(function () {
    var className = 'codeArea', //自定义类名
        maxLineCount = 15, //最多同时显示的行数
        lineHeight = 16, //行高
        scrollBarWidth = 24, //预计滚动条宽度
        cssText = //CSS内容
        'div.vlight { position: relative; margin: 5px 0px; border: solid 1px #FFF3D0; line-height: ' + lineHeight + 'px; color: #000000; font-size: 12px; font-family: Courier New, monospace; white-space: nowrap; overflow: hidden; }' +
        'div.vlight div.vlight_top { height: 5px; background-color: #FFE8A6; font-size: 0px; }' +
        'div.vlight div.vlight_left { position: absolute; width: 65px; left: 0px; text-align: right; color: #2B91AF; overflow: hidden; }' +
        'div.vlight div.vlight_left div { position: relative; width: 40px; left: 0px; padding-right: 5px; border-left: solid 16px #F0F0F0; border-right: solid 4px #6CE26C; }' +
        'div.vlight div.vlight_main { position: relative; margin-left: 65px; padding-left: 5px; overflow-x: scroll; overflow-y: auto; }' +
        'div.vlight span.vlight_cm { color: #008000; }' +
        'div.vlight span.vlight_re { color: #000000; }' +
        'div.vlight span.vlight_st { color: #800000; }' +
        'div.vlight span.vlight_ky { color: #0000FF; }' +
        'div.vlight span.vlight_mk { color: #0000FF; }' +
        'div.vlight span.vlight_lb { color: #800000; }' +
        'div.vlight span.vlight_vn { color: #FF0000; }' +
        'div.vlight span.vlight_vl { color: #0000FF; }' +
        'div.vlight span.vlight_sl { color: #800000; }' +
        'div.vlight span.vlight_bl { color: #0000FF; }' +
        'div.vlight span.vlight_cn { color: #FF0000; }' +
        'div.vlight span.vlight_cv { color: #0000FF; }';

    cssText = cssText.replace(/vlight/g, className); //替换类名
    vejis.html.createStyleSheet(cssText); //创建样式

    var eles = vejis.html.getElementsByClassName(className); //获取元素
    var spanl = '<span class="' + className + '_', //初始化标签
        spanm = '">',
        spanr = '</span>';

    //处理每一个类名符合的元素
    vejis.foreach(eles, function (ele) {
        var div = document.createElement('div');
        div.className = className;
        div.innerHTML =
        '<div class="' + className + '_top"></div>' +
        '<div class="' + className + '_left"></div>';

        var top = div.childNodes[0],
            left = div.childNodes[1];

        var main = document.createElement('div');
        main.className = className + '_main';

        var oText;
        if (ele.tagName == 'TEXTAREA') oText = ele.value; //如果是textarea则直接取value
        else if (ele.tagName == 'PRE') oText = ele.innerText || ele.innerHTML;
        else oText = htmlToText(ele.innerHTML);

        var text;

        if (/^\s*</.test(oText)) text = convertHTML(oText);
        else {
            var temp = oText.replace(/(\/\*[\s\S]*?\*\/)/g, '').replace(/((['"])(\2|.*?([^\\]\2|\\\\\2)))/g, '');

            var cssKeysCount = (temp.match(/[\w.#]+\s*{[\s\S]*?}/g) || []).length;
            var jsKeysCount = (temp.match(/(^|[^\w])(var|for|if|else|function)[^\w]|=|\+/g) || []).length;

            text = cssKeysCount > jsKeysCount ? convertCSS(oText) : convertJS(oText);
        }

        var result = finalDeal(text); //转换文本到高亮的HTML

        main.innerHTML = result.html;
        div.appendChild(main);

        //创建行号
        var lines = ''
        for (var i = 1; i <= result.count; i++)
            lines += i + '<br />';
        left.innerHTML = '<div>' + lines + '</div>';

        //将原来的元素替换成代码高亮区域
        ele.parentNode.replaceChild(div, ele);

        //设置高宽
        left.style.height = main.style.height = lineHeight * (result.count > maxLineCount ? maxLineCount : result.count) + scrollBarWidth + 'px';
        left.childNodes[0].style.height = result.count * lineHeight + scrollBarWidth + 'px';

        //绑定事件
        vejis._event.add(window, 'resize', resize);
        vejis._event.add(main, 'scroll', scroll);

        resize(); //初始化

        function resize() {
            try {
                main.style.width = top.offsetWidth - left.offsetWidth - 5 + 'px';
            } catch (e) { }
        }

        function scroll() {
            left.childNodes[0].style.marginTop = -main.scrollTop + 'px';
        }
    });

    function htmlToText(html) {
        return html.replace(/\r?\n/g, '').replace(/<p(\s[^>]*)?>([\s\S]*?)<\/p>/gi, '$2\r\n\r\n').replace(/<div(\s[^>]*)?>([\s\S]*?)<\/div>/gi, '$2\r\n').replace(/<([a-z]+)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, '$3').replace(/<br[^>]*>/gi, '\r\n').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    }

    function textToHTML(text) {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function convertHTML(text) {
        var globalRE = /(<!\-\-[\s\S]*?\-\->)|(<script(\s[^>]*)?>[\s\S]*?<\/script>)|(<style(\s[^>]*)?>[\s\S]*?<\/style>)|(<(!doctype|\/?[a-z-_]+)([^>]*)>)/ig;

        var cmRE = /^<!\-\-[\s\S]*?\-\->$/;
        var scRE = /^(<script(\s[^>]*)?>)([\s\S]*?)(<\/script>)$/i;
        var stRE = /^(<style(\s[^>]*)?>)([\s\S]*?)(<\/style>)$/i;
        var otRE = /^<(!doctype|\/?[a-z-_]+)([^>]*)>$/i;

        var nlRE = /^(<[!\/]?)([a-z-_]+)([^>]*?(?=[\/>]))(\/?>)$/i;

        var vlGlobalRe = /[a-z_]+\s*=\s*(".*?("|(?=$))|'.*?('|(?=$))|[^\s]*)|[a-z_]+ *=|[a-z_]+|(".*?("|(?=$))|'.*?('|(?=$)))/gi;

        var vlfRE = /^([a-z_]+)(\s*=\s*)(".*?("|(?=$))|'.*?('|(?=$))|[^\s]*)$/i;
        var vlneRE = /^([a-z_]+)(\s*=)$/i;
        var vlnRE = /^([a-z_]+)$/i;
        var vlvRE = /^(".*?("|(?=$))|'.*?('|(?=$)))$/;

        text = text.replace(/&/g, '&amp;');
        text = text.replace(globalRE, function (s) {
            var parts;
            if (cmRE.test(s))
                return spanl + 'cm' + spanm + textToHTML(s) + spanr;
            if (parts = scRE.exec(s))
                return normalLabel(parts[1]) + convertJS(parts[3]) + normalLabel(parts[4]);
            if (parts = stRE.exec(s))
                return normalLabel(parts[1]) + convertCSS(parts[3]) + normalLabel(parts[4]);
            if (otRE.test(s))
                return normalLabel(s);
        });

        return text;

        function normalLabel(text) {
            var parts = nlRE.exec(text);

            return (
                spanl + 'mk' + spanm + textToHTML(parts[1]) + spanr +
                spanl + 'lb' + spanm + parts[2] + spanr +
                (parts[3] ? a = labelValues(parts[3]) : '') +
                spanl + 'mk' + spanm + textToHTML(parts[4]) + spanr
            );
        }

        function labelValues(text) {
            text = text.replace(vlGlobalRe, function (s) {
                var parts;
                if (parts = vlfRE.exec(s))
                    return (
                        spanl + 'vn' + spanm + parts[1] + spanr +
                        spanl + 'mk' + spanm + parts[2] + spanr +
                        spanl + 'vl' + spanm + parts[3] + spanr
                    );
                if (parts = vlneRE.exec(s))
                    return (
                        spanl + 'vn' + spanm + parts[1] + spanr +
                        spanl + 'mk' + spanm + parts[2] + spanr
                    );
                if (vlnRE.test(s))
                    return spanl + 'vn' + spanm + s + spanr;
                if (vlvRE.test(s))
                    return spanl + 'mk' + spanm + s + spanr;
                return s;
            });

            return text;
        }
    }

    function convertCSS(text) {
        var globalRE = /\/\*[\s\S]*?\*\/|@[a-z-]+[\s\S]*?(;|\{|$)|[^\{\}\s,]+|\{[\s\S]*?\}/gi;

        var cmRE = /^\/\*[\s\S]*?\*\/$/;
        var blRE = /^(@[a-z-]+)([\s\S]*?(;|\{|$))$/i;
        var slRE = /^[^\{\}\s,]+$/;
        var ctRE = /^\{([\s\S]+?)\}$/;
        var csRE = /([a-z-]+)( *:\s*)([\s\S]*?)(;|$)/gi;

        text = textToHTML(text); //符号处理

        //匹配
        text = text.replace(globalRE, function (s) {
            var parts;
            if (cmRE.test(s)) return spanl + 'cm' + spanm + s + spanr;
            if (parts = blRE.exec(s)) return spanl + 'bl' + spanm + parts[1] + spanr + parts[2];
            if (slRE.test(s)) return spanl + 'sl' + spanm + s + spanr;
            if (parts = ctRE.exec(s)) return '{' + cssValues(parts[1]) + '}';
            return s;
        });

        return text;

        function cssValues(text) {
            text = text.replace(csRE, function (s) {
                var parts = arguments;
                return (
                    spanl + 'cn' + spanm + parts[1] + spanr +
                    parts[2] +
                    spanl + 'cv' + spanm + parts[3] + spanr +
                    parts[4]
                );
            })

            return text;
        }

    }

    function convertJS(text) {
        var names = ['cm', 're', 'st', 'ky']; //类名的后缀

        //全局正则表达式
        var globalRE = /((\/\*[\s\S]*?\*\/|\/\/.*)|('('|.*?([^\\]'|\\\\'))|"("|.*?([^\\]"|\\\\")))|\/(\/|.*?([^\\]\/|\\\\\/))[gim]{0,3}|([^\w]|^)(break|delete|function|return|typeof|case|do|if|switch|var|catch|else|in|this|void|continue|false|instanceof|throw|while|debugger|finally|new|true|with|default|for|null|try)(?=[^\w]|$))/g;

        //拆分开的正则表达式
        var res = [
            /^(\/\*[\s\S]*?\*\/|\/\/.*)$/,
            /^\/(\/|.*?([^\\]\/|\\\\\/))[gim]{0,3}$/,
            /^'('|.*?([^\\]'|\\\\'))|"("|.*?([^\\]"|\\\\"))$/,
            /(break|delete|function|return|typeof|case|do|if|switch|var|catch|else|in|this|void|continue|false|instanceof|throw|while|debugger|finally|new|true|with|default|for|null|try)$/
        ];

        text = textToHTML(text); //符号处理

        //匹配
        text = text.replace(globalRE, function (s) {
            for (var i = 0; i < res.length; i++) {
                if (!res[i].test(s)) continue;
                var spanl2m = spanl + names[i] + spanm;

                s = s.replace(res[i], function (s) {
                    return spanl2m + s + spanr; //加标签
                });
                return s;
            }
        });

        return text;
    }

    function finalDeal(text) {
        var count = 1; //行数
        //字符处理
        text = text.replace(/\t/g, '    ').replace(/  /g, '&nbsp; ').replace(/  /g, ' &nbsp;').replace(/(\r?\n)+$/g, '').replace(/\r?\n/g, function () { count++; return '<br />'; });
        return { html: text, count: count };
    }
});

