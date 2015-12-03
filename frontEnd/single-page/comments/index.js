

define(function(require,exports){
  var selection = require('comments/selection'),
      face = require('comments/face'),
      pagination = require('js/pagination'),

      private_userInfo = null,
      default_avatar = __uri('/images/default.jpg'),

      noData_tpl = '<div class="l_com_list_noData">来的真早，快抢沙发！</div>',
      baseTpl = __inline('tpl/comments/base.html'),
      sendBox_tpl = __inline('tpl/comments/sendBox.html'),
      user_tpl = __inline('tpl/comments/user.html'),
      list_tpl = __inline('tpl/comments/list.html'),
      item_tpl = __inline('tpl/comments/item.html');
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
      return;
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
    var $allDom = $(this.dom),
        user = {
          username : userInput.username || '',
          email : userInput.email || '',
          blog : userInput.blog || '',
          avatar : userInput.avatar || default_avatar
        },
        screen_name = user.username || '雁过留名';
    $allDom.find('.l_send_username').html(screen_name).attr('title',screen_name);
    $allDom.find('.l_send_avatar img').attr('src',user.avatar);
  }

  /**
   * 转换emoji表情
   */
  function strToEmoji(str){
    return str.replace(/\:((\w|\-)+)\:/g,'<span class="emoji s_$1"></span>');
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
      return;
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
  function askForUserInfo(callback){
    var me = this,
        //用户信息
        user = private_userInfo,
        pop = UI.pop({
          title : '雁过留名',
          width : 300,
          html : user_tpl,
          easyClose : false,
          mask: true,
          confirm : confirmFn
        });
    function confirmFn(){
      var username = $username.val(),
          email = $email.val(),
          blog = $blog.val();
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
        callback && callback();
      },false);
    }
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
        $allDom = me.dom,
        $textarea = Sizzle('textarea',$allDom)[0],
        inputDelay,
        focusDelay;

    $textarea.on('keyup keydown change propertychange input paste',function(){
      clearTimeout(inputDelay);
      inputDelay = setTimeout(function(){
        var newVal = $.trim($textarea.val());
        //校验字符是否发生改变
        if(newVal == me.text){
          return;
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
      askForUserInfo.call(me);
    }).on('click','.l_send_submit',function(){
      me.submit();
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
    var me = this,
        $allDom = this.dom,
        $textarea = Sizzle('textarea',$allDom)[0],
        $count = Sizzle('.l_send_count',$allDom)[0],
        $countRest = Sizzle('b',$count)[0];

    //监听字符变化事件
    this.on('change',function (){
      var length = $textarea.val().length,
          rest_length = me.limit - length,
          show_txt = rest_length;
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
    }).on('sendToServiceSuccess',function(){
      $textarea.val('').trigger('change');
      UI.prompt('发布成功！');
    });
  }
  /**
   * sendBox类
   */
  function sendBox(dom,id,param){
    var me = this,
        param = param || {};
    this.id = id;
    this.reply_for_id = param.reply_for_id || null;
    this.isSubmitting = false;
    this.dom = utils.createDom(sendBox_tpl);
    this.text = '';
    this.userDefine = {};
    this.onBeforeSend = param.onBeforeSend || null;
    dom.innerHTML = '';
    dom.appendChild(this.dom);

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
      Sizzle('textarea',this.dom)[0].focus();
    }
  }
  sendBox.prototype = {
    on: ON,
    submit: function(){
      var me = this,
          $textarea = $(this.dom).find('textarea'),
          $btn = $(this.dom).find('.l_send_submit');

      $textarea.focus();
      if(this.isSubmitting){
        return;
      }else if(this.text.length == 0){
        UI.prompt('你丫倒写点东西啊！',null,{
          from: $btn[0]
        });
      }else if(this.text.length > 500){
        UI.prompt('这是要刷屏的节奏么！',null,{
          from: $btn[0]
        });
      }else if(private_userInfo){
        var text = this.onBeforeSend ? (this.onBeforeSend(me.text) || me.text) : me.text;
        me.isSubmitting = true;
        sendComment({
          id: me.id,
          text: text,
          user: private_userInfo,
          reply_for_id : me.reply_for_id || null
        },function(err,item){
          me.isSubmitting = false;
          if(err){
              EMIT.call(me,'sendToServiceError');
          }else{
              EMIT.call(me,'sendToServiceSuccess',[item]);
          }
        });
      }else{
        askForUserInfo.call(me,function(){
          me.submit();
        });
      }
    }
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

    this.dom = utils.createDom(list_tpl);

    dom.innerHTML = '';
    dom.appendChild(this.dom);

    this.getData(0,function(err,data){
      if(err){
        $(me.dom).find('.l_com_list_cnt').html(noData_tpl);
        return;
      }

      var hash_match = (location.hash || '').match(/#comments-(.+)/);

      var html = juicer(item_tpl,data);
      Sizzle('.l_com_list_cnt',me.dom)[0].innerHTML = html;

      if(hash_match){
        var dom = $(me.dom).find('.l_com_item[data-id=' + hash_match[1] + ']');
        setTimeout(function(){
          me.scrollTo(dom,1200,function(){
            dom.addClass('l_com_item_ani-active');
          });
        },500);
      }
      if(me.total == 0){
        $(me.dom).find('.l_com_list_cnt').prepend(noData_tpl);
      }else{
        //分页组件
        var page = new pagination(Sizzle('.l_com_list_pagination',me.dom)[0],{
            list_count : me.total,
            page_cur : 0,
            page_list_num : me.limit,
            max_page_btn : 6
        });
        page.jump = function(num){
          me.scrollTo(me.dom);
          me.getData((num-1)*me.limit,function(err,data){
            if(err){
              console.log('error');
              return;
            }
            var html = juicer(item_tpl,data);
            Sizzle('.l_com_list_cnt',me.dom)[0].innerHTML = html;
          });
        };
      }
    });
    me.dom.on('click','.btn-reply',function(){
      var item = $(this).parents('.l_com_item'),
          reply_for = item.attr('data-username'),
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
      send.on('sendToServiceSuccess',function(item){
        pop.close();
        me.addItem(item);
      });
    });
  }
  list.prototype.scrollTo = function(dom,time,fn){
    Sizzle('body')[0].scrollTop = utils.offset(dom).top - 70;
  };
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
    utils.fetch({
      url: '/ajax/comments/list',
      data: {
        cid: this.cid,
        skip: skip || 0,
        limit: this.limit || 10
      },
      callback: function(err,data){
        me._status = 'loaded';
        if(err || data.code == 500){
          callback && callback(500);
        }else if(data.code && data.code == 200){
          var DATA = data.data;
          me.total = DATA.count;
          me.list = DATA.list;
          me.list.forEach(function(item){
            item.time = L.parseTime(item.time,"{h}:{ii} {y}-{m}-{d}");
            item.content = strToEmoji(item.content);
            //若无头像，使用默认头像
            item.user.avatar =  item.user.avatar || default_avatar;
            if(item.user.blog){
              item.user.blog = parseUrl(item.user.blog);
            }
          });
          callback && callback(null,DATA);
        }
      }
    });
  };

  exports.sendBox = sendBox;
  exports.list = list;
  exports.init = function(dom,id,param){
    var me = this;
    this.dom = utils.createDom(baseTpl);
    this.id = id;
    dom.innerHTML = '';
    dom.appendChild(this.dom);

    this.sendBox = new sendBox(Sizzle('.l_com_sendBox',this.dom)[0],id,param);
    this.list = new list(Sizzle('.l_com_list',this.dom)[0],id,param);
    this.sendBox.on('sendToServiceSuccess',function(item){
      me.list.addItem(item);
    });
  };
});
