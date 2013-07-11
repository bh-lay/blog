/*
 *layUI
 * layUI.init()
 * layUI.select(seleceDom);
*/

var layUI = layUI || {};

(function(ex) {
	function interactive(thisUI) {
		var listCnt;
		var a_item = thisUI.find('.layUISltCntLi a');
		var selectDom = thisUI.prev();
		var page = $(document);
		var activeSelect = null,
			status = 'close';//close open
		function clickBody(e){
			var dx = e.clientX;
			var dy = e.clientY;
			if (dx < activeSelect.offset().left - page.scrollLeft() || dx > activeSelect.offset().left - page.scrollLeft() + activeSelect.width() || dy < activeSelect.offset().top - page.scrollTop() - 30 || dy > activeSelect.offset().top - page.scrollTop() + activeSelect.height()) {
				close(activeSelect);
			}
		}
		function close (dom){
			activeSelect = null ;
			status = 'close';
			dom.stop().animate({
				height : 0
			}, 120);
			page.unbind('mousedown', clickBody);
		}
		function open(dom){
			activeSelect = dom ;
			status = 'open';
			dom.stop().animate({
				height : dom.find('.layUISltCntLi').height()
			}, 100, 'swing');
			page.bind('mousedown', clickBody);
		}
		
		thisUI.on('click','.layUISltOn',function() {
			listCnt = $(this).parent().find('.layUISltCnt');
			if (status == 'open') {
				close(listCnt);
			} else {
				open(listCnt);
			}
		}).on('click', '.layUISltCntLi a', function() {
			a_item.removeClass('on');
			$(this).addClass('on');
			thisUI.find('.layUISltOn span').html($(this).html());
			selectDom.trigger('change');
			selectDom.find('option').attr({
				selected : false
			}).eq($(this).index()).attr({
				selected : true
			});
			close(listCnt);
		});
	}
	var select = function(obj) {
		if(arguments.length < 1){
			return;
		}
		var slt = obj ;
		slt.each(function(i) {
			var selItem = slt.eq(i);
			var parm = eval('('+selItem.attr('data')+')')||{},
				width = parm.width||'';
				console.log(parm)
			if (!selItem.hasClass('layUIOver')) {
				var value = selItem.find('option:selected').html();
				var sltUI = selItem.html().replace(/<\/option>/gi, '</a>')
					.replace(/<option/gi, '<a href="javascript:void(0)"')
					.replace(/selected\=\"selected\"/g, 'class="on"');
				var UI = $('<div class="layUISlt noSelect" style="width:'+width+'"><div class="layUISltOn"><span>' + value + '</span><i class="layUISltOnIco"></i></div><div class="layUISltCnt"><div class="layUISltCntLi">' + sltUI + '</div></div></div>');
				selItem.after(UI);
				selItem.addClass('layUIOver');
				interactive(UI);
			}
		});

	}
	ex.select = select;
	ex.init = function() {
		$('select').length && select($('select.layUI'));
	}
}(layUI));

