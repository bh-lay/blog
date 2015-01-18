
/**
 * render
 * 
 */

//index page
define(function(require,exports){
	var temp = ['<div class="indeCnt">',
		'<section class="index-aboutme">',
			'<div class="avatar"></div>',
			'<h3>我是<strong>剧中人</strong></h3>',
			'<p>90后天蝎男，前端工程师，全栈开发尝试者</p>',
			'<p><a target="_blank" href="/topic/aboutme/index.html" title="关于剧中人">关于剧中人</a></p>',
			'<div class="footer">',
				'<a target="_blank" href="https://github.com/bh-lay" title="github" class="github"><i class="l-icon l-icon-git"></i></a>',
				'<a target="_blank" href="/topic/aboutme/index.html" title="知乎" class="zhihu"><i class="l-icon l-icon-zhihu"></i></a>',
			'</div>',
		'</section>',
		'<section class="index-about-design">',
			'<div class="l-row">',
				'<div class="l-col-12">',
					'<div class="intro-half">',
						'<h3>尝试实现响应式设计</h3>',
						'<p>配合单页架构提升使用体验</p>',
						'<div class="links">单页组件<a href="#">lofox.js</a><a href="#">iframer</a></div>',
					'</div>',
					'<div class="device-half">',
						'<div class="device pc"></div>',
						'<div class="device mobile"><span></span></div>',
						'<div class="device pad"></div>',
					'</div>',
				'</div>',
			'</div>',
		'</section>',
		'<section class="index-about-blog">',
			'<h1 class="index_intro_a">小剧客栈</h1>',
			'<p class="index_intro_c">nodeJS强力驱动</p>',
			'<p class="index_intro_d">无耻地没有采用express框架</p>',
		'</section>',
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