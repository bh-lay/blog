
/**
 * 编辑文件
 *
 **/
define(function (require) {
	require('http://cdn.bootcss.com/ace/1.1.3/ace.js');
    
	var tmp = ['<div class="col-md-12"><div class="panel panel-default">',
		'<div class="panel-body">',
			'<div class="input-group">',
				'<input type="text" class="form-control custom-ipt" placeholder="文件路径">',
				'<div class="input-group-btn">',
					'<button type="button" class="btn btn-default custom-btnA" >加载文件</button>',
				'</div>',
			'</div><!-- /input-group -->',
			'<div class="custom-editor"><pre id="editor"></pre></div>',
            '<div class="pull-right"><button type="button" class="btn btn-danger">修改（你丫再想想）</button></div>',
		'</div>',
	'</div></div>'].join('');
    function getSysFile(){
        
    }
    function getStaticFile(url,callback){
        $.ajax({
            'url': url,
            'success' : function(str){
                callback && callback(null,str);
            },
            'error' : function(data){
                var status = data.status;
                callback && callback(status);
            }
        });
    }
    function getFile(url,callback){
        url = (url || '').replace(/^\//,'');
        if(url.slice(0,3) == 'sys'){
            getSysFile(url.slice(3,url.length),callback);
        }else{
            getStaticFile(url.slice(3,url.length),callback)
        }
    }
	return function (dom, id) {
		var $DOM = $(tmp),
            $ipt = $DOM.find('.custom-ipt'),
            $getBtn = $DOM.find('.custom-btnA');
        dom.html($DOM);
        
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/xcode");
        
        $getBtn.on('click',function(){
            var val = $ipt.val();
            if(val.length < 3){
                return;
            }
            getFile(val,function(err,str){
                if(err){
                    UI.prompt('[' + err + ']粗错啦！');
                    return;
                }
                editor.setValue(str);
                editor.getSession().setMode("ace/mode/html");
            })
        });
	};
});