/**
 * labs list
 *  
 */
define("public/js/labsList-debug", [ "lib/juicer-debug" ], function(require, exports) {
    require("lib/juicer-debug.js");
    require("public/css/labs-debug.css");
    var temp = [ "{@each list as it,index}", '<li><div class="lab_item">', '<a class="lab_cover" href="/labs/${it.name}" title="${it.title}" target="_blank" style="background-image:url(${it.cover})"></a>', '<h4 class="lab_title">', '<a href="/labs/${it.name}" title="${it.title}" target="_blank">${it.title}</a>', "</h4>", '<div class="lab_info">', "<p>${it.intro}</p>", "</div>", "</div></li>", "{@/each}" ].join("");
    var limit = 20, skip = 0, count = null, dom;
    var insert = function(param) {
        var this_html = $(param["html"]), this_dom = param["dom"];
        this_dom.append(this_html);
    };
    var getData = function(callback) {
        $.ajax({
            type: "GET",
            url: "/ajax/labs",
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
        //		if(!param['init']){
        //			return
        //		}
        skip = 0;
        getData(function(list) {
            dom.html('<div class="l_row"><div class="l_col_12"><ul class="labsList"></ul></div></div>');
            var this_html = juicer(temp, {
                list: list
            }), this_dom = dom.find(".labsList");
            insert({
                end: skip >= count ? true : false,
                html: this_html,
                dom: this_dom
            });
            start();
        });
    };
});
