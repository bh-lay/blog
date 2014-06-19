define("gallery/fileItem", [ "util/event", "util/panel", "util/toucher", "UI/pop" ], function(require, exports) {
    var events = require("util/event.js");
    var panel = require("util/panel.js");
    var toucher = require("util/toucher.js");
    var UI = require("UI/pop.js");
    var file_item_tpl = [ '<div class="gP_item" data-type="file" data-fullname="{fullname}" >', '<div class="gP_item_body">', '<div class="gP_file_item">', '<div class="gP_file-ico">{ico}</div>', '<div class="gP_file-name" title="{fullname}" ><strong>{filename}</strong><span>{extension}</span></div>', "</div>", '<div class="gP_item_tools">', '<div class="gP_item_toolsCnt">', '<a href="javascript:void(0)" class="gP_tool_btn" data-action="del">', '<span class="gP_tool_btn_ico"><span class="glyphicon glyphicon-trash"></span></span>', '<strong class="gP_tool_btn_name">删除</strong>', "</a>", '<a href="javascript:void(0)" class="gP_tool_btn" data-action="rename">', '<span class="gP_tool_btn_ico"><span class="glyphicon glyphicon-pencil"></span>', '<strong class="gP_tool_btn_name">重命名</strong>', "</a>", "</div>", "</div>", '<a href="javascript:void(0)" class="gP_item_toolBar"><span class="glyphicon glyphicon-chevron-down"></span></a>', '<a href="javascript:void(0)" class="gP_item_check"><span class="glyphicon glyphicon-unchecked"></span><span class="glyphicon glyphicon-check"></span></a>', "</div>", "</div>" ].join("");
    function render(tpl, data) {
        var extHtml = '<span class="glyphicon glyphicon-file"></span>';
        if (data.extension.match(/^\.(jpg|gif|bmp|jpeg|png)$/i)) {
            extHtml = '<span class="glyphicon glyphicon-picture"></span>';
        } else if (data.extension.match(/^\.(zip|rar|tar)$/i)) {
            extHtml = '<span class="glyphicon glyphicon-compressed"></span>';
        }
        data.ico = extHtml;
        var txt = "";
        txt += tpl.replace(/{(\w*)}/g, function() {
            var key = arguments[1];
            return data[key] || "";
        });
        return txt;
    }
    /**
	 * @method parseFullname 解析文件名
	 * @param String fullname 文件全名
	 * @param String basePath 文件所在目录
	 * @param String domain 文件所在域名
	 * 
	 * @returns Object file 文件对象
	 * @returns String file.fullname 文件全名
	 * @returns String file.filename 文件名
	 * @returns String file.extension 扩展名
	 * @returns String file.pathname 文件所在路径+文件全名
	 * @returns String file.url 文件绝对地址
	 * 
	 * @example
	 * 	var file = parseFullname('readme.txt');
	 * 	file.fullname; //'readme.txt'
	 * 	file.filename; //'readme'
	 * 	file.extension; //'.txt'
	 */
    function parseFullname(fullname, basePath, domain) {
        var fullname = fullname || "";
        var match = fullname.match(/(.*)\.(\w+)$/);
        //文件基础名
        var filename = match ? match[1] : fullname;
        //文件扩展名
        var extension = match ? "." + match[2] : "";
        //文件完整路径
        var pathname = "/" + basePath + "/" + fullname;
        //过滤路径中重复的//
        pathname = pathname.replace(/\/+/g, "/");
        //过滤域名尾部的/
        domain = domain.replace(/\/$/, "");
        //URL地址
        var url = domain + pathname;
        return {
            fullname: fullname,
            filename: filename,
            extension: extension,
            pathname: pathname,
            url: url
        };
    }
    //删除文件
    function delFile(pathname, callback) {
        $.ajax({
            url: "/ajax/asset/del",
            type: "POST",
            data: {
                path: pathname
            },
            dataType: "json",
            success: function(data) {
                callback && callback(null, data);
            },
            error: function() {
                callback && callback("网络出错");
            }
        });
    }
    /**
	 * 为目录/文件绑定事件
	 * 对象必须包含属性
	 *   dom
	 * 方法
	 *   del
	 * 
	 */
    function bindItemEvent() {
        var this_file = this;
        var itemDom = this.dom;
        itemDom.on("click", 'a[data-action="del"]', function() {
            //删除
            this_file.del();
        }).on("click", 'a[data-action="rename"]', function() {
            //重命名
            this_file.rename();
        }).on("click", ".gP_item_toolBar", function() {
            //打开操作面板状态
            if (itemDom.hasClass("gP_item_menuing")) {
                itemDom.removeClass("gP_item_menuing");
            } else {
                itemDom.removeClass("gP_item_menuing");
                itemDom.addClass("gP_item_menuing");
            }
        }).on("click", ".gP_item_check", function() {
            //切换选中状态
            this_file.select();
        });
        var touchEvents = toucher(itemDom.find(".gP_item_body")[0]);
        touchEvents.on("swipeLeft", function() {
            itemDom.find(".gP_item_body").animate({
                left: -100
            }, 80);
        }).on("swipeRight", function() {
            itemDom.find(".gP_item_body").animate({
                left: 0
            }, 80);
        }).on("longTap", function() {
            //切换选中状态
            this_file.select();
        });
    }
    /**
	 * 文件类
	 * @param {Object} dom
	 * @param {Object} param
	 */
    function fileItem(basePath, param) {
        /**
		 * 状态
		 * 正常 normal
		 * 选中 selected
		 * 菜单 menuing
		 * 上传中uploading
		 */
        this._status = param.status || "normal";
        this.fullname = param.name;
        var file = parseFullname(this.fullname, basePath, "http://asset.bh-lay.com/");
        this.filename = file.filename;
        this.extension = file.extension;
        this.pathname = file.pathname;
        this.url = file.url;
        var html = render(file_item_tpl, {
            fullname: this.fullname,
            filename: this.filename,
            extension: this.extension
        });
        this.dom = $(html);
        bindItemEvent.call(this);
        this.status(this._status);
    }
    fileItem.prototype = {
        status: function(name, value) {
            var need_change = true;
            if (name == "uploading") {
                this.dom.addClass("gP_item_uploading");
            } else if (name == "normal") {
                this.dom.removeClass("gP_item_uploading");
                this.dom.removeClass("gP_item_menuing");
                this.dom.removeClass("gP_item_checked");
            } else {
                need_change = false;
            }
            if (need_change) {
                this._status = name;
            }
        },
        del: function() {
            var pathname = this.pathname;
            var DOM = this.dom;
            UI.confirm({
                text: "删除就找不回来了，你再想想？",
                callback: function() {
                    //发送删除请求
                    delFile(pathname, function(err) {
                        if (err) {
                            UI.prompt(err);
                            return;
                        }
                        DOM.addClass("gP_item_deleted");
                        DOM.css({
                            position: "relative",
                            height: DOM.find(".gP_item_body").height(),
                            background: "#333"
                        });
                        DOM.find(".gP_item_body").css({
                            position: "absolute",
                            width: "100%",
                            height: "100%"
                        }).animate({
                            left: "100%"
                        }, 300, function() {
                            DOM.slideUp(120, function() {
                                DOM.remove();
                            });
                        });
                    });
                }
            });
        },
        rename: function(callback) {
            //	console.log(name,txt);
            var this_file = this;
            var ask = UI.ask("快想一个新名字！", function(txt) {
                var newName = txt;
                $.ajax({
                    url: "/ajax/asset/rename",
                    type: "POST",
                    data: {
                        pathname: this_file.pathname,
                        newName: newName
                    },
                    dataType: "json",
                    success: function(data) {
                        if (data && data.code == 200) {
                            this_file.filename = newName;
                            this_file.fullname = this_file.filename + this_file.extension;
                            var item_dom = this_file.dom.find(".gP_file-name");
                            item_dom.find("strong").html(this_file.filename);
                            item_dom.attr("title", this_file.fullname);
                            callback && callback(null, data);
                        } else {
                            UI.prompt("重命名失败");
                            callback && callback("重命名失败");
                        }
                    },
                    error: function() {
                        callback && callback("网络出错");
                    }
                });
            });
            //设置对话框纯文件名
            ask.setValue(this.filename);
        },
        select: function() {
            if (this._status == "selected") {
                this._status = "normal";
                this.dom.removeClass("gP_item_checked");
            } else {
                this._status = "selected";
                this.dom.addClass("gP_item_checked");
            }
        }
    };
    return fileItem;
});

