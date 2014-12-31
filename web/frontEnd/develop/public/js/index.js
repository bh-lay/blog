
/**
 * render
 * 
 */

//index page
define(function(require,exports){
	var temp = ['<div class="indeCnt">',
		'<div class="l-row">',
            '<div class="l-col-8">',
                '<div class="index-banner">',
'<a class="arrow-left" href="#"></a>', 
'<a class="arrow-right" href="#"></a>',
'<div class="swiper-container">',
  '<div class="swiper-wrapper">',
	'<div class="swiper-slide">',
	  '<div class="content-slide">',
		'<p class="title">Slide with HTML</p>',
		'<p>You can put any HTML inside of slide with any layout, not only images, even another Swiper!</p>',
	  '</div>',
	'</div>',
	'<div class="swiper-slide">123456 </div>',
	'<div class="swiper-slide">',
	  '<div class="content-slide">',
		'<p class="title">Slide with HTML</p>',
		'<p>You can put any HTML inside of slide with any layout, not only images, even another Swiper!</p>',
	  '</div>',
	'</div>',
  '</div>',
'</div>',
'<div class="swiper-pagination"></div>',
				'</div>',
                '<div class="webLink">',
                    '<div class="caption">我的小伙伴</div>',
                    '<div class="content">{@each friends as it}',
                        '<a target="_blank" href="${it.url}" title="${it.title}" >${it.title}</a>',
                    '{@/each}</div>',
                '</div>',
            '</div>',
            '<div class="l-col-4">',
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
                '<div class="some_link">',
                    '<a title="创业团" target="_blank" href="/topic/intiate/index.html">创业团</a>',
                    '<a title="给剧中人留言" href="/bless" lofox="true">留言</a>',
                '</div>',
            '</div>',
        '</div>',
		'<div class="l-row">',
            '<div class="l-col-12">',
                
            '</div>',
        '</div>',
		'<div class="l-row">',
            '<div class="l-col-12">',
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
			setTimeout(function(){
                me.mySwiper = new Swiper(this_dom.find('.swiper-container')[0],{
                    pagination: this_dom.find('.swiper-pagination')[0],
                    loop:true,
                    grabCursor: true,
                    paginationClickable: true,
                    autoplay: 5000
                })
                this_dom.on('click','.arrow-left', function(e){
                    e.preventDefault()
                    me.mySwiper.swipePrev()
                }).on('click','.arrow-right', function(e){
                    e.preventDefault()
                    me.mySwiper.swipeNext()
                });
                console.log('me.mySwiper',me.mySwiper);
            },1000);
        });
	}
    view.prototype = {
        destory: function(){
            this.mySwiper && this.mySwiper.destroy();
        }
    };
    
	return view;
});