define(function(require,exports){
	
	var uploader = require('/frontEnd/util/uploader.js');
	var events = require('/frontEnd/util/event.js');
	
	var loading_tpl = '<div class="gp_loading">正在加载</div>';
	var base_tpl = ['<div class="gP_select">',
		'<div class="gp_select_top">',
			'<a href="javascript:void(0)" data-action="back"><span class="glyphicon glyphicon-chevron-left"></span></a>',
			'<a href="javascript:void(0)" data-action="upload"><span class="glyphicon glyphicon-cloud-upload"></span></a>',
			'<span class="gP_rootNav">/</span>',
		'</div>',
		'<div class="gp_select_cnt"></div>',
	'</div>'].join('');
	
	var dir_tpl = ['<div class="gP_item" data-type="{type}" data-name="{name}">',
		'<div class="gP_dir_item">',
			'<div class="gP_file-ico"><span class="glyphicon glyphicon-folder-open"></span></div>',
			'<div class="gP_file-name">{name}</div>',
		'</div>',
		'<div class="gP_item_tools">',
			'<div class="gP_item_toolsCnt">',
				'<a href="javascript:void(0)" class="gP_tool_btn" data-action="del">',
					'<span class="gP_tool_btn_ico"><span class="glyphicon glyphicon-trash"></span></span>',
					'<strong class="gP_tool_btn_name">删除</strong>',
				'</a>',
				'<a href="javascript:void(0)" class="gP_tool_btn">',
					'<span class="gP_tool_btn_ico"><span class="glyphicon glyphicon-pencil"></span>',
					'<strong class="gP_tool_btn_name">重命名</strong>',
				'</a>',
			'</div>',
		'</div>',
		'<a href="javascript:void(0)" class="gP_item_toolBar"><span class="glyphicon glyphicon-chevron-down"></span></a>',
	'</div>'].join('');
	
	var file_item_tpl = ['<div class="gP_item" data-type="{type}" data-name="{name}">',
		'<div class="gP_file_item">',
			'<div class="gP_file-ico">{type}</div>',
			'<div class="gP_file-name">{name}</div>',
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
	'</div>'].join('');
	//获取目录信息
	function getData(path,callback){
		$.ajax({
			'url' : '/ajax/asset',
			'type' : 'GET',
			'data' : {
				'path' : path
			},
			'dataType' : 'json',
			'success' : function(data){
				if(data && data.code == 200){
					var newData = {
						'dir' : [],
						'files' : []
					};
					for(var i in data.files){
						var type = '';
						if(data.files[i]['isdir']){
							newData['dir'].push({
								'name' : data.files[i]['name']
							});
						}else{
							var match = data.files[i]['name'].match(/\.(\w+)$/);
							type = match ? match[1] : '';
							newData['files'].push({
								'name' : data.files[i]['name'],
								'type' : type
							});
						}
					}
					callback && callback(null,newData);
				}else{
					callback && callback('网络出错！');
				}
			}
		});
	}
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
	function bindEvent(){
		var this_select = this;
		
		var thisUpload = new uploader({
			'dom' : this.dom.find('a[data-action="upload"]'),
			'action' : '/ajax/asset/upload',
			'data' : {
				'act' : 'addFile',
				'root' : '/'
			}
		});
		this.on('fresh',function(baseRoot){
			thisUpload.data.root = baseRoot;
		});
		thisUpload.responseParser = function(data){
		//	console.log(data,'---------------');
			if(data && data.code && data.code == 200){
				files = data.files;
			}else{
				files = [];
			}
			return {
				'files' : files
			};
		}
		thisUpload.on('success',function(){
			this_select.refresh();
		});
		
		this.on('fresh',function(path){
			thisUpload.data.root = path;
		});
		this.dom.on('click','.gP_dir_item',function(){
			//点击文件夹图标，执行打开动作
			var name = $(this).parent().attr('data-name');
			this_select.open(name);
		}).on('click','a[data-action="back"]',function(){
			//后退
			this_select.back();
		}).on('click','a[data-action="rename"]',function(){
			//重命名
			var name = $(this).parents('.gP_item').attr('data-name');
			var ask = UI.ask('快想一个新名字！', function(txt){
				this_select.rename(name,txt);
			});
			//获取纯文件名，去除后缀名
			var nameMatch = name.match(/(.+)\.((?:\w|\s|\d)+)$/);
			var pureName = nameMatch ? nameMatch[1] : name;
			ask.setValue(pureName);
		}).on('click','a[data-action="del"]',function(){
			//删除
			var name = $(this).parents('.gP_item').attr('data-name');
			UI.confirm({
				'text' : '删除就找不回来了，你再想想？',
				'callback' : function(){
					this_select.del(name);
				}
			});
		}).on('click','.gP_item_toolBar',function(){
			var thisBtn = $(this);
			var toolsDom = $(this).parents('.gP_item').find('.gP_item_tools');
			if(toolsDom.height()>115){
				thisBtn.removeClass('open');
				toolsDom.animate({
					'height' : 0
				},100);
			}else{
				thisBtn.addClass('open');
				toolsDom.animate({
					'height' : 120
				},50);
			}
		});
	}
	
	//文件选择类
	function SELECT(dom,param){
		this.root = '';
		
		this.dom = $(base_tpl);
		this.cntDom = this.dom.find('.gp_select_cnt');
		this.pathDom = this.dom.find('.gP_rootNav');
		
		dom.html(this.dom);

		//扩展事件处理
		events.extend.call(this);
		//绑定dom事件
		bindEvent.call(this);
		this.open('');
	}
	SELECT.prototype = {
		'open' : function(filename){
			var this_select = this;
			var path = this.root + '/' + filename;
	//		console.log(path,'22')
			path = path.replace(/\/+/g,'/');
			path = path.length>0 ? path : '/';
	//		console.log(path,'333')
			this.jump(path);
		},
		'del' : function(filename,callback){
			var this_select = this;
			
			var path = this.root + '/' + filename;
			path = path.replace(/\/+/g,'/');
			$.ajax({
				'url' : '/ajax/asset/del',
				'type' : 'POST',
				'data' : {
					'path' : path
				},
				'dataType' : 'json',
				'success' : function(data){
					this_select.refresh();
					callback && callback(null,data);
				},
				'error' : function(){
					callback && callback('网络出错');
				}
			});
		},
		'rename' : function(filename,txt,callback){
		//	console.log(name,txt);
			var this_select = this;
			if(!filename || !txt || filename.length < 0 || txt.length < 0){
				callback && callback('参数不全');
				return;
			}
			
			var newName = txt;

			$.ajax({
				'url' : '/ajax/asset/rename',
				'type' : 'POST',
				'data' : {
					'root' : this.root,
					'oldName' : filename,
					'newName' : newName
				},
				'dataType' : 'json',
				'success' : function(data){
					this_select.refresh();
					callback && callback(null,data);
				},
				'error' : function(){
					callback && callback('网络出错');
				}
			});
		},
		'refresh' : function(){
			var path = this.root;
			this.jump(path);
		},
		'back' : function(){
			var root = this.root;
			//去除最后一节目录
			var path = root.replace(/\/(\w|\-)+(\/|)$/g,'');
			if(path == root){
				return
			}
			this.jump(path);
		},
		//刷新当前列表
		'refresh' : function(){
			var path = this.root;
			this.jump(path);
		},
		//跳转至指定目录
		'jump' : function(path){
			var this_select = this;
			this.cntDom.html(loading_tpl);
			this.pathDom.html(path);
			getData(path,function(err,data){
				if(err){
					this_select.cntDom.html('错啦！');
					return
				}
				var html = render(dir_tpl,data.dir);
				html += render(file_item_tpl,data.files);
				this_select.cntDom.html(html);
				this_select.root = path;
				this_select.emit('fresh',this_select.root);
			});
		}
	};
	
	return function(dom,param){
		return new SELECT(dom,param);
	};
});