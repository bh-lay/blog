/**
 * @author bh-lay
 *
 * @好友功能
 * var at = P.atFriends({
 * 	top:500,
 * 	left:200,
 * 	callback:function(name){
 * 		
 * 	}
 * });
 * at.search('mofei');
 * at.move({
 * 	top:300,
 * 	left:600
 * });
 * 
 * Function depends on
 *		JQUERY
 *		loader
 * 	Selection
 */

window.UI = window.UI || {};
(function(exports){
	
	var base_root = '/c/public/profile/';

	var require = new loader({
		'selection' : '/js/api/util/selection.js',
		'mirror' : '/js/api/util/mirror.js'
	});
	
	var atTpl = ['<div class="atFriends">',
		'<div class="atFriBody">',
			'<div class="atFriCnt">',
				'<div class="pro_loading"></div>',
			'</div>',
			'<div class="atFriTips">@朋友帐号,他就能在[提到我的]页收到</div>',
		'</div>',
		'<div class="atFriArrow">',
			'<span class="atFriArrowBorder">◆</span>',
			'<span class="atFriArrowColor">◆</span>',
		'</div>',
	'</div>'].join('');
	var atItemTpl = ['<a href="javascript:void(0)" data-name="{name}">',
		'{name}',
	'</a>'].join('');
	var at_CSS_tpl = ['<style type="text/css" data-module="atFriends">',
		'.atFriends{position: absolute;width:230px;margin:26px 0px 0px -115px;z-index: 1000;}',
		'.atFriArrow{position: absolute;width: 30px;height:16px;top:-14px;left:100px;overflow: hidden;font-size:20px;font-family:"Simsun";line-height:30px;text-align: center;}',
		'.atFriArrowBorder{display:block;position: absolute;width:100%;height:100%;top:0px;left:0px;color:#bbb;}',
		'.atFriArrowColor{display:block;position: absolute;width: 100%;height:100%;top:1px;left:0px;color:#fff;}',
		'.atFriBody{position:relative;background: #fff;border:1px solid #ccc;border-radius:3px;}',
		'.atFriCnt{max-height:250px;_height:250px;overflow-y:auto;}',
		'.atFriCnt span{display: block;height:30px;line-height: 30px;text-align:center;color:#666;}',
		'.atFriCnt a{display: block;height:28px;line-height: 28px;text-indent:1em;color:#444;}',
		'.atFriCnt a:hover{background:#eee;text-decoration: none;}',
		'.atFriCnt a:active{background:#aaa;text-decoration: none;}',
		'.atFriCnt a.active{background:#cef;color: #000;}',
		'.atFriTips{height:38px;line-height:38px;border-top:1px solid #e6e6e6;background:#f6f6f6;text-indent:1em;color:#666;font-size:12px;}',
	'</style>'].join('');
	$(function(){
		$('head').append(at_CSS_tpl);
	});
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	
	var friendsData = null;
	function getFriends(callback){
		if(friendsData){
			callback&&callback(friendsData);
			return
		}
		$.ajax({
			'url' : '/ajax/ajax_comm.php?action=getFriendsNickByUserid',
			'type' : 'GET', 
			'success' : function(d){
				var data = eval('(' + d  + ')');
				
				friendsData = [];
				for(var i in data.info){
					var li = data.info[i];
					friendsData.push({
						'name' : li[0],
						'nickpy' : null
					})
				}
				callback&&callback(friendsData);
			}
		});
	}
	function handleKey(e){
		if(this.state != 'show'){
			return
		}
		var CNT = this.dom.find('.atFriCnt');
		var LI = CNT.find('a');
		var keyCode = parseInt(e.keyCode);
		var bingoKey = true;
		var total = LI.length;
		if(keyCode == 38){
			//按向上按钮
			if(this.active.num > 0){
				this.active.num--;
			}else{
				this.active.num = total - 1;
			}
		}else if(keyCode == 40){
			//按向下按钮
			if(this.active.num < total-1){
				this.active.num++;
			}else{
				this.active.num = 0;
			}
		}else if(keyCode == 13){
			if(this.active.name){
				insertAt.call(this,this.active.name);
			}
		}else{
			bingoKey = false;
		}
		if(total>10){
			var scrollTop = 28*(this.active.num - 5);
			CNT.scrollTop(scrollTop);
		}
		//this.textarea.focus();
		if(bingoKey){
			LI.removeClass('active');
			LI.eq(this.active.num).addClass('active');
			this.active.name = LI.eq(this.active.num).html();
			e.bubbles=false
			e.cancelBubble=true;
			e.preventDefault&&e.preventDefault();
			e.stopPropagation&&e.stopPropagation();
			return false
		}
	}
	//尝试分析是否@好友
	function checkAt(){
		var startPoint = this.textarea.Selection()[0];
		var test_val = this.textarea.val().slice(0,startPoint);
		var last_val = test_val.split(' ').pop();
		if(last_val.indexOf('@')<0){
			if(this.state == 'show'){
				this.hide();
			}
			return
		}
		var key = test_val.split('@').pop();
		this.search(key);
		//获取光标位置
		var cursor = this.mirror.refresh().cursor;
		this.move({
			'top' : cursor.top,
			'left' : cursor.left
		});
	}
	//插入选中的@好友
	function insertAt(name){
		var this_at = this;
		var startPoint = this_at['textarea'].Selection()[0];
		var test_val = this_at['textarea'].val().slice(0,startPoint);
		var last_val = test_val.split(' ').pop();
		if(last_val.indexOf('@') >= 0){
			var start = test_val.lastIndexOf('@');
	 		var len = last_val.split('@').pop().length + 1;
			this_at['textarea'].Selection(start,len);
		}
		setTimeout(function(){
			this_at['textarea'].insertTxt('@' + name + ' ');
		});
		this.callback&&this.callback(name);
	}
	
	//初始化At
	function initAt(){
		var this_at = this;
		this.mirror = util.mirror(this.textarea)
		
		
		this.dom.on('click',function(){
			this_at['textarea'].focus();
		}).on('click','.atFriCnt a',function(){
			var name = $(this).attr('data-name');
			insertAt.call(this_at,name);
		});
		
		
		var inputDelay;
		this.textarea.on('keyup keydown paste focusin click',function(e){
			clearTimeout(inputDelay);
			inputDelay = setTimeout(function(){
				checkAt.call(this_at);
			},50);
		}).on('keydown',function(e){
			handleKey.call(this_at,e);
		});
		$('body').append(this.dom);
		
		//点击模块外部时，关闭自己
		var bingoDom = false;

		$(document).on('mousedown',function(){
			setTimeout(function(){
				if(!bingoDom){
					//关闭@好友及表情框
					this_at.hide();
				}else{
					bingoDom = false;
				}
			},20);
		});
		this.dom.on('mousedown',function(){
			bingoDom = true;
		});
		this.textarea.on('mousedown',function(){
			bingoDom = true;
		});
	}
	//{display:inline-block;width:0px;overflow:hidden;vertical-align:text-top;}
	function ATFRIENDS(param){
		var param = param || {};
		var this_at = this;
		this.closeFn = param['closeFn'] || null;
		this.state = 'show';
		this.textarea = param['textarea'];
		this.callback = param['callback'] || null
		this.mirror = null;
		this.dom = $(atTpl).hide();
		//当前搜索的关键字
		this.key = null;
		//激活状态的选项
		this.active = {
			'num' : -1,
			'name' : null
		};
	
		//加载依赖模块
		require.load('selection,mirror',function(){
			//初始化
			initAt.call(this_at);
		});
	}
	ATFRIENDS.prototype = {
		'destroy' : function(){
			this.dom.remove();
			this.closeFn&&this.closeFn();
			this.state = 'closed';
		},
		'show' : function(){
			var startPoint = this.textarea.Selection()[0];
			var test_val = this.textarea.val().slice(0,startPoint);
			var last_words = test_val[startPoint-1];
			if(last_words != '@'){
				this.textarea.insertTxt('@');
			}
			this.textarea.focus();
		},
		'hide' : function(){
			this.dom.hide();
			this.state = 'hidden';
			this.key = null;
			this.active = {
				'num' : -1,
				'name' : null
			};
		},
		'move' : function(param){
			if(param){
				var css = param;
				this.dom.css(css);
			}
		},
		'search' : function(txt){
			var this_at = this;
			this.dom.show();
			this.state = 'show';
			if(txt != this.key){
				this.key = txt || '';
				this.active = {
					'num' : -1,
					'name' : null
				};
			}else{
				return
			}
			getFriends(function(d){
				var data = [];
				if(txt == ''){
					data = d;
				}else{
					for(var i=0,total=d.length;i<total;i++){
						if(d[i]['name'].indexOf(txt)>=0){
							data.push(d[i]);
						}
					}
				}
				if(data.length>0){
					var listHtml = render(atItemTpl,data);
				}else{
					var listHtml = '<span>按下空格，完成输入</span>'
				}
				this_at.dom.find('.atFriCnt').html(listHtml);
			});
		}
	};
	
	exports.atFriends = function(param){
		return new ATFRIENDS(param);
	};
})(UI);