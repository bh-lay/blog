define("gallery/folderItem-debug", [ "util/uploader-debug", "util/event-debug", "util/panel-debug", "UI/pop-debug" ], function(require, exports) {
    require("gallery/style-debug.css");
    var uploader = require("util/uploader-debug.js");
    var events = require("util/event-debug.js");
    var panel = require("util/panel-debug.js");
    var UI = require("UI/pop-debug.js");
    var dir_tpl = [ '<div class="gP_item" data-type="folder" data-fullname="{name}">', '<div class="gP_item_body">', '<div class="gP_dir_item">', '<div class="gP_file-ico"><span class="glyphicon glyphicon-folder-open"></span></div>', '<div class="gP_file-name" title="{name}" >{name}</div>', "</div>", '<div class="gP_item_tools">', '<div class="gP_item_toolsCnt">', '<a href="javascript:void(0)" class="gP_tool_btn" data-action="del">', '<span class="gP_tool_btn_ico"><span class="glyphicon glyphicon-trash"></span></span>', '<strong class="gP_tool_btn_name">删除</strong>', "</a>", '<a href="javascript:void(0)" class="gP_tool_btn" data-action="rename">', '<span class="gP_tool_btn_ico"><span class="glyphicon glyphicon-pencil"></span>', '<strong class="gP_tool_btn_name">重命名</strong>', "</a>", "</div>", "</div>", '<a href="javascript:void(0)" class="gP_item_toolBar"><span class="glyphicon glyphicon-chevron-down"></span></a>', '<a href="javascript:void(0)" class="gP_item_check"><span class="glyphicon glyphicon-unchecked"></span><span class="glyphicon glyphicon-check"></span></a>', "</div>", "</div>" ].join("");
    function render(tpl, data) {
        var txt = "";
        for (var i = 0 in data) {
            txt += tpl.replace(/{(\w*)}/g, function() {
                var key = arguments[1];
                return data[i][key] || "";
            });
        }
        return txt;
    }
    //删除目录
    function delDir(pathname, callback) {
        $.ajax({
            url: "/ajax/asset/delDir",
            type: "POST",
            data: {
                path: pathname
            },
            dataType: "json",
            success: function(data) {
                if (data && data.code == 200) {
                    callback && callback(null);
                } else {
                    var msg = "删除失败,code(" + (data.msg || "") + ")";
                    callback && callback(msg);
                }
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
        var this_item = this;
        var itemDom = this.dom;
        itemDom.on("click", 'a[data-action="del"]', function() {
            //删除
            this_item.del();
        }).on("click", 'a[data-action="rename"]', function() {
            //重命名
            this_item.rename();
        }).on("click", ".gP_item_toolBar", function() {
            //打开操作面板状态
            if (itemDom.hasClass("gP_item_menuing")) {
                itemDom.removeClass("gP_item_menuing");
            } else {
                itemDom.removeClass("gP_item_menuing");
                itemDom.addClass("gP_item_menuing");
            }
        }).on("click", ".gP_item_check", function() {
            //选中状态
            if (itemDom.hasClass("gP_item_checked")) {
                itemDom.removeClass("gP_item_checked");
            } else {
                itemDom.addClass("gP_item_checked");
            }
        });
    }
    /**
	 *  目录类
	 * @param {Object} dom
	 * @param {Object} param
	 */
    function folderItem(basePath, data) {
        this.fullname = data.name;
        this.path = "/" + basePath + "/" + this.fullname;
        //过滤重复的路径中重复的//
        this.path = this.path.replace(/\/+/g, "/");
        this.url = "http://asset.bh-lay.com/" + this.path;
        /**
		 * 状态
		 * 正常 normal
		 * 选中 selected
		 * 菜单 menuing
		 */
        this.status = "normal";
        var html = render(dir_tpl, [ {
            name: this.fullname
        } ]);
        this.dom = $(html);
        bindItemEvent.call(this);
    }
    folderItem.prototype = {
        del: function() {
            var path = this.path;
            var DOM = this.dom;
            UI.confirm({
                text: "删除就找不回来了，你再想想？",
                callback: function() {
                    //发送删除请求
                    delDir(path, function(err) {
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
            var this_folder = this;
            var ask = UI.ask("快想一个新名字！", function(txt) {
                var newName = txt;
                $.ajax({
                    url: "/ajax/asset/rename",
                    type: "POST",
                    data: {
                        pathname: this_folder.path,
                        newName: newName
                    },
                    dataType: "json",
                    success: function(data) {
                        if (data && data.code == 200) {
                            callback && callback(null, data);
                            this_folder.dom.attr("data-fullname", newName);
                            this_folder.dom.find(".gP_file-name").attr("title", newName).html(newName);
                        } else {}
                    },
                    error: function() {
                        callback && callback("网络出错");
                    }
                });
            });
            //设置对话框纯文件名
            ask.setValue(this.fullname);
        }
    };
    return folderItem;
});

/**
 *	@author bh-lay
 *	@github https://github.com/bh-lay/uploader
 *  @updata 2014-5-11 0:16
 * Function depend on Jquery!
 * 
 */
window.util = window.util || {};

(function(exports) {
    var staticID = 0;
    var upCnt_tpl = [ '<div class="uploaderCnt" style="width:0px;height:0px;position:fixed;left:0px;top:0px;overflow:hidden"></div>' ].join("");
    var up_tpl = [ '<div class="uploaderItem uploader{ID}">', '<iframe id="uploader{ID}" name="uploader{ID}" width="0" height="0" src="about:blank"></iframe>', '<form method="post" action="{action}" enctype="multipart/form-data" name="uploader" target="uploader{ID}">', //请选择图片
    '<input name="{fileinputname}" type="file" multiple="multiple" class="uploader_btn" title="请选择图片"/>', "{data}", "</form>", "</div>" ].join("");
    var input_tpl = '<input type="hidden" name="{name}" value="{value}" />';
    //创建工作环境
    var global_cnt = $(upCnt_tpl);
    $(function() {
        $("body").append(global_cnt);
    });
    var private_isSupportTouch = "ontouchend" in document ? true : false;
    //iframe加载事件监听方法
    function iframe_load(iframe, callback) {
        if (iframe.attachEvent) {
            iframe.attachEvent("onload", function() {
                callback && callback.call(iframe.contentDocument);
            });
        } else {
            iframe.onload = function() {
                callback && callback.call(iframe.contentDocument);
            };
        }
    }
    //创建新的html
    function buildDom() {
        var this_up = this;
        //组装data对象对应的input
        var data_html = "";
        var data = this.data;
        for (var i in data) {
            data_html += input_tpl.replace(/{(\w*)}/g, function(result, key) {
                if (key == "name") {
                    return i;
                } else if (key == "value") {
                    return data[i];
                }
            });
        }
        //初始化上传配置
        var html = up_tpl.replace(/{(\w*)}/g, function(result, key) {
            if (key == "ID") {
                return this_up.ID;
            } else if (key == "action") {
                return this_up.action;
            } else if (key == "fileinputname") {
                return this_up.fileinputname;
            } else if (key == "data") {
                return data_html;
            }
        });
        return $(html);
    }
    /**
	 * 获取文件信息 
	 */
    function getFilesFromInput(input) {
        var returns = [];
        if (input.value.length > 0) {
            //有文件选中
            if (input.files) {
                //可多选 
                for (var i = 0, total = input.files.length; i < total; i++) {
                    returns.push({
                        name: input.files[i]["name"],
                        size: input.files[i]["size"]
                    });
                }
            } else {
                //不支持多选
                returns.push({
                    name: input.value.split(/\\/).pop()
                });
            }
        }
        return returns;
    }
    //格式化JSON
    function parseJSON(input) {
        //去除部分浏览器自动添加的标签
        input = input.replace(/<[^>]+>|<\/[^>]+>/g, "");
        var output = {};
        //尝试去解析
        try {
            output = eval("(" + input + ")");
        } catch (e) {
            output = "fail";
        }
        return output;
    }
    /**
	 * 单次上传类
	 */
    function SingleUp(param) {
        var this_up = this;
        this.ID = ++staticID;
        this.action = param.action;
        this.data = param["data"] || {};
        //状态 等待上传|上传中
        //    wait | uploading
        this.status = "wait";
        this.responseParser = param["responseParser"] || null;
        this.fileinputname = param["fileinputname"] || "photos";
        //事件集
        this.beforeUpload = param.beforeUpload || null;
        this.onStartUpload = param.onStartUpload || null;
        this.onFail = param.onFail || null;
        this.onSuccess = param.onSuccess || null;
        this.dom = buildDom.call(this);
        global_cnt.append(this.dom);
        /**
		 * 这个定时器是为了处理IE7浏览器异步创建iframe，导致无法立即得到iframe的BUG
		 * 如果你有好的办法，请  mail:bh_lay@126.com
		 */
        setTimeout(function() {
            this_up.init();
        }, 100);
    }
    //销毁自己
    SingleUp.prototype["destory"] = function() {
        if (this.status == "wait") {
            this.dom.remove();
        } else {
            this.dom.hide();
        }
    };
    //处理response
    SingleUp.prototype["handleResponse"] = function(responseTXT) {
        var ID = this.ID;
        this.status = "wait";
        //是否已格式化数据方法
        if (this.responseParser) {
            var jsonData = parseJSON(responseTXT);
            if (jsonData == "fail") {
                //服务器数据异常！
                this.onFail && this.onFail(ID, "服务器数据异常！");
            } else {
                //数据交由开发者格式化
                var parserData = this.responseParser(jsonData);
                if (typeof parserData != "object") {
                    this.onFail && this.onFail(ID);
                } else {
                    if (parserData["files"] && parserData["files"]["length"] > 0) {
                        this.onSuccess && this.onSuccess(ID, parserData["files"], parserData["extra"]);
                    } else {
                        this.onFail && this.onFail(ID, parserData["extra"]);
                    }
                }
            }
        } else {
            this.onFail && this.onFail(ID, "you need define method : responseParser! ");
        }
        //销毁单次上传模块
        this.destory();
    };
    //初始化单次上传模块
    SingleUp.prototype["init"] = function() {
        var this_up = this;
        var uploaderDom = this.dom;
        var iframe = this.dom.find("iframe")[0];
        var ID = this.ID;
        //事件处理
        uploaderDom.on("change", ".uploader_btn", function() {
            var input = this;
            var can_start = true;
            //检测是否已选择文件
            var files = getFilesFromInput(input);
            if (files.length > 0) {
                //触发上传前事件
                if (this_up.beforeUpload) {
                    can_start = this_up.beforeUpload(ID, files);
                } else {
                    can_start = true;
                }
                if (can_start) {
                    uploaderDom.hide();
                    //开始上传文件
                    $(this).parents("form").submit();
                    this_up.status = "uploading";
                    //触发上传事件
                    this_up.onStartUpload && this_up.onStartUpload(ID, files);
                } else {
                    //重置html
                    input.outerHTML = input.outerHTML;
                }
            }
        });
        iframe_load(iframe, function() {
            var responseTXT = this.body.innerHTML;
            this_up.handleResponse(responseTXT);
        });
    };
    /**
	 * 为上传按钮绑定事件
	 */
    function bindEventsForUploader() {
        var this_up = this;
        //创建一个上传组建
        function workStart() {
            var btn = $(this);
            this_up.createSingleUp(btn);
        }
        if (this.dom[0].addEventListener && private_isSupportTouch) {
            //移动端使用touch
            this.dom.each(function() {
                var DOM = $(this)[0];
                DOM.addEventListener("touchstart", workStart);
                DOM.addEventListener("MSPointerDown", workStart);
                DOM.addEventListener("pointerdown", workStart);
            });
        } else {
            //PC为按钮绑定悬停事件
            this.dom.mouseenter(workStart);
        }
        this.dom.mouseleave(function() {
            //注销上传组建
            this_up.activeSet && this_up.activeSet.destory();
        }).on("click", function() {
            //代理click事件至上传组建
            this_up.activeSet.dom.find(".uploader_btn").trigger("click");
        });
    }
    /**
	 * @method uploader 上传类
	 * @param {Object} param 主参数
	 * 
	 */
    function uploader(param) {
        var this_up = this;
        var param = param || {};
        //事件堆
        this._events = {};
        this.action = param["action"] || null;
        this.data = param["data"] || {};
        //绑定上传方法的DOM
        this.dom = param["dom"];
        this.fileinputname = param["fileinputname"] || "photos";
        //是否可上传
        this.can_upload = true;
        this.responseParser = param["responseParser"] || null;
        //当前激活状态的上传组建
        this.activeSet = null;
        setTimeout(function() {
            bindEventsForUploader.call(this_up);
        }, 200);
    }
    uploader.prototype = {
        on: function(eventName, callback) {
            //事件堆无该事件，创建一个事件堆
            if (!this._events[eventName]) {
                this._events[eventName] = [];
            }
            this._events[eventName].push(callback);
            return this;
        },
        emit: function(eventName, args) {
            //事件堆无该事件，结束运行
            if (!this._events[eventName]) {
                return;
            }
            args = args || null;
            for (var i = 0, total = this._events[eventName].length; i < total; i++) {
                this._events[eventName][i].apply(this.event_global || this, args);
            }
        },
        createSingleUp: function() {
            var this_up = this;
            this.activeSet = new SingleUp({
                action: this.action,
                data: this.data,
                responseParser: this.responseParser,
                beforeUpload: function(ID, files) {
                    this_up.emit("beforeUpload", [ ID, files ]);
                    if (this_up.can_upload) {
                        return true;
                    } else {
                        return false;
                    }
                },
                onStartUpload: function(ID, files) {
                    this_up.emit("startUpload", [ ID, files ]);
                },
                onSuccess: function(ID, files, extra) {
                    this_up.emit("success", [ ID, files, extra ]);
                },
                onFail: function(ID, extra) {
                    this_up.emit("error", [ ID, extra ]);
                }
            });
        }
    };
    exports.uploader = uploader;
})(window.util);

//提供CommonJS规范的接口
window.define && define("util/uploader-debug", [], function(require, exports, module) {
    //对外接口
    return window.util.uploader;
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
window.define && define("util/event-debug", [], function(require, exports) {
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
window.define && define("util/panel-debug", [], function(require, exports, module) {
    //对外接口
    return window.util.panel;
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
window.define && define("UI/pop-debug", [], function(require, exports, module) {
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
