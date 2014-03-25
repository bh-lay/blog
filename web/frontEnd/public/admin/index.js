/**
 * @author bh-lay
 * 后台主js文件
 * 
 */

window.admin = window.admin || {};

/**
 * @method admin.push
 * 	@param {String} url,the location url needn't '/p/'
 * 	@example 
 * 		admin.push('vote'); //'vote' is means '/p/vote'
 * 
 * @method admin.refresh
 * 	@example admin.refresh();
 * 
 * @method admin.load 
 *		@param {String} url,the resources url you want to load
 * 	@param {Function} callback 
 * 	@example
 * 		admin.load('/p/public/js/util/slideBar.js',function(){
 * 			console.log('i'm the sidebar!')
 * 		});
 ***/
(function(exports){
	var nameToTitle = {
		'index' : '后台首页',
		'share' : '分享列表',
		'article' : '博文列表',
		'opus' : '作品列表',
		'user' : '用户',
		'publish' : '发布台',
		'friends' : '友情链接',
		'labs' : '实验室',
		'gallery' : '图库'
	};
	
	function filterUrl(input){
		var urlData = input || [];
		var not_admin = false,
			 page,
			 title;
		//判断是否为后台
		if(urlData.length == 0 || urlData[0] != 'admin'){
			not_admin = true;
		}else{
			//判断是否为首页
			if(urlData.length == 1){
				page = 'index';
				title = '首页';
			}else if(nameToTitle[urlData[1]]){
				page = urlData[1];
				title = nameToTitle[page];
			}else{
				page = 'error';
				title = '出错了';
				//FIXME 出错了
				console.log('url err!');
			}
		}
		return {
			'not_admin' : not_admin,
			'page' : page,
			'title' : title
		}
	}
	function createDom(dom){
		var newDom = $('<div><div class="pro_loading">正在加载</div></div>');
		dom.html(newDom);
		return newDom;
	}
	seajs.use([
		'/frontEnd/util/lofox.js',
		'/frontEnd/UI/pop.js',
		'/frontEnd/public/admin/render.js',
		'/frontEnd/lib/jquery/jquery.easing.1.3.min.js'
	],function(){
		var lofox = util.lofox();
		var mainDom = $('.mainCnt');
		var titleDom = $('title');
		lofox.on('change',function(urlData,searchData){
			
			var data = filterUrl(urlData);
			var page_title = data.title;
			var page_name = data.page;
			//console.log(data);
			if(data.not_admin){
				//非管理后台
				window.location.reload();
				return
			}
			switch(page_name){
				case 'index':
					//首页
					var dom = createDom(mainDom);
					admin.render.index(dom);
				break
				case 'article':
					//博文页
					var dom = createDom(mainDom);
					admin.render.article(dom);
				break
				case 'share':
					//分享
					var dom = createDom(mainDom);
					admin.render.share(dom);
				break
				case 'opus':
					//作品
					var dom = createDom(mainDom);
					admin.render.opus(dom);
				break
				case 'labs':
					//作品
					var dom = createDom(mainDom);
					admin.render.labs(dom);
				break
				case 'user':
					//用户
					var dom = createDom(mainDom);
					if(urlData.length == 2){
						page_title = '用户';
						admin.render.userIndex(dom);
					}else if(urlData.length >= 3){
						if(urlData[2] == 'list'){
							page_title = '用户列表';
							admin.render.userList(dom);
						}else if(urlData[2] == 'group'){
							page_title = '用户组列表';
							dom.html('俺是用户组列表页');
						}else if(urlData[2] == 'power'){
							page_title = '权限页';
							admin.render.powerList(dom);
						}else{
							admin.push('/user/');
							admin.refresh();
						}
					}
				break
				case 'publish':
					mainDom.html('<div class="col-md-12"></div>');
					var dom = mainDom.find('.col-md-12');
					var type = '';
					var id = null;
					if(urlData.length >= 3){
						type = urlData[2];
					}
					if(urlData.length >= 4){
						id = urlData[3];
					}
					if(type.match(/^(article|share|opus|friends|labs|power)$/)){
						seajs.use('/frontEnd/publish/publish.js',function(publish){
							publish.init(dom,{
								'active' : type,
								'id' : id
							});
						});
					}else{
						admin.push('/publish/article');
						admin.refresh();
					}
				break
				case 'friends':
					//友情链接模块
					var dom = createDom(mainDom);
					admin.render.friends(dom);
				break
				case 'gallery' :
					mainDom.html('<div class="col-md-12"></div>');
					var dom = mainDom.find('.col-md-12');
					seajs.use('/frontEnd/gallery/index.js',function(gallery){
						gallery.init(dom);
					});
				break
				default:
					admin.push('/admin/');
					admin.refresh();
					return
					mainDom.html('<div Style="height:60px;background:#fff;line-height:60px;text-align:center;">这是一个<strong Style="font-size:20px;">“错误的”</strong>页面，请找<a href="http://sighttp.qq.com/authd?IDKEY=add2a4ef1d41f5d9014a7162fd89e6343c31c38ccbf9cc6f" title="发起QQ聊天" target="_blank" style="color:#fa0;margin:0px 10px;">[ 剧中人 ]</a>查看哪儿出了问题！</div>');
			}
			titleDom.html(page_title + '—剧中人后台');
			$('.crumbs').html(page_title);
		});
		
		admin.render.base();
		
		$('body').on('click','a.custom-lofox',function(){
			var url = $(this).attr('href');
			lofox.push(url);
			lofox.refresh();
			return false
		});
		
		exports.load = function(){
			require.load.apply(require,arguments);
		};
		exports.pageList = function(dom,param){
			return new pageList(dom,param);
		};
		exports.push = function(url){
			//去除参数中的首个‘/’或‘/admin/’
			var new_url = '/admin/' + (url ? url.replace(/^(\/admin\/|\/)/,'') : '');
			lofox.push.call(lofox,new_url);
		};
		exports.formToAjax = function(dom,param){
			return new formToAjax(dom,param);
		};
		exports.refresh = function(){
			lofox.refresh();
		};
	});
})(window.admin);

