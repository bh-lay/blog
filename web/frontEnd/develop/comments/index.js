

(function(global,doc,factory){
	global.L = global.L || {};
	global.L.comments = factory();
})(window,document,function(){
	var style = ['<style type="text/css">',
		'.l_comments{padding-top:50px;}',
		'.l_com_sendBox{margin-bottom:30px;}',
		'.l_com_item{height:80px;margin-bottom:10px;background:#fff;}',
		
		'.l_sendBox{position:relative;transition:0.5s;}',
		'.l_sendBox_main{position:relative;margin-left:100px;}',
		'.l_send_textarea{}',
		'.l_send_textarea textarea{display:block;box-sizing:border-box;width:100%;height:80px;padding:4px 10px;margin:0px;border:none;resize:none;font-family:inherit;line-height:1.5;font-size:16px;color:#ddd;transition:0.05s;}',
		'.l_send_textarea textarea:focus{outline:none;}',
		'.l_send_tools{height:0px;padding:0px;overflow:hidden;transition:0.2s;}',
		'.l_send_tools_right{float:right;}',
		'.l_send_submit{display:block;width:80px;height:30px;line-height:30px;text-align:center;color:#333;background:#fff;}',
		'.l_send_submit:hover{background:#eee;color:#333;}',
		
		'.l_sendBox_active{}',
		'.l_sendBox_active textarea{box-shadow:1px 1px 2px #000;color:#333;}',
		'.l_sendBox_active .l_send_tools{height:30px;padding-top:10px;}',
		
		'.l_sendBox_avatar{position:absolute;top:0px;left:0px;width:80px;height:80px;border-radius:40px;overflow:hidden;background:#333;}',
		'.l_send_login{display:block;text-align:center;line-height:80px;font-size:16px;color:#aaa;}',
		
	'</style>'].join('');
	var baseTpl = ['<div class="l_comments">',
		'<div class="l_com_sendBox"></div>',
		'<div class="l_com_list">',
			'<div class="l_com_item">',
			'</div>',
			'<div class="l_com_item">',
			'</div>',
		'</div>',
	'</div>'].join('');
	var sendBox_tpl = ['<div class="l_sendBox">',
		'<div class="l_sendBox_main">',
			'<div class="l_send_textarea"><textarea name="content"></textarea></div>',
			'<div class="l_send_tools">',
				'<div class="l_send_tools_right">',
					'<a href="#" class="l_send_submit">发布</a>',
				'</div>',
			'</div>',
		'</div>',
		'<div class="l_sendBox_avatar">',
			'<a href="javascript:void(0)" class="l_send_login">登录</a>',
		'</div>',
	'</div>'].join('');
	$('head').append(style);
	
	/**
	 * sendBox类
	 */
	function sendBox(dom){
		var me = this;
		this.dom = $(sendBox_tpl)[0];
		
		var textarea = $(this.dom).find('textarea');
		textarea.on('focus',function(){
			$(me.dom).addClass('l_sendBox_active');
		}).on('focusout',function(){
			$(me.dom).removeClass('l_sendBox_active');
		});
		$(dom).html($(this.dom));
	}
	return function(dom){
		
		this.dom = $(baseTpl)[0];
		new sendBox($(this.dom).find('.l_com_sendBox')[0]);
		dom.html($(this.dom));
	} 
});