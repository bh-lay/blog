
  var chatList = [
    {
      from: 'system',
      text: '[剧中人]已加入群聊'
    },
    {
      from: 'a',
      text: '新人做下自我介绍'
    },
    {
      from: 'me',
      text: '大家好，我是剧中人，大数据研究院的同学'
    },
    {
      from: 'me',
      text: '前几天一不小心在大家朋友圈刷屏的「中国声谷看雪景」就是我的作品'
    },
    {
      from: 'b',
      text: '原来是你拍的啊，幸会幸会'
    },
    {
      from: 'c',
      text: '作品挺美的，赞 👍'
    },
    {
      from: 'a',
      text: '进群有啥事？'
    },
    {
      from: 'me',
      text: '最近公司不是搞了个“光影随心”摄影比赛么，我也报名参加了'
    },
    {
      from: 'b',
      text: '懂了，你是来找我们刷票的'
    },
    {
      from: 'c',
      // text: '先别动，看看他接下来说什么',
      image: __uri('chat-image/despacito.png'),
      sizePercent: 1
    },
    {
      from: 'me',
      text: '刷票可不敢，会被公司开除的'
    },
    {
      from: 'me',
      text: '就是活动太过热闹，作品多到爆，想让大家抽空看一下我的作品\n觉得不错的话麻烦投我一票'
    },
    {
      from: 'b',
      text: '还说不是刷票的'
    },
    {
      from: 'c',
      // text: '就是就是'
      image: __uri('chat-image/yes.jpg'),
      sizePercent: 1
    },
    {
      from: 'a',
      text: '看来你挺用心的，说吧要怎么投票？'
    },
    {
      from: 'me',
      text: '多谢啦，我的作品一共有两份，一份是「旅行随拍」里面是我17年旅行时拍摄的照片，另一份叫「中国声谷看雪景」是上次全景的同名作品'
    },
    {
      from: 'me',
      image: __uri('chat-image/screenshot.jpg'),
      sizePercent: .5
    },
    {
      from: 'me',
      text: '投票方式就是点赞啦，每个人有十个点赞的机会，剩余的赞可以支持下其他小伙伴的作品呦'
    },
    {
      from: 'c',
      text: '活动地址在哪儿呢？'
    },
    {
      from: 'me',
      text: '哦，忘发了，这个链接里有进入投票页面方式！'
    },
    {
      from: 'me',
      text: '多谢大伙儿了',
      link: 'javascript:showdetail()'
    },
    {
      from: 'a',
      text: '6666666666'
    }
  ];
  var user = {
      me: {
        nickname: '剧中人（新成员）',
        avatar: __uri('avatar/avatar-lay.jpg')
      },
      a: {
        nickname: '浅尝辄止（群主）',
        avatar: __uri('avatar/a.jpg')
      },
      b: {
        nickname: '树上的骷髅（狗管理）',
        avatar: __uri('avatar/b.jpeg')
      },
      c: {
        nickname: '一页（萌新担当）',
        avatar: __uri('avatar/c.jpg')
      }
  };
  var bigPic = [
    __uri('images/1.jpg'),
    __uri('images/2.jpg'),
    __uri('images/3.jpg'),
    __uri('images/4.jpg'),
    __uri('images/5.jpg'),
    __uri('images/6.jpg'),
    __uri('images/7.jpg'),
    __uri('images/8.jpg'),
    __uri('images/9.jpg')
  ];
  function typed(text, stepCallback, onEnd){
    var sliceLength = 0;
    function step(){
      sliceLength++;
      stepCallback(text.slice(0, sliceLength))
      if (sliceLength >= text.length) {
        setTimeout(onEnd, 700)
      } else{
        setTimeout(step, 140)
      }
    }
    setTimeout(step, 1000)
  }

  var app = new Vue({
    el: '#app',
    data: {
      scrollTop: 0,
      typedText: '',
      isForbiddenOverflow: true,
      // 是否正在输入
      isTyping: false,
      
      isShowShare: false,
      randomPicUrl: '',

      user: user,
      chatList: [
        {
          from: 'a',
          text: '有新人加群了，我去处理一下'
        },
        {
          from: 'c',
          text: '快拉进来看看！'
        }
      ]
    },
    methods: {
      scrollToEnd: function () {
        var nodeOuter = this.$refs['chat-window'];
        var nodeInner = this.$refs['chat-list'];
        this.$nextTick(function(){
          this.scrollTop = Math.max(nodeInner.clientHeight - nodeOuter.clientHeight, 0);
        });
      },
      setNormalScroll: function () {
        var nodeOuter = this.$refs['chat-window'];
        var nodeInner = this.$refs['chat-list'];
        setTimeout(function(){
          nodeOuter.classList.add('normal-scroll')
          nodeOuter.scrollTop = nodeInner.clientHeight - nodeOuter.clientHeight;
        }, 500);
      },
      startChat: function () {
        var me = this;
        function chatItem(){
          if(chatList.length){
            // typed
            var newItem = chatList.shift();
            function sendMsg(){
              me.chatList.push(newItem);
              me.scrollToEnd();
              // 进入下一次聊天
              chatItem()
            }
            if(newItem.from === 'me' && !!newItem.text) {
              typed(newItem.text, function(text){
                me.typedText = text;
                me.isTyping = true;
              }, function () {
                me.typedText = '';
                me.isTyping = false;
                sendMsg();
              })
            } else {
              setTimeout(sendMsg, 1500);
            }
          } else {
            me.isForbiddenOverflow = false;
            me.setNormalScroll()
          }
        }
        chatItem();
      },
      showSharePop: function () {
        var randomIndex = Math.round(Math.random() * (bigPic.length - 1));
        this.randomPicUrl = bigPic[randomIndex];
        this.isShowShare = true;
      }
    }
  });

  var mask = document.querySelector('.loading-mask');
  setTimeout(function(){
    mask.classList.add('close');
    setTimeout(function(){
      mask.parentNode.removeChild(mask);
      app.startChat();
    }, 200);
  }, 1200);
  // forbidden wechat scroll
  var overscroll = function(el) {
  el.addEventListener('touchstart', function() {
    var top = el.scrollTop
      , totalScroll = el.scrollHeight
      , currentScroll = top + el.offsetHeight;
    //If we're at the top or the bottom of the containers
    //scroll, push up or down one pixel.
    //
    //this prevents the scroll from "passing through" to
    //the body.
    if(top === 0) {
      el.scrollTop = 1;
    } else if(currentScroll === totalScroll) {
      el.scrollTop = top - 1;
    }
  });
  el.addEventListener('touchmove', function(evt) {
    //if the content is actually scrollable, i.e. the content is long enough
    //that scrolling can occur
    if(el.offsetHeight < el.scrollHeight)
      evt._isScroller = true;
  });
}
overscroll(document.querySelector('.chat-window'));
document.body.addEventListener('touchmove', function(evt) {
  //In this case, the default behavior is scrolling the body, which
  //would result in an overflow.  Since we don't want that, we preventDefault.
  if(!evt._isScroller || app.isForbiddenOverflow) {
    evt.preventDefault();
  }
});
function showdetail(){
  app.showSharePop();
}

// 图片预加载
(function () {
  // 先预加载头像
  for(var i in user){
    new Image().src = user[i].avatar;
  }
  // 再预加载聊天中用到的图片
  setTimeout(function(){
    chatList.forEach(function(item){
      if(item.image){
        new Image().src = item.image;
      }
    });
  }, 1500)
})()