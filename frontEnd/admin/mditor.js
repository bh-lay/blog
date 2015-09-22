/**
 * @author bh-lay
 * 
 * @github https://github.com/bh-lay/mditor
 * @modified 2015-7-12 22:6
 * 
 **/


(function(global,doc,editor_factory,selection_factory,maked_factory){
  var utils = selection_factory(doc),
      maked = maked_factory(),
      mditor = editor_factory(global,doc,utils,maked);
  global.mditor = global.mditor || mditor;
  global.define && define(function(){
    return mditor;
  });
})(window,document,function(window,document,utils,maked){
  var localStorage = window.localStorage || {
    getItem : function(){},
    setItem : function(){}
  };
  
  var editor_tpl = '<div class="mditor_fullScreen"><div class="mditor_input"><textarea></textarea></div><div class="mditor_view"><div class="md_html"></div></div><div class="mditor_toolBar"><a href="javascript:void(0)" title="退出全屏" class="mditor-close">×</a></div></div>',
      mini_tpl = '<div class="mditor-mini"><div class="mditor-mini-bar"><div class="mditor-mini-tab"><a href="javascript:void(0)" title="编辑" class="mditor-btn mditor-btn-edit active"><i class="mditor-icon "></i><span>编辑</span></a><a href="javascript:void(0)" title="预览" class="mditor-btn mditor-btn-preview"><i class="mditor-icon "></i><span>预览</span></a></div><div class="mditor-mini-side"><a href="javascript:void(0)" title="帮助" class="mditor-link mditor-help">help</a><a href="javascript:void(0)" title="全屏" class="mditor-btn mditor-btn-full"><i class="mditor-icon "></i></a></div></div><div class="mditor-mini-preview"></div><div class="mditor-mini-help"><a href="javascript:void(0)" class="mditor-close">×</a><div class="mditor-help-txt"><h3>快捷键</h3><p><b>撤销</b>Ctrl + Z</p><p><b>恢复</b>Ctrl + Y</p><p><b>加粗</b>Ctrl + B</p><p><b>斜体</b>Ctrl + I</p><p><b>链接</b>Ctrl + L</p><p><b>图片</b>Ctrl + G</p><p><b>代码</b>Ctrl + Shift + K</p><p><b>代码块</b>Ctrl + K</p></div></div></div>',
      style_css = '.mditor-icon{display:inline-block;width:15px;height:15px;margin-right:5px;vertical-align:middle;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAPCAYAAABwfkanAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqtJREFUeNrUllmIjWEYx883xjAyGGtjKZQL0mkkuSAiFJncMBcYIs2NZA2RpexTk2WSseRopETCnKLckQuDso7cWHJlG9myc/we/b/T29t3zpkckqd+8513+573fd7/83wTpFKp2P9mhfYnCIJsc2xwDEyEMrgO+/7lYQNznmPTZkm4A4dgJ1xh3ba8nQdBA4/v8B7uWTAipk2HsdDBgozfubEcEauAKTAMDkAX9Z+2dfmCnYI49Ic+UBxBL40PgP22rjDLhkdBNeyAG1AKR2ER3HKi5a7pB1Vy8g1+QHt4aQeFpnCiNv0cPsNy6Cwfvr2DD1ALD9OajrAhsBo2y1ECrsE5qIMnEWvmwAwdcA98gTbwEabCKmiGdc4aO0yJDpnJSkQ3eOOe2LVB0vAktWugQb/LNDbCuWKzZeqPq10ufe6FSvWV6vAJx2873U6jciVKHiv0bpNo0a913qa7a0KV2hvVjikaSSWFq8t56u+qeXG1R8JA730xbXq947e35tRkiPRCjZeHfgu8a0hIe6bdpTBcydhDsjgMF72XjoaV8ErtydJek54nlMyhrbGbyqfqFDj12nR4WRubCeNhmsat74wO5NsC6CjpmJ1XhMNIVyoXQtuq/AjlYbq3sLfNII9i53tR5NbpIxJ6hZLJkmoWvNXVXFCkY172h9VjMUyAtXBbV1mt6mE3c1LyqdUG58vvJn6fhQ2tCLBVsaGsqw+rhxXuFmX4YFiiDTeqGtTleOFuVYItcBOOwy6neliZHAd3Tc9eDllJe9yKkteiOemS90jyqJfDB3re95xks2NwCWYr8m6dfgHb4aq3pqckYjfw1ckL1zpJIoHklpZHUvrtK82Zs6dKsEj7E/97eJ/xZgUt52c83PRBOj7BM9Xp14pW7G9u+nftpwADABwSFeQIwYanAAAAAElFTkSuQmCC)}.mditor-overflow{overflow:hidden !important;}.mditor_fullScreen{background:#444;position:fixed;top:0px;left:0px;width:100%;height:100%;z-index:50000;font-family:"Microsoft Yahei";}.mditor_fullScreen textarea::selection{background:#000;}.mditor_fullScreen textarea::-moz-selection{background:#000;}.mditor_toolBar{position:absolute;top:0px;left:0px;width:100%;height:0;}.mditor-close{display:block;position:absolute;width:40px;height:40px;top:10px;right:20px;text-align:center;text-decoration:none;color:#aaa;font:bold 28px/40px "simsun";transition:0.1s;}.mditor-close:hover{background:#eee;color:#333;text-decoration:none;}.mditor-close:active{background:#aaa;color:#fff;}.mditor_input{position:absolute;top:0px;left:0px;width:50%;height:100%;}.mditor_input textarea{position:absolute;display:block;box-sizing:border-box;top:0;left:0;width:100%;height:100%;margin:0px;padding:20px 15px 20px 26px;border:none;resize:none;background:#232323;color:#e6e1dc;font-size:16px;font-family:inherit;line-height:1.6;}.mditor_input textarea:focus{box-shadow:1px 1px 10px #000;outline:none;}.mditor_view{position:absolute;top:0px;right:0px;width:50%;height:100%;overflow:auto;background:#fff;}.mditor_view .md_html{padding:20px;}.mditor-mini{position:relative;background:#fff;border:1px solid #ddd;font-family:"Microsoft Yahei";}.mditor-mini-bar{height:40px;background:#eee;}.mditor-mini-tab{float:left;}.mditor-btn{display:inline-block;vertical-align:middle;padding:0 2.4em;height:40px;line-height:38px;color:#333;font-size:14px;text-decoration:none;}.mditor-btn span{display:inline-block;vertical-align:middle;height:24px;line-height:24px;}.mditor-btn:hover{background:#f4f4f4;}.mditor-btn.active{background:#fff;}.mditor-btn-preview i{background-position:-15px 0;}.mditor-btn-full i{background-position:-30px 0;}.mditor-link{display:inline-block;vertical-align:middle;padding:0 1em;height:40px;line-height:38px;color:#555;font-size:14px;text-decoration:none;}.mditor-mini-side{float:right;}.mditor-mini-preview{display:none;min-height:200px;padding:30px 20px;}.mditor-mini textarea{display:block;box-sizing:border-box;width:100%;min-height:300px;resize:vertical;padding:20px;font-size:14px;font-family:inherit;border:none;}.mditor-mini textarea:focus{outline:none;}.mditor-mini-help{position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;display:none;}.mditor-help-txt{width:300px;margin:auto;padding:30px 20px;}.mditor-help-txt h3{margin:0 0 20px;padding:10px;text-align:center;font-size:20px;border-bottom:1px solid #eee;}.mditor-help-txt p{margin:0;line-height:24px;font-size:14px;}.mditor-help-txt b{display:inline-block;width:47%;padding-right:15px;text-align:right;font-weight:normal;}@media screen and (max-width:700px){.mditor_input{width:100%;}.mditor_view{width:100%;display:none;}.mditor_preview{visibility:visible;}.mditor_viewer{left:0px;}}';
  
  // 创建style标签
  function createStyleSheet(cssStr,attr){
    var styleTag = document.createElement('style');
    
    attr = attr || {};
    attr.type = "text/css";
    for(var i in attr){
      styleTag.setAttribute(i, attr[i]);
    }
    
    // IE
    if (styleTag.styleSheet) {
      styleTag.styleSheet.cssText = cssStr;
    } else {
      var tt1 = document.createTextNode(cssStr);
      styleTag.appendChild(tt1);
    }
    return styleTag;
  }
  
  var private_head = document.head || document.getElementsByTagName('head')[0];
  var styleSheet = createStyleSheet(style_css,{'data-module' : "mditor"});
  private_head.appendChild(styleSheet);
    
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
      this._events[eventName][i].apply(this,args);
    }
  }
  /**
   * 历史记录
   **/
  function LOG(max){
    this.data = [];
    this.current = -1;
    this.maxLength = max || 20;
  }
  LOG.prototype = {
    push: function(item){
      if(this.data.length > this.current + 1){
        this.data.length = this.current + 1;
      }
      this.current++;
      this.data.push(item);
      if(this.data.length > this.maxLength){
        this.data = this.data.slice( -this.maxLength);
        this.current = this.maxLength - 1;
      }
    },
    undo: function(){
      if(this.current <= 0){
        return;
      }
      return this.data[--this.current];
    },
    redo: function (){
      if(this.data.length > this.current + 1){
        return this.data[++this.current];
      }else{
        return null;
      }
    }
  };
  var action_config = {
    //加粗
    bold : '**{{加粗}}**',
    //斜体
    italic : '*{{斜体}}*',
    //链接
    link : '[{{链接文字}}](http://)',
    //图片
    image : '![{{图片描述}}](http://)',
    //代码
    code :  '`code`',
    //代码域
    precode : '\n\n```javascript\n{{//some code……}}\n```',
    tab : '  '
  };
  var keyCode_config = {
    9: 'tab',
    c66 : 'bold',
    c71 : 'image',
    c73 : 'italic',
    c75 : 'precode',
    cs75 : 'code',
    c76 : 'link',
    c89 : 'redo',
    c90 : 'undo'
  };
  /**
   * 设置输入框属性
   */
  function setAreaProp(elem){
    elem.spellcheck = false;
    elem.autocapitalize = 'none';
    elem.autocorrect = 'off';
  }
  
  /**
   * 编辑类
   *  change:任何字符改动都会触发
   *  input: 用户输入才会触发
   *
   **/
  function EDITOR($area,param){
    param = param || {};
    var me = this;
    
    this._$textarea = $area;
    //事件中心
    this._events = {};
    //历史记录
    this._log = new LOG(20);
    //设置输入框属性
    this.content = '';
    setAreaProp(this._$textarea[0]);
    //绑定快捷键
    var inputDelay;
    this._$textarea.on('keydown',function(e){
      //监听热键
      var key = (e.ctrlKey ? 'c' : '') + (e.shiftKey ? 's' : '') + e.keyCode;
      if(keyCode_config[key]){
        me.action(keyCode_config[key]);
        e.preventDefault();
      }else{
        clearTimeout(inputDelay);
        inputDelay = setTimeout(function(){
          var cont = $(me._$textarea).val();
          if(cont != me.content){
            me.emit('change',[cont]);
            me.emit('input',[cont]);
            me.content = cont;
          }
        },100);
      }
    });
    
    this.content = this._$textarea.val();
    
    //记录初始状态
    this._logMe();
    //当进行输入操作时，记录状态
    this.on('input',function(val){
      me._logMe(val);
    });
  }
  EDITOR.prototype = {
    on : ON,
    emit : EMIT,
    redo : function(){
      var step = this._log.redo();
      this.writeStep(step);
    },
    undo : function(){
      var step = this._log.undo();
      this.writeStep(step);
    },
    //记录当前状态
    _logMe: function(val){
      this._log.push({
        selection : utils.getPosition(this._$textarea[0]),
        content: val || this._$textarea.val()
      });
    },
    //绘制当前步骤
    writeStep: function (step){
      if(!step || !step.content){
        return
      }
      this._$textarea.val(step.content);
      this.content = step.content;
      this.emit('change',[step.content]);
      if(step.selection){
        utils.setPosition(this._$textarea[0],step.selection[0],(step.selection[1] - step.selection[0]));
      }
    },
    getContent : function(){
      var content = this._$textarea.val();
      localStorage.setItem('mditor',content);
      return content;
    },
    getHtml : function(){
      var text = this.getContent();
      var html = maked(text);
      return html;
    },
    insert : function(txt){
      utils.insertTxt(this._$textarea[0],txt);
      me.emit('change',[$(me._$textarea).val()]);
    },
    action : function(name){
      var config = action_config[name];
      //第一顺序，执行action_config的插入方法
      if(typeof(config) == 'string'){
        var selection_txt = utils.getPosition(this._$textarea[0])[2];
        config = config.replace(/{{(.+?)}}/,function(a,b){
          return selection_txt ? selection_txt : b;
        });
        utils.insertTxt(this._$textarea[0],config);
        this._logMe();
      }else if(typeof(config) == 'function'){
        //第二顺序，检查action_config是否为function
        config.call(this);
      }else if(typeof(this[name]) == 'function'){
        //第三顺序,从自身原型链上找方法
        this[name].call(this);
      }
    }
  };
  

  /**
   * 全屏编辑器
   * 
   */
  function Full(param){
    var me = this,
        content = param.content || '',
        previewClass = param.previewClass || 'article';
    
    this._$dom = $(editor_tpl);
    this._$textarea = this._$dom.find('textarea');
    this._$viewScreen = this._$dom.find('.mditor_view');
    this._$viewer = this._$viewScreen.find('.md_html');
    
    this.closeFn = param['closeFn'] || null;
    this.editor = new EDITOR(this._$textarea);
    this.editor.on('change',function(){
      me.render();
    });
    //初始化
    $('body').append(this._$dom);
    this._$viewer.addClass(previewClass);
    this._$textarea.val(content);
    this.render();
    
    this._$dom.find('.mditor-close').on('click',function(){
      me.close();
    });
    var isAdapt = false;
    function scroll(){
      if(isAdapt){
        return;
      }
      isAdapt = true;
      var scrollDom = this;
      setTimeout(function(){
        var percent = $(scrollDom).scrollTop() / scrollDom.scrollHeight;
        var moveDom = (scrollDom == me._$viewScreen[0]) ? me._$textarea : me._$viewScreen;
        moveDom.animate({
          scrollTop: percent * moveDom[0].scrollHeight
        },90);
        setTimeout(function(){
          isAdapt = false;
        },140);
      },200);
    }
    this._$textarea.on('scroll',scroll);
    this._$viewScreen.on('scroll',scroll);
    $('body').addClass('mditor-overflow');
  }
  Full.prototype = {
    render : function(){
      var html = this.editor.getHtml();
      this._$viewer.html(html);
    },
    close : function(){
      this.closeFn && this.closeFn.call(this);
      this._$dom.remove();
      $('body').removeClass('mditor-overflow');
    }
  };
  /**
   * mini编辑器
   *
   **/
  function MINI(area,param){
    if(! (this instanceof MINI)){
        return new MINI(area,param);
    }
    param = param || {};
    var me = this,
        previewClass = param.previewClass || 'article';
    
    this._$dom = $(mini_tpl);
    this._$textarea = $(area);
    this._$viewer = this._$dom.find('.mditor-mini-preview');
    this._$btn_preview = this._$dom.find('.mditor-btn-preview');
    this._$btn_edit = this._$dom.find('.mditor-btn-edit');
    this._$help = me._$dom.find('.mditor-mini-help');

    
    this._$viewer.addClass(previewClass);
    //将编辑器dom放置在textarea前
    this._$textarea.before(this._$dom);
    //再将textarea移入编辑器内
    this._$dom[0].appendChild(this._$textarea[0]);
    
    this.editor = new EDITOR(this._$textarea);
    //全屏
    this._$dom.on('click','.mditor-btn-full',function(){
      new Full({
        content: me.getContent(),
        previewClass: previewClass,
        closeFn: function(){
          me._$textarea.val(this.editor.getContent());
          me.render();
        }
      });
    }).on('click','.mditor-help',function(){
      me._$help.fadeIn(80);
    }).on('click','.mditor-close',function(){
      me._$help.fadeOut(100);
    });
    //预览
    this._$btn_preview.on('click',function(){
      me.preview();
    });
    //退出预览
    this._$btn_edit.on('click',function(){
      me.edit();
    });
  }
  MINI.prototype = {
    getContent : function(){
      return this.editor.getContent();;
    },
    getHtml : function(){
      return this.editor.getHtml();
    },
    render : function(){
      var html = this.editor.getHtml();
      this._$viewer.html(html);
    },
    insert : function(txt){
      //修复预览状态下，插入渲染不及时的问题
      this.editor.insert(txt);
      this.render();
    },
    preview : function(){
      this._$textarea.hide();
      this.render();
      this._$viewer.show();
      this._$btn_edit.removeClass('active');
      this._$btn_preview.addClass('active');
    },
    edit : function(){
      this._$textarea.show();
      this._$viewer.hide().html('');
      this._$btn_edit.addClass('active');
      this._$btn_preview.removeClass('active');
    }
  };
  return MINI;
},function(a){function d(a,d,e,f){var g,h,i,j,k,l;"TEXTAREA"==a.tagName&&"undefined"!=typeof d&&(d=d.toString(),"undefined"==typeof e?(i=c(a),g=i[0],h=i[1]):(g=parseInt(e),h=f||g),j=a.value,k=j.slice(0,g),l=j.slice(h),a.value=k+d+l,b(a,k.length+d.length,0))}var b=function(){var b=a.createElement("textarea");return b.setSelectionRange?function(a,b,c){var c=c||0;setTimeout(function(){a.focus(),a.setSelectionRange(b,b+c)})}:b.createTextRange?function(a,b,c){var d,e;c=c||0,a.focus(),d=a.value.length,e=a.createTextRange(),e.moveStart("character",b),e.moveEnd("character",b+c-d),e.select()}:void 0}(),c=function(){var b=a.createElement("textarea");return"number"==typeof b.selectionStart?function(a){return[a.selectionStart,a.selectionEnd,a.value.slice(a.selectionStart,a.selectionEnd)]}:function(b){var e,f,g,c=0,d=0;if(b.focus(),e=a.selection.createRange(),"TEXTAREA"==b.tagName){for(f=a.body.createTextRange(),f.moveToElementText(b),c=0;f.compareEndPoints("StartToStart",e)<0;c++)f.moveStart("character",1);for(g=0;c>=g;g++)"\n"==b.value.charAt(g)&&c++;for(f.moveToElementText(b),d=0;f.compareEndPoints("StartToEnd",e)<0;d++)f.moveStart("character",1);for(g=0;d>=g;g++)"\n"==b.value.charAt(g)&&d++}return[c,d,selectedTxt,b.value.slice(c,d)]}}();return{insertTxt:d,Selection:Selection,setPosition:b,getPosition:c}},function(){function b(b){this.tokens=[],this.tokens.links={},this.options=b||l.defaults,this.rules=a.normal,this.options.gfm&&(this.rules=this.options.tables?a.tables:a.gfm)}function d(a,b){if(this.options=b||l.defaults,this.links=a,this.rules=c.normal,this.renderer=this.options.renderer||new e,this.renderer.options=this.options,!this.links)throw new Error("Tokens array requires a `links` property.");this.options.gfm?this.rules=this.options.breaks?c.breaks:c.gfm:this.options.pedantic&&(this.rules=c.pedantic)}function e(a){this.options=a||{}}function f(a){this.tokens=[],this.token=null,this.options=a||l.defaults,this.options.renderer=this.options.renderer||new e,this.renderer=this.options.renderer,this.renderer.options=this.options}function g(a,b){return a.replace(b?/&/g:/&(?!#?\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function h(a){return a.replace(/&([#\w]+);/g,function(a,b){return b=b.toLowerCase(),"colon"===b?":":"#"===b.charAt(0)?"x"===b.charAt(1)?String.fromCharCode(parseInt(b.substring(2),16)):String.fromCharCode(+b.substring(1)):""})}function i(a,b){return a=a.source,b=b||"",function c(d,e){return d?(e=e.source||e,e=e.replace(/(^|[^\[])\^/g,"$1"),a=a.replace(d,e),c):new RegExp(a,b)}}function j(){}function k(a){for(var c,d,b=1;b<arguments.length;b++){c=arguments[b];for(d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])}return a}function l(a,c,d){var h,i,e,j,n;if(d||"function"==typeof c){d||(d=c,c=null),c=k({},l.defaults,c||{}),e=c.highlight,j=0;try{h=b.lex(a,c)}catch(m){return d(m)}if(i=h.length,n=function(a){if(a)return c.highlight=e,d(a);var b;try{b=f.parse(h,c)}catch(g){a=g}return c.highlight=e,a?d(a):d(null,b)},!e||e.length<3)return n();if(delete c.highlight,!i)return n();for(;j<h.length;j++)!function(a){return"code"!==a.type?--i||n():e(a.text,a.lang,function(b,c){return b?n(b):null==c||c===a.text?--i||n():(a.text=c,a.escaped=!0,--i||n(),void 0)})}(h[j])}else try{return c&&(c=k({},l.defaults,c)),f.parse(b.lex(a,c),c)}catch(m){if(m.message+="\nPlease report this to https://github.com/chjj/marked.",(c||l.defaults).silent)return"<p>An error occured:</p><pre>"+g(m.message+"",!0)+"</pre>";throw m}}var c,a={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:j,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:j,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:j,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};return a.bullet=/(?:[*+-]|\d+\.)/,a.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,a.item=i(a.item,"gm")(/bull/g,a.bullet)(),a.list=i(a.list)(/bull/g,a.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+a.def.source+")")(),a.blockquote=i(a.blockquote)("def",a.def)(),a._tag="(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b",a.html=i(a.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,a._tag)(),a.paragraph=i(a.paragraph)("hr",a.hr)("heading",a.heading)("lheading",a.lheading)("blockquote",a.blockquote)("tag","<"+a._tag)("def",a.def)(),a.normal=k({},a),a.gfm=k({},a.normal,{fences:/^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,paragraph:/^/}),a.gfm.paragraph=i(a.paragraph)("(?!","(?!"+a.gfm.fences.source.replace("\\1","\\2")+"|"+a.list.source.replace("\\1","\\3")+"|")(),a.tables=k({},a.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/}),b.rules=a,b.lex=function(a,c){var d=new b(c);return d.lex(a)},b.prototype.lex=function(a){return a=a.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n"),this.token(a,!0)},b.prototype.token=function(b,c,d){for(var e,f,g,h,i,j,k,l,m,b=b.replace(/^ +$/gm,"");b;)if((g=this.rules.newline.exec(b))&&(b=b.substring(g[0].length),g[0].length>1&&this.tokens.push({type:"space"})),g=this.rules.code.exec(b))b=b.substring(g[0].length),g=g[0].replace(/^ {4}/gm,""),this.tokens.push({type:"code",text:this.options.pedantic?g:g.replace(/\n+$/,"")});else if(g=this.rules.fences.exec(b))b=b.substring(g[0].length),this.tokens.push({type:"code",lang:g[2],text:g[3]});else if(g=this.rules.heading.exec(b))b=b.substring(g[0].length),this.tokens.push({type:"heading",depth:g[1].length,text:g[2]});else if(c&&(g=this.rules.nptable.exec(b))){for(b=b.substring(g[0].length),j={type:"table",header:g[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:g[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:g[3].replace(/\n$/,"").split("\n")},l=0;l<j.align.length;l++)j.align[l]=/^ *-+: *$/.test(j.align[l])?"right":/^ *:-+: *$/.test(j.align[l])?"center":/^ *:-+ *$/.test(j.align[l])?"left":null;for(l=0;l<j.cells.length;l++)j.cells[l]=j.cells[l].split(/ *\| */);this.tokens.push(j)}else if(g=this.rules.lheading.exec(b))b=b.substring(g[0].length),this.tokens.push({type:"heading",depth:"="===g[2]?1:2,text:g[1]});else if(g=this.rules.hr.exec(b))b=b.substring(g[0].length),this.tokens.push({type:"hr"});else if(g=this.rules.blockquote.exec(b))b=b.substring(g[0].length),this.tokens.push({type:"blockquote_start"}),g=g[0].replace(/^ *> ?/gm,""),this.token(g,c,!0),this.tokens.push({type:"blockquote_end"});else if(g=this.rules.list.exec(b)){for(b=b.substring(g[0].length),h=g[2],this.tokens.push({type:"list_start",ordered:h.length>1}),g=g[0].match(this.rules.item),e=!1,m=g.length,l=0;m>l;l++)j=g[l],k=j.length,j=j.replace(/^ *([*+-]|\d+\.) +/,""),~j.indexOf("\n ")&&(k-=j.length,j=this.options.pedantic?j.replace(/^ {1,4}/gm,""):j.replace(new RegExp("^ {1,"+k+"}","gm"),"")),this.options.smartLists&&l!==m-1&&(i=a.bullet.exec(g[l+1])[0],h===i||h.length>1&&i.length>1||(b=g.slice(l+1).join("\n")+b,l=m-1)),f=e||/\n\n(?!\s*$)/.test(j),l!==m-1&&(e="\n"===j.charAt(j.length-1),f||(f=e)),this.tokens.push({type:f?"loose_item_start":"list_item_start"}),this.token(j,!1,d),this.tokens.push({type:"list_item_end"});this.tokens.push({type:"list_end"})}else if(g=this.rules.html.exec(b))b=b.substring(g[0].length),this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:"pre"===g[1]||"script"===g[1]||"style"===g[1],text:g[0]});else if(!d&&c&&(g=this.rules.def.exec(b)))b=b.substring(g[0].length),this.tokens.links[g[1].toLowerCase()]={href:g[2],title:g[3]};else if(c&&(g=this.rules.table.exec(b))){for(b=b.substring(g[0].length),j={type:"table",header:g[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:g[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:g[3].replace(/(?: *\| *)?\n$/,"").split("\n")},l=0;l<j.align.length;l++)j.align[l]=/^ *-+: *$/.test(j.align[l])?"right":/^ *:-+: *$/.test(j.align[l])?"center":/^ *:-+ *$/.test(j.align[l])?"left":null;for(l=0;l<j.cells.length;l++)j.cells[l]=j.cells[l].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */);this.tokens.push(j)}else if(c&&(g=this.rules.paragraph.exec(b)))b=b.substring(g[0].length),this.tokens.push({type:"paragraph",text:"\n"===g[1].charAt(g[1].length-1)?g[1].slice(0,-1):g[1]});else if(g=this.rules.text.exec(b))b=b.substring(g[0].length),this.tokens.push({type:"text",text:g[0]});else if(b)throw new Error("Infinite loop on byte: "+b.charCodeAt(0));return this.tokens},c={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:j,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:j,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/},c._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,c._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/,c.link=i(c.link)("inside",c._inside)("href",c._href)(),c.reflink=i(c.reflink)("inside",c._inside)(),c.normal=k({},c),c.pedantic=k({},c.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/}),c.gfm=k({},c.normal,{escape:i(c.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:i(c.text)("]|","~]|")("|","|https?://|")()}),c.breaks=k({},c.gfm,{br:i(c.br)("{2,}","*")(),text:i(c.gfm.text)("{2,}","*")()}),d.rules=c,d.output=function(a,b,c){var e=new d(b,c);return e.output(a)},d.prototype.output=function(a){for(var c,d,e,f,b="";a;)if(f=this.rules.escape.exec(a))a=a.substring(f[0].length),b+=f[1];else if(f=this.rules.autolink.exec(a))a=a.substring(f[0].length),"@"===f[2]?(d=":"===f[1].charAt(6)?this.mangle(f[1].substring(7)):this.mangle(f[1]),e=this.mangle("mailto:")+d):(d=g(f[1]),e=d),b+=this.renderer.link(e,null,d);else if(this.inLink||!(f=this.rules.url.exec(a))){if(f=this.rules.tag.exec(a))!this.inLink&&/^<a /i.test(f[0])?this.inLink=!0:this.inLink&&/^<\/a>/i.test(f[0])&&(this.inLink=!1),a=a.substring(f[0].length),b+=this.options.sanitize?g(f[0]):f[0];else if(f=this.rules.link.exec(a))a=a.substring(f[0].length),this.inLink=!0,b+=this.outputLink(f,{href:f[2],title:f[3]}),this.inLink=!1;else if((f=this.rules.reflink.exec(a))||(f=this.rules.nolink.exec(a))){if(a=a.substring(f[0].length),c=(f[2]||f[1]).replace(/\s+/g," "),c=this.links[c.toLowerCase()],!c||!c.href){b+=f[0].charAt(0),a=f[0].substring(1)+a;continue}this.inLink=!0,b+=this.outputLink(f,c),this.inLink=!1}else if(f=this.rules.strong.exec(a))a=a.substring(f[0].length),b+=this.renderer.strong(this.output(f[2]||f[1]));else if(f=this.rules.em.exec(a))a=a.substring(f[0].length),b+=this.renderer.em(this.output(f[2]||f[1]));else if(f=this.rules.code.exec(a))a=a.substring(f[0].length),b+=this.renderer.codespan(g(f[2],!0));else if(f=this.rules.br.exec(a))a=a.substring(f[0].length),b+=this.renderer.br();else if(f=this.rules.del.exec(a))a=a.substring(f[0].length),b+=this.renderer.del(this.output(f[1]));else if(f=this.rules.text.exec(a))a=a.substring(f[0].length),b+=g(this.smartypants(f[0]));else if(a)throw new Error("Infinite loop on byte: "+a.charCodeAt(0))}else a=a.substring(f[0].length),d=g(f[1]),e=d,b+=this.renderer.link(e,null,d);return b},d.prototype.outputLink=function(a,b){var c=g(b.href),d=b.title?g(b.title):null;return"!"!==a[0].charAt(0)?this.renderer.link(c,d,this.output(a[1])):this.renderer.image(c,d,g(a[1]))},d.prototype.smartypants=function(a){return this.options.smartypants?a.replace(/--/g,"—").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…"):a},d.prototype.mangle=function(a){for(var e,b="",c=a.length,d=0;c>d;d++)e=a.charCodeAt(d),Math.random()>.5&&(e="x"+e.toString(16)),b+="&#"+e+";";return b},e.prototype.code=function(a,b,c){if(this.options.highlight){var d=this.options.highlight(a,b);null!=d&&d!==a&&(c=!0,a=d)}return b?'<pre><code class="'+this.options.langPrefix+g(b,!0)+'">'+(c?a:g(a,!0))+"\n</code></pre>\n":"<pre><code>"+(c?a:g(a,!0))+"\n</code></pre>"},e.prototype.blockquote=function(a){return"<blockquote>\n"+a+"</blockquote>\n"},e.prototype.html=function(a){return a},e.prototype.heading=function(a,b,c){return"<h"+b+' id="'+this.options.headerPrefix+c.toLowerCase().replace(/[^\w]+/g,"-")+'">'+a+"</h"+b+">\n"},e.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"},e.prototype.list=function(a,b){var c=b?"ol":"ul";return"<"+c+">\n"+a+"</"+c+">\n"},e.prototype.listitem=function(a){return"<li>"+a+"</li>\n"},e.prototype.paragraph=function(a){return"<p>"+a+"</p>\n"},e.prototype.table=function(a,b){return"<table>\n<thead>\n"+a+"</thead>\n"+"<tbody>\n"+b+"</tbody>\n"+"</table>\n"},e.prototype.tablerow=function(a){return"<tr>\n"+a+"</tr>\n"},e.prototype.tablecell=function(a,b){var c=b.header?"th":"td",d=b.align?"<"+c+' style="text-align:'+b.align+'">':"<"+c+">";return d+a+"</"+c+">\n"},e.prototype.strong=function(a){return"<strong>"+a+"</strong>"},e.prototype.em=function(a){return"<em>"+a+"</em>"},e.prototype.codespan=function(a){return"<code>"+a+"</code>"},e.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"},e.prototype.del=function(a){return"<del>"+a+"</del>"},e.prototype.link=function(a,b,c){var d,f;if(this.options.sanitize){try{d=decodeURIComponent(h(a)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(0===d.indexOf("javascript:")||0===d.indexOf("vbscript:"))return""}return f='<a href="'+a+'"',b&&(f+=' title="'+b+'"'),f+=">"+c+"</a>"},e.prototype.image=function(a,b,c){var d='<img src="'+a+'" alt="'+c+'"';return b&&(d+=' title="'+b+'"'),d+=this.options.xhtml?"/>":">"},f.parse=function(a,b,c){var d=new f(b,c);return d.parse(a)},f.prototype.parse=function(a){this.inline=new d(a.links,this.options,this.renderer),this.tokens=a.reverse();for(var b="";this.next();)b+=this.tok();return b},f.prototype.next=function(){return this.token=this.tokens.pop()},f.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0},f.prototype.parseText=function(){for(var a=this.token.text;"text"===this.peek().type;)a+="\n"+this.next().text;return this.inline.output(a)},f.prototype.tok=function(){var c,d,e,f,g,a,b,h,i;switch(this.token.type){case"space":return"";case"hr":return this.renderer.hr();case"heading":return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text);case"code":return this.renderer.code(this.token.text,this.token.lang,this.token.escaped);case"table":for(a="",b="",e="",c=0;c<this.token.header.length;c++)f={header:!0,align:this.token.align[c]},e+=this.renderer.tablecell(this.inline.output(this.token.header[c]),{header:!0,align:this.token.align[c]});for(a+=this.renderer.tablerow(e),c=0;c<this.token.cells.length;c++){for(d=this.token.cells[c],e="",g=0;g<d.length;g++)e+=this.renderer.tablecell(this.inline.output(d[g]),{header:!1,align:this.token.align[g]});b+=this.renderer.tablerow(e)}return this.renderer.table(a,b);case"blockquote_start":for(b="";"blockquote_end"!==this.next().type;)b+=this.tok();return this.renderer.blockquote(b);case"list_start":for(b="",h=this.token.ordered;"list_end"!==this.next().type;)b+=this.tok();return this.renderer.list(b,h);case"list_item_start":for(b="";"list_item_end"!==this.next().type;)b+="text"===this.token.type?this.parseText():this.tok();return this.renderer.listitem(b);case"loose_item_start":for(b="";"list_item_end"!==this.next().type;)b+=this.tok();return this.renderer.listitem(b);case"html":return i=this.token.pre||this.options.pedantic?this.token.text:this.inline.output(this.token.text),this.renderer.html(i);case"paragraph":return this.renderer.paragraph(this.inline.output(this.token.text));case"text":return this.renderer.paragraph(this.parseText())}},j.exec=j,l.options=l.setOptions=function(a){return k(l.defaults,a),l},l.defaults={gfm:!0,tables:!0,breaks:!1,pedantic:!1,sanitize:!1,smartLists:!1,silent:!1,highlight:null,langPrefix:"lang-",smartypants:!1,headerPrefix:"",renderer:new e,xhtml:!1},l.Parser=f,l.parser=f.parse,l.Renderer=e,l.Lexer=b,l.lexer=b.lex,l.InlineLexer=d,l.inlineLexer=d.output,l.parse=l,l});