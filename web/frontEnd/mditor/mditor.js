/**
 * 
 */

window.mditor = window.mditor || {};

(function(exports){
	var miniBar_tpl = ['<div class="mditor_miniBar">',
		'<a style="float: right;" href="javascript:void(0)" title="全屏"><i class="icon-fullscreen"></i></a>',
	'</div>'].join('');
	var editor_tpl = ['<div class="mditor">',
		'<div class="mditor_toolBar">',
			'<div class="mditor_tool_side">',
					'<a href="javascript:void(0)" title="预览"><i class="icon-view"></i></a>',
					'<a href="javascript:void(0)" title="退出全屏" data-btn="exist_fullscreen"><i class="icon-exist_fullscreen"></i></a>',
			'</div>',
			'<div class="mditor_tool_main">',
					'<a href="javascript:void(0)" title="加粗" data-btn="bold"><i class="icon-bold"></i></a>',
					'<a href="javascript:void(0)" title="斜体" data-btn="italic" ><i class="icon-italic"></i></a>',
					'<a href="javascript:void(0)" title="链接"><i class="icon-link"></i></a>',
					'<a href="javascript:void(0)" title="图片"><i class="icon-image"></i></a>',
					'<a href="javascript:void(0)" title="代码"><i class="icon-code"></i></a>',
					'<a href="javascript:void(0)" title="撤销"><i class="icon-undo"></i></a>',
					'<a href="javascript:void(0)" title="重做"><i class="icon-redo"></i></a>',
			'</div>',
		'</div>',
		'<div class="mditor_main">',
			'<div class="mditor_input">',
				'<textarea>{content}</textarea>',
			'</div>',
			'<div class="mditor_view">',
				'<div class="mditor_viewer"><div class="md_html"></div></div>',
			'</div>',
		'</div>',
	'</div>'].join('');
	//激活状态的对象（最多同时存在一个）
	var private_active = null;
	
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = '/frontEnd/mditor/mditor.css';
	document.getElementsByTagName('head')[0].appendChild(link);
	
	var link2 = document.createElement('link');
	link2.type = 'text/css';
	link2.rel = 'stylesheet';
	link2.href = '/frontEnd/lib/showdown/style-0.6.4.min.css';
//	link2.href = 'http://dillinger.io/css/style-0.6.4.min.css';
	document.getElementsByTagName('head')[0].appendChild(link2);
	
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = '/frontEnd/lib/showdown/showdown.js';
	document.getElementsByTagName('head')[0].appendChild(script);

	var script2 = document.createElement('script');
	script2.type = 'text/javascript';
	script2.src = '/frontEnd/util/selection.js';
	document.getElementsByTagName('head')[0].appendChild(script2);
	
	function resize(){
		var parent_w = parseInt(this._textarea.parent().width());
		var parent_h = parseInt(this._textarea.parent().height());
		var padding_lr = parseInt(this._textarea.css('paddingLeft'))*2;
		var padding_tb = parseInt(this._textarea.css('paddingTop'))*2;
		this._textarea.css({
			'width' : parent_w - 10 - padding_lr,
			'height' : parent_h - padding_tb
		});
	}
	$(window).resize(function(){
		if(private_active){
			resize.call(private_active);
		}
	});
//	.on('keydown',function(e){
//		if(!private_active){
//			return
//		}
//		if(e.keyCode == 8){
//			return false
//		}
//	});
	function EDITOR(param){
		if(private_active){
			return
		}
		var this_editor = this;
		var param = param || {};
		var content;
		if(param['editFor']){
			this.edit_for = param['editFor'];
			content = this.edit_for.val();
		}else{
			content = param['content'] || '';
		}
		
		
		var new_tpl = editor_tpl.replace('{content}',content);
		
		this.dom = $(new_tpl);
		this._textarea = this.dom.find('textarea');
		this._view = this.dom.find('.md_html');
		this.closeFn = param['closeFn'] || null;
		//初始化
		$('body').append(this.dom);
		this.render();
		resize.call(this);
		private_active = this;
		var inputDelay;
		this._textarea.on('keydown keyup',function(){
			clearTimeout(inputDelay);
			inputDelay = setTimeout(function(){
				this_editor.render();
			},100);
		});
		this.dom.on('click','.mditor_toolBar a',function(){
			var btn = $(this).attr('data-btn');
			var txt = '';
			if(btn == 'bold'){
				txt = '**粗粗的文字**';
				this_editor._textarea.insertTxt(txt).focus(2,5);
			}else if(btn == 'italic'){
				txt = '*斜斜的文字*';
				this_editor._textarea.insertTxt(txt).focus(1,5);
			}else if(btn == 'exist_fullscreen'){
				this_editor.close();
			}
			this_editor.render();
		});
	}
	EDITOR.prototype = {
		'getContent' : function(){
			return this._textarea.val();
		},
		'getHtml' : function(){
			console.log('refresh')
			var text = this.getContent();
			var converter = new Showdown.converter();
		 	var html = converter.makeHtml(text);
		 	return html;
		},
		'render' : function(){
			var html = this.getHtml();
			this._view.html(html);
		},
		'close' : function(){
			private_active = null;
			this.closeFn && this.closeFn(this.getContent());
			this.dom.remove();
		}
	};
	
	exports.create = function(){
		return new EDITOR();
	}
	exports.bind = function(dom){
		dom.each(function(){
			var area = $(this);
			var toolbar = $(miniBar_tpl);
			area.before(toolbar);
			toolbar.on('click','a',function(){
				new EDITOR({
					'editFor' : area,
					'closeFn' : function(txt){
						area.val(txt);
					}
				});
			});
		});
	}
})(window.mditor);