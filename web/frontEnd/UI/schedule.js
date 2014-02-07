/**
 * @author bh-lay
 * 日程表
 * 
 **/

window.UI = window.UI || {};


(function(exports){
	var schedule_tpl = ['<div style="-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;-khtml-user-select:none;user-select:none">',
		'<div class="schedule_t">',
			'<span></span>',
			'<em class="icon s_left"></em>',
			'<em class="icon s_right"></em>',
		'</div>',
		'<div class="schedule_list">',
			'<div class="schedule_cnt"><table>',
				'<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>',
				'<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>',
				'<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>',
				'<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>',
				'<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>',
				'<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>',
				'<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>',
      	'</table></div>',
   	'</div>',
   '</div>'].join('');
	
	/**
	 * 获取一个月有多少天
	 * @param {String|Number} year  the year ....
	 * @param {String} month  the month（一月即为1） ....\
	 * 
	 * @returns {Number} days the days count in this month  
	 *  
	 */
	function getMonthDays(year,month){
		var date = new Date();
		date.setFullYear(year);
		//把日期设置到下个月一号
		date.setMonth(month);
		date.setDate(1);
		//时间再调回到一天前
		date = new Date(date-(1000*60*60*24));
		//获取当时的日期，即为当月天数
		var days = date.getDate();
		return days;
	}
	/**
	 * 获取一个月第一天是周几
	 * @param {String} year
	 * @param {String} month 整月（一月即为1）
	 * 
	 * @returns {Number} day 0是星期天 1是星期一
	 * 
	 *  
	 */
	function getMonthFirstDay(year,month){
		var date = new Date();
		date.setFullYear(year);
		//设置为当月一日
		date.setMonth(month-1);
		date.setDate(1);
		//获取星期几
		var day = date.getDay();
		return day;
	}
	function refresh(){
		this.dom.find('.schedule_t span').html(this.year + '年' + this.month + '月')
		//当月第一天所在索引（周日为0）
		var firstIndex = getMonthFirstDay(this.year,this.month);
		//当月共有多少天
		var days = getMonthDays(this.year,this.month);
		//上个月的天数
		var lastMonthDays = getMonthDays(this.year,this.month-1);
		
		if(firstIndex == 0){
			firstIndex = 7;
		}
		
		var index = 0;
		var s = 0;
		this.dom.find('td').each(function(){
	//			console.log(firstIndex,index)
			var date ;
			if(index < firstIndex){
				date = lastMonthDays - firstIndex + index + 1;
				$(this).addClass('gray');
			}else{
				date = index - firstIndex + 1;
				if(date <= days){
					$(this).removeClass('gray');
				}else{
					date = ++s;
					$(this).addClass('gray');
				}
			}
			$(this).html(date).attr('data-date',date);
			index++;
		});
		this.changeFn&&this.changeFn(this);
	}
	/**
	 * 创建日历类
	 * @param {Object} dom calendar contented
	 *  
	 */
	function CALENDAR(dom,param){
		var this_sch = this;
		var param = param || {};
		var date = new Date();
		this.year = date.getFullYear();
		this.month = date.getMonth() + 1;
		this.dom = $(schedule_tpl);
		this.changeFn = param['changeFn'] || null;
		
		
		dom.html(this.dom);
		this.dom.find('.schedule_list').animate({
			'height' : 245
		},800);
		this.dom.on('click','.s_right',function(){
			this_sch.nextMonth();
		}).on('click','.s_left',function(){
			this_sch.prevMonth();
		}).on('mouseenter','td',function(){
			$(this).css({'background':'#eee'});
		}).on('mouseleave','td',function(){
			$(this).css({'background':'#fff'});
		}).on('mousedown','td',function(){
			$(this).css({'background':'#ddd'});
		}).on('mouseup','td',function(){
			$(this).css({'background':'#eee'});
		}).on('click','td',function(){
			if($(this).hasClass('gray')){
				if($(this).parent().index() < 3){
					this_sch.prevMonth();
				}else{
					this_sch.nextMonth();
				}
			}
		});
		this.refresh();
	};
	var render_delay;
	CALENDAR.prototype = {
		'prevMonth' : function(){
			if(this.month > 1){
				this.month--;
			}else{
				this.year--;
				this.month = 12;
			}
			this.refresh();
		},
		'nextMonth' : function(){
			if(this.month<12){
				this.month++;	
			}else{
				this.year++;
				this.month = 1;
			}
			this.refresh();
		},
		'prevYear' : function(){
			this.year--;
			this.refresh();
		},
		'nextYear' : function(){
			this.year++;
			this.refresh();
		},
		'refresh' : function(){
			clearTimeout(render_delay);
			var this_cal = this;
			render_delay = setTimeout(function(){
				refresh.call(this_cal);
			},50);
		}
	};

	//
	exports.calendar = CALENDAR;

})(window.UI);


