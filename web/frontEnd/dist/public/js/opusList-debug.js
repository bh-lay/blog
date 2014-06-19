/**
 * opus list
 *  
 */
define("public/js/opusList-debug", [ "lib/juicer-debug" ], function(require, exports) {
    require("lib/juicer-debug.js");
    seajs.use("public/css/opus.css");
    var item_tpl = [ "{@each list as it,index}", "<li>", '<div class="opus_cover">', '<a href="/opus/${it.id}" title="${it.title}" target="_self" lofox="true" >', '<img src="${it.cover}" alt="${it.title}" />', "</a>", "</div>", '<div class="opus_info">', '<h3><a href="/opus/${it.id}" target="_self" lofox="true" >${it.title}</a></h3>', "<p><strong>开发范围：</strong>", "{@each it.work_range as that,index}", "<span>${that}</span>", "{@/each}", "</p>", "<p><strong>在线地址：</strong>", "{@if it.online_url}", '<a href="${it.online_url}">${it.online_url}</a>', "{@else}", "<span>无在线地址</span>", "{@/if}", "</p>", "</div>", "</li>", "{@/each}" ].join("");
    var limit = 20, skip = 0, count = null, dom;
    var insert = function(param) {
        var this_html = $(param["html"]), this_dom = param["dom"];
        this_dom.append(this_html);
    };
    var getData = function(callback) {
        $.ajax({
            type: "GET",
            url: "/ajax/opus",
            data: {
                act: "get_list",
                skip: skip,
                limit: limit
            },
            success: function(data) {
                count = data["count"];
                skip += limit;
                var list = data["list"];
                for (var i = 0, total = list.length; i < total; i++) {
                    list[i]["work_range"] = list[i]["work_range"] ? list[i]["work_range"].split(/\,/) : [ "暂未填写" ];
                }
                callback && callback(list);
            }
        });
    };
    var start = function() {
        $(".shareList").on("mouseenter", "a", function() {
            $(this).find("strong").stop().animate({
                bottom: 0
            }, 200);
        }).on("mouseleave", "a", function() {
            $(this).find("strong").stop().animate({
                bottom: -100
            }, 200);
        });
    };
    return function(dom, param) {
        var render_over = this.render_over || null;
        //			if(param['init']){
        skip = 0;
        getData(function(list) {
            dom.html('<div class="golCnt"><div class="opusList"><ul></ul></div></div>');
            var this_html = juicer(item_tpl, {
                list: list
            }), this_dom = dom.find(".opusList ul");
            insert({
                end: skip >= count ? true : false,
                html: this_html,
                dom: this_dom
            });
            start();
            render_over && render_over();
        });
    };
});
