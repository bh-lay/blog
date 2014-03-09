define(function(require,exports){
	require('/frontEnd/gallery/style.css');
	var select = require('/frontEnd/gallery/select.js');
	
	var base_tpl = ['<div class="galleryPanel">',
		'<div class="gP_tab">',
			'<a href="javascript:void(0)" data-type="select">选择</a>',
			'<a href="javascript:void(0)" data-type="maker">拼图</a>',
		'</div>',
		'<div class="gP_cnt"></div>',
	'</div>'].join('');

	function show_module (dom,cpt_dom,name){
		if(name == 'maker'){
			MAKER(dom);
		}else{
			//默认为选择已上传
			name = "select";
			SELECT(dom);
		}
		cpt_dom.find('a').removeClass('active');
		cpt_dom.find('a[data-type="' + name + '"]').addClass('active');
	
	}
	
	function INIT(dom,param){
		dom.html(base_tpl);
		
		var cpt_dom = dom.find('.gP_tab');
		var cnt_dom = dom.find('.gP_cnt');
		
		var param = param || {};
		var active = param.active || 'article';
		show_module(cnt_dom,cpt_dom,active);
		cpt_dom.on('click','a',function(){
			var name = $(this).attr('data-type');
			show_module(cnt_dom,cpt_dom,name);
		});
		
	}
	function SELECT(dom){
		select(dom);
	}
	function MAKER(dom){
		dom.html('<div class="gp_loading">待开发</div>');
	}
	exports.init = INIT;
	exports.select = SELECT;
});
