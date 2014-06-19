/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
/**
 * 发布权限
 */
define && define("publish/power", [ "mditor/mditor", "gallery/index", "util/uploader.js", "util/event.js", "util/panel.js", "UI/pop.js", "gallery/fileItem.js", "gallery/folderItem.js" ], function(require, exports) {
    seajs.use("publish/publish.css");
    require("mditor/mditor.js");
    require("gallery/index.js");
    //初始化模版
    function valueInit(tpl, data) {
        var txt = tpl.replace(/\{(\w*)}/g, function() {
            return data[arguments[1]] || "";
        });
        return txt;
    }
    /****
	 * 获取权限内容
	 */
    function getPower(id, callback) {
        if (!id) {
            callback && callback("missing arguments");
        }
        $.ajax({
            url: "/ajax/power",
            type: "GET",
            data: {
                act: "get_detail",
                id: id
            },
            success: function(data) {
                if (data.code != 1) {
                    callback && callback("data error");
                } else {
                    callback && callback(null, data.detail);
                }
            }
        });
    }
    /**
	 * 权限
	 **/
    var power_tpl = [ '<form action="/ajax/power/add_edit" method="post" target="_self"><ul>', '<li class="L_foUItem"><label class="L_foUItTitle">权限编号：</label><input type="text" name="id" value="{id}"/></li>', '<li class="L_foUItem"><label class="L_foUItTitle">权限名：</label><input type="text" name="name" value="{name}" /></li>', '<li class="L_foUItem"><label class="L_foUItTitle">权限描述：</label><input type="text" name="discription" value="{discription}" ></li>', '<li class="L_foUItem"><input type="submit" value="提交" /></li>', "</ul></form>" ].join("");
    //发布权限内容
    function POWER(dom, id) {
        if (!id) {
            var new_html = valueInit(power_tpl, {});
            dom.html(new_html);
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在提交权限的创建！");
                },
                onResponse: function(data) {
                    UI.prompt("权限修改完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
            return;
        }
        getPower(id, function(err, data) {
            if (err) {
                dom.html("数据异常！");
                return;
            }
            var new_html = valueInit(power_tpl, data);
            dom.html(new_html);
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在提交权限的修改！");
                },
                onResponse: function(data) {
                    UI.prompt("全县修改完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
        });
    }
    //对外接口
    return POWER;
});

define("gallery/index", [ "util/uploader", "util/event", "util/panel", "UI/pop", "gallery/fileItem", "util/event.js", "util/panel.js", "util/toucher.js", "UI/pop.js", "gallery/folderItem", "util/uploader.js" ], function(require, exports) {
    seajs.use("gallery/style.css");
    var uploader = require("util/uploader.js");
    var events = require("util/event.js");
    var panel = require("util/panel.js");
    var UI = require("UI/pop.js");
    var fileItem = require("gallery/fileItem.js");
    var folderItem = require("gallery/folderItem.js");
    var loading_tpl = '<div class="gp_loading">正在加载</div>';
    var empty_tpl = '<div class="gp_loading">傻逼，建个空目录做啥子！</div>';
    var base_tpl = [ '<div class="gP_select">', '<div class="gp_toolBar">', '<div class="gp_toolBar_left">', '<a href="javascript:void(0)" data-action="back"><span class="glyphicon glyphicon-chevron-left"></span></a>', '<a href="javascript:void(0)" data-action="createDir"><span class="glyphicon glyphicon-folder-close"></span></a>', '<a href="javascript:void(0)" data-action="upload"><span class="glyphicon glyphicon-cloud-upload"></span></a>', "</div>", '<span class="gP_rootNav">/</span>', '<div class="gp_toolBar_right">', '<a href="javascript:void(0)" data-action="changeLayout">', '<div class="changeLayout layoutColum">', '<div class="span1"></div><div class="span2"></div>', '<div class="span3"></div><div class="span4"></div>', '<div class="span5"></div><div class="span6"></div>', "</div>", "</a>", "</div>", "</div>", '<div class="gp_select_cnt gp_select_colum"></div>', "</div>" ].join("");
    var pop_tpl = [ '<div class="galleryPop">', '<div class="galleryPop_cnt"><div class="container bs-docs-container"><div class="row">', '<div class="col-md-12"></div>', "</div></div></div>", '<div class="galleryPop_footer">', '<a href="javascript:void(0)">确定</a>', "</div>", "</div>" ].join("");
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
    /**
	 * @method researchFullname 从数组中查找属性fullname 为传入参数的对象 
	 */
    function researchFullname(fullname, data) {
        var total = data.length;
        for (var i = 0; i < total; i++) {
            if (data[i].fullname == fullname) {
                return data[i];
            }
        }
    }
    /**
	 * 获取目录信息
	 */
    function getData(path, callback) {
        $.ajax({
            url: "/ajax/asset",
            type: "GET",
            data: {
                path: path
            },
            dataType: "json",
            success: function(data) {
                if (data && data.code == 200) {
                    var newData = {
                        dir: [],
                        files: []
                    };
                    for (var i in data.files) {
                        var type = "";
                        if (data.files[i]["isdir"]) {
                            newData["dir"].push({
                                name: data.files[i]["name"],
                                type: "folder"
                            });
                        } else {
                            newData["files"].push({
                                name: data.files[i]["name"]
                            });
                        }
                    }
                    callback && callback(null, newData);
                } else {
                    callback && callback("网络出错！");
                }
            }
        });
    }
    function bindEvent() {
        var this_select = this;
        var thisUpload = new uploader({
            dom: this.dom.find('a[data-action="upload"]'),
            action: "/ajax/asset/upload",
            data: {
                act: "addFile",
                root: "/"
            }
        });
        this.on("fresh", function(baseRoot) {
            thisUpload.data.root = baseRoot;
        });
        thisUpload.responseParser = function(data) {
            //	console.log(data,'---------------');
            if (data && data.code && data.code == 200) {
                files = data.files;
            } else {
                files = [];
            }
            return {
                files: files
            };
        };
        thisUpload.on("startUpload", function(ID, files) {
            console.log("startUpload", arguments);
            for (var i in files) {
                var fileNew = new fileItem(this_select.root, {
                    name: files[i]["name"],
                    status: "uploading"
                });
                this_select.files.push(fileNew);
                this_select.cntDom.append(fileNew.dom);
            }
        });
        thisUpload.on("success", function(ID, files) {
            console.log("success", arguments);
            for (var i in files) {
                var name = files[i].name;
                this_select.get(name, "file").status("normal");
            }
        });
        this.dom.on("click", ".gP_dir_item", function() {
            //点击文件夹图标，执行打开动作
            var name = $(this).parents(".gP_item").attr("data-fullname");
            this_select.open(name);
        }).on("click", 'a[data-action="createDir"]', function() {
            //创建新的文件夹
            UI.ask("新目录叫什么呢？", function(txt) {
                this_select.createDir(txt);
            });
        }).on("click", 'a[data-action="back"]', function() {
            //后退
            this_select.back();
        }).on("click", 'a[data-action="changeLayout"]', function() {
            //改变布局
            this_select.layout();
        });
        //空白处绑定右键
        var fileMenu = panel({
            targets: ".gP_cnt"
        });
        fileMenu.add("mkdir", {
            txt: "新建目录"
        }, function() {
            //创建新的文件夹
            UI.ask("新目录叫什么呢？", function(txt) {
                this_select.createDir(txt);
            });
        });
        //文件右键菜单
        var fileMenu = panel({
            targets: '.gP_item[data-type="file"]',
            callback: function(name) {
                console.log('you have chioce "', name, '" from the [ ', this, "]");
            },
            callbefore: function() {}
        });
        //指定类型
        fileMenu.type = "menu";
        //增删菜单条目
        fileMenu.add("rename", {
            txt: "重命名"
        }, function() {
            //重命名
            var fullname = $(this).attr("data-fullname");
            var file = this_select.get(fullname, "file");
            file && file.rename();
        });
        fileMenu.add("delete", {
            txt: "删除"
        }, function() {
            //删除
            var fullname = $(this).attr("data-fullname");
            var file = this_select.get(fullname, "file");
            file && file.del();
        });
        fileMenu.add("showurl", {
            txt: "url地址"
        }, function() {
            //显示绝对地址
            var fullname = $(this).attr("data-fullname");
            var file = this_select.get(fullname, "file");
            UI.confirm({
                text: '<a target="_blank" href="' + file.url + '">' + file.url + "</a>"
            });
        });
        //文件夹右键菜单
        var folderMenu = panel({
            targets: '.gP_item[data-type="folder"]',
            callback: function(name) {
                console.log('you have chioce "', name, '" from the [ ', this, "]");
            },
            callbefore: function() {}
        });
        //指定类型
        folderMenu.type = "menu";
        //增删菜单条目
        folderMenu.add("open", {
            txt: "打开"
        }, function() {
            //重命名
            var fullname = $(this).attr("data-fullname");
            this_select.open(fullname);
        });
        folderMenu.add("rename", {
            txt: "重命名"
        }, function() {
            //重命名
            var fullname = $(this).attr("data-fullname");
            var folder = this_select.get(fullname, "folder");
            folder && folder.rename();
        });
        folderMenu.add("delete", {
            txt: "删除"
        }, function() {
            //删除
            var fullname = $(this).attr("data-fullname");
            var folder = this_select.get(fullname, "folder");
            folder && folder.del();
        });
    }
    /**
	 * 文件选择类
	 */
    function SELECT(dom, param) {
        this.root = "/";
        this.dom = $(base_tpl);
        this._layout = "colum";
        this.cntDom = this.dom.find(".gp_select_cnt");
        this.pathDom = this.dom.find(".gP_rootNav");
        this.folders = [];
        this.files = [];
        dom.html(this.dom);
        //扩展事件处理
        events.extend.call(this);
        //绑定dom事件
        bindEvent.call(this);
        this.open("");
        this.layout("colum");
    }
    SELECT.prototype = {
        open: function(filename) {
            var this_select = this;
            var path = this.root + "/" + filename;
            //		console.log(path,'22')
            path = path.replace(/\/+/g, "/");
            path = path.length > 0 ? path : "/";
            //		console.log(path,'333')
            this.jump(path);
        },
        layout: function(input) {
            var type = "";
            if (input && input.match(/^grid|colum$/)) {
                type = input;
            } else {
                if (this._layout == "colum") {
                    type = "grid";
                } else {
                    type = "colum";
                }
            }
            this._layout = type;
            var btn = this.dom.find(".changeLayout");
            var listDom = this.dom.find(".gp_select_cnt");
            //改变布局
            if (this._layout == "colum") {
                btn.removeClass("layoutGrid");
                btn.addClass("layoutColum");
                listDom.addClass("gp_select_colum");
                listDom.removeClass("gp_select_grid");
            } else {
                btn.addClass("layoutGrid");
                btn.removeClass("layoutColum");
                listDom.removeClass("gp_select_colum");
                listDom.addClass("gp_select_grid");
            }
        },
        createDir: function(foldername, callback) {
            var this_select = this;
            if (!foldername || foldername.length < 0) {
                callback && callback("参数不全");
                return;
            }
            $.ajax({
                url: "/ajax/asset/createDir",
                type: "POST",
                data: {
                    root: this.root,
                    name: foldername
                },
                dataType: "json",
                success: function(data) {
                    this_select.refresh();
                    callback && callback(null, data);
                },
                error: function() {
                    callback && callback("网络出错");
                }
            });
        },
        get: function(fullname, type) {
            var result = false;
            if (fullname && fullname.length > 0) {
                var type = type || "";
                if (type == "file") {
                    result = researchFullname(fullname, this.files);
                } else if (type == "folder") {
                    result = researchFullname(fullname, this.folders);
                } else {
                    var all = this.files.concat(this.folders);
                    result = researchFullname(fullname, all);
                }
            }
            return result;
        },
        back: function() {
            var root = this.root;
            //去除最后一节目录
            var path = root.split("/");
            path.pop();
            var newRoot = path.join("/");
            if (newRoot == root) {
                return;
            }
            this.jump(newRoot);
        },
        //刷新当前列表
        refresh: function() {
            var path = this.root;
            this.jump(path);
        },
        //跳转至指定目录
        jump: function(basePath) {
            var this_select = this;
            var cntDom = this.cntDom;
            cntDom.html(loading_tpl);
            this.pathDom.html(basePath);
            getData(basePath, function(err, data) {
                if (err) {
                    cntDom.html("错啦！");
                    return;
                }
                if (data.dir.length + data.files.length > 0) {
                    cntDom.html("");
                    this_select.folders = [];
                    this_select.files = [];
                    for (var i in data.dir) {
                        var folderNew = new folderItem(basePath, {
                            name: data.dir[i]["name"]
                        });
                        cntDom.append(folderNew.dom);
                        this_select.folders.push(folderNew);
                    }
                    for (var i in data.files) {
                        var fileNew = new fileItem(basePath, {
                            name: data.files[i]["name"]
                        });
                        cntDom.append(fileNew.dom);
                        this_select.files.push(fileNew);
                    }
                } else {
                    cntDom.html(empty_tpl);
                }
                this_select.root = basePath;
                this_select.emit("fresh", this_select.root);
            });
        },
        selection: function() {
            var selectedFiles = [];
            var filesTotal = this.files.length;
            for (var i = 0; i < filesTotal; i++) {
                if (this.files[i].status == "selected") {
                    selectedFiles.push({
                        extension: this.files[i]["extension"],
                        fullname: this.files[i]["fullname"],
                        url: this.files[i]["url"]
                    });
                }
            }
            return selectedFiles;
        }
    };
    exports.init = function(dom, param) {
        return new SELECT(dom, param);
    };
    exports.pop = function POP(callback) {
        var pop = UI.cover({
            title: "选择文件",
            html: pop_tpl
        });
        var explorer = new SELECT(pop.cntDom.find(".col-md-12"));
        pop.dom.find(".galleryPop_footer a").on("click", function() {
            callback && callback(explorer.selection());
            pop.close();
        });
    };
});
