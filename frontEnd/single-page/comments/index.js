

define([
  'exports',
  'js/Base',
  'comments/selection',
  'comments/face',
  'js/pagination',
  'js/juicer'
],function(exports,utils,selection,face,pagination,juicer){
    var private_userInfo = null,
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
    var user = {
          username : userInput.username || '',
          email : userInput.email || '',
          blog : userInput.blog || '',
          avatar : userInput.avatar || default_avatar
        },
        screen_name = user.username || '雁过留名',
        nodeUser = utils.query('.l_send_username',this.dom);
    nodeUser.innerHTML = screen_name;
    nodeUser.setAttribute('title',screen_name);
    utils.query('.l_send_avatar img',this.dom).setAttribute('src',user.avatar);
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

    utils.fetch({
      url : '/ajax/comments/add',
      type : 'POST',
      data : {
        cid : data.id,
        content : data.text,
        //如果为登录用户，则不发送用户信息
        user : user,
        reply_for_id : data.reply_for_id
      },
      callback : function(err,data){
        if(!err && data.code && data.code == 200){
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
        }),
        nodeUsername = utils.query('input[name="username"]',pop.dom),
        nodeEmail = utils.query('input[name="email"]',pop.dom),
        nodeBlog = utils.query('input[name="blog"]',pop.dom);
    function confirmFn(){
      var username = nodeUsername.value,
          email = nodeEmail.value,
          blog = nodeBlog.value;
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
      });
    }

    if(user){
      nodeUsername.value = user.username || '';
      nodeEmail.value = user.email || '';
      nodeBlog.value = user.blog || '';
    }
  }
  /**
   * 绑定dom事件
   */
  function bindDomEvent(){
    var me = this,
        nodeGlobal = me.dom,
        nodeTextarea = utils.query('textarea',nodeGlobal),
        inputDelay,
        focusDelay;

    utils.bind(nodeTextarea,'keyup keydown change propertychange input paste',function(){
      clearTimeout(inputDelay);
      inputDelay = setTimeout(function(){
        var newVal = nodeTextarea.value.trim();
        //校验字符是否发生改变
        if(newVal == me.text){
          return;
        }
        me.text = newVal;
        //触发自定义事件“change”
        EMIT.call(me,'change');
      },80);
    }).bind('focus',function(){
        clearTimeout(focusDelay);
        utils.addClass(nodeGlobal,'l_sendBox_active');
    }).bind('focusout blur',function(){
      clearTimeout(focusDelay);
      focusDelay = setTimeout(function(){
        if(me.text.length == 0){
          utils.removeClass(nodeGlobal,'l_sendBox_active');
        }
      },200);
    });

    utils.bind(nodeGlobal,'click','.l_send_placeholder',function(){
      nodeTextarea.focus();
    }).bind('click','.set-userinfo',function(e){
      askForUserInfo.call(me);
    }).bind('click','.l_send_submit',function(){
      me.submit();
    }).bind('click','.l_send_face',function(){
      var offset = utils.offset(this);
      nodeTextarea.focus();
      face({
        top: offset.top,
        left: offset.left,
        onSelect: function(title){
          selection.insertTxt(nodeTextarea,':' + title + ':');
          utils.trigger(nodeTextarea,'change');
        }
      });
    });
  }
  //绑定对象自定义事件
  function bindCustomEvent(){
    var me = this,
        nodeGlobal = this.dom,
        nodeTextarea = utils.query('textarea',nodeGlobal),
        nodeCount = utils.query('.l_send_count',nodeGlobal),
        nodeCountRest = utils.query('b',nodeCount);

    //监听字符变化事件
    this.on('change',function (){
      var length = nodeTextarea.value.length,
          rest_length = me.limit - length,
          show_txt = rest_length;
      if(length > 2 * me.limit/3){
        nodeCount.style.display = 'block';
        if(rest_length < 0){
          show_txt = '<font color="#f50">' + Math.abs(rest_length) + '</font>';
        }
        nodeCountRest.innerHTML = show_txt;
      }else{
        nodeCount.style.display = 'none';
      }
    }).on('login',function(user){
      //设置用户信息
      setUserInfoToUI.call(me,user);
      private_userInfo = user;
    }).on('sendToServiceError',function(){
      UI.prompt('网络出错，没发成功！');
    }).on('sendToServiceSuccess',function(){
      nodeTextarea.value = '';
      utils.trigger(nodeTextarea,'change');
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
    this.limit = 500;
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
      utils.query('textarea',this.dom).focus();
    }
  }
  sendBox.prototype = {
    on: ON,
    submit: function(){
      var me = this,
          nodeTextarea = utils.query('textarea',this.dom);

      nodeTextarea.focus();
      if(this.isSubmitting){
        return;
      }else if(this.text.length == 0){
        UI.prompt('你丫倒写点东西啊！',null);
      }else if(this.text.length > 500){
        UI.prompt('这是要刷屏的节奏么！',null);
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
        utils.query('.l_com_list_cnt',me.dom).innerHTML = noData_tpl;
        return;
      }

      var hash_match = (location.hash || '').match(/#comments-(.+)/);

      var html = juicer(item_tpl,data);
      utils.query('.l_com_list_cnt',me.dom).innerHTML = html;

      if(hash_match){
        var dom = utils.query('.l_com_item[data-id="' + hash_match[1] + '"]',me.dom);
        setTimeout(function(){
          me.scrollTo(dom);
          utils.addClass(dom,'l_com_item_ani-active');
        },500);
      }
      if(me.total == 0){
        utils.query('.l_com_list_cnt',me.dom).innerHTML = noData_tpl;
      }else{
        //分页组件
        var page = new pagination(utils.query('.l_com_list_pagination',me.dom),{
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
            utils.query('.l_com_list_cnt',me.dom).innerHTML = html;
          });
        };
      }
    });
    utils.bind(me.dom,'click','.btn-reply',function(){
      var item = utils.parents(this,'.l_com_item'),
          reply_for = item.getAttribute('data-username'),
          pop = UI.pop({
            title: '回复：' + reply_for,
            mask: true,
            easyClose: false,
            from: 'top',
          }),
          send = new sendBox(pop.cntDom,me.cid,{
            focus: true,
            reply_for_id : item.getAttribute('data-id'),
            onBeforeSend : function(text){
              return '@' + reply_for + ' ' + text;
            }
          });
      utils.css(utils.query('.UI_pop_cpt',pop.dom),{
        border: 'none'
      });
      send.on('sendToServiceSuccess',function(item){
        pop.close();
        me.addItem(item);
      });
    });
  }
  list.prototype.scrollTo = function(dom){
    utils.query('body').scrollTop = utils.offset(dom).top - 70;
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
    var node_item = utils.createDom(html),
        node_list_cnt = utils.query('.l_com_list_cnt',this.dom);
    node_list_cnt.insertBefore(node_item, node_list_cnt.firstChild);
    utils.addClass(node_item,'l_com_item_ani-insert');
    var nodeNoData = utils.query('.l_com_list_noData',this.dom);
    nodeNoData && (nodeNoData.style.display = "none");
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
            item.time = utils.parseTime(item.time,"{h}:{ii} {y}-{m}-{d}");
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

    this.sendBox = new sendBox(utils.query('.l_com_sendBox',this.dom),id,param);
    this.list = new list(utils.query('.l_com_list',this.dom),id,param);
    this.sendBox.on('sendToServiceSuccess',function(item){
      me.list.addItem(item);
    });
  };
});
