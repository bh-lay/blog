/**
 * blogList page
 *  
 */
define("public/js/blogList-debug", [ "lib/juicer-debug" ], function(require, exports) {
    require("lib/juicer-debug.js");
    require("public/css/blog-debug.css");
    var blogTemp = [ "{@each list as it,index}", '<div class="articleItem" articleId="${it.id}">', '<div class="artItCpt">', '<h3><a href="/blog/${it.id}" title="${it.title}" lofox="true" target="_self" >${it.title}</a></h3>', "<p>${it.time_show}</p>", "</div>", '<div class="artItCnt">', "{@if it.cover}", '<div class="artItPic">', '<a href="/blog/${it.id}" title="${it.title}" lofox="true" target="_self" >', '<img src="${it.cover}" alt="${it.title}" />', "</a>", "</div>", "{@/if}", '<div class="artItInfo"><p>${it.intro}</p></div>', '<div class="artItTag">${it.tags}</div>', '<div class="artItFoot">', '<a class="dataLike" title="我喜欢" href="javascript:void(0)"><i></i><b>8</b></a>', '<a class="dataView" title="查看" href="/blog/${it.id}" lofox="true" target="_self"><i></i><b>367</b></a>', "</div>", "</div>", '<div class="artItLace">', '<div class="artItLaCircle"></div>', '<div class="artItLaCorner"><b></b><i></i></div>', "</div>", "</div>", "{@/each}" ].join("");
    var add_btn, limit = 10, skip;
    var insert = function(param) {
        console.log("blog list page:", "insert html !");
        var param = param || {};
        var this_dom = $(param["html"]).hide();
        if (param["end"]) {
            add_btn.hide();
        } else {
            add_btn.removeClass("blog_addMore_loading");
        }
        add_btn.before(this_dom);
        this_dom.fadeIn(200);
    };
    var getData = function(fn) {
        $.ajax({
            type: "GET",
            url: "/ajax/blog",
            data: {
                act: "get_list",
                skip: skip,
                limit: limit
            },
            success: function(data) {
                var count = data["count"], list = data["list"];
                for (var i in list) {
                    var date = new Date(parseInt(list[i].time_show));
                    list[i].time_show = date.getYear() + 1900 + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    list[i].cover = list[i].cover;
                }
                var this_html = juicer(blogTemp, {
                    list: list
                });
                fn && fn(this_html, count);
            }
        });
    };
    var bindEvent = function(dom) {
        console.log("blog list page:", "bind event !");
        console.log("blog list page:", "add blog btn [more] !");
        var add_btn_tpl = [ '<div class="blog_addMore">', '<a href="javascript:void(0)">加载更多</a>', "<span>正在加载……</span>", "</div>" ].join("");
        add_btn = $(add_btn_tpl);
        dom.find(".articleList").append(add_btn);
        dom.on("click", ".blog_addMore", function() {
            add_btn.addClass("blog_addMore_loading");
            getData(function(html, count) {
                skip += limit;
                insert({
                    end: skip >= count ? true : false,
                    html: html
                });
            });
        }).on("click", ".dataLike", function() {
            var this_ico = $(this);
            var left = this_ico.offset().left - 20, top = this_ico.offset().top - 16;
        });
    };
    return function(dom, param) {
        console.log("blog list page:", "start !");
        dom.html('<div class="l_row"><div class="l_col_12"><div class="articleList"></div></div></div>');
        skip = 0;
        bindEvent(dom);
        getData(function(html, count) {
            skip += limit;
            insert({
                end: skip >= count ? true : false,
                html: html
            });
        });
    };
});
