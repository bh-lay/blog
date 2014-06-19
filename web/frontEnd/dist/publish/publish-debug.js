/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
//alert(window.outerWidth);
define && define("publish/publish-debug", [ "publish/article-debug", "mditor/mditor-debug.js", "gallery/index-debug.js", "publish/share-debug", "publish/opus-debug", "publish/labs-debug", "publish/friends-debug", "publish/power-debug", "publish/user-debug" ], function(require, exports) {
    seajs.use("publish/publish.css");
    var article = require("publish/article-debug.js");
    var share = require("publish/share-debug.js");
    var opus = require("publish/opus-debug.js");
    var labs = require("publish/labs-debug.js");
    var friends = require("publish/friends-debug.js");
    var power = require("publish/power-debug.js");
    var user = require("publish/user-debug.js");
    var publish_tpl = [ '<div class="publish">', '<div class="publish_cpt">', '<a href="javascript:void(0)" data-type="article" class="active">博文</a>', '<a href="javascript:void(0)" data-type="share">分享</a>', '<a href="javascript:void(0)" data-type="labs">实验室</a>', '<a href="javascript:void(0)" data-type="opus">作品</a>', '<a href="javascript:void(0)" data-type="friends">友情链接</a>', "</div>", '<div class="publish_cnt"></div>', "</div>" ].join("");
    function show_module(dom, cpt_dom, name, id) {
        if (name == "share") {
            share(dom, id);
        } else if (name == "opus") {
            opus(dom, id);
        } else if (name == "friends") {
            friends(dom, id);
        } else if (name == "labs") {
            labs(dom, id);
        } else if (name == "user") {
            user(dom, id);
        } else {
            //默认为发布文章
            article(dom, id);
        }
        cpt_dom.find("a").removeClass("active");
        cpt_dom.find('a[data-type="' + name + '"]').addClass("active");
    }
    function INIT(dom, param) {
        var param = param || {};
        var id = param.id || null;
        var active = param.active || "article";
        if (active == "user") {
            show_module(dom, cpt_dom, active, id);
        } else {
            dom.html(publish_tpl);
            var cpt_dom = dom.find(".publish_cpt");
            var cnt_dom = dom.find(".publish_cnt");
            show_module(cnt_dom, cpt_dom, active, id);
            cpt_dom.on("click", "a", function() {
                var name = $(this).attr("data-type");
                show_module(cnt_dom, cpt_dom, name, null);
                admin.push("publish/" + name);
            });
        }
    }
    exports.init = INIT;
    exports.article = article;
    exports.share = share;
    exports.opus = opus;
    exports.labs = labs;
    exports.friends = friends;
    exports.power = power;
    exports.user = user;
});

/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
/**
 * 发布博文
 */
