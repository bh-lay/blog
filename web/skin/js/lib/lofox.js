/**
 * @author 作者:剧中人
 * @blog http://bh-lay.com/
 *  
 * lofox mean : location fox
 */
var lofox = function(dom,callback){
	return new lofox.init(dom,callback);
};

(function(exports){
	function parse_url(url){
		var pathname = url || window.location.pathname;
			pathname = pathname.replace(/^\/|\/$/g,'');
		var path_node = pathname.split(/\//);
		path_node[0] = '/' + path_node[0];
		return path_node;
	}
	var page_title = $('title');
	function render_over(){
		var that = this;
		if(this.title){
			page_title.html(this.title);
		}
		var end_time = new Date().getTime(),
			min_time = 400,
			delay_time = 0;
		
		if(end_time - this.start_time < min_time){
			delay_time = min_time - (end_time - this.start_time);
		}
		setTimeout(function(){
			that.loading.close();
			that.dom&&that.dom.fadeIn(300);
		},delay_time);
	}
	function render(url){
		console.log('render :','this page is [' + path + ']');
		var loading = L.dialog.loading();
		this.dom.hide();
		var path = parse_url(url);
		var data = this.router[path[0]] || null;
		var that = this;
		if(data){
			data['title']&&page_title.html(data['title']);
			var start_time = new Date().getTime();
			this.render_code++;
			this.callback&&this.callback();
			data['renderFn']&&data['renderFn'].call({
				'path' : path,
				'dom' :that.dom,
				'render_over' : function(title){
					render_over.call({
						'start_time' : start_time,
						'title' : title,
						'loading' : loading,
						'dom' : that.dom
					});
				}
			},{
				'init' : true
			});
		}
	}
	var HTML5 = function(){
		console.log('lofox:','support history API !');
		var that = this;
		window.addEventListener('popstate',function(e){
			var state = e.state || {};
			//Avoid multiple rendering
			if(state.url){
				render.call(that,state.url);
			}
			return false;
		});
		
		exports.push = function(url,param){
			var param = param || {},
				need_render = (typeof(param['render']) =="boolean")?param['render']:true;
			if(url == window.location.pathname){
				console.log('lofox:','needn\'t not push this state!');
				return
			}
			window.history.pushState({
				url: url
			},'test',url);
			
			need_render&&render.call(that,url);
		}
	};	

	var INIT = function(dom,callback){
		console.log('lofox:','i\'m start !');
		this.router = {};
		this.callback = callback;
		this.support = true;
		this.dom = dom;
		this.render_count = 1;
		if(window.history&&window.history.pushState){
			HTML5.call(this);
		}else{
			this.support = false;
		}
	};
	INIT.prototype = {
		'set' : function(root,name,callback){
			var root = arguments[0];
			var name = typeof(arguments[1]) == 'string' ? arguments[1] :null;
			var callback = typeof(arguments[arguments['length'] - 1]) == 'function' ?arguments[arguments['length'] - 1] :null;
			this.router[root] = {
				'title' : name,
				'renderFn' : callback
			};
		},
		'start' : function(){
			var path = parse_url();
			var data = this.router[path[0]] || null;
			if(data){
				data['renderFn']&&data['renderFn'].call({
					'path' : path,
					'dom' :this.dom
				},{
					'init' : false
				});
			}
		}
	};
	exports.init = INIT;
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