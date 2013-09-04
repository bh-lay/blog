/**
 * @author 作者:剧中人
 * @blog http://bh-lay.com/
 *  
 * lofox mean : location fox
 */
var lofox = function(callback){
	lofox.start(callback)
};

(function(exports){
	var HTML5 = function(callback){
		console.log('lofox:','support history API !');
		
		window.addEventListener('popstate',function(e){
			//console.log(e);
			var state = e.state || {};
			//console.log(state);
			if(state.url){
				callback(state.url);
			}
			return false;
		});
		exports.push = function(url){
			callback(url);
			window.history.pushState({
				url: url
			},'test',url);
		}
	};	
	var HASH = function(callback){
		console.log('lofox:','using hash url !');
		
		var hash = window.location.hash;
		setInterval(function(){
			var new_hash = window.location.hash||'#';
			if(new_hash != hash){
				hash = new_hash;
				var url = hash.replace(/^#/,'');
				callback(url);
			}
		},30);
		
		exports.push = function(url){
			window.location.hash = url;
		}
	}
	
	exports.start = function(callback){
		console.log('lofox:','i\'m start !');
		if(window.history&&window.history.pushState){
			HTML5(callback);
		}else{
			HASH(callback);
		}
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