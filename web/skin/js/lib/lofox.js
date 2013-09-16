/**
 * @author 作者:剧中人
 * @blog http://bh-lay.com/
 *  
 * lofox mean : location fox
 */
var lofox = function(callback){
	return lofox.start(callback);
};

(function(exports){
	var HTML5 = function(callback){
		console.log('lofox:','support history API !');
		
		window.addEventListener('popstate',function(e){

			var state = e.state || {};
			//Avoid multiple rendering
			if(state.url){
				callback(state.url);
			}
			return false;
		});
		exports.push = function(url,param){
			var param = param || {};
				 render = (typeof(param['render']) =="boolean")?param['render']:true;
			if(url == window.location.pathname){
				console.log('lofox:','needn\'t not push this state!');
				return
			}
			window.history.pushState({
				url: url
			},'test',url);
			
			render&&callback(url);
		}
	};	
	var HASH = function(callback){
		console.log('lofox:','using hash url !');
		
		var hash = window.location.hash || '#',
			 need_render = true;
		
		setInterval(function(){
			var new_hash = window.location.hash || '#';
			if((new_hash != hash)&&need_render){
				hash = new_hash;
				var url = hash.replace(/^#/,'');
				callback(url);
			}
		},60);
		
		exports.push = function(url,param){
			var param = param || {};
			need_render = (typeof(param['render']) =="boolean")?param['render']:true;

			window.location.hash = url;
		}
	}
	
	exports.start = function(callback){
		var support = false;
		console.log('lofox:','i\'m start !');
		if(window.history&&window.history.pushState){
			HTML5(callback);
			support = false;
		//}else{
		//	HASH(callback);
		}
		return support;
	};
})(lofox);

//demo
/*
$(function(){
	lofox.start(function(url){
		$('.pageCnt').load(url+' .pageInner');
	});
	$('a').on('click',function(){
		var url = $(this).attr('href');
		lofox.push(url);
		return false
	});
});
*/