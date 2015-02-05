
/**
 * render
 * 
 */

//index page
define(function(require,exports){
	var temp = ['<div class="indeCnt">',
		'<section class="index-aboutme">',
			'<div class="avatar"></div>',
			'<h3>我是剧中人</h3>',
			'<p>90后天蝎男，前端工程师，全栈开发尝试者</p>',
			'<div class="footer">',
				'<a target="_blank" href="/topic/aboutme/index.html" title="关于剧中人" class="aboutme"><i class="l-icon l-icon-layLogo"></i></a>',
				'<a target="_blank" href="https://github.com/bh-lay" title="github" class="github"><i class="l-icon l-icon-git"></i></a>',
				'<a target="_blank" href="http://www.zhihu.com/people/imju-zhong-ren" title="知乎" class="zhihu"><i class="l-icon l-icon-zhihu"></i></a>',
				'<a target="_blank" href="https://dribbble.com/bh_lay" title="dribbble" class="dribbble"><i class="l-icon l-icon-dribbble"></i></a>',
			'</div>',
		'</section>',
		'<section class="index-about-design">',
			'<div class="grid-row">',
                '<div class="grid-box-2 intro-half">',
                    '<h3>尝试实现响应式设计</h3>',
                    '<p>配合单页架构提升使用体验</p>',
                    '<div class="links">',
                        '单页组件<a href="http://bh-lay.github.io/lofox/index.html">lofox.js</a>',
                        '<a href="http://bh-lay.github.io/iframer/app.html">iframer</a>',
                    '</div>',
                '</div>',
                '<div class="grid-box-2 device-half">',
                    '<div class="device pc"></div>',
                    '<div class="device mobile"><span></span></div>',
                    '<div class="device pad"></div>',
                '</div>',
			'</div>',
		'</section>',
		'<section class="index-about-backend">',
            '<div class="language">',
                '<div class="nodeJS-logo"></div>',
                '<p>NODEJS强力驱动</p>',
            '</div>',
            '<div class="frameworks">',
                '<p>无耻地没有使用以下框架</p>',
                '<p>express hexo bones rrestjs koa hapi<a target="_blank" href="https://github.com/bh-lay/blog/">博客源码</a></p>',
            '</div>',
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
        var this_dom = $(temp);
        dom.html(this_dom);
	}
    view.prototype = {
        destory: function(){
        }
    };
    
	return view;
});