/**
 * @author bh-lay
 * util.events;
 *
 * var evevts = new util.events();
 * events.on('ready',function(){
 * 	//do something
 * });
 * events.emit('ready',args[0],args[1],args[2]);
 * 
 * or
 * //For your own object extend event
 * util.events.extend(this);
 * 
 */
window.util = window.util || {};

(function(exports) {
    function ON(eventName, callback) {
        //事件堆无该事件，创建一个事件堆
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }
    function EMIT(eventName, args) {
        //事件堆无该事件，结束运行
        if (!this.events[eventName]) {
            return;
        }
        for (var i = 0, total = this.events[eventName].length; i < total; i++) {
            this.events[eventName][i].call(this.event_global || this, args);
        }
    }
    //继承
    function EXTEND() {
        this.events = {};
        this.on = ON;
        this.emit = EMIT;
    }
    function EVENTS(global) {
        this.events = {};
        this.event_global = global || null;
    }
    EVENTS.prototype = {
        on: ON,
        emit: EMIT
    };
    exports.events = EVENTS;
    exports.events.extend = EXTEND;
})(window.util);

//提供commonJS规范的接口
window.define && define("util/event", [], function(require, exports) {
    exports.events = window.util.events;
    exports.extend = window.util.events.extend;
});

/**
 * @author 剧中人
 * @github https://github.com/bh-lay/panel
 * @modified 2014-4-16 21:35
 * panel
 * the right key of mouse
 *
 *
 *  DEMO
 * //创建一个右键绑定
 * 	var o = panel({
 * 		targets :'.testButton',
 * 		list : {
 * 			'open' : {'txt' : '打开'},
 * 			'rename' : {'txt' : '重命名','display' : 'disable'},
 * 			'delete' : {'txt' : '删除'}
 * 		},
 * 		callbefore:function(){
 * 			//右键之后菜单弹出之前，可以在这里做些事情
 * 		},
 * 		callback:function(name) {
 * 			console.log('you have chioce "' , name , '" from the [ ' , this , ']');
 * 		}
 * 	});
 * //指定类型
 * 	o.type = 'menu';//@param:'menu','dock'
 * //选项置灰
 * 	o.display('rename','disable');
 * //选项恢复
 * 	o.display('delete','hide');
 * //增删菜单条目
 * 	o.add('test',{'txt':'测试'},function(){
 * 		alert(12)
 * 	});
 * 	o.remove('copy');
 */
window.util = window.util || {};

window.util.panel = window.util.panel || function(param) {
    var param = param || {};
    var doms_path = param["targets"] || null, type = param["type"] || "menu", args = param["list"] || {}, callback = param["callback"] || null, callbefore = param["callbefore"] || null;
    return new window.util.panel.init(doms_path, type, args, callback, callbefore);
};

(function(exports) {
    ////////////////////////////////////////////
    var console = window.console || {
        log: function() {}
    };
    var private_win = $(window), private_winW, private_winH, private_scrollTop, private_scrollLeft, private_active_panel = null, private_body = $("html,body");
    var menu_tpl = [ '<div class="panel_menu panel_mark"><ul class="pa_me_list">{-content-}</ul></div>' ];
    var dock_tpl = [ '<div class="panel_dock panel_mark"><div class="pa_do_body">{-content-}</div></div>' ];
    var style_tpl = [ '<style type="text/css">', ".panel_menu{position: absolute;z-index :10000;width:140px;background:#fff;border:1px solid #bbb;border-radius:4px;}", ".pa_me_list{padding:5px 0px;margin:0px;}", ".pa_me_list span,", ".pa_me_list a{line-height:24px;display:block;font-size:12px;text-indent:2em;padding: 2px 5px;text-decoration:none;}", ".pa_me_list span{cursor: default;color:#aaa;}", ".pa_me_list a{color:#444;}", ".pa_me_list a:hover{color:#000;background:#eee;}", ".panel_dock{position: absolute;z-index :10000;background:#444;border-radius:4px;box-shadow:1px 1px 40px #000;_border:1px solid #666;}", ".pa_do_body{padding:0px 10px;}", ".panel_dock span,", ".panel_dock a{line-height:32px;display:inline-block;font-size:12px;color:#888;padding: 0px 10px;}", ".panel_dock span{cursor: default;}", ".panel_dock a{color:#f4f4f4;}", ".panel_dock a:hover{color:#222;background:#eee;}", "</style>" ];
    function reCountSize() {
        private_winW = private_win.width();
        private_winH = private_win.height();
        private_scrollTop = private_win.scrollTop();
        private_scrollLeft = private_win.scrollLeft();
    }
    function change_dispaly(name, check) {
        if (typeof this["list"][name] == "object") {
            this["list"][name]["display"] = check;
        }
    }
    // Unified to remove panel dom
    function remove_panel() {
        if (private_active_panel) {
            private_active_panel.fadeOut(100, function() {
                $(this).remove();
            });
            private_active_panel = null;
        }
    }
    //重算浏览器尺寸
    reCountSize();
    setTimeout(reCountSize, 1e3);
    $(function() {
        $("head").append(style_tpl.join(""));
        //try to close panel
        var bingo_panel = false;
        $("body").on("mousedown", ".panel_mark", function() {
            bingo_panel = true;
        }).on("mousedown", function() {
            setTimeout(function() {
                if (!bingo_panel) {
                    remove_panel();
                }
                bingo_panel = false;
            }, 20);
        }).on("contextmenu", ".panel_mark", function() {
            return false;
        });
        //window resize 
        var delay;
        $(window).on("resize scroll", function() {
            clearTimeout(delay);
            delay = setTimeout(function() {
                reCountSize();
                remove_panel();
            }, 100);
        });
    });
    //////////////////////////////////
    function show_panel(left, top, type, param, this_dom, callback) {
        var panel_tpl = "";
        switch (type) {
          case "menu":
            panel_tpl = menu_tpl.join("");
            break;

          case "dock":
            panel_tpl = dock_tpl.join("");
            break;

          default:
            console.log("error");
            return;
        }
        var list_html = "";
        for (var i = 0 in param) {
            param[i]["display"] = param[i]["display"] || "show";
            switch (param[i]["display"]) {
              case "show":
                if (param[i]["callback"]) {
                    list_html += '<a data-callback="true" data-name="' + (i || "") + '" href="javascript:;">' + (param[i]["txt"] || "") + "</a>";
                } else {
                    list_html += '<a data-name="' + (i || "") + '" href="javascript:;">' + (param[i]["txt"] || "") + "</a>";
                }
                break;

              //case 'hide':
                //break
                case "disable":
                list_html += '<span data-name="' + (i || "") + '" href="javascript:;">' + (param[i]["txt"] || "") + "</span>";
                break;
            }
        }
        panel_tpl = panel_tpl.replace(/{-content-}/, list_html);
        var panel_dom = $(panel_tpl);
        panel_dom.on("click", "a", function() {
            remove_panel();
            var this_name = $(this).attr("data-name") || "";
            if ($(this).attr("data-callback")) {
                var this_name = $(this).attr("data-name");
                if (param[this_name]["callback"]) {
                    param[this_name]["callback"].call(this_dom, this_name);
                }
            } else {
                callback.call(this_dom, this_name);
            }
        });
        //append panel dom and mark the dom mark
        remove_panel();
        $("body").append(panel_dom);
        private_active_panel = panel_dom;
        // setting panel dom position
        var panel_h = panel_dom.outerHeight(), panel_w = panel_dom.outerWidth();
        if (panel_h + top > private_winH + private_scrollTop) {
            top = private_scrollTop + private_winH - panel_h;
        }
        if (panel_w + left > private_winW + private_scrollLeft) {
            left = private_scrollLeft + private_winW - panel_w;
        }
        panel_dom.css({
            top: top,
            left: left
        });
    }
    ///////////////////////////////////////////
    function filter_clone(args) {
        var obj = {};
        for (var i = 0 in args) {
            obj[i] = {};
            obj[i]["txt"] = args[i]["txt"];
            if (args[i]["display"] && args[i]["display"].match(/^(show|hide|disable)$/)) {
                obj[i]["display"] = args[i]["display"];
            } else {
                obj[i]["display"] = "show";
            }
            obj[i]["callback"] = args[i]["callback"] || null;
        }
        return obj;
    }
    // exports start /////////////////////////////////////////
    function construction(doms_path, type, args, callback, callbefore) {
        var this_panel = this;
        this.type = type;
        this.list = filter_clone(args);
        if (!doms_path) {
            return;
        }
        $("body").on("mousedown", doms_path, function(e) {
            var this_dom = this;
            remove_panel();
            if (e.target.tagName.match(/INPUT|TEXTAREA/i)) {
                return;
            }
            //console.log(e,e.cancelBubble,e.preventDefault,e.stopPropagation)			
            if (e.button == 2) {
                e.bubbles = false;
                e.cancelBubble = true;
                e.preventDefault && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
                //if(e.button > 0){
                var x = e.pageX, y = e.pageY;
                callbefore && callbefore.call(this_dom);
                setTimeout(function() {
                    show_panel(x, y, this_panel.type, this_panel.list, this_dom, callback);
                }, 40);
            }
        }).on("contextmenu", doms_path, function(e) {
            //	return false;
            if (!e.target.tagName.match(/INPUT|TEXTAREA/i)) {
                return false;
            }
        });
    }
    construction.prototype = {
        display: function(name, check) {
            var that = this;
            if (!(check && check.match(/^(show|hide|disable)$/))) {
                //check error
                return;
            }
            if (Object.prototype.toString.call(name) == "[object Array]") {
                for (var i = 0, total = name.length; i < total; i++) {
                    change_dispaly.call(this, name[i], check);
                }
            } else if (typeof name == "string") {
                change_dispaly.call(this, name, check);
            } else {
                return;
            }
        },
        add: function(name, arg, callback) {
            if (!arg["display"] || !arg["display"].match(/^(show|hide|disable)$/)) {
                arg["display"] = null;
            }
            this["list"][name] = this["list"][name] || {};
            var li = this["list"][name];
            li["txt"] = arg["txt"] || li["txt"];
            li["display"] = arg["display"] || li["display"];
            li["callback"] = callback || li["callback"];
        },
        remove: function(name) {
            if (typeof this["list"][name] == "object") {
                delete this["list"][name];
            }
        }
    };
    exports.init = construction;
})(window.util.panel);

