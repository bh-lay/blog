/**
 * opus detail
 *  
 */
seajs.use('/frontEnd/util/tie.js',function(){
	util.tie({
		'dom' : $('.labs_detail_bar_body'),
		'scopeDom' : $('.labs_detail_cnt'),
		'fixed_top' : 30
	});
	$.getScript('/frontEnd/lib/juicer.js',function(){
		$.getScript('/frontEnd/lib/github/reposWidge.js');
	});

	//下载部分
	var btn = $('.labs_detail_download_link a');
	btn.eq(0).addClass('active');

	btn.mouseover(function(){//点击圆点按钮效果
		var index = $(this).index();
		$('.labs_detail_download_linkTxt ul:first').stop().animate({
			'marginLeft' : '-' + index + '00%'
		},200);
		btn.removeClass('active');
		btn.eq(index).addClass('active');
	});
});