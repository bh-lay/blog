import "./links.less";

$('.add_one').click(function(){
  var pop = UI.pop({
    width: 550,
    mask: true,
    title: '我也要上榜',
    html: $('#post_tpl').html(),
    confirm : function(){
      var $elem = $(pop.cntDom),
          data = getData($elem),
          err = null;
      if(data.title.length < 1){
        err = '咋不告诉我你叫啥捏！';
      }else if(data.url.length < 5 ){
        err = '博客地址我不校验，但你也不能糊弄我啊！';
      }else if(data.discription.length < 10){
        err = '介绍下自己，逼格噌噌噌往上飙啊有木有！';
      }
      if(err){
        UI.prompt(err);
      }else{
        var prompt = UI.prompt('正在提交' , 0 , {
          mask: true
        });
        sendData(data , function(){
          prompt.tips('搞定，等待审核吧！');
          setTimeout(function(){
            pop.close();
          },2000);
        },function(){
          prompt.tips('保存失败，咋回事，不会是出 BUG 了吧！');
        });
      }
      return false;
    }
  });
});
function getData($elem){
  return {
    title : $elem.find('input[name="title"]').val(),
    url : $elem.find('input[name="url"]').val(),
    github_username : $elem.find('input[name="github_username"]').val(),
    discription : $elem.find('textarea[name="discription"]').val()
  };
}

function sendData(data, successFn,errorFn){
  $.ajax({
    url : '/ajax/links/post',
    data : data,
    success : function(res){
      if(res && res.code == 200){
        successFn && successFn();
      }else {
        errorFn && errorFn();
      }
    },
    error : function(){
      errorFn && errorFn();
    }
  });
}

//打开新窗口（附加滚动条效果）
function openWindow(url){
    var win = window.open('about:blank'),
        page = [
          '<body style="margin:0;padding:0;">',
          '<div style="position:absolute;width:100%;top:0,left:0;background:#eee;overflow:hidden">',
            '<div id="bar" style="width:0;height:6px;background:#00ab57;transition:.8s"></div>',
            '</div>',
            '<script>',
            'var elem_bar = document.getElementById("bar"),w=0,delay;',
            'function setWidth(inputW){',
            'w = inputW || (w + (100 - w)/3);',
            'elem_bar.style.width = w + "%";',
              'console.log(inputW,w);',
            'w>99&&clearInterval(delay)',
            '}',
            'setTimeout(setWidth,10);',
            'delay=setInterval(setWidth,1000);',
            '</script>',
          '</body'
        ].join('');
    function setUrl(url){
        win.window.setWidth && win.window.setWidth(100);
        setTimeout(function(){
          win.window.location.href = url;
        },800);
    }
    win.document.write(page);
    url && setTimeout(function(){
      setUrl(url);
    },800);
    return {
        setUrl: setUrl,
        close: function(){
            win.close();
        }
    };
}
$('body').on('click','.guy-item a',function(){
  var url = $(this).attr('href'),
      win = openWindow(url);
  return false;
});
