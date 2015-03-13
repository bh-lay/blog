/**
 * @author bh-lay
 * 
 * @github https://github.com/bh-lay/mditor
 * @modified 2015-3-13 17:25
 * 
 **/


(function(global,doc,editor_factory,selection_factory,showdown_factory){
  var utils = selection_factory(doc);
	var showdown = showdown_factory();
	
	var mditor = editor_factory(global,doc,utils,showdown);
	global.mditor = global.mditor || mditor;
	global.define && define(function(){
		return mditor;
	});
})(window,document,function(window,document,utils,Showdown){
	var localStorage = window.localStorage || {
		getItem : function(){},
		setItem : function(){}
	};
	
	var editor_tpl = '<div class="mditor_fullScreen"><div class="mditor_input"><textarea spellcheck="false" autocapitalize="none" autocorrect="off"></textarea></div><div class="mditor_view"><div class="md_html"></div></div><div class="mditor_toolBar"><a href="javascript:void(0)" title="退出全屏" class="exist_fullscreen">×</a></div></div>';
	var mini_tpl = '<div class="mditor-mini"><div class="mditor-mini-bar"><div class="mditor-mini-tab"><a href="javascript:void(0)" title="编辑" class="mditor-btn-edit active"><i class="mditor-icon "></i><span>编辑</span></a><a href="javascript:void(0)" title="预览" class="mditor-btn-preview"><i class="mditor-icon "></i><span>预览</span></a></div><div class="mditor-mini-side"><a href="javascript:void(0)" title="全屏" class="mditor-btn-full"><i class="mditor-icon "></i></a></div></div><div class="mditor-mini-preview"></div></div>';
	var style_css = '.mditor-icon{display:inline-block;width:15px;height:15px;margin-right:5px;vertical-align:middle;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAPCAYAAABwfkanAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqtJREFUeNrUllmIjWEYx883xjAyGGtjKZQL0mkkuSAiFJncMBcYIs2NZA2RpexTk2WSseRopETCnKLckQuDso7cWHJlG9myc/we/b/T29t3zpkckqd+8513+573fd7/83wTpFKp2P9mhfYnCIJsc2xwDEyEMrgO+/7lYQNznmPTZkm4A4dgJ1xh3ba8nQdBA4/v8B7uWTAipk2HsdDBgozfubEcEauAKTAMDkAX9Z+2dfmCnYI49Ic+UBxBL40PgP22rjDLhkdBNeyAG1AKR2ER3HKi5a7pB1Vy8g1+QHt4aQeFpnCiNv0cPsNy6Cwfvr2DD1ALD9OajrAhsBo2y1ECrsE5qIMnEWvmwAwdcA98gTbwEabCKmiGdc4aO0yJDpnJSkQ3eOOe2LVB0vAktWugQb/LNDbCuWKzZeqPq10ufe6FSvWV6vAJx2873U6jciVKHiv0bpNo0a913qa7a0KV2hvVjikaSSWFq8t56u+qeXG1R8JA730xbXq947e35tRkiPRCjZeHfgu8a0hIe6bdpTBcydhDsjgMF72XjoaV8ErtydJek54nlMyhrbGbyqfqFDj12nR4WRubCeNhmsat74wO5NsC6CjpmJ1XhMNIVyoXQtuq/AjlYbq3sLfNII9i53tR5NbpIxJ6hZLJkmoWvNXVXFCkY172h9VjMUyAtXBbV1mt6mE3c1LyqdUG58vvJn6fhQ2tCLBVsaGsqw+rhxXuFmX4YFiiDTeqGtTleOFuVYItcBOOwy6neliZHAd3Tc9eDllJe9yKkteiOemS90jyqJfDB3re95xks2NwCWYr8m6dfgHb4aq3pqckYjfw1ckL1zpJIoHklpZHUvrtK82Zs6dKsEj7E/97eJ/xZgUt52c83PRBOj7BM9Xp14pW7G9u+nftpwADABwSFeQIwYanAAAAAElFTkSuQmCC)}.mditor-overflow{overflow:hidden !important;}.mditor_fullScreen{background:#444;position:fixed;top:0px;left:0px;width:100%;height:100%;z-index:50000;font-family:"Microsoft Yahei";}.mditor_fullScreen textarea::selection{background:#000;}.mditor_fullScreen textarea::-moz-selection{background:#000;}.mditor_toolBar{position:absolute;top:0px;left:0px;width:100%;height:0;}.exist_fullscreen{display:block;position:absolute;width:40px;height:40px;top:10px;right:20px;text-align:center;text-decoration:none;color:#aaa;font:bold 28px/40px "simsun";transition:0.1s;}.exist_fullscreen:hover{background:#eee;color:#333;text-decoration:none;}.exist_fullscreen:active{background:#aaa;color:#fff;}.mditor_input{position:absolute;top:0px;left:0px;width:50%;height:100%;}.mditor_input textarea{position:absolute;display:block;box-sizing:border-box;top:0;left:0;width:100%;height:100%;margin:0px;padding:20px 15px 20px 26px;border:none;resize:none;background:#232323;color:#e6e1dc;font-size:16px;font-family:inherit;line-height:1.6;}.mditor_input textarea:focus{box-shadow:1px 1px 10px #000;outline:none;}.mditor_view{position:absolute;top:0px;right:0px;width:50%;height:100%;overflow:auto;background:#fff;}.mditor_view .md_html{padding:20px;}.mditor-mini{background:#fff;border:1px solid #ddd;font-family:"Microsoft Yahei";}.mditor-mini-bar{height:40px;line-height:35px;background:#eee;}.mditor-mini-tab{float:left;}.mditor-mini-bar a{display:block;float:left;padding:0 2.4em;height:40px;background:#eee;color:#333;font-size:14px;text-decoration:none;}.mditor-mini-bar a span{display:inline-block;vertical-align:middle;height:24px;line-height:24px;}.mditor-btn-preview i{background-position:-15px 0;}.mditor-btn-full i{background-position:-30px 0;}.mditor-mini-bar a:hover{background:#f4f4f4;}.mditor-mini-bar a.active{background:#fff;}.mditor-mini-side{float:right;}.mditor-mini-preview{display:none;min-height:200px;padding:30px 20px;}.mditor-mini textarea{display:block;box-sizing:border-box;width:100%;min-height:300px;resize:vertical;padding:20px;font-size:14px;font-family:inherit;border:none;}.mditor-mini textarea:focus{outline:none;}@media screen and (max-width:700px){.mditor_input{width:100%;}.mditor_view{width:100%;display:none;}.mditor_preview{visibility:visible;}.mditor_viewer{left:0px;}}';
	
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
		
	
    
	var action_config = {
		//加粗
    bold : {
			insert : '**{{加粗}}**'
		},
    //斜体
		italic : {
			insert : '*{{斜体}}*'
		},
    //链接
		link : {
			insert : '[{{链接文字}}](http://)'
		},
    //图片
		image : {
			insert : '![{{图片描述}}](http://)'
		},
    //代码
		code : {
			insert : '`code`'
		},
    //代码域
		precode : {
			insert : '\n\n```javascript\n{{//some code……}}\n```'
		},
    tab : {
      insert : '  '
    }
	};
	var keyCode_config = {
    9: 'tab',
		c66 : 'bold',
		c71 : 'image',
		c73 : 'italic',
		c75 : 'precode',
		cs75 : 'code',
		c76 : 'link',
	};
    
  function EDITOR($area,param){
    param = param || {};
    var me = this;
    
    this._$textarea = $area;
    this.onchange = param.onchange || null;
    //绑定快捷键
		var inputDelay;
    this._$textarea.on('keydown',function(e){
      var key = (e.ctrlKey ? 'c' : '') + (e.shiftKey ? 's' : '') + e.keyCode;
      if(keyCode_config[key]){
        me.action(keyCode_config[key]);
        e.preventDefault();
      }else{
        clearTimeout(inputDelay);
        inputDelay = setTimeout(function(){
          me.onchange && me.onchange.call(this,$(me._$textarea).val());
        },200);
      }
    });
  }
  EDITOR.prototype = {
		getContent : function(){
			var content = $(this._$textarea).val();
			localStorage.setItem('mditor',content);
			return content;
		},
		getHtml : function(){
			var text = this.getContent();
			var converter = new Showdown.converter();
		 	var html = converter.makeHtml(text);
		 	return html;
		},
    insert : function(txt){
      utils.insertTxt(this._$textarea[0],txt);
    },
		action : function(type){
			if( !action_config[type]){
				return;
			}
			var selection_txt = utils.Selection(this._$textarea[0])[2];
			var txt = action_config[type]['insert'];
			txt = txt.replace(/{{(.+?)}}/,function(a,b){
				return selection_txt ? selection_txt : b;
			});
			utils.insertTxt(this._$textarea[0],txt);
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
    this.editor = new EDITOR(this._$textarea,{
      onchange : function(){
        me.render();
      }
    });
		//初始化
		$('body').append(this._$dom);
    this._$viewer.addClass(previewClass);
    this._$textarea.val(content);
		this.render();
		
		this._$dom.find('.exist_fullscreen').on('click',function(){
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
    this.editor = new EDITOR(this._$textarea,{
      onchange: param.onchange || null
    });
		
    this._$viewer.addClass(previewClass);
    //将编辑器dom放置在textarea前
    this._$textarea.before(this._$dom);
    //再将textarea移入编辑器内
    this._$dom[0].appendChild(this._$textarea[0]);
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
},function(a){function d(){var a=arguments[0];if("TEXTAREA"==a.tagName)return arguments["length"]>1?(b(a,arguments[1],arguments[2]),void 0):c(a)}function e(a,d,e,f){var g,h,i,j,k,l;"TEXTAREA"==a.tagName&&"undefined"!=typeof d&&(d=d.toString(),"undefined"==typeof e?(i=c(a),g=i[0],h=i[1]):(g=parseInt(e),h=f||g),j=a.value,k=j.slice(0,g),l=j.slice(h),a.value=k+d+l,b(a,k.length+d.length,0))}var b=function(){var b=a.createElement("textarea");return b.setSelectionRange?function(a,b,c){var c=c||0;setTimeout(function(){a.focus(),a.setSelectionRange(b,b+c)})}:b.createTextRange?function(a,b,c){var d,e;c=c||0,a.focus(),d=a.value.length,e=a.createTextRange(),e.moveStart("character",b),e.moveEnd("character",b+c-d),e.select()}:void 0}(),c=function(){var b=a.createElement("textarea");return"number"==typeof b.selectionStart?function(a){return[a.selectionStart,a.selectionEnd,a.value.slice(a.selectionStart,a.selectionEnd)]}:function(b){var e,f,g,c=0,d=0;if(b.focus(),e=a.selection.createRange(),"TEXTAREA"==b.tagName){for(f=a.body.createTextRange(),f.moveToElementText(b),c=0;f.compareEndPoints("StartToStart",e)<0;c++)f.moveStart("character",1);for(g=0;c>=g;g++)"\n"==b.value.charAt(g)&&c++;for(f.moveToElementText(b),d=0;f.compareEndPoints("StartToEnd",e)<0;d++)f.moveStart("character",1);for(g=0;d>=g;g++)"\n"==b.value.charAt(g)&&d++}return[c,d,selectedTxt,b.value.slice(c,d)]}}();return{insertTxt:e,Selection:d,setPosition:b,getPosition:c}},function(){var c,a={extensions:{}};return a.forEach=function(a,b){if("function"==typeof a.forEach)a.forEach(b);else{var c,d=a.length;for(c=0;d>c;c++)b(a[c],c,a)}},c=function(a){return a.replace(/[_-]||\s/g,"").toLowerCase()},a.converter=function(b){var d,e,f,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,g=0,h=[],i=[];"undefind"!=typeof module&&"undefined"!=typeof exports&&"undefind"!=typeof require&&(j=require("fs"),j&&(k=j.readdirSync((__dirname||".")+"/extensions").filter(function(a){return~a.indexOf(".js")}).map(function(a){return a.replace(/\.js$/,"")}),a.forEach(k,function(b){var d=c(b);a.extensions[d]=require("./extensions/"+b)}))),this.makeHtml=function(b){return d={},e={},f=[],b=b.replace(/~/g,"~T"),b=b.replace(/\$/g,"~D"),b=b.replace(/\r\n/g,"\n"),b=b.replace(/\r/g,"\n"),b="\n\n"+b+"\n\n",b=O(b),b=b.replace(/^[ \t]+$/gm,""),a.forEach(h,function(a){b=m(a,b)}),b=B(b),b=o(b),b=n(b),b=q(b),b=M(b),b=b.replace(/~D/g,"$$"),b=b.replace(/~T/g,"~"),a.forEach(i,function(a){b=m(a,b)}),b},b&&b.extensions&&(l=this,a.forEach(b.extensions,function(b){if("string"==typeof b&&(b=a.extensions[c(b)]),"function"!=typeof b)throw"Extension '"+b+"' could not be loaded.  It was either not found or is not a valid extension.";a.forEach(b(l),function(a){a.type?"language"===a.type||"lang"===a.type?h.push(a):("output"===a.type||"html"===a.type)&&i.push(a):i.push(a)})})),m=function(a,b){if(a.regex){var c=new RegExp(a.regex,"g");return b.replace(c,a.replace)}return a.filter?a.filter(b):void 0},n=function(a){return a+="~0",a=a.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|(?=~0))/gm,function(a,b,c,f,g){return b=b.toLowerCase(),d[b]=I(c),f?f+g:(g&&(e[b]=g.replace(/"/g,"&quot;")),"")}),a=a.replace(/~0/,"")},o=function(a){return a=a.replace(/\n/g,"\n\n"),a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,p),a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside)\b[^\r]*?<\/\2>[ \t]*(?=\n+)\n)/gm,p),a=a.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,p),a=a.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,p),a=a.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,p),a=a.replace(/\n\n/g,"\n")},p=function(a,b){var c=b;return c=c.replace(/\n\n/g,"\n"),c=c.replace(/^\n/,""),c=c.replace(/\n+$/g,""),c="\n\n~K"+(f.push(c)-1)+"K\n\n"},q=function(a){a=x(a);var b=C("<hr />");return a=a.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,b),a=z(a),a=A(a),a=G(a),a=o(a),a=H(a)},r=function(a){return a=D(a),a=s(a),a=J(a),a=v(a),a=t(a),a=K(a),a=I(a),a=F(a),a=a.replace(/  +\n/g," <br />\n")},s=function(a){var b=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;return a=a.replace(b,function(a){var b=a.replace(/(.)<\/?code>(?=.)/g,"$1`");return b=P(b,"\\`*_")})},t=function(a){return a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,u),a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,u),a=a.replace(/(\[([^\[\]]+)\])()()()()()/g,u)},u=function(a,b,c,f,g,h,i,j){var k,l,m,n,o,p;if(void 0==j&&(j=""),k=b,l=c,m=f.toLowerCase(),n=g,o=j,""==n)if(""==m&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m,void 0!=d[m])n=d[m],void 0!=e[m]&&(o=e[m]);else{if(!(k.search(/\(\s*\)$/m)>-1))return k;n=""}return n=P(n,"*_"),p='<a href="'+n+'"',""!=o&&(o=o.replace(/"/g,"&quot;"),o=P(o,"*_"),p+=' title="'+o+'"'),p+=">"+l+"</a>"},v=function(a){return a=a.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,w),a=a.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,w)},w=function(a,b,c,f,g,h,i,j){var p,k=b,l=c,m=f.toLowerCase(),n=g,o=j;if(o||(o=""),""==n){if(""==m&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m,void 0==d[m])return k;n=d[m],void 0!=e[m]&&(o=e[m])}return l=l.replace(/"/g,"&quot;"),n=P(n,"*_"),p='<img src="'+n+'" alt="'+l+'"',o=o.replace(/"/g,"&quot;"),o=P(o,"*_"),p+=' title="'+o+'"',p+=" />"},x=function(a){return a=a.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(a,b){return C("<h1>"+r(b)+"</h1>")}),a=a.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(a,b){return C("<h2>"+r(b)+"</h2>")}),a=a.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(a,b,c){var d=b.length;return C("<h"+d+">"+r(c)+"</h"+d+">")})},z=function(a){a+="~0";var b=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;return g?a=a.replace(b,function(a,b,c){var f,d=b,e=c.search(/[*+-]/g)>-1?"ul":"ol";return d=d.replace(/\n{2,}/g,"\n\n\n"),f=y(d),f=f.replace(/\s+$/,""),f="<"+e+">"+f+"</"+e+">\n"}):(b=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g,a=a.replace(b,function(a,b,c,d){var h,e=b,f=c,g=d.search(/[*+-]/g)>-1?"ul":"ol";return f=f.replace(/\n{2,}/g,"\n\n\n"),h=y(f),h=e+"<"+g+">\n"+h+"</"+g+">\n"})),a=a.replace(/~0/,"")},y=function(a){return g++,a=a.replace(/\n{2,}$/,"\n"),a+="~0",a=a.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,function(a,b,c,d,e){var f=e,g=b;return g||f.search(/\n{2,}/)>-1?f=q(N(f)):(f=z(N(f)),f=f.replace(/\n$/,""),f=r(f)),"<li>"+f+"</li>\n"}),a=a.replace(/~0/g,""),g--,a},A=function(a){return a+="~0",a=a.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(a,b,c){var d=b,e=c;return d=E(N(d)),d=O(d),d=d.replace(/^\n+/g,""),d=d.replace(/\n+$/g,""),d="<pre><code>"+d+"\n</code></pre>",C(d)+e}),a=a.replace(/~0/,"")},B=function(a){return a+="~0",a=a.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g,function(a,b,c){var d=b,e=c;return e=E(e),e=O(e),e=e.replace(/^\n+/g,""),e=e.replace(/\n+$/g,""),e="<pre><code"+(d?' class="'+d+'"':"")+">"+e+"\n</code></pre>",C(e)}),a=a.replace(/~0/,"")},C=function(a){return a=a.replace(/(^\n+|\n+$)/g,""),"\n\n~K"+(f.push(a)-1)+"K\n\n"},D=function(a){return a=a.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(a,b,c,d){var f=d;return f=f.replace(/^([ \t]*)/g,""),f=f.replace(/[ \t]*$/g,""),f=E(f),b+"<code>"+f+"</code>"})},E=function(a){return a=a.replace(/&/g,"&amp;"),a=a.replace(/</g,"&lt;"),a=a.replace(/>/g,"&gt;"),a=P(a,"*_{}[]\\",!1)},F=function(a){return a=a.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>"),a=a.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>")},G=function(a){return a=a.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(a,b){var c=b;return c=c.replace(/^[ \t]*>[ \t]?/gm,"~0"),c=c.replace(/~0/g,""),c=c.replace(/^[ \t]+$/gm,""),c=q(c),c=c.replace(/(^|\n)/g,"$1  "),c=c.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(a,b){var c=b;return c=c.replace(/^  /gm,"~0"),c=c.replace(/~0/g,"")}),C("<blockquote>\n"+c+"\n</blockquote>")})},H=function(a){var b,c,d,e,g,h;for(a=a.replace(/^\n+/g,""),a=a.replace(/\n+$/g,""),b=a.split(/\n{2,}/g),c=[],d=b.length,e=0;d>e;e++)g=b[e],g.search(/~K(\d+)K/g)>=0?c.push(g):g.search(/\S/)>=0&&(g=r(g),g=g.replace(/^([ \t]*)/g,"<p>"),g+="</p>",c.push(g));for(d=c.length,e=0;d>e;e++)for(;c[e].search(/~K(\d+)K/)>=0;)h=f[RegExp.$1],h=h.replace(/\$/g,"$$$$"),c[e]=c[e].replace(/~K\d+K/,h);return c.join("\n\n")},I=function(a){return a=a.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;"),a=a.replace(/<(?![a-z\/?\$!])/gi,"&lt;")},J=function(a){return a=a.replace(/\\(\\)/g,Q),a=a.replace(/\\([`*_{}\[\]()>#+-.!])/g,Q)},K=function(a){return a=a.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,'<a href="$1">$1</a>'),a=a.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,function(a,b){return L(M(b))})},L=function(a){var b=[function(a){return"&#"+a.charCodeAt(0)+";"},function(a){return"&#x"+a.charCodeAt(0).toString(16)+";"},function(a){return a}];return a="mailto:"+a,a=a.replace(/./g,function(a){if("@"==a)a=b[Math.floor(2*Math.random())](a);else if(":"!=a){var c=Math.random();a=c>.9?b[2](a):c>.45?b[1](a):b[0](a)}return a}),a='<a href="'+a+'">'+a+"</a>",a=a.replace(/">.+:/g,'">')},M=function(a){return a=a.replace(/~E(\d+)E/g,function(a,b){var c=parseInt(b);return String.fromCharCode(c)})},N=function(a){return a=a.replace(/^(\t|[ ]{1,4})/gm,"~0"),a=a.replace(/~0/g,"")},O=function(a){return a=a.replace(/\t(?=\t)/g,"    "),a=a.replace(/\t/g,"~A~B"),a=a.replace(/~B(.+?)~A/g,function(a,b){var f,d=b,e=4-d.length%4;for(f=0;e>f;f++)d+=" ";return d}),a=a.replace(/~A/g,"    "),a=a.replace(/~B/g,"")},P=function(a,b,c){var e,d="(["+b.replace(/([\[\]\\])/g,"\\$1")+"])";return c&&(d="\\\\"+d),e=new RegExp(d,"g"),a=a.replace(e,Q)},Q=function(a,b){var c=b.charCodeAt(0);return"~E"+c+"E"}},a});