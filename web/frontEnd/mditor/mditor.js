/**
 * 
 */

window.mditor = window.mditor || {};

(function(exports){
	var editor_tpl = ['<div class="mditor">',
		'<div class="mditor_input"><textarea>{content}</textarea></div>',
		'<div class="mditor_view md_html"></div>',
	'</div>'].join('');
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = 'http://127.0.0.1:3000/frontEnd/mditor/mditor.css';
	document.getElementsByTagName('head')[0].appendChild(link);
	
	var link2 = document.createElement('link');
	link2.type = 'text/css';
	link2.rel = 'stylesheet';
	link2.href = 'http://127.0.0.1:3000/frontEnd/lib/showdown/style-0.6.4.min.css';
//	link2.href = 'http://dillinger.io/css/style-0.6.4.min.css';
	document.getElementsByTagName('head')[0].appendChild(link2);
	
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = '/frontEnd/lib/showdown/showdown.js';
	document.getElementsByTagName('head')[0].appendChild(script);
	
	
	function EDITOR(param){
		var this_editor = this;
		var param = param || {};
		var content = param['content'] || '';
		var new_tpl = editor_tpl.replace('{content}',content);
		$('body').append(new_tpl);
		
		this._textarea = $('.mditor_input textarea');
		var inputDelay;
		this._textarea.on('keydown keyup',function(){
			clearTimeout(inputDelay);
			inputDelay = setTimeout(function(){
				var html = this_editor.getHtml();
				$('.mditor_view').html(html);
			},200);
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
		}
	};
	
	exports.create = function(){
		return new EDITOR();
	}
	exports.bind = function(dom){
		dom.on('click',function(){
			var area = $(this);
			new EDITOR({
				'content' : area.val()
			});
		});
	}
})(window.mditor);