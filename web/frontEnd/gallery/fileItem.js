define(function(require,exports){
	
	var events = require('/frontEnd/util/event.js');
	var panel = require('/frontEnd/util/panel.js');
	var UI = require('/frontEnd/UI/pop.js');
	
	var file_item_tpl = ['<div class="gP_item" data-type="file" data-fullname="{fullname}" >',
		'<div class="gP_item_body">',
		'<div class="gP_file_item">',
			'<div class="gP_file-ico">{ico}</div>',
			'<div class="gP_file-name" title="{fullname}" ><strong>{filename}</strong><span>{extension}</span></div>',
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
		var extHtml = '<span class="glyphicon glyphicon-file"></span>';
		if(data.extension.match(/^\.(jpg|gif|bmp|jpeg|png)$/i)){
			extHtml = '<span class="glyphicon glyphicon-picture"></span>';
		}else if(data.extension.match(/^\.(zip|rar|tar)$/i)){
			extHtml = '<span class="glyphicon glyphicon-compressed"></span>';
		}
		data.ico = extHtml;
		var txt = '';
		txt += tpl.replace(/{(\w*)}/g,function(){
			var key = arguments[1];
			return data[key] || '';
		});
		return txt;
	}
	
	
	/**
	 * @method parseFullname 解析文件名
	 * @param String fullname 文件全名
	 * @param String basePath 文件所在目录
	 * @param String domain 文件所在域名
	 * 
	 * @returns Object file 文件对象
	 * @returns String file.fullname 文件全名
	 * @returns String file.filename 文件名
	 * @returns String file.extension 扩展名
	 * @returns String file.pathname 文件所在路径+文件全名
	 * @returns String file.url 文件绝对地址
	 * 
	 * @example
	 * 	var file = parseFullname('readme.txt');
	 * 	file.fullname; //'readme.txt'
	 * 	file.filename; //'readme'
	 * 	file.extension; //'.txt'
	 */
	function parseFullname(fullname,basePath,domain){
		var fullname = fullname || '';

		var match = fullname.match(/(.*)\.(\w+)$/);
		var filename = match ? match[1] : fullname;
		var extension = match ? '.' + match[2] : '';
		var pathname = '/' + basePath + '/' + fullname;
		//过滤重复的路径中重复的//
		pathname = pathname.replace(/\/+/g,'/');
		var url = domain + pathname.replace(/$^\//,'');
		
		return {
			'fullname' : fullname,
			'filename' : filename,
			'extension' : extension,
			'pathname' : pathname
		};
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
		var this_file = this;
		var itemDom = this.dom;
		itemDom.on('click','a[data-action="del"]',function(){
			//删除
			this_file.del();
		}).on('click','a[data-action="rename"]',function(){
			//重命名
			this_file.rename();
		}).on('click','.gP_item_toolBar',function(){
			//打开操作面板状态
			if(itemDom.hasClass('gP_item_menuing')){
				itemDom.removeClass('gP_item_menuing');
			}else{
				itemDom.removeClass('gP_item_menuing');
				itemDom.addClass('gP_item_menuing');
			//	this_file.dom.find('.gP_item').removeClass('gP_item_checked');
			}
		}).on('click','.gP_item_check',function(){
			//选中状态
			
			if(itemDom.hasClass('gP_item_checked')){
				itemDom.removeClass('gP_item_checked');
			}else{
				itemDom.addClass('gP_item_checked');
			}
		//	this_file.dom.find('.gP_item').removeClass('gP_item_menuing');
		});
	}
	
	/**
	 * 文件类
	 * @param {Object} dom
	 * @param {Object} param
	 */
	function fileItem(basePath,data){
		/**
		 * 状态
		 * 正常 normal
		 * 选中 selected
		 * 菜单 menuing
		 */
		this.status = 'normal';
		this.fullname = data.name;
		
		var file = parseFullname(this.fullname,basePath,'http://asset.bh-lay.com/');
		this.filename = file.filename;
		this.extension = file.extension;
		this.pathname = file.pathname;
		this.url =  file.url;
		
		var html = render(file_item_tpl,{
			'fullname' : this.fullname,
			'filename' : this.filename,
			'extension' : this.extension
		});
		
		this.dom = $(html);
		bindItemEvent.call(this);
		
	}
	fileItem.prototype = {
		'del' : function(){
			var pathname = this.pathname;
			var DOM = this.dom;
			UI.confirm({
				'text' : '删除就找不回来了，你再想想？',
				'callback' : function(){
					//发送删除请求
					delFile(pathname,function(err){
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
			var this_file = this;
			var ask = UI.ask('快想一个新名字！', function(txt){
				
				var newName = txt;
				$.ajax({
					'url' : '/ajax/asset/rename',
					'type' : 'POST',
					'data' : {
						'root' : this_file.root,
						'oldName' : this_file.fullname,
						'newName' : newName
					},
					'dataType' : 'json',
					'success' : function(data){
						if(data && data.code == 200){
							
							this_file.filename = newName;
							this_file.fullname = this_file.filename + this_file.extension;
							var item_dom = this_file.dom.find('.gP_file-name');
							item_dom.find('strong').html(this_file.filename);
							item_dom.attr('title',this_file.fullname);
							callback && callback(null,data);
						}else{
							callback && callback('重命名失败');
						}
					},
					'error' : function(){
						callback && callback('网络出错');
					}
				});
			});
			//设置对话框纯文件名
			ask.setValue(this.filename);
		}
	};

	return fileItem;
});