/***
 *
 * new UI.schedule();
 * @param {Object} dom
 */
(function(exports){
	var require = new loader({
		'pop' : '/js/api/UI/pop.js'
	});
	//获取一个月有多少天
	function getMonthDays(year,month){
		var date = new Date();
		date.setFullYear(year);
		//把日期设置到下个月一号
		date.setMonth(month);
		date.setDate(1);
		//时间再调回到一天前
		date = new Date(date-(1000*60*60*24));
		//获取当时的日期，即为当月天数
		var days = date.getDate();
		return days;
	}
	//渲染方法
	function renderItem(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	//拼接浮层html
	function joint_all(input){
		var input = input?input.toString() : '';
		var output = ['<div class="s_stroke">',
			'<div class="s_arrow">',
				'<i class="s_a_u">◆</i>',
				'<i class="s_a_d">◆</i>',
			'</div>',
			'<div class="s_stroke_cnt">',
				input,
			'</div>',
		'</div>'].join('');
		return output;
	}
	function joint_group(name,input){
		var input = input?input.toString() : '';
		var output = ['<div class="strok_t">' + name + '</div>',
		'<div class="strok_c">',
			input,
		'</div>'].join('');
		return output;
	}
	/*
	var list_tpl = ['<div class="s_course">',
		'<div class="s_c_t">{type}：</div>',
		'<div class="s_c_c">',
			'<div class="stroke_list">',
				'<p class="stroke_i">',
					'<span class="ss_time">',
						'<em class="icon"></em>{time}',
					'</span>',
					'<span class="ss_name">',
						'<em class="icon"></em>{name}',
					'</span>',
					'<span class="ss_site">',
						'<em class="icon"></em>{location}',
					'</span>',
				'</p>',
				'<p>备注：{remarks}</p>',
			'</div>',
		'</div>',
	'</div>'].join('');
	*/
	var list_tpl = ['<div class="s_course">',
		'<div class="s_c_c">',
			'<div class="stroke_list">',
				'<p class="stroke_i">',
					'<span class="ss_time">',
						'<em class="icon"></em>{start_time}-{end_time}',
					'</span>',
					'<span class="ss_name">',
						'<em class="icon"></em>{name}',
					'</span>',
				'</p>',
				'<p>备注：{remarks}</p>',
			'</div>',
		'</div>',
	'</div>'].join('');
	
	//渲染列表html
/*	function renderPopTpl(data){
		var html = '';
		for(var i in data){
			if(data[i]['data'].length > 0){
				var name = data[i]['name'];
				var this_html = renderItem(list_tpl, data[i]['data']);
				html += joint_group(name,this_html);
			}
		}
		
		return joint_all(html);
	}
	*/
	function renderPopTpl(data){
		var html = '';
		if(data.length > 0){
			var name = '个人';
			var this_html = renderItem(list_tpl, data);
			html += joint_group(name,this_html);
		}		
		return joint_all(html);
	}
	//创建当前月数据
	function createhMonthData(data,DATE){
		var year = DATE[0];
		var month = DATE[1];
		var output = {};
		//当月第一天
		var thisMonthFirstDate = new Date(year + '-' + month +'-1');
		//当月天数
		var thisMonthLength = getMonthDays(year,month);
//		console.log(thisMonthLength)
		//遍历所有数据
		for(var s in data){
			var create_time = data[s]['create_time'];
			//创建时间
			var createDate = new Date(create_time);
			//第一次展示时间
			var firstShowDate;
			//第一次展示与创建时间间隔天数
			var afterDays = (data[s]['day_in_week'] - createDate.getDay() + 7)%7;
//			console.log('==============================');
			if(afterDays%7 == 0){
				firstShowDate = createDate;
			}else{
				firstShowDate = createDate.setDate(createDate.getDate()+afterDays);
			//	console.log(firstShowDate,createDate);
			}
			
			
		 	//第一次展示与当月第一天的间隔天数
		 	var gap = Math.ceil((thisMonthFirstDate - firstShowDate)/1000/60/60/24);
		// 	console.log(gap);
		 	if(gap >= -thisMonthLength){
			 	for(var i=0;i<thisMonthLength;i++){
			 		//console.log('gap:',gap,'index',i,'week:',data[s]['day_in_week'],'afterDays:',afterDays);
			 		//若在开始展示之前，跳至下一天进行检测
			 		if(gap+i < 0){
			 			continue
			 		}
			 		
					var isBingo = false;
			 		//循环方式
				 	if(data[s]['loop_mode'] == 0){
				 		//不循环
				 		if(gap+i == 0){
				 			isBingo = true;
						}
				 	}else if(data[s]['loop_mode'] == 1){
				 		//每周循环
				 		if((gap+i)%7 == 0){
				 			isBingo = true;
						}
				 	}else if(data[s]['loop_mode'] == 2){
				 		//隔周循环
				 		if((gap+i)%14 == 0){
				 			isBingo = true;
						}
				 	}
				 	if(isBingo){
			 			output[i] = output[i] || {};
			 			output[i]['list'] = output[i]['list'] || [];
			 			if(typeof(output[i]['num']) == 'number'){
							output[i]['num']++;
			 			}else{
			 				output[i]['num'] = 1;
			 			}
			 			
				 		output[i]['list'].push({
							"id": 'none',
							"type" : "课程",
							"start_time": data[s]['start_time'],
							"end_time": data[s]['end_time'],
							'name' : data[s]['course_name'],
							'location' : '',
							'remarks' : data[s]['remark']
						});
				 	}
			 	}
			}
		}
		return output;
	}

	//日历源数据
	function scheduleData(){
		var this_sch = this;
		this.onLoad = null;
		this.data = null;
		this.monthData = null;
		$.ajax({
			'url' : '/c/ajax/schedule/user',
			'type' : 'GET', 
			'success' : function(d){
				//var data = eval('(' + d + ')');
				var data = d;
				if(data&&data['data']){
					for(var s in data['data']){
						//调整周日｛7｝至｛0｝
						data['data'][s]['day_in_week'] = parseInt(data['data'][s]['day_in_week']);
						if(data['data'][s]['day_in_week'] == 7){
							data['data'][s]['day_in_week'] = 0;
						}
					}
					this_sch.data = data['data'];
					this_sch.onLoad&&this_sch.onLoad();
				}else{
					
				}
			}
		});
	}
	//为日程表绘制小点点
	scheduleData.prototype.renderDot = function renderDot(cal){
		var this_sch = this;
		this.monthData = createhMonthData(this.data,[cal.year,cal.month]);
	//	console.log(this);
		cal.dom.find('td').each(function(){
			if($(this).hasClass('gray')){
				return
			}
			var index = parseInt($(this).attr('data-date')) - 1;
			//	console.log(num);
			if(this_sch.monthData[index] && this_sch.monthData[index]['num'] > 0){
				$(this).append('<em class="icon s_remind"><b>' + this_sch.monthData[index]['num'] + '</b><i class="icon"></i></em>')
			}
		});
	};
	//为日程表绑定事件
	scheduleData.prototype.bindEvent = function bindEvent(schedule){
		var this_sch = this;
		schedule.dom.on('click','td',function(){
			if($(this).html().length < 3){
				return
			}
			var index = parseInt($(this).attr('data-date')) - 1;
			var offset = $(this).offset();
		//	console.log(index,this_sch)
			var data = this_sch['monthData'][index]['list'];
			var html = renderPopTpl(data);
			console.log(data,12)
			var plane = UI.plane({
				'width' : 370,
				'top' : offset.top,
				'left' : offset.left - 380,
				'html' : html
			});
			var height = parseInt(plane.dom.css('height'));
			plane.dom.css({
				'marginTop' : -height/2 + 20
			});
		});
	};

	exports.schedule = function(dom){
		var cal = new UI.calendar(dom);
		var sch = new scheduleData();
		sch.onLoad = function(){
			sch.renderDot(cal);
			cal.changeFn = function(){
				sch.renderDot(cal);
			};
			
			require.load('pop',function(){
				sch.bindEvent(cal);
			});
		};
		
		return cal;
	};
})(window.UI);