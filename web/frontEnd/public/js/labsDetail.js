/**
 * opus detail
 *  
 */
define(function(require,exports){
	require('/frontEnd/lib/juicer.js');
	require('/frontEnd/public/css/labs.css');
	
	function getData(id,fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/labs',
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
					L.dialog.tips('试验品不存在！');
					lofox.push('/opus',{render:false});
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
		 
		$.get('/ajax/temp?labs_detail',function(data){
			var template = data['labs_detail'];
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
});