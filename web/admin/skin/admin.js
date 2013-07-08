/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

function resize(){
	var navH = $('.topNav').height()+$('.secondNav').height();
	$('.mainFrame').height($(window).height()-navH);
	$(window).resize(function(){
		$('.mainFrame').height($(window).height()-navH);
	});
}

function nav(){
	var Btn = $('.nav li a');
	var navCnt = $('.secondNav .navItem');
	Btn.click(function(){
		var i = $(this).parent().index()
		Btn.removeClass('cur').eq(i).addClass('cur');
		navCnt.hide().eq(i).show();
	});
	navCnt.on('click','a',function(){
		navCnt.find('a').removeClass('cur');
		$(this).addClass('cur');
	});
}

$(function(){
	nav();
});