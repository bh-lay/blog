/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

var holy={};

//自动隐藏输入框插件
$.fn.autoKey=function(){
	var searchBox = $(this);
	var title=searchBox.val(); 
	searchBox.click(function(){if(searchBox.val()==title){searchBox.val("");}}).blur(function(){if(searchBox.val()==""){searchBox.val(title);}}); 
	return searchBox;
}
//动态显示标题插件
$.fn.showTitle=function(){
	var imgList = $(this);
	var total=imgList.length;
	var boxH;
	$.each(imgList,function(){$(this).after('<span>'+$(this).attr('alt')+'</span>');});
	imgList.parent().mouseenter(function(){
		$(this).find('span').stop().animate({bottom:'0'},300);
	}).mouseleave(function(){
		boxH=$(this).find('span').outerHeight();
		$(this).find('span').stop().animate({bottom:-boxH},600);
	});
	return imgList;
}
//可关闭插件
$.fn.shutDown=function(){
	$(this).prepend('<div class="close">X</div>');
	$(".close").click(function(){$(this).parent().slideUp('slow');});
	return this;
}

//搜索表单验证
holy.checkForm=function (){
	$("#searchform").submit(function(){
		if($('#searchform .inputText').val()==""||$('#searchform .inputText').val()=="搜索站内内容"){return false;}
	});
}
//自动换肤
function diySkin(){
	var Rand = Math.floor(Math.random()*4);
	switch(Rand){
		case 0:$('body').addClass('skin_a');
		break
		case 1:$('body').addClass('skin_b');
		break
		case 2:$('body').addClass('skin_c');
		break
		case 3:$('body').addClass('skin_d');
		break
		default:$('body').addClass('skin_a');
	}
}
//图像浏览器插件
$.fn.gallery=function (){
	if($('.lay_show').length==0){$('body').append("<div class='lay_show'><div class='lay_exist'>X</div><div class='lay_img'><img alt='' src='' /><div class='lay_title'></div><div class='lay_over'>已经到达列表终点，点击继续浏览</div></div><a class='lay_prev'>《</a><a class='lay_next'>》</a></div>");}
	var imgList = $(this);
	var bigPic = $('.lay_show>.lay_img>img');
	var total=imgList.length;
	var i, width, height, marginT, src, alt,timer;
	imgList.css({cursor:'pointer'});
	$(".lay_exist").click(function(){$(this).parent().fadeOut('slow');});
	if(total==1){$('.lay_next, .lay_prev').hide();}
	function change(src,alt){//切换大图函数
		$('.lay_title').html((i+1)+'/'+total+'　'+alt);
		bigPic.fadeOut('300');
		clearTimeout(timer);
		timer=setTimeout(function(){
			bigPic.attr('src',src);
			setTimeout(function(){
				width = bigPic.width();
				height = bigPic.height();
				marginT = ($(window).height()-$('.lay_show img').height())/2+$(document).scrollTop();
				if (marginT<0){marginT=0;}
				$('.lay_show .lay_img').stop().animate({'width': width,'height': height,'marginTop':marginT},300);
				setTimeout(function(){bigPic.stop().fadeIn('300');},400);
			},10);
		},800);
	}
	imgList.click(function(){
		src = $(this).attr('src');
		alt = $(this).attr('alt');
		i = imgList.index(this);
		$('.lay_show').fadeIn('800').css({height:$(document).height()+400});
		change(src,alt);
	});
	function over(){$('.lay_over').slideDown(200).delay(800).fadeOut(800);}
	//前一张
	function prev(){
		if (i>0){
			src = imgList.eq(--i).attr('src');
			alt = imgList.eq(i).attr('alt');
			change(src,alt);
		}else{over();i=total;}
	}
	//下一张
	function next(){
		if (i<total-1){
			src = imgList.eq(++i).attr('src');
			alt = imgList.eq(i).attr('alt');
			change(src,alt);
		}else{over(); i=-1;}
	}
	//左右键翻页
	$(window).keydown(function(event){
		if($('.lay_show').css('display')=='block'){
			switch(event.keyCode) {
				case 37:prev();
				break
				case 39:next();
				break
				case 27:$('.lay_show').fadeOut('slow');
				break
			}
		}
	});
	$('.lay_next').click(function(){next();});
	$('.lay_prev').click(function(){prev();});
	$('.lay_next, .lay_prev').mouseover(function(){$(this).stop().animate({width:'60'},500)}).mouseout(function(){$(this).stop().animate({width:'40'},500)});
	return imgList;
}



//标题显示内部隐藏的p标签
function showDetail(box){
	$(box).mouseenter(function(){
		$(this).find('p').stop().fadeTo('600',1);
	}).mouseleave(function(){
		$(this).find('p').stop().fadeTo('600',0);
	});
}

