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

define(function(require,exports){
    require('util/lofox_1_0.js');
	require('UI/dialog.js');
	require('lib/juicer.js');
	require('admin/render.js');
	require('lib/jquery/jquery.easing.1.3.min.js');
	
    var page_friends = require('admin/friends.js'),
        page_comment = require('admin/comments_list.js'),
        article_list = require('admin/article_list.js');
    
	function createDom(dom){
		var oldDom = dom.find('.mainCnt_body');
		var newDom = $('<div class="mainCnt_body"><div><div class="pro_loading">正在加载</div></div></div>');
		
		dom.append(newDom);
		if(oldDom.length != 0){
			dom.css('height',dom.height());
			oldDom.css({
				'position' : 'absolute',
				'top': 0,
				'left' : 0
			});
			newDom.css({
				'position' : 'absolute',
				'top' : 0,
				'left': '200%'
			});
			
			oldDom.animate({
				'left': '-100%'
			},400).fadeOut(100,function(){
				$(window).scrollTop(0);
				oldDom.remove();
				newDom.animate({
					'left': 0
				},200,function(){
					dom.css('height','auto');
					newDom.css('position','relative');
				});
			});
		}
		return newDom;
	}
    var lofox = util.lofox();
    var mainDom = $('.mainCnt');
    var titleDom = $('title');


    admin.render.base();

    //首页
    lofox.set('/admin/',function(){
        this.title('后台首页');
        var dom = createDom(mainDom);
		
        var tpl = $('#tpl_index_page').html();
		var txt = tpl.replace('{username}',admin_dataBase.username);
		dom.html(txt);
    });
    //博文页
    lofox.set('/admin/article',function(){
        this.title('博文列表');
        var dom = createDom(mainDom);
        article_list(dom);
    });
    //作品页
    lofox.set('/admin/opus',function(){
        this.title('作品列表');
        var dom = createDom(mainDom);
        admin.render.opus(dom);
    });
    //实验室
    lofox.set('/admin/labs',function(){
        this.title('实验室');
        var dom = createDom(mainDom);
        admin.render.labs(dom);
    });
    //用户列表页
    lofox.set('/admin/user/list',function(){
        this.title('用户列表');
        var dom = createDom(mainDom);
        admin.render.userList(dom);
    });
    //用户组页
    lofox.set('/admin/user/group',function(){
        this.title('用户组列表');
        var dom = createDom(mainDom);
        dom.html('俺是用户组列表页');
    });
    //权限页
    lofox.set('/admin/user/power',function(){
        this.title('权限页');
        var dom = createDom(mainDom);
        admin.render.powerList(dom);
    });

    //友情链接模块
    lofox.set('/admin/friends',function(){
        this.title('友情链接');
        var dom = createDom(mainDom);
        page_friends(dom);
    });
    //图库
    lofox.set('/admin/gallery',function(){
        this.title('图库');

        var domCnt = createDom(mainDom);
        domCnt.html('<div class="col-md-12"></div>');
        var dom = domCnt.find('.col-md-12');
        seajs.use('admin/gallery/index.js',function(gallery){
            gallery.init(dom);
        });
    });
    //评论管理
    lofox.set('/admin/comments',function(){
        this.title('评论管理');
        var domCnt = createDom(mainDom);
        domCnt.html('<div class="col-md-12"></div>');
        var dom = domCnt.find('.col-md-12');
        page_comment(dom);
    });
    //发布相关
    lofox.set([
        '/admin/publish/',
        '/admin/publish/{type}',
        '/admin/publish/{type}/{id}'
    ],function(data){
        this.title('发布台');
        var domCnt = createDom(mainDom);
        domCnt.html('<div class="col-md-12"></div>');
        var dom = domCnt.find('.col-md-12');
        var type = data.type || null;
        var id = data.id || null;

        if(type && type.match(/^(article|opus|friends|labs|power|user)$/)){
            seajs.use('publish/publish.js',function(publish){
                publish.init(dom,{
                    'active' : type,
                    'id' : id,
                    'sendFn' : function(){
                        location.back();
                    }
                });
            });
        }else{
            admin.push('/publish/article');
            admin.refresh();
        }
    });

    lofox.rest(function(){
        admin.push('');
        admin.refresh();
    })

    $('body').on('click','a.custom-lofox',function(){
        var url = $(this).attr('href');
        lofox.push(url);
        lofox.refresh();
        return false
    }).on('click','a.custom-publish',function(){
        var btn = $(this);
        var type = btn.attr('data-type');
        var id = btn.attr('data-id');
        seajs.use('publish/publish.js',function(publish){
            var cover = UI.cover({
                from : btn[0],
				easyClose: false,
                html : '<div class="container my-publish-cnt"></div>'
            });
            publish.init($(cover.dom).find('.my-publish-cnt'),{
                'active' : type,
                'id' : id,
                'sendFn' : function(){
                    setTimeout(function(){
                        cover.close();
                    },1000);
                }
            });
        });
        return false;
    });

    window.admin.load = function(){
        require.load.apply(require,arguments);
    };
    window.admin.pageList = function(dom,param){
        return new pageList(dom,param);
    };
    window.admin.push = function(url){
        //去除参数中的首个‘/’或‘/admin/’
        var new_url = '/admin/' + (url ? url.replace(/^(\/admin\/|\/)/,'') : '');
        lofox.push.call(lofox,new_url);
    };
    window.admin.formToAjax = function(dom,param){
        return new formToAjax(dom,param);
    };
    window.admin.refresh = function(){
        lofox.refresh();
    };
});

/**
 * ajax交互
 *
 **/
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

function pageListRender(){
	var txt = '';

	if (this.page_cur > 1) {
		txt += '<li><a data-page="prev" href="javascript:void(0)" >上一页</a></li>';
	}else{
		txt += '<li class="disabled"><span>上一页</span></li>';
	}
	var btn_num = 0;
	var start_num = 0;
	if(this.page_num > this.max_page_btn){
		start_num =  this.page_cur - Math.floor(this.max_page_btn/2);
	}
	
	
	start_num = Math.max(start_num,1);
	for(; start_num < this.page_num + 1; start_num++) {
		if(start_num != this.page_cur){
			txt += '<li><a data-page="jump" href="javascript:void(0)">' + start_num + '</a></li>';
		}else{
			txt += '<li class="active"><span>'+ start_num +'</span></li>';
		}
		btn_num++;
		if(btn_num >= this.max_page_btn){
			break;
		}
	}
	if (this.page_num - this.page_cur >= 1) {
		txt += '<li><a data-page="next" href="javascript:void(0)">下一页</a></li>';
	}else{
		txt += '<li class="disabled"><span>下一页</span></li>';
	}
	this.dom.html(txt);
}
function pageList(dom,param){
	var param = param || {};
	var this_page = this;
	this.list_count = param.list_count || 0;
	this.page_cur = param.page_cur || 1;
	this.page_list_num = param.page_list_num || 15;
	this.page_num = Math.ceil(this.list_count / this.page_list_num);
	this.max_page_btn = param.max_page_btn || 50;
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
	pageListRender.call(this);
}
pageList.prototype = {
	'jumpTo' : function(num){
		this.page_cur = num;
		pageListRender.call(this);
		this.jump && this.jump(num);
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
			return formatObj[arguments[1]]||0;
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