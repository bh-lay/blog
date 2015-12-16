/**
 * higlight 
 *  Base on https://github.com/niceue/highlight
**/
define(function(){

    var ruleSet = {};
    function highlight(text, lang){
        switch (typeof text) {
            case 'undefined':
            case 'object':
                highlightElements(text || document);
                break;
            case 'string':
                return parse(text, lang);
        }
    }

    //添加高亮语法
    highlight.add = function(lang,data, rules) {
        var exp, rule, arr = [];
        arr.toString = joinExp;

        for (var className in rules) {
            rule = rules[className];
            exp = (typeof rule.exp !== "string") ? String(rule.exp).substr(1, String(rule.exp).length-2) : rule.exp;

            arr.push({
                className : className,
                exp : "(" + exp + ")",
                length : (exp.match(/(^|[^\\])\([^?]/g) || "").length + 1, // number of subexps in rule
                replacement : rule.replacement || null
            });
        }

        var a = lang.split(' '), i = a.length;
        while (i--) {
            ruleSet[ a[i] ] = {
                data: data || {},
                rules: arr
            };
        }
    };

    function highlightElements(node) {
        var parent = node.parentNode,
            html;
        lang = (node.className || '').match(/(?:^|\s)(javascript|css|html)(?:$|\s)/);
        lang = lang ? lang[1] : 'javascript';
        html =  parse(node.innerHTML, lang);
        if(parent && (parent.tagName||'').toLowerCase() == 'pre'){
            node = parent;
        }
        node.outerHTML = html;
    }

    function joinExp() {
        var exps = [];
        for (var i = 0; i < this.length; i++) exps.push(this[i].exp);
        return exps.join("|");
    }

    function parse(text, lang) {
        var lang = lang || 'js',
            config = ruleSet[lang],
            rules = config.rules,
            parsed, arr;
        parsed = text.replace(/\r?\n$/, '').replace(new RegExp(rules, "g"), function() {
            var i = 0, j = 1, rule;
            while (rule = rules[i++]) {
                if (arguments[j]) {
                    // if no custom replacement defined do the simple replacement
                    if (!rule.replacement){
                        return '<span class="' + rule.className + '">' + arguments[0] + '</span>';
                    } else if(typeof rule.replacement == 'function' ){
                        return rule.replacement(arguments[0],rule);
                    } else {
                        // replace $0 with the className then do normal replaces
                        var str = rule.replacement.replace("$0", rule.className);
                        for (var k = 1; k <= rule.length - 1; k++){
                            str = str.replace("$" + k, arguments[j + k]);
                        }
                        return str;
                    }
                } else j+= rule.length;
            }
        });
        arr = parsed.split(/\r?\n/);
        
        parsed = '<div>' + arr.join('</div><div>')+'</div>';
        parsed = '<div class="highlight ' + lang + '">'+ parsed +'</div>';
        return parsed;
    }

    highlight.add("js javascript json",{
            className: 'js'
        },{
        blockComments: {
            exp: /\/\*[^*]*\*+([^\/][^*]*\*+)*\//,
            replacement : function(str){
                var start = '<span class="comment">',
                    end = "</span>",
                    text = start + str.replace(/\r?\n/g,end + '\r\n' + start) + end;
                return text;
            }
        },
        inlineComments : {
            exp  : /(\/\/[^\n]*(\n|$))/,//  /[^\\]\/\/[^\n]*(\n|$)/,
            replacement: "<span class=\"comment\">$1</span>"
        },
        string : {
            exp  : /'[^'\\]*(\\.[^'\\]*)*'|"[^"\\]*(\\.[^"\\]*)*"/
        },
        number: {
            exp  : /([^"'][+\-]?)(\d+)([^"'])/,
            replacement: "$1<span class=\"$0\">$2</span>$3"
        },
        regex: {
            exp  : /\/[^\n]+[^\\]\//,
        },
        keywords : {
            exp  : /\b(arguments|break|case|continue|default|delete|do|else|false|for|function|if|in|instanceof|new|null|return|switch|this|true|typeof|var|void|while|with|replace)\b/
        },
        global : {
            exp  : /\b(toString|valueOf|window|element|prototype|constructor|document|location|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity|Date)\b/
        }
    });
    highlight.add("html xml", {
            className: 'html'
        },{
        tag : {
            exp: /(&lt;\/?)([a-zA-Z]+\s?)/,
            replacement: "$1<span class=\"$0\">$2</span>"
        },
        comment : {
            exp: /&lt;!\s*(--([^\-]|[\r\n]|-[^\-])*--\s*)&gt;/
        },
        tag : {
            exp: /(&lt;\/?)([a-zA-Z]+\s?)/,
            replacement: "$1<span class=\"$0\">$2</span>"
        },
        string : {
            exp  : /'[^']*'|"[^"]*"/
        },
        attribute : {
            exp: /\b([a-zA-Z\-:]+)(=)/,
            replacement: "<span class=\"$0\">$1</span>$2"
        },
        data: {
            exp: /\s(data-[a-zA-z\-]+)/
        },
        doctype : {
            exp: /&lt;!DOCTYPE([^&]|&[^g]|&g[^t])*&gt;/
        }
    });
    highlight.add("css",{
            className: 'css'
        },{
        comment : {
            exp  : /\/\*[^*]*\*+([^\/][^*]*\*+)*\//
        },
        keywords : {
            exp  : /@\w[\w\s]*/
        },
        selectors : {
            exp  : "([\\w-:\\[.#][^{};>]*)(?={)"
        },
        properties : {
            exp  : "([\\w-]+)(?=\\s*:)"
        },
        units : {
            exp  : /([0-9])(px|em|en|%|pt|rem)\b/,
            replacement : "$1<span class=\"$0\">$2</span>"
        },
        colors: {
            exp: /#[A-Za-z0-9]{3,6}/
        },
        urls : {
            exp  : /url\(([^\)]*)\)/,
            replacement : "url(<span class=\"$0\">$1</span>)"
        },
        important: {
            exp: /!important/
        }
     });

    return highlight;
});