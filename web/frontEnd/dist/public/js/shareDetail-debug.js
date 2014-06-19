/**
 * share detail
 *  
 */
define("public/js/shareDetail-debug", [ "lib/juicer-debug" ], function(require, exports) {
    require("lib/juicer-debug.js");
    seajs.use("public/css/share.css");
    var template = [ '<div class="l_row"><div class="l_col_12 shareDetail">', '<div class="articletop">', "<h1>${title}</h1>", "<p><span>分享时间：${time_show} </span></p>", "</div>", '<div class="article">$${content}</div>', '<div class="youyan">', '<div id="uyan_frame"></div>', '<script type="text/javascript">', 'var uyan_config = {"du":"bh-lay.com"};', "</script>", '<script type="text/javascript" id="UYScript" src="http://v1.uyan.cc/js/iframe.js?UYUserId=1605927" async=""></script>', "</div>", "</div></div>" ].join("");
    function getData(id, fn) {
        $.ajax({
            type: "GET",
            url: "/ajax/share",
            data: {
                act: "get_detail",
                id: id
            },
            success: function(data) {
                if (data.code == 1) {
                    var detail = data["detail"];
                    var date = new Date(parseInt(detail.time_show));
                    detail.time_show = date.getYear() + 1900 + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    var this_html = juicer(template, detail);
                    fn && fn(this_html, detail["title"]);
                } else {
                    //	L.dialog.tips('分享不存在！');
                    lofox.push("/share", {
                        render: false
                    });
                    fn && fn();
                }
            }
        });
    }
    return function(dom, id) {
        var render_over = this.render_over || null;
        //	if(param['init']){
        var dom = dom, id = id || null;
        getData(id, function(html, title) {
            html && dom.html(html);
            render_over && render_over(title);
        });
    };
});
