

/***
 * 分页 页码
 **/
define([
	'js/Base'
],function(utils){
	function render(){
		var txt = '<ul class="pagination">';
        if(this.page_num < 2){
            return;
        }
		if (this.page_cur > 1) {
			txt += '<li class="pagination_prev"><a data-page="prev" href="javascript:void(0)" >上一页</a></li>';
		}else{
			txt += '<li class="pagination_prev disabled"><span>上一页</span></li>';
		}
		var btn_num = 0;
		var start_num = 0;
		if(this.page_num > this.max_page_btn){
			start_num =  this.page_cur - Math.floor(this.max_page_btn/2);
		}


		start_num = Math.max(start_num,1);
		for(; start_num < this.page_num + 1; start_num++) {
			if(start_num != this.page_cur){
				txt += '<li><a data-page="jump" href="javascript:void(0)">' + start_num + '</a></li>';
			}else{
				txt += '<li class="active"><span>'+ start_num +'</span></li>';
			}
			btn_num++;
			if(btn_num >= this.max_page_btn){
				break;
			}
		}
		if (this.page_num - this.page_cur >= 1) {
			txt += '<li class="pagination_next"><a data-page="next" href="javascript:void(0)">下一页</a></li>';
		}else{
			txt += '<li class="pagination_next disabled"><span>下一页</span></li>';
		}
        txt += '</ul>';
		this.dom.innerHTML = txt;
	}
	function pageList(dom,param){
		var param = param || {};
		var me = this;
		this.list_count = param.list_count || 0;
		this.page_cur = param.page_cur || 1;
		this.page_list_num = param.page_list_num || 15;
		this.page_num = Math.ceil(this.list_count / this.page_list_num);
		this.max_page_btn = param.max_page_btn || 50;
		this.jump = null;
		this.dom = document.createElement('div');

		utils.bind(this.dom,'click','a',function(e){
			var num,
					page = this.getAttribute('data-page');
			switch (page) {
				case 'next':
					me.jumpTo(++me.page_cur);
					break;
				case 'prev':
					me.jumpTo(--me.page_cur);
					break;
				default:
				// 'jump':
					num = parseInt(this.innerHTML);
					me.page_cur = num - 1;
					me.jumpTo(num);
			}
			e.preventDefault();
		});
		dom.innerHTML = '';
		dom.appendChild(this.dom);
		render.call(this);
	}
	pageList.prototype = {
		jumpTo : function(num){
			this.page_cur = num;
			render.call(this);
			this.jump && this.jump(num);
		}
	};
	return pageList;
});
