define(function(require,exports){
	require('/frontEnd/gallery/style.css');
	var base_tpl = ['<div class="galleryPanel">',
		'<div class="gP_tab">',
			'<a href="javascript:void(0)" data-type="select">选择</a>',
			'<a href="javascript:void(0)" data-type="upload">上传</a>',
			'<a href="javascript:void(0)" data-type="maker">拼图</a>',
		'</div>',
		'<div class="gP_cnt"></div>',
	'</div>'].join('');
	var loading_tpl = '<div class="gp_loading">正在加载</div>';

	function show_module (dom,cpt_dom,name){
		if(name == 'upload'){
			UPLOAD(dom);
		}else if(name == 'maker'){
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
		dom.html(loading_tpl);
	}
	function UPLOAD(){
		
	}
	function MAKER(){
		
	}
	exports.init = INIT;
	exports.select = SELECT;
	exports.upload = UPLOAD;
});
