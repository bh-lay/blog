
/**
 * render
 * 
 */

//index page
define(function(require,exports){
	var temp = ['<div class="indeCnt">',
		'<div class="l-row index-section">',
			'<div class="l-col-12">',
                '<div class="index-intro">',
                    '<div class="logo"><i class="l-icon l-icon-layLogo"></i></div>',
                    '<h1 class="index_intro_a">小剧客栈</h1>',
                    '<p class="index_intro_b">一个自称是单页面加响应式的个人博客</p>',
                    '<p class="index_intro_c">nodeJS强力驱动</p>',
                    '<p class="index_intro_d">无耻地没有采用express框架</p>',
                    '<div class="footer">',
                        '<a href="https://github.com/bh-lay" target="_blank" title="github"><i class="l-icon l-icon-git"></i></a>',
                        '<a href="/topic/aboutme/index.html" target="_blank" title="关于剧中人">关于剧中人</a>',
                    '</div>',
                '</div>',
                '<div class="webLink">',
                    '<div class="caption">我的小伙伴</div>',
                    '<div class="content">{@each friends as it}',
                        '<a target="_blank" href="${it.url}" title="${it.title}" >${it.title}</a>',
                    '{@/each}</div>',
                '</div>',
            '</div>',
        '</div>',
	'</div>'].join('');
    function getData(callback){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/forPage/index',
			'success' :function(data){
				callback && callback(null,data);
			}
		});
	}
    function view(dom,callback){
        var me = this;
        
        getData(function(err,data){
            if(err){
                data = {
                    friends : []
                }
            }
            var html = juicer(temp,data);
            var this_dom = $(html);
            dom.html(this_dom);
        });
	}
    view.prototype = {
        destory: function(){
        }
    };
    
	return view;
});