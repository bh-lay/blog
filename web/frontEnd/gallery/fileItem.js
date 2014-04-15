define(function(require,exports){
	
	var events = require('/frontEnd/util/event.js');
	var panel = require('/frontEnd/util/panel.js');
	var UI = require('/frontEnd/UI/pop.js');
	
	var file_item_tpl = ['<div class="gP_item file_item_{id}" data-name="{name}">',
		'<div class="gP_item_body">',
		'<div class="gP_file_item">',
			'<div class="gP_file-ico">{ico}</div>',
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
	
	//删除文件
	function delFile(pathname,callback){
		$.ajax({
			'url' : '/ajax/asset/del',
			'type' : 'POST',
			'data' : {
				'path' : pathname
			},
			'dataType' : 'json',
			'success' : function(data){
				callback && callback(null,data);
			},
			'error' : function(){
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
		
		//文件（文件夹）绑定右键
		var itemMenu = panel({
			'targets' : '.file_item_' + private_item_ID,
			'callback':function(name) {
				console.log('you have chioce "' , name , '" from the [ ' , this , ']');
			},
			'callbefore' : function(){
			//	console.log('you have panel [ ' , this , ']');
			}
		});
		
		//指定类型
		itemMenu.type = 'menu';
		//增删菜单条目
		itemMenu.add('rename',{'txt':'重命名'},function(){
			//重命名
			var name = $(this).attr('data-name');
			var ask = UI.ask('快想一个新名字！', function(txt){
				this_item.rename(txt);
			});
			//获取纯文件名，去除后缀名
			var nameMatch = name.match(/(.+)\.((?:\w|\s|\d)+)$/);
			var pureName = nameMatch ? nameMatch[1] : name;
			ask.setValue(pureName);
		});
		itemMenu.add('delete',{'txt':'删除'},function(){
			//删除
			this_item.del();
		});
	}
	
	/**
	 * 文件类
	 * @param {Object} dom
	 * @param {Object} param
	 */
	var private_item_ID = 0;
	function fileItem(basePath,data){
		private_item_ID++;
		this.name = data.name;
		this.path = '/' + basePath + '/' + this.name;
		//过滤重复的路径中重复的//
		this.path = this.path.replace(/\/+/g,'/');
		
		this.url = 'http://asset.bh-lay.com/' + this.path;
		/**
		 * 状态
		 * 正常 normal
		 * 选中 selected
		 * 菜单 menuing
		 */
		this.status = 'normal';
					
		var match = this['name'].match(/\.(\w+)$/);
		var type = match ? match[1] : '';
		var extHtml = '<span class="glyphicon glyphicon-file"></span>';
		if(type.match(/^jpg|gif|bmp|jpeg|png$/i)){
			extHtml = '<span class="glyphicon glyphicon-picture"></span>';
		}
		
		var html = render(file_item_tpl,[{
			'name' : this['name'],
			'ico' : extHtml,
			'id' : private_item_ID
		}]);
		
		this.dom = $(html);
		bindItemEvent.call(this);
		
	}
	fileItem.prototype = {
		'del' : function(){
			var path = this.path;
			var DOM = this.dom;
			UI.confirm({
				'text' : '删除就找不回来了，你再想想？',
				'callback' : function(){
					//发送删除请求
					delFile(path,function(err){
						if(err){
							UI.prompt(err);
							return;
						}
						DOM.addClass('gP_item_deleted');
						DOM.css({
							'position' : 'relative',
							'height' : DOM.find('.gP_item_body').height(),
							'background' : '#333'
						});
						DOM.find('.gP_item_body').css({
							'position' : 'absolute',
							'width' : '100%',
							'height' : '100%'
						}).animate({
							'left' : '100%'
						},300,function(){
							DOM.slideUp(120,function(){
								DOM.remove();
							});
						});
					});
				}
			});
		},
		'rename' : function(callback){
		//	console.log(name,txt);
			var filename = this.name;
			var baseRoot = this.root;
			var ask = UI.ask('快想一个新名字！', function(txt){
				
				var newName = txt;
				$.ajax({
					'url' : '/ajax/asset/rename',
					'type' : 'POST',
					'data' : {
						'root' : baseRoot,
						'oldName' : filename,
						'newName' : newName
					},
					'dataType' : 'json',
					'success' : function(data){
						callback && callback(null,data);
					},
					'error' : function(){
						callback && callback('网络出错');
					}
				});
			});
			//获取纯文件名，去除后缀名
			var nameMatch = name.match(/(.+)\.((?:\w|\s|\d)+)$/);
			var pureName = nameMatch ? nameMatch[1] : name;
			ask.setValue(pureName);
		}
	};

	return fileItem;
});