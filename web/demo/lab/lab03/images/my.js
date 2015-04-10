/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

//主导航
function nav(){
	$('#nav>li').prepend("<div class='hoverbj'></div>");
	$('#nav>li>a').mouseover(function(){
		$(this).animate({textIndent:'10px'}).prev().fadeIn('30');
		$(this).next().delay('100').slideDown('60');
	}).parent().mouseleave(function(){
		$(this).find("a").animate({textIndent:'0px'}).prev().fadeOut('50');
		$(this).find('ul').delay('80').slideUp('80');
	});
}
//人物特效
function links_show(){
	var i=0;
	$('#links>li').mouseover(function(){
		i=$(this).index('#links>li');
		$(this).css({background:"rgba(255,255,255,.5)",boxShadow:"0px 0px 20px #aef"});
		$('#links_show>li').eq(i).find('img').animate({bottom:'0px'},'40');
	}).mouseout(function(){
		$(this).css({background:"transparent",boxShadow:"none"});
		$('#links_show>li>img').animate({bottom:'-200px'},'80');
	});
}

$(document).ready(function(){
	nav();
	links_show();


});
