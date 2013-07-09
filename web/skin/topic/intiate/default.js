/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

var holy={};

//瀑布流
holy.wFall=function (){
	var box = $('#waterfall').children("dl");
	var boxer = [];//存放内容的数组
	var timer;
	var temp = [
		"<div class='tips'>",
			"本页面是剧中人朋友们的创业项目，目前大多为淘宝小店，希望每一颗渴望成功的种子都能生根发芽。如有任何意见及建议，请联系小剧！！！",
		"</div>",
			"<div class='col' id='colA'></div>",
			"<div class='col' id='colB'></div>",
			"<div class='col' id='colC'></div>",
			"<div class='col' id='colD'>",
		"</div>",
		"<div id='addMore'>显示更多</div>"
	];
	var total = box.length;
	var dlNo=0;//页面中已经生成的dl数量
	var i=0;//源dl的索引值
	$.each(box,function(){boxer.push($(this).html());});//获取源内容，生成数组
	$('#waterfall').html(temp.join(''));//生成新的框架结构
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

$(document).ready(function(){

	if($('#waterfall').length>0){holy.wFall();}

});