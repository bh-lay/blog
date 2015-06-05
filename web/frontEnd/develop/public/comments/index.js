

define(function(require,exports){
	var mirror = require('public/comments/mirror'),
	    selection = require('public/comments/selection'),
      face = require('public/comments/face'),
	    pagination = require('util/pagination');
	var noData_tpl = '<div class="l_com_list_noData">来的真早，快抢沙发！</div>';
  var default_avatar = 'http://layasset.qiniudn.com/user/default.jpg',
      private_userInfo = null,
      baseTpl = ['<div class="l_comments">',
		'<div class="l_com_sendBox"></div>',
		'<div class="l_com_list">',
		'</div>',
	'</div>'].join('');
	
	var sendBox_tpl = ['<div class="l_sendBox" spellcheck="false">',
      '<div class="l_send_side">',
        '<div class="l_send_avatar"><img src="" onerror="gravatar_error_fn(this)"/></div>',
        '<a href="javascript:void(0)" class="l_send_username">报上名来</a>',
      '</div>',
		'<div class="l_sendBox_main">',
			'<div class="l_send_textarea">',
				'<textarea name="content"></textarea>',
				'<div class="l_send_placeholder">评论屌一点，BUG少一点！</div>',
			'</div>',
			'<div class="l_send_footer">',
				'<div class="l_send_footer_left">',
					'<a href="javascript:void(0)" title="插入表情" class="l_send_face"><span class="l-icon l-icon-face"></span></a>',
					'<div class="l_send_count"><b>500</b><i>/</i><span>500</span></div>',
				'</div>',
				'<div class="l_send_footer_right">',
					'<a href="javascript:void(0)" class="l_send_submit">发布</a>',
				'</div>',
			'</div>',
		'</div>',
	'</div>'].join('');
	var user_tpl = ['<div class="l_sendBox_user">',
        '<input type="text" autocomplete="off" name="username" placeholder="昵称"/>',
        '<input type="text" autocomplete="off" name="email" placeholder="xxx@qq.cn"/>',
        '<input type="text" autocomplete="off" name="blog" placeholder="xxx.me"/>',
        '<p>邮箱仅用于<a href="http://en.gravatar.com/" title="全球认可的大头贴">gravatar</a>头像，和与您沟通！</p>',
    '</div>'].join('');
	var list_tpl = ['<div>',
		'<div class="l_com_list_cnt"><div class="l-loading-panel"><span class="l-loading"></span><p>正在加载评论内容</p></div></div>',
		'<div class="l_com_list_pagination"></div>',
	'</div>'].join('');
	
	var item_tpl = ['{@each list as it}',
		'<div class="l_com_item" data-uid="${it.uid}" data-id="${it._id}" data-cid="${it.cid}">',
			'<div class="l_com_item_main">',
				'<div class="l_com_item_caption">{@if it.user.blog}<a href="${it.user.blog}">${it.user.username}</a>{@else}${it.user.username}{@/if} </div>',
				'<div class="l_com_item_content">$${it.content}</div>',
				'<div class="l_com_item_footer">',
					'<div class="time">${it.time}</div>',
					'<a href="javascript:void(0)" class="btn-reply">回复</a>',
				'</div>',
			'</div>',
			'<div class="l_com_item_avatar">',
				'<img src="{@if it.user.avatar}${it.user.avatar}{@else}' + default_avatar + '{@/if}" onerror="gravatar_error_fn(this)"/>',
			'</div>',
		'</div>',
	'{@/each}'].join('');
	
	/**
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
	function parseTime(time,format){
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
		
		var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g,function(result,key){
			var value = formatObj[key];
			if(result.length > 3 && value < 10){
				value = '0' + value;
			}
			return value || 0;
		});
		return time_str;
	}
	/**
	 * 格式化网址
	 *
	 */
	function parseUrl(input){
		var output = null;
		//是否符合网址规范
		if(typeof(input) == 'string' && input.match(/[\w-]+\.\w{2,4}/) ){
		
			//补全协议
      output = input.match(/^http(?:s|)\:\/\//) ? input : ('http://' + input);
		}
		return output;
	}
	
	//处理自定义事件
	function ON(eventName,callback){
		this._events = this._events || {};
		//事件堆无该事件，创建一个事件堆
		if(!this._events[eventName]){
			this._events[eventName] = [];
		}
		this._events[eventName].push(callback);
		//提供链式调用的支持
		return this;
	}
	function EMIT(eventName,args){
		this._events = this._events || {};
		//事件堆无该事件，结束运行
		if(!this._events[eventName]){
			return
		}
		for(var i=0,total=this._events[eventName].length;i<total;i++){
			this._events[eventName][i].apply(this.event_global || this,args);
		}
	}
	
	
	/**
	 * 设置用户信息
	 *
	 */
	function setUserInfoToUI(userInput){
    userInput = userInput || {};
		var $allDom = $(this.dom);
		var user = {
      username : userInput.username || '',
			email : userInput.email || '',
			blog : userInput.blog || '',
			avatar : userInput.avatar || default_avatar
		}
    var screen_name = user.username || '雁过留名';
		$allDom.find('.l_send_username').html(screen_name).attr('title',screen_name);
		$allDom.find('.l_send_avatar img').attr('src',user.avatar);
	}
    
  /**
   * 转换emoji表情
   */
  function strToEmoji(str){
    return str.replace(/\:((\w|\-)+)\:/g,'<span class="emoji s_$1"></span>');
  }
  //占用全局方法
  window.gravatar_error_fn = function(elem){
    if(elem.src.indexOf('www.gravatar.com') > -1){
      //若gravatar官网请求失败，使用多说镜像
      elem.src = elem.src.replace('www.gravatar.com','gravatar.duoshuo.com');
    }else if(elem.src.indexOf('gravatar.duoshuo.com') > -1){
      //若多说镜像失败，使用默认头像
      elem.src = default_avatar;
    }
    //其余情况均不处理（已是默认头像）
  }
  
	/**
	 * 发送评论
	 *
	 */
	function sendComment(data,callback){
		var user;
		if(data.user.id){
			user = null;
		}else if(data.user && data.user.username.length > 0){
			user = data.user;
		}else{
			callback && callback('未登录');
			return
		}
		
		$.ajax({
			url : '/ajax/comments/add',
			type : 'POST',
			data : {
				cid : data.id,
				content : data.text,
				//如果为登录用户，则不发送用户信息
				user : user,
        reply_for_id : data.reply_for_id
			},
			success : function(data){
				if(data.code && data.code == 200){
					callback && callback(null,data.data);
				}else{
					callback && callback('fail');
				}
			}
		});
	}
    /**
     * 询问用户信息
     *
     */
    function askForUserInfo(){
        var me = this;
        //用户信息
        var user = private_userInfo;
        
        var pop = UI.pop({
          title : '雁过留名',
          width : 300,
          html : user_tpl,
          easyClose : false,
          mask: true,
          confirm : function (){
            var username = $username.val();
            var email = $email.val();
            var blog = $blog.val();
            if(username.length < 1){
                UI.prompt('大哥，告诉我你叫什么呗！',null,{
                  from : 'top'
                });
                return false;
            }
            if(blog.length && !parseUrl(blog)){
                UI.prompt('博客地址是对的么？',null,{
                  from: 'top'
                });
                return false;
            }
            L.user.setLocalUser({
                username: username,
                email: email,
                blog: blog
            });
            //更新用户信息
            L.user.info(function(err,user){
                if(err){
                    private_userInfo = null;
                }else if(user){
                    private_userInfo = user;
                }
                EMIT.call(me,'login',[private_userInfo]);
            },false);
          }
        });
        
        var $elem = $(pop.dom),
            $username = $elem.find('input[name="username"]'),
            $email = $elem.find('input[name="email"]'),
            $blog = $elem.find('input[name="blog"]');
        
        if(user){
            $username.val(user.username || '');
            $email.val(user.email || '');
            $blog.val(user.blog || '');
        }
    }
	/**
	 * 绑定dom事件
	 */
	function bindDomEvent(){
		
      var me = this,
          $allDom = $(this.dom),
          $textarea = $allDom.find('textarea'),
          inputDelay,
          focusDelay,
          isSubmitting = false;
      $textarea.on('keyup keydown change propertychange input paste',function(){
          clearTimeout(inputDelay);
          inputDelay = setTimeout(function(){
              var newVal = $.trim($textarea.val());
              //校验字符是否发生改变
              if(newVal == me.text){
                  return
              }
              me.text = newVal;
              //触发自定义事件“change”
              EMIT.call(me,'change');
          },80);
      }).on('focus',function(){
          clearTimeout(focusDelay);
          $allDom.addClass('l_sendBox_active');
      }).on('focusout',function(){
          clearTimeout(focusDelay);
          focusDelay = setTimeout(function(){
            if(me.text.length == 0){
              $allDom.removeClass('l_sendBox_active');
            }
          },200);
      });

      $allDom.on('click','.l_send_placeholder',function(){
        $textarea.focus();
      }).on('click','.l_send_username,.l_send_avatar',function(e){
        askForUserInfo.call(me)
      }).on('click','.l_send_submit',function(){
        $textarea.focus();
        if(isSubmitting){
          return
        }else if(me.text.length == 0){
          UI.prompt('你丫倒写点东西啊！',null,{
              top: $(this).offset().top + 40,
              from: $(this)[0]
          });
        }else if(me.text.length > 500){
          UI.prompt('这是要刷屏的节奏么！',null,{
              top: $(this).offset().top + 40,
              from: $(this)[0]
          });
        }else if(private_userInfo){
          var text = me.onBeforeSend ? (me.onBeforeSend(me.text) || me.text) : me.text;
          isSubmitting = true;
          sendComment({
            id: me.id,
            text: text,
            user: private_userInfo,
            reply_for_id : me.reply_for_id || null
          },function(err,item){
            isSubmitting = false;
            if(err){
                EMIT.call(me,'sendToServiceError');
            }else{
                EMIT.call(me,'sendToServicesuccess',[item]);
            }
          });
        }else{
          askForUserInfo.call(me);
        }
      }).on('click','.l_send_face',function(){
        var offset = $(this).offset();
        $textarea.focus();
        face({
          top: offset.top,
          left: offset.left,
          onSelect: function(title){
            $textarea.insertTxt(':' + title + ':').trigger('change');
          }
        });
      });
    }
	//绑定对象自定义事件
	function bindCustomEvent(){
		var me = this;
		var $allDom = $(this.dom);
		var $textarea = $allDom.find('textarea');
        var $count = $allDom.find('.l_send_count');
		var $countRest = $count.find('b');
		var text_mirror = mirror($textarea);
		
		//监听字符变化事件
		this.on('change',function (){
			var height = text_mirror.refresh().realHeight + 20;
			var overflow = 'hidden';
			if(height < 80){
				height = 80;
			}else if(height > 200){
				height = 200;
				overflow = 'visible';
			}
			$textarea.css({
				height: height,
				overflow: overflow
			});
			
			var length = $textarea.val().length;
			var rest_length = me.limit - length;
			var show_txt = rest_length;
      if(length > 200){
          $count.show();
          if(rest_length < 0){
      show_txt = '<font color="#f50">' + Math.abs(rest_length) + '</font>';
          }
          $countRest.html(show_txt);
      }else{
          $count.hide();
      }
		}).on('login',function(user){
			//设置用户信息
			setUserInfoToUI.call(me,user);
			private_userInfo = user;
		}).on('sendToServiceError',function(){
			UI.prompt('网络出错，没发成功！');
		}).on('sendToServicesuccess',function(){
			$textarea.val('').trigger('change');
			UI.prompt('发布成功！');
		});
		
	}
	/**
	 * sendBox类
	 */
	function sendBox(dom,id,param){
		var me = this;
		var param = param || {};
		this.id = id;
    this.reply_for_id = param.reply_for_id || null;
		this.dom = $(sendBox_tpl)[0];
		this.text = '';
		this.userDefine = {};
    this.onBeforeSend = param.onBeforeSend || null;
		$(dom).html($(this.dom));
		
		//绑定dom事件
		bindDomEvent.call(this);
		//绑定对象自定义事件
		bindCustomEvent.call(this);
		L.user.info(function(err,user){
			if(err){
				private_userInfo = null;
			}else if(user){
				private_userInfo = user;
			}
			setUserInfoToUI.call(me,user);
		});
    if(param.focus){
        $(this.dom).find('textarea').focus();
    }
	}
	sendBox.prototype = {
		on: ON
	};
	
	
  
    
	/**
	 * 列表类
	 *
	 */
	function list(dom,cid,param){
    var me = this;
    param = param || {};
    //comment id
    this.cid = cid;
    this.list = [];
    this.skip = 0;
    this.limit = param.list_num || 15;
    this.total = 0;
    this._status = 'normal';
    this.dom = $(list_tpl)[0];

    $(dom).html(this.dom);

    this.getData(0,function(err,data){
      if(err){
        $(me.dom).find('.l_com_list_cnt').html(noData_tpl);
        return
      }
      var html = juicer(item_tpl,data);
      $(me.dom).find('.l_com_list_cnt').html(html);
      if(me.total == 0){
        $(me.dom).find('.l_com_list_cnt').prepend(noData_tpl);
      }else{
        //分页组件
        var page = new pagination($(dom).find('.l_com_list_pagination'),{
            list_count : me.total,
            page_cur : 0,
            page_list_num : me.limit,
            max_page_btn : 6
        });
        page.jump = function(num){
          $('html,body').animate({
            scrollTop: $(me.dom).offset().top - 70
          },100);
          me.getData((num-1)*me.limit,function(err,data){
            if(err){
              console.log('error');
              return
            }
            var html = juicer(item_tpl,data);
            $(me.dom).find('.l_com_list_cnt').html(html);
          });
        };
      }
    });
    $(me.dom).on('click','.btn-reply',function(){
      var item = $(this).parents('.l_com_item'),
          reply_for = item.find('.l_com_item_caption').text(),
          pop = UI.pop({
            title: '回复：' + reply_for,
            mask: true,
            easyClose: false,
            from: 'top',
          }),
          send = new sendBox(pop.cntDom,me.cid,{
            focus: true,
            reply_for_id : item.attr('data-id'),
            onBeforeSend : function(text){
              return '@' + reply_for + ' ' + text;
            }
          });
      $(pop.dom).find('.UI_pop_cpt').css('border','none');
      send.on('sendToServicesuccess',function(item){
        pop.close();
        me.addItem(item);
      });
    });
	}
	list.prototype.addItem = function(item){
      item.time = '刚刚';
      item.content = strToEmoji(item.content);
      if(item.user && item.user.blog){
        item.user.blog = parseUrl(item.user.blog);
      }
      var html = juicer(item_tpl,{
        list: [item]
      });
      var $item = $(html);
      $(this.dom).find('.l_com_list_cnt').prepend($item);
      $item.addClass('l_com_item_ani-insert');
      $(this.dom).find('.l_com_list_noData').fadeOut(100);
	};
	list.prototype.getData = function(skip,callback){
    if(this._status == 'loading'){
        return;
    }
    var me = this;
    this._status = 'loading';
    $.ajax({
      url: '/ajax/comments/list',
      data: {
        cid: this.cid,
        skip: skip || 0,
        limit: this.limit || 10
      },
      success: function(data){
        if(data.code == 500){
          callback && callback(500);
        }
        me._status = 'loaded';
        if(data.code && data.code == 200){
          var DATA = data.data;
          me.total = DATA.count;
          me.list.concat(DATA.list);

          for(var i=0,total=DATA.list.length;i<total;i++){
            DATA.list[i].time = parseTime(DATA.list[i].time,"{h}:{ii} {y}-{m}-{d}");
            DATA.list[i].content = strToEmoji(DATA.list[i].content);
            if(DATA.list[i].user.blog){
              DATA.list[i].user.blog = parseUrl(DATA.list[i].user.blog);
            }
          }
          callback && callback(null,DATA);
        }
      }
    });
	};
	
	exports.sendBox = sendBox;
	exports.list = list;
	exports.init = function(dom,id,param){
		var me = this;
		this.dom = $(baseTpl)[0];
		this.id = id;
		$(dom).html($(this.dom));
		
		this.sendBox = new sendBox($(this.dom).find('.l_com_sendBox')[0],id,param);
		this.list = new list($(this.dom).find('.l_com_list')[0],id,param);
		this.sendBox.on('sendToServicesuccess',function(item){
			me.list.addItem(item);
		});
	};
});