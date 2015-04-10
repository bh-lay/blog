/**
 * @author 作者:剧中人
 * @blog http://bh-lay.com/
 *  
 * lofox mean : location fox
 */

$(function(){
	var cur = -1;
	function change(index){
		
		$('.navigation a').removeClass('cur').eq(index).addClass('cur');
		$('.pageCnt').eq(cur).animate({'left':"-80%"},200,function(){
			$('.pageCnt').eq(cur).css({'left':0}).hide();
			$('.pageCnt').eq(index).fadeIn(100);
			cur = index;
		})
	}
	
	$('.navigation a').on('click',function(){
		var index = $(this).index();
		change(index);
	});
	
	$('.pageCnt').hide()
	change(0);
});
