/**
 * @author 剧中人
 * @github https://github.com/bh-lay/panel
 * @modified 2014-4-16 21:35
 * panel
 * the right key of mouse
 *
 *
 *  DEMO
 * //创建一个右键绑定
 * 	var o = panel({
 * 		targets :'.testButton',
 * 		list : {
 * 			'open' : {'txt' : '打开'},
 * 			'rename' : {'txt' : '重命名','display' : 'disable'},
 * 			'delete' : {'txt' : '删除'}
 * 		},
 * 		callbefore:function(){
 * 			//右键之后菜单弹出之前，可以在这里做些事情
 * 		},
 * 		callback:function(name) {
 * 			console.log('you have chioce "' , name , '" from the [ ' , this , ']');
 * 		}
 * 	});
 * //指定类型
 * 	o.type = 'menu';//@param:'menu','dock'
 * //选项置灰
 * 	o.display('rename','disable');
 * //选项恢复
 * 	o.display('delete','hide');
 * //增删菜单条目
 * 	o.add('test',{'txt':'测试'},function(){
 * 		alert(12)
 * 	});
 * 	o.remove('copy');
 */

(function(global,doc,factory){

	if(global.define){
		//提供CommonJS规范的接口
		define(function(){
      		//对外接口
      		return factory(global,doc);
  		});
  	}else{
		global.util = global.util || {};
		global.util.panel = global.util.panel || factory(global,doc);
  	}
})(window,document,function(window,document){
	////////////////////////////////////////////
	var console = window.console || {'log':function(){}};
	
	var private_win = $(window),
		 private_winW,
		 private_winH,
		 private_scrollTop,
		 private_scrollLeft,
		 private_active_panel = null,
		 private_body = $('html,body');

	var menu_tpl = ['<div class="panel_menu panel_mark"><ul class="pa_me_list">{-content-}</ul></div>'];
	var dock_tpl = ['<div class="panel_dock panel_mark"><div class="pa_do_body">{-content-}</div></div>'];
	var style_tpl = ['<style type="text/css">',
		'.panel_menu{position: absolute;z-index :10000;width:140px;background:#fff;border:1px solid #bbb;border-radius:4px;}',
		'.pa_me_list{padding:5px 0px;margin:0px;}',
		'.pa_me_list span,',
		'.pa_me_list a{line-height:24px;display:block;font-size:12px;text-indent:2em;padding: 2px 5px;text-decoration:none;}',
		'.pa_me_list span{cursor: default;color:#aaa;}',
		'.pa_me_list a{color:#444;}',
		'.pa_me_list a:hover{color:#000;background:#eee;}',
		'.panel_dock{position: absolute;z-index :10000;background:#444;border-radius:4px;box-shadow:1px 1px 40px #000;_border:1px solid #666;}',
		'.pa_do_body{padding:0px 10px;}',
		'.panel_dock span,',
		'.panel_dock a{line-height:32px;display:inline-block;font-size:12px;color:#888;padding: 0px 10px;}',
		'.panel_dock span{cursor: default;}',
		'.panel_dock a{color:#f4f4f4;}',
		'.panel_dock a:hover{color:#222;background:#eee;}',
	'</style>'];
	
	function reCountSize(){
		private_winW = private_win.width();
		private_winH = private_win.height();
		private_scrollTop = private_win.scrollTop();
		private_scrollLeft = private_win.scrollLeft();
	}
	function change_dispaly(name, check) {
		if(typeof (this['list'][name]) == "object") {
			this['list'][name]['display'] = check;
		}
	}
	// Unified to remove panel dom
	function remove_panel(){
		if(private_active_panel){
			private_active_panel.fadeOut(100,function(){
				$(this).remove();
			});
			private_active_panel = null;
		}
	}
	//重算浏览器尺寸
	reCountSize();
	setTimeout(reCountSize,1000);
	$(function(){
		$('head').append(style_tpl.join(''));
		//try to close panel
		var bingo_panel = false;
		$('body').on('mousedown', '.panel_mark', function() {
			bingo_panel = true;
		}).on('mousedown', function() {
			setTimeout(function() {
				if (!bingo_panel) {
					remove_panel()
				}
				bingo_panel = false;
			},20);
		}).on('contextmenu','.panel_mark', function() {
			return false;
		});
		
		//window resize 
		var delay;
		$(window).on('resize scroll',function(){
			clearTimeout(delay);
			delay = setTimeout(function(){
				reCountSize();
				remove_panel();
			},100);
		});
	});
	//////////////////////////////////
	function show_panel(left, top, type, param, this_dom, callback) {
		
		var panel_tpl = '';
		switch(type){
			case 'menu':
				panel_tpl = menu_tpl.join('');
			break
			case 'dock':
				panel_tpl = dock_tpl.join('');
			break
			default :
				console.log('error');
				return;
		}
		
		var list_html = '';
		for (var i = 0 in param) {
			param[i]['display'] = param[i]['display'] || 'show';
			switch(param[i]['display']){
				case 'show':
					if (param[i]['callback']) {
						list_html += '<a data-callback="true" data-name="' + (i || '') + '" href="javascript:;">' + (param[i]['txt'] || '') + '</a>';
					}else{
						list_html += '<a data-name="' + (i || '') + '" href="javascript:;">' + (param[i]['txt'] || '') + '</a>';
					}
				break
				//case 'hide':
				//break
				case 'disable':
					list_html += '<span data-name="' + (i || '') + '" href="javascript:;">' + (param[i]['txt'] || '') + '</span>';
				break
			}
		}
		panel_tpl = panel_tpl.replace(/{-content-}/, list_html);
		
		
		var panel_dom = $(panel_tpl);
		panel_dom.on('click', 'a', function() {
			remove_panel()
			var this_name = $(this).attr('data-name') || '';

			if ($(this).attr('data-callback')) {
				var this_name = $(this).attr('data-name');
				if (param[this_name]['callback']) {
					param[this_name]['callback'].call(this_dom, this_name);
				}
			} else {
				callback.call(this_dom, this_name);
			}
		});
		
		//append panel dom and mark the dom mark
      remove_panel();
		$('body').append(panel_dom);
		private_active_panel = panel_dom;
		
		// setting panel dom position
		var panel_h = panel_dom.outerHeight(),
			 panel_w = panel_dom.outerWidth();
		
		if(panel_h + top > private_winH + private_scrollTop){
			top = private_scrollTop + private_winH - panel_h;
		}
		if(panel_w + left > private_winW + private_scrollLeft){
			left = private_scrollLeft + private_winW - panel_w
		}
		panel_dom.css({
			'top' : top,
			'left' : left
		});
	}

    ///////////////////////////////////////////

    function filter_clone(args) {
        var obj = {};
        for (var i = 0 in args) {
            obj[i] = {};
            obj[i]['txt'] = args[i]['txt'];
            if(args[i]['display']&&args[i]['display'].match(/^(show|hide|disable)$/)){
            	obj[i]['display'] = args[i]['display']
            }else{
            	obj[i]['display'] = 'show';
            }
            obj[i]['callback'] = args[i]['callback'] || null;
        }
        return obj;
    }

    // exports start /////////////////////////////////////////
	function construction(doms_path,type,args,callback,callbefore) {
		var this_panel = this;
		this.type = type;
		this.list = filter_clone(args);
		if(!doms_path){
			return
		}
		$('body').on('mousedown',doms_path, function(e) {
			var this_dom = this;
			remove_panel()
			if(e.target.tagName.match(/INPUT|TEXTAREA/i)){
				return
			}
			//console.log(e,e.cancelBubble,e.preventDefault,e.stopPropagation)			
			if (e.button == 2) {
				e.bubbles=false
				e.cancelBubble=true;
				e.preventDefault&&e.preventDefault();
				e.stopPropagation&&e.stopPropagation();
				//if(e.button > 0){
				var x = e.pageX,
					 y = e.pageY;
				callbefore&&callbefore.call(this_dom);
				setTimeout(function() {
					show_panel(x, y, this_panel.type, this_panel.list, this_dom, callback);
				},40);
			}
			//return false
		}).on('contextmenu',doms_path, function(e) {
		//	return false;
			if(!e.target.tagName.match(/INPUT|TEXTAREA/i)){
         	return false
         }
		});
	};
	construction.prototype = {
		'display' : function(name, check) {
		
			var that = this;
			if(!(check&&check.match(/^(show|hide|disable)$/))){
				//check error
				return
			}
			
			if(Object.prototype.toString.call(name) == "[object Array]"){
				for(var i = 0,total = name.length ; i<total ; i++){
					change_dispaly.call(this,name[i],check);
				}
			}else if(typeof(name) == "string"){
				change_dispaly.call(this,name,check);
			}else{
				return
			}
		},
		'add' : function(name, arg, callback) {
			if(!arg['display'] || !arg['display'].match(/^(show|hide|disable)$/)){
				arg['display'] = null;
         }
			this['list'][name] = this['list'][name] || {};
			var li = this['list'][name];
			li['txt'] = arg['txt'] || li['txt'];
			li['display'] = arg['display'] || li['display'];
			li['callback'] = callback || li['callback'];
		},
		'remove' : function(name) {
			if ( typeof (this['list'][name]) == "object") {
				delete this['list'][name];
			}
		}
	};
	return function(param) {
		var param = param || {};
		var doms_path = param['targets'] || null,
			 type = param['type'] || 'menu',
			 args = param['list'] || {},
			 callback = param['callback'] || null,
			 callbefore = param['callbefore'] || null;
		return new construction(doms_path,type,args,callback,callbefore);
	};
});