//提供CommonJS规范的接口
window.define && define("util/panel", [], function(require, exports, module) {
    //对外接口
    return window.util.panel;
});

/**
 * @author 剧中人
 * @github https://github.com/bh-lay/toucher
 * @modified 2014-6-3 15:48
 * 
 */
window.util = window.util || {};

window.util.toucher = window.util.toucher || function(dom) {
    return new window.util.toucher.init(dom);
};

(function(exports) {
    /**
	 * 检查class在不在多个class中 
	 */
    function hasClass(classAll, classSingle) {
        var classAll = classAll || "";
        var classArray = classAll.split(/\s/g);
        for (var i = 0, total = classArray.length; i < total; i++) {
            if (classArray[i] == classSingle) {
                return true;
            }
        }
    }
    /**
	 * @method 向句柄所在对象增加事件监听
	 * @description 支持链式调用
	 * 
	 * @param string 事件名
	 * @param [string] 事件委托至某个class（可选）
	 * @param [function] 符合条件的事件被触发时需要执行的回调函数 
	 * 
	 */
    function ON(eventName, a, b) {
        this._events = this._events || {};
        var className, fn;
        if (typeof a == "string") {
            className = a.replace(/^\./, "");
            fn = b;
        } else {
            className = null;
            fn = a;
        }
        //事件名存在且callback合法，进行监听绑定
        if (eventName.length > 0 && typeof fn == "function") {
            //事件堆无该事件，创建一个事件堆
            if (!this._events[eventName]) {
                this._events[eventName] = [];
            }
            this._events[eventName].push({
                className: className,
                fn: fn
            });
        }
        //提供链式调用的支持
        return this;
    }
    /**
	 * @method 事件触发器
	 * @description 根据事件最原始被触发的target，逐级向上追溯事件绑定
	 * 
	 * @param string 事件名
	 * @param object 原生事件对象
	 */
    function EMIT(eventName, e) {
        this._events = this._events || {};
        //事件堆无该事件，结束触发
        if (!this._events[eventName]) {
            return;
        }
        //记录尚未被执行掉的事件绑定
        var rest_events = this._events[eventName];
        //从事件源：target开始向上冒泡
        var target = e.target;
        while (1) {
            //当前需要校验的事件集
            var eventsList = rest_events;
            //置空尚未执行掉的事件集
            rest_events = [];
            //遍历事件所有绑定
            for (var i = 0, total = eventsList.length; i < total; i++) {
                var classStr = eventsList[i]["className"];
                var callback = eventsList[i]["fn"];
                //符合事件委托，执行
                if (hasClass(target.className, classStr)) {
                    //返回false停止事件冒泡及后续事件，其余继续执行
                    if (event_callback(eventName, callback, target, e) == false) {
                        return;
                    }
                } else {
                    //不符合执行条件，压回到尚未执行掉的列表中
                    rest_events.push(eventsList[i]);
                }
            }
            //向上冒泡
            target = target.parentNode;
            //若没有 需要执行的事件，结束冒泡
            if (rest_events.length == 0) {
                return;
            }
            //若已经冒泡至顶，检测顶级绑定，结束冒泡
            if (target == this.dom || !target) {
                //遍历剩余所有事件绑定
                for (var i = 0, total = rest_events.length; i < total; i++) {
                    var classStr = rest_events[i]["className"];
                    var callback = rest_events[i]["fn"];
                    //未指定事件委托，直接执行
                    if (classStr == null) {
                        event_callback(eventName, callback, target, e);
                    }
                }
                return;
            }
        }
    }
    /**
	 * 执行绑定的回调函数，并创建一个事件对象
	 * @param[string]事件名
	 * @param[function]被执行掉的函数
	 * @param[object]指向的dom
	 * @param[object]原生event对象
	 */
    function event_callback(name, fn, dom, e) {
        var touch = e.touches.length ? e.touches[0] : {};
        var newE = {
            type: name,
            pageX: touch.clientX || 0,
            pageY: touch.clientY || 0
        };
        //为swipe事件增加交互初始位置及移动距离
        if (name == "swipe" && e.startPosition) {
            newE.startX = e.startPosition["pageX"], newE.startY = e.startPosition["pageY"], 
            newE.moveX = newE.pageX - newE.startX, newE.moveY = newE.pageY - newE.startY;
        }
        return fn.call(dom, newE);
    }
    /**
	 * 判断swipe方向
	 */
    function swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? "Left" : "Right" : y1 - y2 > 0 ? "Up" : "Down";
    }
    /**
	 * 监听原生的事件，主动触发模拟事件
	 * 
	 */
    function eventListener(DOM) {
        var this_touch = this;
        //轻击开始时间
        var touchStartTime = 0;
        //记录上一次点击时间
        var lastTouchTime = 0;
        //记录初始轻击的位置
        var x1, y1, x2, y2;
        //轻击事件的延时器
        var touchDelay;
        //测试长按事件的延时器
        var longTap;
        //记录当前事件是否已为等待结束的状态
        var isActive = false;
        //记录有坐标信息的事件
        var eventMark = null;
        //单次用户操作结束
        function actionOver(e) {
            isActive = false;
            clearTimeout(longTap);
            clearTimeout(touchDelay);
        }
        //触屏开始
        function touchStart(e) {
            //缓存事件
            eventMark = e;
            x1 = e.touches[0].pageX;
            y1 = e.touches[0].pageY;
            x2 = 0;
            y2 = 0;
            isActive = true;
            touchStartTime = new Date();
            EMIT.call(this_touch, "swipeStart", e);
            //检测是否为长按
            clearTimeout(longTap);
            longTap = setTimeout(function() {
                actionOver(e);
                //断定此次事件为长按事件
                EMIT.call(this_touch, "longTap", e);
            }, 500);
        }
        //触屏结束
        function touchend(e) {
            //touchend中，拿不到坐标位置信息，故使用全局保存下的事件
            EMIT.call(this_touch, "swipeEnd", eventMark);
            if (!isActive) {
                return;
            }
            var now = new Date();
            if (now - lastTouchTime > 260) {
                touchDelay = setTimeout(function() {
                    //断定此次事件为轻击事件
                    actionOver();
                    EMIT.call(this_touch, "singleTap", eventMark);
                }, 250);
            } else {
                clearTimeout(touchDelay);
                actionOver(e);
                //断定此次事件为连续两次轻击事件
                EMIT.call(this_touch, "doubleTap", eventMark);
            }
            lastTouchTime = now;
        }
        //手指移动
        function touchmove(e) {
            //缓存事件
            eventMark = e;
            //在原生事件基础上记录初始位置（为swipe事件增加参数传递）
            e.startPosition = {
                pageX: x1,
                pageY: y1
            };
            //断定此次事件为移动事件
            EMIT.call(this_touch, "swipe", e);
            if (!isActive) {
                return;
            }
            x2 = e.touches[0].pageX;
            y2 = e.touches[0].pageY;
            if (Math.abs(x1 - x2) > 2 || Math.abs(y1 - y2) > 2) {
                //断定此次事件为移动手势
                var direction = swipeDirection(x1, x2, y1, y2);
                EMIT.call(this_touch, "swipe" + direction, e);
            } else {
                //断定此次事件为轻击事件
                actionOver(e);
                EMIT.call(this_touch, "singleTap", e);
            }
            actionOver(e);
            //是否阻止浏览器默认事件
            if (this_touch.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
        /**
		 * 对开始手势的监听
		 */
        DOM.addEventListener("touchstart", touchStart);
        DOM.addEventListener("MSPointerDown", touchStart);
        DOM.addEventListener("pointerdown", touchStart);
        /**
		 * 对手势结束的监听（轻击）
		 */
        DOM.addEventListener("touchend", touchend);
        DOM.addEventListener("MSPointerUp", touchend);
        DOM.addEventListener("pointerup", touchend);
        /**
		 * 对移动手势的监听
		 */
        DOM.addEventListener("touchmove", touchmove);
        DOM.addEventListener("MSPointerMove", touchmove);
        DOM.addEventListener("pointermove", touchmove);
        /**
		 * 对移动结束的监听
		 */
        DOM.addEventListener("touchcancel", actionOver);
        DOM.addEventListener("MSPointerCancel", actionOver);
        DOM.addEventListener("pointercancel", actionOver);
    }
    /**
	 * touch类
	 * 
	 */
    function touch(DOM, param) {
        var param = param || {};
        this.dom = DOM;
        this.preventDefault = typeof param.preventDefaul == "boolean" ? param.preventDefault : false;
        //监听DOM原生事件
        eventListener.call(this, this.dom);
    }
    //拓展事件绑定方法
    touch.prototype["on"] = ON;
    //对外提供接口
    exports.init = touch;
})(util.toucher);

//提供CommonJS规范的接口
window.define && define("util/toucher", [], function(require, exports, module) {
    //对外接口
    return window.util.toucher;
});

/**
 * @author bh-lay
 * 
 * @github https://github.com/bh-lay/UI
 * @modified 2014-34-17 13:52
 * 
 * Function depends on
 *		JQUERY
 * 
 * @method UI.pop
 * 	@param {Object} param the main paramter
 * 	@param {String} param.title 弹框标题
 * 	@param {String} param.html 弹框内容
 * 	@param {String} [param.width] 弹框宽度
 * 	@param {String} [param.height] 弹框高度
 * 	@param {String} [param.top] 弹框与页面顶部距离
 * 	@param {String} [param.left] 弹框与页面左侧距离
 * 	@param {String} [param.mask] 是否显示蒙层
 * 	@param {Function} [param.closeFn] 弹框关闭时的回调
 * 	@param {Function} [param.closeFn]
 * 	@param {Object|Function} [param.confirm] 使用对话方式（详细定义或只定义回调）
 * 	@param {Array} [param.confirm.btns] 按钮自定义名称
 * 	@param {Array} [param.confirm.callback] 确定时的回调方法
 * 
 * 	@returns {Object} pop
 * 	@returns {String} pop.title 弹框标题
 * 	@returns {Object} pop.dom 弹框所属DOM
 * 	@returns {Object} pop.cntDom 弹框内容部分DOM
 * 	@returns {Function} pop.close 关闭弹框的方法
 * 	@returns {Function} pop.closeFn 弹框关闭时的回调
 * 	@example 
 * 	UI.pop({
 * 	  	'width' : 300,
 * 		'confirm' : function(){
 *       	alert(1);
 *   		}
 * 	});	
 *		UI.pop({
 * 		'title' : '我的弹框',
 * 	  	'width' : 300,
 * 		'confirm' : {
 *   	 		'btns' : ['好的','不干'],
 *    		'callback' : function(){
 *       		alert(1);
 *     		}
 *   		}
 * 	});
 
 * @method UI.pop.config.gap 为pop弹框配置页面显示边界
 * 	@param {String} name 设置边界名（top/right/bottom/left）
 * 	@param {Number} vlue 设置边界尺寸
 * 
 * @method UI.confirm
 * 	@param {Object} param the main paramter
 * 	@param {String} param.text 提示内容
 * 	@param {Function} [param.closeFn] 关闭时的回调
 * 	@param {Function} [param.closeFn]
 * 	@param {Array} [param.btns] 按钮自定义名称
 * 	@param {Array} [param.callback] 确定时的回调方法
 * 
 * 	@returns {Object} confirm
 * 	@returns {Object} confirm.dom 弹框所属DOM
 * 	@returns {Function} confirm.close 关闭弹框的方法
 * 	@returns {Function} confirm.closeFn 弹框关闭时的回调
 * 
 * @method UI.ask
 * 	@param {String} text 标题
 * 	@param {String} callback 回调
 * 
 * 	@returns {Object} ask
 * 	@returns {Object} ask.dom prompt所属DOM
 * 	@returns {Function} ask.close 关闭
 * 
 * @method UI.plane
 * 	@param {Object} param the main paramter
 * 	@param {String} param.html
 * 	@param {String} [param.width]
 * 	@param {String} [param.height]
 * 	@param {String} [param.top]
 * 	@param {String} [param.left]
 * 	@param {Function} [param.closeFn]
 * 
 * 	@returns {Object} plane
 * 	@returns {Object} plane.dom
 * 	@returns {Function} plane.closeFn
 * 
 * @method UI.prompt
 * 	@param {String} text
 * 	@param {String|Number} [time] 默认为1300ms，0为不自动关闭
 * 
 * 	@returns {Object} prompt
 * 	@returns {Object} prompt.dom prompt所属DOM
 * 	@returns {Function} prompt.tips 为prompt设置内容
 * 	@returns {Function} confirm.close 关闭prompt
 * 
 * 	@example 
 * 	//默认时间
 * 		P.prompt('操作失败');
 * 	//指定时间
 * 		P.prompt('操作失败',2400);
 * 	//主动控制
 * 		var a = P.prompt('正在发送',0);
 * 		a.tips('发送成功');
 * 		a.close()
 * 
 **/
window.UI = window.UI || {};

(function(exports) {
    var allCnt = [ '<div class="pop_lawyer">', '<div class="pop_mask"></div>', '<div class="pop_main_cnt"></div>', '<div class="pop_fixedScreen_cnt"></div>', "</div>" ].join("");
    var pop_tpl = [ '<div class="pro_pop">', '<div class="pro_pop_cpt"></div>', '<div class="pro_pop_cnt"></div>', '<a href="javascript:void(0)" class="pro_pop_close" title="关闭">×</a>', "</div>" ].join("");
    var miniChat_tpl = [ '<div class="pro_miniChatSlideCnt"><div class="pro_miniChat">', '<div class="pro_miniChat_text">{text}</div>', "</div></div>" ].join("");
    var confirm_tpl = [ '<div class="pro_confirm">', '<div class="pro_confirm_text">{text}</div>', "</div>" ].join("");
    var ask_tpl = [ '<div class="pro_ask">', '<div class="pro_ask_text">{text}</div>', '<input type="text" name="pro_ask_key"/>', "</div>" ].join("");
    var confirmBar_tpl = [ '<div class="pro_pop_confirm">', '<a href="javascript:void(0)" class="pro_pop_confirm_ok">{confirm}</a>', '<a href="javascript:void(0)" class="pro_pop_confirm_cancel">{cancel}</a>', "</div>" ].join("");
    var plane_tpl = [ '<div class="pro_plane"></div>' ].join("");
    var prompt_tpl = [ '<div class="pro_prompt">', '<div class="pro_cnt"></div>', "</div>" ].join("");
    var cover_tpl = [ '<div class="pro_cover">', '<div class="pro_coverCnt"></div>', '<a href="javascript:void(0)" class="pro_coverClose">〉</a>', "</div>" ].join("");
    var popCSS = [ '<style type="text/css" data-module="UI-pop-prompt-plane">', //基础框架
    '.pop_lawyer{position:absolute;top:0px;left:0px;z-index:4999;width:100%;height:0px;overflow:visible;font-family:"Microsoft Yahei"}', ".pop_mask{position:absolute;top:0px;left:0px;width:100%;background:#000;display:none;opacity:0.2}", ".pop_main_cnt{width:0px;height:0px;overflow:visible;}", ".pop_fixedScreen_cnt{position:absolute;top:0px;left:0px;width:100%;height:0px;overflow:visible;}", //各模块样式
    ".pro_pop{width:200px;_border:1px solid #eee;position:absolute;top:400px;left:300px;", "background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}", ".pro_pop_cpt{position:relative;height:40px;line-height:40px;margin-right:41px;overflow:hidden;border-bottom:1px solid #ebebeb;background:#f6f6f6;", "color:#333;font-size:18px;text-indent:15px;cursor: default;}", ".pro_pop_cnt{position:relative;min-height:100px;overflow:hidden;width:100%;}", '.pro_pop_close{display:block;position:absolute;top:0px;right:0px;width:40px;height:40px;text-align:center;line-height:40px;color:#ddd;font-family:"Simsun";font-size:40px;background:#fafafa;border:1px solid #ebebeb;border-width:0px 0px 1px 1px;text-decoration:none;}', ".pro_pop_close:hover{background-color:#eee;border-left-color:#ddd;text-decoration:none;}", ".pro_pop_close:active{background-color:#ddd;border-left-color:#ccc;color:#ccc;}", ".pro_confirm{_border:1px solid #eee;position:absolute;background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}", ".pro_confirm_text{padding:30px 10px 20px;line-height:26px;text-align:center;font-size:20px;color:#333;}", ".pro_ask{_border:1px solid #eee;position:absolute;background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}", ".pro_ask_text{padding:30px 10px 10px;line-height:26px;text-align:center;font-size:20px;color:#333;}", ".pro_ask input{display:block;margin:0px auto 15px;height:30px;padding:4px 4px;line-height:22px;box-sizing:border-size;width:90%;}", ".pro_miniChatSlideCnt{width:220px;height:0px;overflow:hidden;position:absolute;border-radius:4px;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}", ".pro_miniChat{position:absolute;left:0px;bottom:0px;width:100%;_border:1px solid #eee;background:#fff;overflow:hidden;}", ".pro_miniChat_text{padding:20px 10px 10px;box-sizing:content-box;line-height:24px;text-align:center;font-size:14px;color:#333;}", ".pro_miniChat .pro_pop_confirm a{height:26px;line-height:26px;}", ".pro_pop_confirm{padding:10px 0px 15px 30px;box-sizing:content-box;text-align:center;}", ".pro_pop_confirm a{display:inline-block;height:30px;padding:0px 15px;box-sizing:content-box;border-radius:3px;font-size:14px;line-height:30px;background:#38b;color:#fff;margin-right:30px;}", ".pro_pop_confirm a:hover{text-decoration: none;background:#49c;}", ".pro_pop_confirm a:active{text-decoration: none;background:#27a}", ".pro_plane{width:200px;position:absolute;top:400px;left:300px;}", ".pro_prompt{width:240px;position:absolute;padding:30px 10px;box-sizing:content-box;background:#fff;_border:1px solid #fafafa;border-radius:4px;box-shadow:2px 2px 10px rgba(0,0,0,0.5);}", ".pro_cnt{font-size:18px;color:#222;text-align:center;}", ".pro_cover{position:absolute;top:0px;left:0px;width:100%;height:100px;}", ".pro_coverCnt{position:relative;width:100%;height:100%;background:#fff;}", '.pro_coverClose{display:block;position:absolute;top:50%;left:0px;width:20px;height:60px;padding-left:5px;text-align:center;line-height:60px;color:#ddd;font-family:"Simsun";font-size:30px;background:#555;}', ".pro_coverClose:hover{background-color:#333;color:#fff;text-decoration:none;}", "</style>" ].join("");
    var isIE67 = false;
    if (navigator.appName == "Microsoft Internet Explorer") {
        var version = navigator.appVersion.split(";")[1].replace(/[ ]/g, "");
        if (version == "MSIE6.0" || version == "MSIE7.0") {
            isIE67 = true;
        }
    }
    var DOM = $(allCnt);
    /**
	 * 
	 * define private variables
	 * 
	 **/
    var private_body = $("html,body"), private_maskDom = DOM.find(".pop_mask"), private_mainDom = DOM.find(".pop_main_cnt"), private_fixedScreenDom = DOM.find(".pop_fixedScreen_cnt"), private_win = $(window), private_winW, private_winH, private_doc = $(document), private_docH, private_scrollTop, private_maskCount = 0;
    var private_CONFIG = {
        gap: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        zIndex: 499
    };
    //重新计算窗口尺寸
    function countSize() {
        private_winW = document.body.clientWidth;
        private_scrollTop = private_win.scrollTop();
        private_winH = window.innerHeight;
        private_docH = private_doc.height();
    }
    $("head").append(popCSS);
    $("body").append(DOM);
    //更新窗口尺寸
    countSize();
    /**
	 *	fix Prompt Mask position & size 
	 */
    if (isIE67) {
        private_maskDom.css({
            position: "absolute",
            height: private_winH,
            top: 0
        });
        private_win.on("resize scroll", function() {
            //更新窗口尺寸
            countSize();
            private_fixedScreenDom.animate({
                top: private_scrollTop
            }, 100);
            private_maskDom.css({
                top: private_scrollTop,
                height: private_winH
            });
        });
    } else {
        private_fixedScreenDom.css({
            position: "fixed",
            top: 0
        });
        private_maskDom.css({
            position: "fixed",
            height: private_winH,
            top: 0
        });
        private_win.on("resize scroll", function() {
            //更新窗口尺寸
            countSize();
            private_maskDom.css({
                height: private_winH
            });
        });
    }
    //通用拖动方法
    function drag(handle_dom, dom, param) {
        var param = param || {};
        var moving = param["move"] || null;
        var start = param["start"] || null;
        var end = param["end"] || null;
        var dragMask = $('<div style="width:100%;height:100%;position:absolute;top:0px;left:0px;z-index:100000;cursor:default;"></div>');
        var dx, dy, l_start, t_start, w_start, h_start;
        handle_dom.mousedown(function(e) {
            if (e.button == 0) {
                down(e);
            }
        });
        function down(e) {
            //更新窗口尺寸
            countSize();
            //			e.preventDefault();
            //			e.stopPropagation();
            dx = e.pageX;
            dy = e.pageY;
            l_start = parseInt(dom.css("left"));
            t_start = parseInt(dom.css("top"));
            w_start = parseInt(dom.outerWidth());
            h_start = parseInt(dom.outerHeight());
            private_doc.mousemove(move).mouseup(up);
            dragMask.css({
                width: private_winW,
                height: private_winH,
                top: 0,
                left: 0,
                cursor: handle_dom.css("cursor")
            });
            private_fixedScreenDom.append(dragMask);
            start && start();
        }
        function move(e) {
            e.preventDefault();
            e.stopPropagation();
            //remove selection
            //	window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
            moving && moving(e.pageX - dx, e.pageY - dy, l_start, t_start, w_start, h_start);
        }
        function up(e) {
            dragMask.remove();
            private_doc.unbind("mousemove", move).unbind("mouseup", up);
            end && end();
        }
    }
    //通用限制位置区域的方法
    function fix_position(top, left, width, height) {
        var gap = private_CONFIG.gap;
        if (top < private_scrollTop + gap.top) {
            //Beyond the screen(top)
            top = private_scrollTop + gap.top;
        } else if (top + height - private_scrollTop > private_winH - gap.bottom) {
            //Beyond the screen(bottom)
            if (height > private_winH - gap.top - gap.bottom) {
                //Is higher than the screen
                top = private_scrollTop + gap.top;
            } else {
                //Is shorter than the screen
                top = private_scrollTop + private_winH - height - gap.bottom;
            }
        }
        if (left < gap.left) {
            left = gap.left;
        } else if (left + width > private_winW - gap.right) {
            left = private_winW - width - gap.right;
        }
        return {
            top: top,
            left: left
        };
    }
    //计算自适应页面位置的方法
    function adaption(width, height) {
        var top = (private_winH - height) / 2 + private_scrollTop;
        var left = (private_winW - width) / 2;
        var newPosition = fix_position(top, left, width, height);
        var gap = private_CONFIG.gap;
        var clientTop = (private_winH - height) / 2;
        if (clientTop < gap.top) {
            clientTop = gap.top;
        }
        return {
            top: newPosition.top,
            left: newPosition.left,
            clientTop: clientTop,
            clientLeft: newPosition.left
        };
    }
    //增加确认方法
    function add_confirm(dom, param, close) {
        var callback = null;
        var cancel = null;
        var btns = [ "确认", "取消" ];
        if (typeof param == "function") {
            callback = param;
        } else if (typeof param == "object") {
            if (param["btns"]) {
                btns[0] = param["btns"][0];
                btns[1] = param["btns"][1];
            }
            if (typeof param["callback"] == "function") {
                callback = param["callback"];
            }
            if (typeof param["cancel"] == "function") {
                cancel = param["cancel"];
            }
        }
        var this_html = confirmBar_tpl.replace(/{(\w+)}/g, function() {
            var key = arguments[1];
            if (key == "confirm") {
                return btns[0];
            } else if (key == "cancel") {
                return btns[1];
            }
        });
        dom.append(this_html);
        dom.on("click", ".pro_pop_confirm_ok", function() {
            if (callback) {
                //根据执行结果判断是否要关闭弹框
                var result = callback();
                if (result != false) {
                    close();
                }
            } else {
                close();
            }
        }).on("click", ".pro_pop_confirm_cancel", function() {
            if (cancel) {
                //根据执行结果判断是否要关闭弹框
                var result = cancel();
                if (result != false) {
                    close();
                }
            } else {
                close();
            }
        });
    }
    /**
	 * 公用关闭方法
	 *  
	 */
    function CLOSEMETHOD(effect, time) {
        this.closeFn && this.closeFn();
        if (!effect) {
            this.dom.remove();
        } else {
            var method = "fadeOut";
            var time = time ? parseInt(time) : 80;
            if (effect == "fade") {
                method = "fadeOut";
            } else if (effect == "slide") {
                method = "slideUp";
            }
            this.dom[method](time, function() {
                $(this).remove();
            });
        }
        if (this._mask) {
            private_maskCount--;
            if (private_maskCount == 0) {
                private_maskDom.fadeOut(80);
            }
        }
    }
    /***
	 * 弹框
	 * pop 
	 */
    function POP(param) {
        var param = param || {};
        var this_pop = this;
        this.title = param["title"] || "请输入标题";
        this.dom = $(pop_tpl);
        this.cntDom = this.dom.find(".pro_pop_cnt");
        this.closeFn = param["closeFn"] || null;
        this._mask = param["mask"] || false;
        var this_html = param["html"] || "";
        var this_width = param["width"] || 240;
        var this_height = param["height"] ? parseInt(param["height"]) - 41 : null;
        //预定高度时
        if (this_height) {
            this.onScrollToEnd = null;
            this.cntDom.css({
                height: this_height
            }).html('<div class="UI_scroll_body"></div>');
            var scrollbar = UI.scrollBar(this.cntDom);
            scrollbar.onScroll = function(gap) {
                if (gap.bottom < 20 && this_pop.onScrollToEnd) {
                    this_pop.onScrollToEnd && this_pop.onScrollToEnd();
                }
            };
            this.cntDom = this.cntDom.find(".UI_scroll_body");
        }
        //当有确认参数时
        if (param["confirm"]) {
            add_confirm(this.dom, param["confirm"], function() {
                this_pop.close();
            });
        }
        //fix position get size
        var fixSize = adaption(this_width, this_height || 300);
        var top = typeof param["top"] == "number" ? param["top"] : fixSize.top;
        var left = typeof param["left"] == "number" ? param["left"] : fixSize.left;
        //can drag is pop
        UI.drag(this.dom.find(".pro_pop_cpt"), this.dom, {
            move: function(dx, dy, l_start, t_start, w_start, h_start) {
                var top = dy + t_start;
                var left = dx + l_start;
                var newSize = fix_position(top, left, w_start, h_start);
                this_pop.dom.css({
                    left: newSize.left,
                    top: newSize.top
                });
            }
        });
        //insert html
        this.cntDom.prepend(this_html);
        // create pop
        this.dom.css({
            width: this_width,
            left: left,
            top: top
        }).on("click", ".pro_pop_close", function() {
            this_pop.close();
        }).find(".pro_pop_cpt").html(this.title);
        if (this._mask) {
            private_maskCount++;
            if (private_maskCount == 1) {
                private_maskDom.fadeIn(80);
            }
        }
        private_mainDom.append(this.dom);
    }
    POP.config = {
        gap: function(name, value) {
            if (name && name.match(/(top|right|bottom|left)/)) {
                if (parseInt(value)) {
                    private_CONFIG.gap[name] = value;
                }
            }
        }
    };
    //使用close方法
    POP.prototype["close"] = CLOSEMETHOD;
    POP.prototype["adapt"] = function() {
        var offset = this.dom.offset();
        var width = this.dom.width();
        var height = this.dom.height();
        var fixSize = adaption(width, height);
        //	console.log(offset,fixSize,'-----------');
        this.dom.animate({
            top: fixSize.top,
            left: fixSize.left
        }, 100);
    };
    /***
	 * CONFIRM 
	 */
    function CONFIRM(param) {
        var param = param || {};
        var this_pop = this;
        var this_text = param["text"] || "请输入确认信息！";
        var callback = param["callback"] || null;
        var this_html = confirm_tpl.replace(/{text}/, this_text);
        this._mask = true;
        this.dom = $(this_html);
        this.closeFn = param["closeFn"] || null;
        add_confirm(this.dom, param, function() {
            this_pop.close();
        });
        //
        var newPosition = adaption(300, 160);
        // create pop
        this.dom.css({
            width: 300,
            left: newPosition.clientLeft,
            top: newPosition.clientTop
        });
        private_maskCount++;
        if (private_maskCount == 1) {
            private_maskDom.fadeIn(80);
        }
        private_fixedScreenDom.append(this.dom);
    }
    CONFIRM.prototype["close"] = CLOSEMETHOD;
    /***
	 * ASK 
	 */
    function ASK(text, callback) {
        var this_pop = this;
        var this_text = text || "请输入确认信息！";
        var this_html = ask_tpl.replace(/{text}/, this_text);
        this.dom = $(this_html);
        this.closeFn = null;
        this.callback = callback || null;
        var this_html = confirmBar_tpl.replace(/{(\w+)}/g, function(a, key) {
            if (key == "confirm") {
                return "确定";
            } else if (key == "cancel") {
                return "取消";
            }
        });
        this.dom.append(this_html);
        this.dom.on("click", ".pro_pop_confirm_ok", function() {
            var value = this_pop.dom.find("input").val();
            if (this_pop.callback) {
                //根据执行结果判断是否要关闭弹框
                var result = this_pop.callback(value);
                if (result != false) {
                    this_pop.close();
                }
            } else {
                this_pop.close();
            }
        }).on("click", ".pro_pop_confirm_cancel", function() {
            this_pop.close();
        });
        var newPosition = adaption(300, 160);
        // create pop
        this.dom.css({
            width: 300,
            left: newPosition.clientLeft,
            top: newPosition.clientTop
        });
        private_fixedScreenDom.append(this.dom);
    }
    ASK.prototype["close"] = CLOSEMETHOD;
    ASK.prototype["setValue"] = function(text) {
        var text = text ? text.toString() : "";
        this.dom.find("input").val(text);
    };
    /**
	 * prompt
	 * 
	 **/
    function prompt(txt, time) {
        var this_prompt = this;
        var txt = txt || "请输入内容";
        this.dom = $(prompt_tpl);
        this.tips(txt);
        var newPosition = adaption(260, 100);
        // create pop
        this.dom.css({
            left: newPosition.clientLeft,
            top: newPosition.clientTop
        });
        //console.log(private_winH,12);
        private_fixedScreenDom.append(this.dom);
        if (time != 0) {
            this_prompt.close(time);
        }
    }
    prompt.prototype = {
        tips: function(txt) {
            if (txt) {
                this.dom.find(".pro_cnt").html(txt);
            }
        },
        close: function(time) {
            var delay = time ? parseInt(time) : 1300;
            var this_prompt = this;
            setTimeout(function() {
                this_prompt.dom.fadeOut(200, function() {
                    this_prompt.dom.remove();
                });
            }, delay);
        }
    };
    /**
	 *	PLANE 
	 */
    //the active plane
    private_activePlane = null;
    //check click
    var bingoDom = false;
    private_doc.on("mousedown", function checkClick() {
        setTimeout(function() {
            if (!bingoDom) {
                //close the active plane
                private_activePlane && private_activePlane.close();
            } else {
                bingoDom = false;
            }
        }, 20);
    }).on("mousedown", ".pro_plane", function() {
        bingoDom = true;
    });
    function PLANE(param) {
        //如果有已展开的PLANE，干掉他
        private_activePlane && private_activePlane.close();
        private_activePlane = this;
        var param = param || {};
        var this_plane = this;
        var this_html = param["html"] || "";
        this.closeFn = param["closeFn"] || null;
        this.dom = $(plane_tpl);
        //insert html
        this.dom.html(this_html);
        this.dom.css({
            width: param["width"] || 240,
            height: param["height"] || null,
            top: param["top"] || 300,
            left: param["left"] || 800
        });
        private_mainDom.append(this.dom);
    }
    PLANE.prototype["close"] = CLOSEMETHOD;
    /**
	 *	miniChat 
	 */
    function miniChat(param) {
        var param = param || {};
        var this_chat = this;
        this.text = param["text"] || "请输入标题";
        this.closeFn = param["closeFn"] || null;
        var this_tpl = miniChat_tpl.replace("{text}", this.text);
        this.dom = $(this_tpl);
        //当有确认参数时
        add_confirm(this.dom.find(".pro_miniChat"), param, function() {
            this_chat.close();
        });
        var top = typeof param["top"] == "number" ? param["top"] : 300;
        var left = typeof param["left"] == "number" ? param["left"] : 300;
        // create pop
        this.dom.css({
            left: left,
            top: top
        });
        private_mainDom.append(this.dom);
        var height = this.dom.find(".pro_miniChat").height();
        this.dom.animate({
            height: height
        }, 200);
    }
    miniChat.prototype["close"] = CLOSEMETHOD;
    /***
	 * 全屏弹框
	 * COVER 
	 */
    function COVER(param) {
        var param = param || {};
        var this_cover = this;
        this.dom = $(cover_tpl);
        this.cntDom = this.dom.find(".pro_coverCnt");
        this.closeDom = this.dom.find(".pro_coverClose");
        this.closeFn = param["closeFn"] || null;
        var this_html = param["html"] || "";
        //insert html
        this.cntDom.prepend(this_html);
        this.dom.on("click", ".pro_coverClose", function() {
            this_cover.close();
        });
        this.closeDom.hide();
        // create pop
        this.dom.css({
            height: private_winH
        });
        this.cntDom.css({
            top: 0,
            left: private_winW
        }).animate({
            left: 0
        }, 200, function() {
            this_cover.closeDom.fadeIn(100);
        });
        private_fixedScreenDom.append(this.dom);
    }
    //使用close方法
    COVER.prototype["close"] = function() {
        var DOM = this.dom;
        this.closeDom.fadeOut(100);
        this.cntDom.animate({
            left: private_winW
        }, 400, function() {
            DOM.remove();
        });
    };
    /**
	 *  抛出对外接口
	 */
    exports.pop = function() {
        return new POP(arguments[0]);
    };
    exports.pop.config = POP.config;
    exports.miniChat = function() {
        return new miniChat(arguments[0]);
    };
    exports.confirm = function() {
        return new CONFIRM(arguments[0]);
    };
    exports.ask = function(text, callback) {
        return new ASK(text, callback);
    };
    exports.prompt = function(txt, time) {
        return new prompt(txt, time);
    };
    exports.plane = function() {
        return new PLANE(arguments[0]);
    };
    exports.cover = function() {
        return new COVER(arguments[0]);
    };
    exports.drag = drag;
})(UI);

/**
 *	UI.scrollBar();
 *
 **/
(function(exports) {
    var scrollBar_css = [ '<style type="text/css" data-module="UI_scrollBar">', "@font-face {", 'font-family:"UI";', 'src:url("/js/api/UI/images/ui-webfont.eot");', 'src:url("/js/api/UI/images/ui-webfont.eot?#iefix") format("embedded-opentype"),', 'url("/js/api/UI/images/ui-webfont.woff") format("woff"),', 'url("/js/api/UI/images/ui-webfont.ttf")  format("truetype"),', 'url("/js/api/UI/images/ui-webfont.svg#icon") format("svg");', "font-weight: normal;", "font-style: normal;", "}", ".UI_scroll_body{position:relative;width:100%;height:100%;overflow-y:scroll;}", ".UI_scrollBar_module{position:absolute;top:0px;right:0px;width:10px;height:100%;background:#fff;}", ".UI_scrollBar_cnt{top:15px;bottom:15px;position:absolute;width:100%;background:#eee;}", ".UI_scrollBar{position:absolute;top:10px;right:0px;width:100%;height:20px;border-radius:4px;background:#ccc;}", '.UI_scrollBar_up,.UI_scrollBar_down{position:absolute;width:100%;height:15px;right:0px;line-height:15px;text-align:center;color:#888;font-size:14px;font-family:"UI";background:#fff;}', ".UI_scrollBar_up{top:0px;}", ".UI_scrollBar_down{bottom:0px;}", ".UI_scrollBar_module a:hover{text-decoration:none;background:#aaa;color:#444;}", ".UI_scrollBar_module a:active{background:#666;}", "</style>" ].join("");
    var scrollBar_tpl = [ '<div class="UI_scrollBar_module">', '<a href="javascript:void(0)" class="UI_scrollBar_up">u</a>', '<div class="UI_scrollBar_cnt">', '<a href="javascript:void(0)" class="UI_scrollBar"></a>', "</div>", '<a href="javascript:void(0)" class="UI_scrollBar_down">d</a>', "</div>" ].join("");
    $(function() {
        $("head").append(scrollBar_css);
    });
    //注册滚轮事件
    function scroll(dom, mouse) {
        if (document.addEventListener) {
            dom.addEventListener("DOMMouseScroll", mouse, false);
        }
        dom.onmousewheel = mouse;
    }
    function handuleAnimate(dom, is) {
        is = is || {};
        var right, time, delayTime;
        if (is.draging) {
            return;
        }
        if (is.hoverCnt && is.fromOut) {
            right = 0;
            time = 40;
            delayTime = 0;
            if (is.hoverBar) {}
        } else if (is.hoverBar) {
            right = 0;
            time = 80;
            delayTime = 80;
        } else if (is.hoverCnt) {
            right = 0;
            time = 200;
            delayTime = 600;
        } else {
            right = -10;
            time = 300;
            delayTime = 600;
        }
        clearTimeout(is.delay);
        is.delay = setTimeout(function() {
            dom.stop().animate({
                right: right
            }, time);
        }, delayTime);
    }
    function initScroll() {
        var this_scroll = this;
        var IS = {
            fromOut: false,
            draging: false,
            hoverBar: false,
            hoverCnt: false,
            delay: 0
        };
        if (this.dom["origin"].css("position") == "static") {
            this.dom["origin"].css({
                position: "relative"
            });
        }
        //鼠标经过滚动条
        this_scroll.dom["all"].on("mouseenter", function() {
            IS.fromOut = false;
            IS.hoverBar = true;
            handuleAnimate(this_scroll.dom["all"], IS);
        }).on("mouseleave", function() {
            IS.fromOut = false;
            IS.hoverBar = false;
            handuleAnimate(this_scroll.dom["all"], IS);
        });
        //鼠标经过大框框、点击上下滚动
        this.dom["origin"].on("mouseenter", function() {
            IS.fromOut = true;
            IS.hoverCnt = true;
            handuleAnimate(this_scroll.dom["all"], IS);
        }).on("mouseleave", function() {
            IS.fromOut = false;
            IS.hoverCnt = false;
            handuleAnimate(this_scroll.dom["all"], IS);
        }).on("click", ".UI_scrollBar_down", function() {
            this_scroll.downward();
        }).on("click", ".UI_scrollBar_up", function() {
            this_scroll.upward();
        });
        //监听鼠标滚动
        scroll(this.dom["origin"][0], function() {
            //console.log('mouse is scrolling!');
            this_scroll.fix_scrollBar();
        });
        //滚动时，判断滚动到的位置,触发回调
        var scrollDelay;
        this.dom["body"].on("scroll", function() {
            clearTimeout(scrollDelay);
            scrollDelay = setTimeout(function() {
                if (this_scroll.onScroll) {
                    var top = parseInt(this_scroll["origin"].scrollTop);
                    var bottom = parseInt(this_scroll["origin"].totalH - this_scroll["origin"].scrollTop - this_scroll["origin"].height);
                    this_scroll.onScroll({
                        top: top,
                        bottom: bottom
                    });
                }
            }, 100);
        });
        //定时刷新滚动条（内部高度可能会自动变化）
        setInterval(function() {
            this_scroll.fix_scrollBar();
        }, 1200);
        //拖动触发滚动
        UI.drag(this.dom["bar"], this.dom["bar"], {
            start: function() {
                IS.draging = true;
            },
            move: function(dx, dy, l_start, t_start, w_start, h_start) {
                var top = dy + t_start;
                this_scroll.fix_content(top);
            },
            end: function() {
                IS.draging = false;
                handuleAnimate(this_scroll.dom["all"], IS);
            }
        });
        this.dom["origin"].append(this.dom["all"]);
        this_scroll.dom["all"].css("right", -10);
        //hide default scroll bar
        setTimeout(function() {
            //console.log(1,this_scroll.dom['body'].width(),this_scroll.dom['body'][0].clientWidth);
            this_scroll.dom["body"].css({
                width: this_scroll.dom["body"].width() * 2 - this_scroll.dom["body"][0].clientWidth
            });
        }, 100);
    }
    function scrollBar(cnt_dom) {
        if (typeof cnt_dom != "object") {
            return;
        }
        if (cnt_dom.find(".UI_scroll_body").length == 0) {
            return;
        }
        this.dom = {};
        this.dom["origin"] = cnt_dom;
        this.dom["body"] = this.dom["origin"].find(".UI_scroll_body");
        this.dom["all"] = $(scrollBar_tpl);
        this.dom["bar"] = this.dom["all"].find(".UI_scrollBar");
        this.onScroll = null;
        this.origin = {
            scrollTop: 0,
            height: 0,
            totalH: 0
        };
        this.bar = {
            top: 0,
            height: 0,
            totalH: 0
        };
        initScroll.call(this);
    }
    scrollBar.prototype = {
        fix_scrollBar: function() {
            //刷新目标对象的尺寸位置
            this.origin.totalH = this.dom["body"][0].scrollHeight;
            this.origin.height = this.dom["origin"].height();
            this.origin.scrollTop = this.dom["body"].scrollTop();
            //计算滚动条尺寸及位置
            this.bar.totalH = this.origin.height - 30;
            this.bar.top = this.origin.scrollTop / this.origin.totalH * this.bar.totalH;
            this.bar.height = this.origin.height / this.origin.totalH * this.bar.totalH;
            //设置滚动条
            this.dom["bar"].stop().animate({
                top: this.bar.top,
                height: this.bar.height
            }, 80);
        },
        fix_content: function(top) {
            if (top < 0) {
                this.bar.top = 0;
            } else if (top > this.bar.totalH - this.bar.height) {
                this.bar.top = this.bar.totalH - this.bar.height;
            } else {
                this.bar.top = top;
            }
            this.dom["bar"].css({
                top: this.bar.top
            });
            this.origin.scrollTop = this.bar.top / this.bar.totalH * this.origin.totalH;
            this.dom["body"].scrollTop(this.origin.scrollTop);
        },
        downward: function() {
            var top = this.bar.top + 10;
            this.fix_content(top);
        },
        upward: function() {
            var top = this.bar.top - 10;
            this.fix_content(top);
        }
    };
    exports.scrollBar = function(dom) {
        return new scrollBar(dom);
    };
})(window.UI);

//提供CommonJS规范的接口
window.define && define("UI/pop", [], function(require, exports, module) {
    //对外接口
    exports.ask = window.UI.ask;
    exports.pop = window.UI.pop;
    exports.miniChat = window.UI.miniChat;
    exports.confirm = window.UI.confirm;
    exports.prompt = window.UI.prompt;
    exports.plane = window.UI.plane;
    exports.cover = window.UI.cover;
    exports.drag = window.UI.drag;
});