$(function(exports){
	function sendPOST(url,callback){
		$.ajax({
			'url' : url,
			'type' : 'POST',
			'success' : function(data){
				if(data && data.code == 200){
					callback && callback(null,'操作成功');
				}else{
					var msg = data.msg || '操作失败';
					callback && callback(msg);
				}
			},
			'error' : function(){
				callback && callback('网络出错！');
			}
		});
	}
	$('body').on('click','a[data-action-ajaxConfirm]',function(){
		var btn = $(this);
		var url = btn.attr('href');
		var text = btn.attr('data-action-ajaxConfirm');
		UI.confirm({
			'text' : text,
			'callback' : function(){
				sendPOST(url,function(err,msg){
					if(err){
						UI.prompt(err);
					}else{
						UI.prompt('操作成功！');
					}
				});
			}
		});
		return false;
	}).on('click','a[data-action-del]',function(){
		var btn = $(this);
		var url = btn.attr('href');
		var text = btn.attr('data-action-del');
		var item_selector = btn.attr('data-item-selector');
		var item = btn.parents(item_selector);
		UI.confirm({
			'text' : text,
			'callback' : function(){
				sendPOST(url,function(err,msg){
					if(err){
						UI.prompt(err);
					}else{
						item.fadeTo(400,0.1,function(){
							item.slideUp(200,function(){
								item.remove();
							});
						});
					}
				});
			}
		});
		return false;
	}).on('click','a[data-action-ajax]',function(){
		var btn = $(this);
		var url = btn.attr('href');
		var text = btn.attr('data-action-ajax');
		$.ajax({
			'url' : url,
			'type' : 'POST',
			'success' : function(data){
				if(data && data.code ==200){
					UI.prompt(text);
				}else{
					UI.prompt('操作失败！');
				}
			},
			'error' : function(){
				UI.prompt('网络出错！');
			}
		});
		return false;
	});
});

/***
 * 使用ajax提交表单
 * 
 **/