//添加滚动到对象位置按钮函数
holy.flyTo=function(obj,title,classN){//参数分别是：要滚动到的对象，生成按钮名字，生成按钮的class
	var obj = $(obj);
	$('#toolbar').append("<div class='ico "+classN+"'title='"+title+"'>"+title+"</div>");  
	$('.reply').click(function(){
		var top=obj.offset().top-150;
		$('html,body').animate({scrollTop:top},800);
	});
}
//手风琴效果
holy.accordion=function(){
	var pic = $('#lay_accordion li');
	var i=0;//li的索引值
	var timer;
	var maxW=500;//最大宽度
	var minW=(pic.parent().parent().width()-maxW)/4;//最小宽度
	var midW=pic.parent().parent().width()/5;//正常宽度
	$.each(pic,function(){$(this).prepend('<b></b>');});
	pic.mouseenter(function(){
		clearTimeout(timer);
		i=pic.index(this);
		timer = setTimeout(function(){
			pic.not(pic.eq(i)).stop().animate({width:minW},'100');
			pic.eq(i).stop().animate({width:maxW},'100');
		},200);
	}).parent().mouseleave(function(){
		clearTimeout(timer);
		timer = setTimeout(function(){
			pic.stop().animate({width:midW},'slow');
		},500);
	});
}
//工具栏
holy.toolBar=function(){
	$('body').append('<div id="toolbar"><div class="backtop ico" title="飞到顶部去">返回顶部</div></div>');
	$('.backtop').click(function(){$('html,body').stop().animate({scrollTop: '0px'}, 800);});
	$(window).scroll(function(){
		if($(window).scrollTop()<=100) {
			$(".backtop").css({visibility:"hidden"});
		}else{
			$(".backtop").css({visibility:"visible"});
		}
	});
}
//阅读模式与版权链接函数
holy.readMode=function (article,show,hide){
	$('#toolbar').append('<div class="read ico" title="阅读模式很帅气">阅读模式</div><div class="exitread ico" title="回到正常模式吧">页面模式</div>');
	var article =$(article);
	var show =$(show);
	var hide =$(hide);
	var url = window.location.href;
	var reader =$('.read');
	var exitread =$('.exitread');
	reader.click(function(){
		article.animate({fontSize: '24px'},'slow');
		hide.css('display','none');
		show.animate({width:'100%'},'slow');
		reader.slideUp('slow');
		exitread.slideDown('slow');
	});
	exitread.click(function(){
		article.animate({fontSize: '14px'},'1000');
		setTimeout(function (){hide.fadeIn('500');},1000);
		show.animate({width:'650px'},'1000');
		exitread.slideUp('slow');
		reader.slideDown('slow');
	});
	article.find('h3').append("<a class='hide' href='"+url+"' title='小剧客栈'>查看原文</a>");
	article.find('p').eq(3).append("<a class='hide' href='"+url+"' title='小剧客栈'>小剧客栈</a>");
}
//tab效果
holy.tab=function(tabName){//最外容器的ID
	var btn=$(tabName).find('.caption').find('li');
	var showBox=$(tabName).find('.list').find('ul');
	var boxH=showBox.height();
	var i=0;
	btn.eq(i).addClass('on');
	btn.click(function(){
		btn.eq(i).removeClass('on');
		i=btn.index(this);
		btn.eq(i).addClass('on');
		showBox.eq(0).stop().animate({marginTop:-i*boxH},'500');
	});
}
//瀑布流
holy.wFall=function (){
	var box = $('#waterfall').children("dl");
	var boxer = [];//存放内容的数组
	var timer;
	var total = box.length;
	var dlNo=0;//页面中已经生成的dl数量
	var i=0;//源dl的索引值
	$.each(box,function(){boxer.push($(this).html());});//获取源内容，生成数组
	$('#waterfall').html("<div style='padding:0px 10px;' class='box'><p>本页面的瀑布流效果是剧中人使用jquery框架实现，内容暂时不完整，待文案整理完毕之后会放上剧中人朋友们的个人或团队创业项目，敬请关注更新！！！</p></div><div class='col' id='colA'></div><div class='col' id='colB'></div><div class='col' id='colC'></div><div class='col' id='colD'></div><div id='addMore'>显示更多</div>");//生成新的框架结构
	var colA=$('#colA');
	var colB=$('#colB');
	var colC=$('#colC');
	var colD=$('#colD');
	var hA,hB,hC,hD;//四栏的高度
	function show(showdlNo){//添加新内容，参数为添加的数量
		for(var n=0;n<showdlNo;n++){
			hA = colA.height();
			hB = colB.height();
			hC = colC.height();
			hD = colD.height();
			if(i==total){i=0}
			if(hA<=hB&&hA<=hC&&hA<=hD){colA.append("<dl id='wf"+dlNo+"'>"+boxer[i++]+"</dl>");
			}else if(hB<=hC&&hB<=hD){colB.append("<dl id='wf"+dlNo+"'>"+boxer[i++]+"</dl>");
			}else if(hC<=hD){colC.append("<dl id='wf"+dlNo+"'>"+boxer[i++]+"</dl>");
			}else{colD.append("<dl id='wf"+dlNo+"'>"+boxer[i++]+"</dl>");}
			$('#wf'+dlNo++).fadeIn('300');
		}
	}
	show(8);//页面初始显示八个dl
	$(window).scroll(function(){
		if(dlNo<40){//设置页面中的滚动可显示dl的数量
			clearTimeout(timer);
			timer = setTimeout(function(){
				if($(document).scrollTop()+$(window).height()>$(document).height()-300){show(4);}
			},500);
		}else{$('#addMore').fadeIn('200');}
	});
	$('#addMore').click(function(){show(8)});
}
//小剧还是屈服在了ie6的淫威之下
holy.fixie6=function (){
	$('head').append("<script src='/skin/holy/iepng.js' type='text/javascript'></script><style>#killie6{height:140px;padding:40px 200px 0px;background:#fff;font-size:16px;border-bottom:5px solid #444;color:#222}#killie6 h1{text-align:center;font-size:20px;border-bottom:1px dashed #ddd;}#killie6 a{text-decoration:underline;padding-right:1em;color:#800;}#toolbar{position:'absolute'}#killie6 a:hover{color:red}.skin_a,.skin_b,.skin_c,body{background-position:center 180px;}</style>");
	$('body').prepend("<div id='killie6'><h1>老大，麻烦您更新下浏览器吧！</h1><p>矮油，就说你的，这么老的浏览器您怎么还在用啊，太out啦！提示下哈，博客中的部分特效您有可能无法正常查看哦！推荐您使用<a href='http://chrome.360.cn/'>360极速浏览器</a>或　<a href='http://www.google.com/chrome/?hl=zh-CN'>谷歌浏览器</a>，尝试体验更酷炫的页面效果吧！<a href='http://bh-lay.com/about/2012-07-30/42.html'>为什么不支持我的浏览器？</a></p></div>");
	EvPNG.fix('div,a,span');
	$(window).scroll(function(){$('#toolbar').css({top:$(document).scrollTop()+$(window).height()/2});});
}
//切换域名 
holy.fixurl=function (){
	var hostname=window.location.hostname;
	if(hostname!="bh-lay.com"){window.location.hostname="bh-lay.com"}
}
//个人信息
function medetail(){
	$('#aboutme .weibo').css({display:'block',height:'0',paddingTop:'0'});
	$('#aboutme').mouseenter(function(){
		$('#aboutme .weibo').stop().animate({height:'35',paddingTop:'10'},'200');
	}).mouseleave(function(){
		$('#aboutme .weibo').stop().animate({height:'0',paddingTop:'0'},300);
	});
}

