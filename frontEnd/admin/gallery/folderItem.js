define(function(require,exports){
	
	var uploader = require('uploader.js');
	var events = require('event.js');
	var panel = require('panel.js');
	var UI = require('dialog.js');
	
	var dir_tpl = ['<div class="gP_item" data-type="folder" data-fullname="{name}">',
		'<div class="gP_item_body">',
		'<div class="gP_dir_item">',
			'<div class="gP_file-ico"><span class="glyphicon glyphicon-folder-open"></span></div>',
			'<div class="gP_file-name" title="{name}" >{name}</div>',
		'</div>',
		'<div class="gP_item_tools">',
			'<div class="gP_item_toolsCnt">',
				'<a href="javascript:void(0)" class="gP_tool_btn" data-action="del">',
					'<span class="gP_tool_btn_ico"><span class="glyphicon glyphicon-trash"></span></span>',
					'<strong class="gP_tool_btn_name">删除</strong>',
				'</a>',
				'<a href="javascript:void(0)" class="gP_tool_btn" data-action="rename">',
					'<span class="gP_tool_btn_ico"><span class="glyphicon glyphicon-pencil"></span>',
					'<strong class="gP_tool_btn_name">重命名</strong>',
				'</a>',
			'</div>',
		'</div>',
		'<a href="javascript:void(0)" class="gP_item_toolBar"><span class="glyphicon glyphicon-chevron-down"></span></a>',
		'<a href="javascript:void(0)" class="gP_item_check"><span class="glyphicon glyphicon-unchecked"></span><span class="glyphicon glyphicon-check"></span></a>',
	'</div>',
	'</div>'].join('');


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
	
	//删除目录
	function delDir(pathname,callback){
		$.ajax({
			url: '/ajax/asset/delDir',
			type: 'POST',
			data: {
				path: pathname
			},
			dataType: 'json',
			success: function(data){
				if(data && data.code == 200){
					callback && callback(null);
				}else{
					var msg = '删除失败,code(' + (data.msg || '') + ')';
					callback && callback(msg);
				}
			},
			error: function(){
				callback && callback('网络出错');
			}
		});
	}

	/**
	 * 为目录/文件绑定事件
	 * 对象必须包含属性
	 *   dom
	 * 方法
	 *   del
	 * 
	 */
	function bindItemEvent(){
		var this_item = this;
		var itemDom = this.dom;
		itemDom.on('click','a[data-action="del"]',function(){
			//删除
			this_item.del();
		}).on('click','a[data-action="rename"]',function(){
			//重命名
			this_item.rename();
		}).on('click','.gP_item_toolBar',function(){
			//打开操作面板状态
			if(itemDom.hasClass('gP_item_menuing')){
				itemDom.removeClass('gP_item_menuing');
			}else{
				itemDom.removeClass('gP_item_menuing');
				itemDom.addClass('gP_item_menuing');
			//	this_item.dom.find('.gP_item').removeClass('gP_item_checked');
			}
		}).on('click','.gP_item_check',function(){
			//选中状态
			
			if(itemDom.hasClass('gP_item_checked')){
				itemDom.removeClass('gP_item_checked');
			}else{
				itemDom.addClass('gP_item_checked');
			}
		//	this_item.dom.find('.gP_item').removeClass('gP_item_menuing');
		});
		
	}
	/**
	 *  目录类
	 * @param {Object} dom
	 * @param {Object} param
	 */
	function folderItem(basePath,data){
		this.fullname = data.name;
		this.path = '/' + basePath + '/' + this.fullname;
		//过滤重复的路径中重复的//
		this.path = this.path.replace(/\/+/g,'/');
		
		this.url = 'http://static.bh-lay.com/' + this.path;
		/**
		 * 状态
		 * 正常 normal
		 * 选中 selected
		 * 菜单 menuing
		 */
		this.status = 'normal';
		
		var html = render(dir_tpl,[{
			name: this.fullname
		}]);
		this.dom = $(html);
		
		bindItemEvent.call(this);
	}
	folderItem.prototype = {
		del: function(){
			var path = this.path;
			var DOM = this.dom;
			UI.confirm({
				text: '删除就找不回来了，你再想想？',
				callback: function(){
					//发送删除请求
					delDir(path,function(err){
						if(err){
							UI.prompt(err);
							return;
						}
						DOM.addClass('gP_item_deleted');
						DOM.css({
							position: 'relative',
							height: DOM.find('.gP_item_body').height(),
							background: '#333'
						});
						DOM.find('.gP_item_body').css({
							position: 'absolute',
							width: '100%',
							height: '100%'
						}).animate({
							left: '100%'
						},300,function(){
							DOM.slideUp(120,function(){
								DOM.remove();
							});
						});
					});
				}
			});
		},
		rename: function(callback){
			var this_folder = this;
			var ask = UI.ask('快想一个新名字！', function(txt){
				var newName = txt;
				$.ajax({
					url: '/ajax/asset/rename',
					type: 'POST',
					data: {
						pathname: this_folder.path,
						newName: newName
					},
					dataType: 'json',
					success: function(data){
						if(data && data.code == 200){
							callback && callback(null,data);
							this_folder.dom.attr('data-fullname',newName);
							this_folder.dom.find('.gP_file-name')
								.attr('title',newName)
								.html(newName);
						}else{
							
						}
					},
					error: function(){
						callback && callback('网络出错');
					}
				});
			});
			//设置对话框纯文件名
			ask.setValue(this.fullname);
		}
	};
	
	return folderItem;
});