function formToAjax(dom,param){
	var this_form = this;
	var param = param || {};
	var formDom = null;
	if(dom[0].tagName == 'FORM'){
		formDom = dom;
	}else{
		formDom = dom.find('form');
	}
	
	if(formDom.length == 0){
		console.log('找不到<form>');
		return
	}
	this.formDom = formDom;
	this.action = this.formDom.attr('action');
	this.method = this.formDom.attr('method') || 'GET';
	this.method = this.method.toUpperCase();
	this.onSubmit = param['onSubmit'] || null;
	this.onResponse = param['onResponse'] || null;
	
	this.formDom.on("submit", function(event) {
		this_form.submit();
		return false
	});
}
formToAjax.prototype = {
	'getData' : function(){
		var output = {};
		this.formDom.find('input,textarea').each(function(){
			var ipt = $(this);
			var name = ipt.attr('name');
			var type = ipt.attr('type');
			if(!name){
				return
			}
			if(type == 'radio' || type == 'checkbox'){
				//FIXME 单选框或复选框
			}else if(type == 'file'){
				console.log('丢弃文件域！');
			}else{
				var value = ipt.val();
				output[name] = value;
			}
		});
		this.formDom.find('select').each(function(){
			//FIXME 下拉框
		});
		return output;
	},
	'submit' : function(){
		var this_form = this;
		var data = this.getData();
		if(this.onSubmit){
			var check = this.onSubmit(data);
			if(check == false){
				//console.log('不提交');
				return
			}
		}
		//console.log('提交');
		$.ajax({
			'url' : this.action,
			'type' : this.method,
			'data' : data,
			'success' : function(data){
				this_form.onResponse && this_form.onResponse(data);
			}
		});
	}
};



/***
 * 分页 页码
 **/
function pageList(dom,param){
	var param = param || {};
	var this_page = this;
	this.list_count = param.list_count || 0;
	this.page_cur = param.page_cur || 1;
	this.page_list_num = param.page_list_num || 15;
	this.page_num = Math.ceil(this.list_count / this.page_list_num);
	this.jump = null;
	this.dom = $('<ul class="pagination"></ul>');
	
	this.dom.on('click','a[data-page="jump"]',function(){
		var num = parseInt($(this).html());
		this_page.page_cur = num - 1;
		this_page.jumpTo(num);
	}).on('click','a[data-page="next"]',function(){
		var num = ++this_page.page_cur;
		this_page.jumpTo(num);
	}).on('click','a[data-page="prev"]',function(){
		var num = --this_page.page_cur;
		this_page.jumpTo(num);
	});
	dom.html(this.dom);
	this.render();
}
pageList.prototype = {
	'jumpTo' : function(num){
		this.page_cur = num;
		this.render();
		this.jump && this.jump(num);
	},
	'render' : function(){
		var txt = '';

		if (this.page_cur > 1) {
			txt += '<li><a data-page="prev" href="javascript:void(0)" >上一页</a></li>';
		}else{
			txt += '<li class="disabled"><span>上一页</span></li>';
		}
		for(var i = 0; i < this.page_num; i++) {
			if(i+1 != this.page_cur){
				txt += '<li><a data-page="jump" href="javascript:void(0)">' + (i + 1) + '</a></li>';
			}else{
				txt += '<li class="disabled"><a href="javascript:void(0)">'+ (i + 1) +'</a></li>';
			}
		}
		if (this.page_num - this.page_cur >= 1) {
			txt += '<li><a data-page="next" href="javascript:void(0)">下一页</a></li>';
		}else{
			txt += '<li class="disabled"><span>下一页</span></li>';
		}
		this.dom.html(txt);
	}
};

/**
 * 格式化日期
 * @param (timestamp/Date,'{y}-{m}-{d} {h}:{m}:{s}')
 * 
 * y:year
 * m:months
 * d:date
 * h:hour
 * i:minutes
 * s:second
 * a:day
 */
window.parse = window.parse || {};
(function(exports){
	
	exports.time = function(time,format){
		if(arguments.length==0){
			return null;
		}
		var format = format ||'{y}-{m}-{d} {h}:{i}:{s}';
		
		if(typeof(time) == "object"){
			var date = time;
		}else{
			var date = new Date(parseInt(time));
		}
		
		var formatObj = {
			y : date.getYear()+1900,
			m : date.getMonth()+1,
			d : date.getDate(),
			h : date.getHours(),
			i : date.getMinutes(),
			s : date.getSeconds(),
			a : date.getDay(),
		};
		
		var time_str = format.replace(/{(y|m|d|h|i|s|a)}/g,function(){
			return formatObj[arguments[1]]||arguments[0];
		});
		//console.log(format,formatObj)
		return time_str;
	}
})(window.parse);

/***
 * 基础页
 **/
window.admin = window.admin || {};
window.admin.render = window.admin.render || {};
(function(exports){
	exports.base = function(){
		$('.userCnt').click(function(){
			$('.username_hover').slideDown(200);
		});
		$('.username_hover').mouseleave(function(){
			$(this).fadeOut(200);
		})
	};
})(window.admin.render);