//客户服务页面
function serviceList(){
	$('#serviceList div a').css({display:'block'}).mouseover(function(){
		$(this).prev().stop().fadeTo('300',1);
	}).mouseout(function(){
		$(this).prev().stop().fadeTo('300',0);
	});
}


$(document).ready(function(){
//修正域名 ie6、7
	//holy.fixurl();
	if($.browser.msie){if($.browser.version=="6.0"||$.browser.version=="7.0"){holy.fixie6();}}
//工具栏
	if($('#toolbar').length==0){holy.toolBar();}
	if($('#uyan_frame').length>0){holy.flyTo('#uyan_frame','给说个话呗','reply');}
	if($(".article").length>0){holy.readMode('.article','.main','.sidebar');}
	
//使用插件、函数
	if($('.article img').length>0){$('.article img').gallery();}
	if($('.photo img').length>0){$('.photo img').gallery();}

	if($('#keyboard').length>0){
		$('#keyboard').autoKey();
		holy.checkForm();
	}
	
	if($("#tabOne").length>0){holy.tab('#tabOne');}
	if($("#tabTwo").length>0){holy.tab('#tabTwo');}
	
	if($('.picText').length>0){showDetail('.picText div');}

	if($('#lay_accordion').length>0){holy.accordion();}
	if($('.grid').length>0){$('.grid img').showTitle();}
	
	if($('#focusTitle').length>0){diySkin();}
	if($('#aboutme').length>0){medetail();}
	if($('#serviceList').length>0){serviceList();}
	
	if($('#waterfall').length>0){holy.wFall();}
	if($('.codeArea').length>0){$('head').append("<script src='/skin/holy/codeArea.js' type='text/javascript'></script>");}
	if($(".shutdown").length>0){$('.shutdown').shutDown();}
});