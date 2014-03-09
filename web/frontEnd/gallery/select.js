define(function(require,exports){
	var loading_tpl = '<div class="gp_loading">正在加载</div>';
	var base_tpl = ['<div class="gP_select">',
		'<div class="gp_select_top">',
			'<a href="javascript:void(0)" data-action="back"><span class="glyphicon glyphicon-chevron-left"></span></a>',
			'<a href="javascript:void(0)" data-action="upload"><span class="glyphicon glyphicon-cloud-upload"></span></a>',
		'</div>',
		'<div class="gp_select_cnt"></div>',
	'</div>'].join('');
	
	var dir_tpl = ['<div class="gP_dir_item" data-type="{type}" data-name="{name}">',
		'<div class="gP_file-ico"><span class="glyphicon glyphicon-folder-open"></span></div>',
		'<div class="gP_file-name">{name}</div>',
	'</div>'].join('');
	
	var item_tpl = ['<div class="gP_file_item" data-type="{type}" data-name="{name}">',
		'<div class="gP_file-ico">{type}</div>',
		'<div class="gP_file-name">{name}</div>',
	'</div>'].join('');
	
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
							var match = data.files[i]['name'].match(/\.(.+)/);
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
		
		this.dom.on('click','.gP_dir_item',function(){
			var name = $(this).attr('data-name');
			this_select.open(name);
		}).on('click','a[data-action="back"]',function(){
			this_select.back();
		});
	}
	function SELECT(dom,param){
		this.root = '';
		
		this.dom = $(base_tpl);
		this.cntDom = this.dom.find('.gp_select_cnt');
		dom.html(this.dom);
		bindEvent.call(this);
		
		this.open('');
	}
	SELECT.prototype = {
		'open' : function(filename){
			var this_select = this;
			var path = this.root + '/' + filename;
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
		//跳转至指定目录
		'jump' : function(path){
			var this_select = this;
			this.cntDom.html(loading_tpl);
			getData(path,function(err,data){
				if(err){
					this_select.cntDom.html('错啦！');
					return
				}
				var html = render(dir_tpl,data.dir);
				html += render(item_tpl,data.files);
				this_select.cntDom.html(html);
				this_select.root = path;
			});
		}
	};
	
	return function(dom,param){
		return new SELECT(dom,param);
	};
});