define("publish/article-debug", [ "mditor/mditor-debug", "gallery/index-debug", "util/uploader-debug.js", "util/event-debug.js", "util/panel-debug.js", "UI/pop-debug.js", "gallery/fileItem-debug.js", "gallery/folderItem-debug.js" ], function(require, exports) {
    seajs.use("publish/publish.css");
    require("mditor/mditor-debug.js");
    var gallery = require("gallery/index-debug.js");
    //初始化模版
    function valueInit(tpl, data) {
        var txt = tpl.replace(/\{(\w*)}/g, function() {
            return data[arguments[1]] || "";
        });
        return txt;
    }
    var article_tpl = [ '<div class="pub_article"><form action="/ajax/add_edit" method="post" target="_self">', '<div class="pub_row_input"><input type="text" placeholder="博文标题，必须要填的哦！" name="title" value="{title}"/></div>', '<div class="pub_row_input">', '<textarea placeholder="一段话概括博文" name="intro" cols="50" rows="5">{intro}</textarea>', "</div>", '<div class="pub_row_input">', '<textarea class="mditor" placeholder="博文正文" name="content">{content}</textarea>', "</div>", '<div class="pub_row_image">', '<div class="pub_row_image" style="background-image:url({cover});">', '<a class="pub_cover_btn" href="javascript:void(0)">选择</a>', "</div>", '<input type="hidden" placeholder="缩略图" name="cover" value="{cover}" />', "</div>", "<div>", '<input type="text" placeholder="标签" name="tags" value="{tags}" />', '<input type="text" placeholder="作者" name="author" value="{author}" />', '<input type="text" placeholder="发表时间" name="time_show" value="{time_show}" />', "</div>", '<div class="pub_sub">', '<input type="hidden" name="id" value="{id}" />', '<input type="hidden" name="category" value="blog" />', '<button type="submit" class="btn btn-primary">提交</button>', "</div>", "</form></div>" ].join("");
    /****
	 * 获取博文内容
	 */
    function getArticle(id, callback) {
        if (!id) {
            callback && callback("missing arguments");
        }
        $.ajax({
            url: "/ajax/blog",
            type: "GET",
            data: {
                content_format: "markdown",
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
    //处理博文模块
    function article_handule(dom, data) {
        var new_html = valueInit(article_tpl, data);
        dom.html(new_html);
        mditor.bind(dom.find("textarea.mditor"));
        dom.find(".pub_cover_btn").click(function() {
            gallery.pop(function(files) {
                if (files && files.length > 0) {
                    var url = files[0]["url"];
                    dom.find(".pub_row_image").css("backgroundImage", "url(" + url + ")");
                    dom.find('input[name="cover"]').val(url);
                }
            });
        });
        admin.formToAjax(dom, {
            onSubmit: function(data) {
                UI.prompt("正在提交博文修改！");
            },
            onResponse: function(data) {
                UI.prompt("博文修改完毕");
                admin.push("/admin/");
                admin.refresh();
            }
        });
    }
    //发布帖子
    function ARTICLE(dom, id) {
        if (!id) {
            article_handule(dom, {});
            return;
        }
        getArticle(id, function(err, data) {
            if (err) {
                dom.html("数据异常！");
                return;
            }
            article_handule(dom, data);
        });
    }
    return ARTICLE;
});

/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
//alert(window.outerWidth);
/**
 * 发布分享
 */
define("publish/share-debug", [ "mditor/mditor-debug", "gallery/index-debug", "util/uploader-debug.js", "util/event-debug.js", "util/panel-debug.js", "UI/pop-debug.js", "gallery/fileItem-debug.js", "gallery/folderItem-debug.js" ], function(require, exports) {
    seajs.use("publish/publish.css");
    require("mditor/mditor-debug.js");
    require("gallery/index-debug.js");
    //初始化模版
    function valueInit(tpl, data) {
        var txt = tpl.replace(/\{(\w*)}/g, function() {
            return data[arguments[1]] || "";
        });
        return txt;
    }
    var share_tpl = [ '<div class="pub_share">', '<form action="/ajax/add_edit" method="post" target="_self">', '<div class="pub_row_input">', '<input type="text" placeholder="分享主题" name="title" value="{title}"/>', "</div>", '<div class="pub_row_input">', '<textarea name="intro" placeholder="分享简介" cols="50" rows="5">{intro}</textarea>', "</div>", '<div class="pub_row_input">', '<textarea name="content" placeholder="分享详情" cols="50" rows="10" >{content}</textarea>', "</div>", "<div>", '<input type="text" placeholder="缩略图" name="cover" value="{cover}" />', '<input type="text" placeholder="标签" name="tags" value="{tags}" />', '<input type="text" placeholder="发表时间" name="time_show" value="{time_show}" />', '<input type="text" placeholder="分享来自" name="from" value="{from}" />', '<input type="text" placeholder="分享地址" name="from_url" value="{from_url}" />', "</div>", "<div>", '<input type="hidden" name="id" value="{id}" />', '<input type="hidden" name="category" value="share" />', '<button type="submit" class="btn btn-primary">提交</button>', "</div>", "</form>", "</div>" ].join("");
    /****
	 * 获取分享内容
	 */
    function getShare(id, callback) {
        if (!id) {
            callback && callback("missing arguments");
        }
        $.ajax({
            url: "/ajax/share",
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
    //发布分享
    function SHARE(dom, id) {
        if (!id) {
            var new_html = valueInit(share_tpl, {});
            dom.html(new_html);
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在提交分享修改！");
                },
                onResponse: function(data) {
                    UI.prompt("分享发布完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
            return;
        }
        getShare(id, function(err, data) {
            if (err) {
                dom.html("数据异常！");
                return;
            }
            var new_html = valueInit(share_tpl, data);
            dom.html(new_html);
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在提交分享修改！");
                },
                onResponse: function(data) {
                    UI.prompt("分享修改完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
        });
    }
    return SHARE;
});

/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
//alert(window.outerWidth);
/**
 * 发布作品
 */
define && define("publish/opus-debug", [ "mditor/mditor-debug", "gallery/index-debug", "util/uploader-debug.js", "util/event-debug.js", "util/panel-debug.js", "UI/pop-debug.js", "gallery/fileItem-debug.js", "gallery/folderItem-debug.js" ], function(require, exports) {
    seajs.use("publish/publish.css");
    require("mditor/mditor-debug.js");
    require("gallery/index-debug.js");
    //初始化模版
    function valueInit(tpl, data) {
        var txt = tpl.replace(/\{(\w*)}/g, function() {
            return data[arguments[1]] || "";
        });
        return txt;
    }
    var opus_tpl = [ '<div class="pub_opus">', '<form action="/ajax/add_edit" method="post" target="_self">', '<div class="pub_row_input"><input type="text" name="title" value="{title}" placeholder="标题"/></div>', '<div class="pub_row_input"><input type="text" name="work_range" value="{work_range}" placeholder="开发范围" /></div>', '<div class="pub_row_input"><input type="text" name="online_url" value="{online_url}" placeholder="在线地址" /></div>', '<div class="pub_row_input">', '<textarea name="intro" cols="50" rows="5" placeholder="作品简介">{intro}</textarea>', "</div>", '<div class="pub_row_input">', '<textarea class="mditor" name="content" cols="50" rows="10" placeholder="作品详细信息" >{content}</textarea>', "</div>", '<div class="">', '<input type="text" name="cover" value="{cover}" placeholder="缩略图"/>', '<input type="text" name="opus_pic" value="{opus_pic}" placeholder="作品大图" />', '<input type="text" name="tags" value="{tags}" placeholder="标签" />', '<input type="text" name="opus_time_create" value="{opus_time_create}" placeholder="创作时间" />', "</div>", "<div>", '<input type="hidden" name="id" value="{id}" />', '<input type="hidden" name="category" value="opus" />', '<button type="submit" class="btn btn-primary">提交</button>', "</div>", "</form>", "</div>" ].join("");
    /****
	 * 获取作品内容
	 */
    function getOpus(id, callback) {
        if (!id) {
            callback && callback("missing arguments");
        }
        $.ajax({
            url: "/ajax/opus",
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
    function OPUS(dom, id) {
        if (!id) {
            var new_html = valueInit(opus_tpl, {});
            dom.html(new_html);
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在提交分享修改！");
                },
                onResponse: function(data) {
                    UI.prompt("分享发布完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
            return;
        }
        getOpus(id, function(err, data) {
            if (err) {
                dom.html("数据异常！");
                return;
            }
            var new_html = valueInit(opus_tpl, data);
            dom.html(new_html);
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在提交作品修改！");
                },
                onResponse: function(data) {
                    UI.prompt("作品修改完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
        });
    }
    return OPUS;
});

/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
/**
 * 发布试验室
 */
define && define("publish/labs-debug", [ "mditor/mditor-debug", "gallery/index-debug", "util/uploader-debug.js", "util/event-debug.js", "util/panel-debug.js", "UI/pop-debug.js", "gallery/fileItem-debug.js", "gallery/folderItem-debug.js" ], function(require, exports) {
    seajs.use("publish/publish.css");
    require("mditor/mditor-debug.js");
    require("gallery/index-debug.js");
    //初始化模版
    function valueInit(tpl, data) {
        var txt = tpl.replace(/\{(\w*)}/g, function() {
            return data[arguments[1]] || "";
        });
        return txt;
    }
    var labs_tpl = [ '<div class="pub_labs">', '<form action="/ajax/add_edit" method="post" target="_self">', '<div class="pub_row_input"><input type="text" name="name" value="{name}" placeholder="插件名"/></div>', '<div class="pub_row_input"><input type="text" name="title" value="{title}" placeholder="标题"/></div>', '<div class="pub_row_input"><input type="text" name="cover" value="{cover}" placeholder="缩略图" /></div>', '<div class="pub_row_input"><input type="text" name="time_create" value="{opus_time_create}" placeholder="创作时间" /></div>', '<div class="pub_row_input">', '<textarea name="intro" cols="50" rows="5" placeholder="插件简介">{intro}</textarea>', "</div>", '<div class="pub_row_input"><input type="text" name="git_full_name" value="{git_full_name}" placeholder="github地址（如“bh-lay/uploader”）" /></div>', '<div class="pub_row_input"><input type="text" name="demo_url" value="{demo_url}" placeholder="demo地址" /></div>', '<div class="pub_row_input">', '<textarea class="mditor" name="content" cols="50" rows="10" placeholder="插件详细介绍" >{content}</textarea>', "</div>", "<div>", '<input type="hidden" name="id" value="{id}" />', '<input type="hidden" name="category" value="labs" />', '<button type="submit" class="btn btn-primary">提交</button>', "</div>", "</form>", "</div>" ].join("");
    /****
	 * 获取实验室内容
	 */
    function getLabs(id, callback) {
        if (!id) {
            callback && callback("missing arguments");
        }
        $.ajax({
            url: "/ajax/labs",
            type: "GET",
            data: {
                content_format: "markdown",
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
    //发布实验室内容
    function LABS(dom, id) {
        if (!id) {
            var new_html = valueInit(labs_tpl, {});
            dom.html(new_html);
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在提交实验室的修改！");
                },
                onResponse: function(data) {
                    UI.prompt("实验室发布完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
            mditor.bind(dom.find("textarea.mditor"));
            return;
        }
        getLabs(id, function(err, data) {
            if (err) {
                dom.html("数据异常！");
                return;
            }
            var new_html = valueInit(labs_tpl, data);
            dom.html(new_html);
            mditor.bind(dom.find("textarea.mditor"));
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在提交实验室修改！");
                },
                onResponse: function(data) {
                    UI.prompt("实验室修改完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
        });
    }
    return LABS;
});

/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
/**
 * 发布友情链接
 */
define && define("publish/friends-debug", [ "mditor/mditor-debug", "gallery/index-debug", "util/uploader-debug.js", "util/event-debug.js", "util/panel-debug.js", "UI/pop-debug.js", "gallery/fileItem-debug.js", "gallery/folderItem-debug.js" ], function(require, exports) {
    seajs.use("publish/publish.css");
    require("mditor/mditor-debug.js");
    require("gallery/index-debug.js");
    //初始化模版
    function valueInit(tpl, data) {
        var txt = tpl.replace(/\{(\w*)}/g, function() {
            return data[arguments[1]] || "";
        });
        return txt;
    }
    var friend_tpl = [ '<div class="pub_friend">', '<form action="/ajax/add_edit" method="post" target="_self">', '<div class="pub_row_input"><input type="text" name="title" value="{title}" placeholder="标题" /></div>', '<div class="pub_row_input"><input type="text" name="url" value="{url}" placeholder="地址" /></div>', '<div class="pub_row_input"><input type="text" name="discription" value="{discription}" placeholder="描述" /></div>', '<div class="pub_row_input"><input type="text" name="isShow" value="{isShow}" placeholder="是否显示" /></div>', '<div class="pub_row_input">', '<input type="hidden" name="id" value="{id}" />', '<input type="hidden" name="category" value="blog_friend" />', '<button type="submit" class="btn btn-primary">提交</button>', "</div>", "</form>", "</div>" ].join("");
    /****
	 * 获取友情链接内容
	 */
    function getFriend(id, callback) {
        if (!id) {
            callback && callback("missing arguments");
        }
        $.ajax({
            url: "/ajax/friends",
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
    //增加、修改友情链接
    function FRIENDS(dom, id) {
        if (!id) {
            var new_html = valueInit(friend_tpl, {});
            dom.html(new_html);
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在发布！");
                },
                onResponse: function(data) {
                    UI.prompt("链接发布完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
            return;
        }
        getFriend(id, function(err, data) {
            if (err) {
                dom.html("数据异常！");
                return;
            }
            var new_html = valueInit(friend_tpl, data);
            dom.html(new_html);
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在提交链接修改！");
                },
                onResponse: function(data) {
                    UI.prompt("链接修改完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
        });
    }
    //对外接口
    return FRIENDS;
});

/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
/**
 * 发布权限
 */
define && define("publish/power-debug", [ "mditor/mditor-debug", "gallery/index-debug", "util/uploader-debug.js", "util/event-debug.js", "util/panel-debug.js", "UI/pop-debug.js", "gallery/fileItem-debug.js", "gallery/folderItem-debug.js" ], function(require, exports) {
    seajs.use("publish/publish.css");
    require("mditor/mditor-debug.js");
    require("gallery/index-debug.js");
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

/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
//alert(window.outerWidth);
/**
 * 发布分享
 */
define("publish/user-debug", [], function(require, exports) {
    seajs.use("publish/publish.css");
    //初始化模版
    function valueInit(tpl, data) {
        var txt = tpl.replace(/\{(\w*)}/g, function() {
            return data[arguments[1]] || "";
        });
        return txt;
    }
    var share_tpl = [ '<div class="pub_share">', /*<li class="L_foUItem"><label class="L_foUItTitle">：</label><input type="text" name="" value="{email}" /></li>
				<li class="L_foUItem"><label class="L_foUItTitle">：</label><input type="text" name="" ></li>
				<li class="L_foUItem"><label class="L_foUItTitle">：</label><select name="">{user_group}</select></li>
				<li class="L_foUItem"><input type="hidden" name="id" value="{id}" /><input type="submit" value="提交" /></li>
				**/
    '<form action="/ajax/user" method="post" target="_self">', '<div class="pub_row_input">', '<input type="text" placeholder="用户名" name="username" value="{username}"/>', "</div>", '<div class="pub_row_input">', '<input type="text" placeholder="邮箱" name="email" value="{email}"/>', "</div>", '<div class="pub_row_input">', '<input type="text" placeholder="密码" name="password" />', "</div>", '<div class="pub_row_input">', '<input type="text" placeholder="用户组" name="user_group" value="{user_group}"/>', "</div>", "<div>", '<input type="hidden" name="id" value="{id}" />', '<input type="hidden" name="category" value="share" />', '<button type="submit" class="btn btn-primary">提交</button>', "</div>", "</form>", "</div>" ].join("");
    /****
	 * 获取用户信息
	 */
    function getUser(id, callback) {
        if (!id) {
            callback && callback("missing arguments");
        }
        $.ajax({
            url: "/ajax/user/" + id,
            type: "GET",
            success: function(data) {
                if (data.code != 200) {
                    callback && callback("data error");
                } else {
                    callback && callback(null, data.detail);
                }
            }
        });
    }
    //用户模块
    function SHARE(dom, id) {
        if (!id) {
            var new_html = valueInit(share_tpl, {});
            dom.html(new_html);
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在提交用户创建！");
                },
                onResponse: function(data) {
                    UI.prompt("用户创建完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
            return;
        }
        getUser(id, function(err, data) {
            if (err) {
                dom.html("数据异常！");
                return;
            }
            var new_html = valueInit(share_tpl, data);
            dom.html(new_html);
            admin.formToAjax(dom, {
                onSubmit: function(data) {
                    UI.prompt("正在提交用户修改！");
                },
                onResponse: function(data) {
                    UI.prompt("用户修改完毕");
                    admin.push("/admin/");
                    admin.refresh();
                }
            });
        });
    }
    return SHARE;
});
