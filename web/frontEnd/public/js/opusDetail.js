/**
 * opus detail
 *  
 */
define(function(require,exports){
	require('/frontEnd/lib/juicer.js');
	require('/frontEnd/public/css/opus.css');
	
	function getData(id,fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/opus',
			'data' : {
				'act' : 'get_detail',
				'id' : id
			},
			'success' :function(data){
				if(data.code == 1){
					var detail = data['detail'];
					var date = new Date(parseInt(detail.opus_time_create));
					detail.opus_time_create = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					
					fn&&fn(detail,detail['title']);
				}else{
				//	L.dialog.tips('作品不存在！');
			//		L.push('/opus');
					fn&&fn();
				}
			}
		});
	};
	return function(dom,id){
		var render_over = this.render_over || null;
		var param = param || {},
			 dom = dom || $('.contlayer'),
			 id = id || null;
		 
		$.get('/ajax/temp?opus_detail',function(data){
			var template = data['opus_detail'];
			if(!template){
				console.log('error','get template error !');
				return
			}
			getData(id,function(detail,title){
				var this_html = juicer(template,detail);
				this_html&&dom.html(this_html);
				render_over&&render_over(title);
			});
		});
	};
})(render);