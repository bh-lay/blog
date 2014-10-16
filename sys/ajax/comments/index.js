/**
 * @author bh-lay
 * 
 * /ajax/user
 * /ajax/user/signup
 * /ajax/user/login
 * /ajax/user/list
 * demo $.post('/ajax/user',{
	
	});
 */

var parse = require('../../lofox/parse.js');
var add = require('./add.js');
var list = require('./list.js');

//一分钟限制十个回复
var time_limit = 60 * 1000;
var count_limit = 10;

//接口
exports.add = function (connect,app){
	parse.request(connect.request,function(err,data){
		connect.session(function(session_this){
			//获取评论计数
			var comment_count = session_this.get('comment_count') || 0;
			
			//上次清除评论计数的时间
			var last_clear_time = session_this.get('comment_count_clear') || new Date().getTime();
			var now = new Date().getTime();
			//时间间隔在限制之外
			if(now - last_clear_time > ){
				//评论计数置为一
				session_this.set({
					'comment_count' : 1;
				});
			}else{
				//指定时间内 评论数超过上限
				if(comment_count >= count_limit){
					connect.write('json',{
						'code' : 403
						'评论频率过快，请歇息片刻！'
					});
					return;
				}else{
					//评论计数加一
					session_this.set({
						'comment_count' : comment_count + 1;
					});
				}
			}
		
		
			data.uid = session_this.get('uid');
			add(data,function(err,data){
				var json = {
					'code' : 200
				}
				if(err){
					json.code = 201
				}else{
					json.data = data;
				}
				connect.write('json',json);
			});
		});
	});
}

//接口
exports.list = function (connect,app){
	var data = connect.url.search;
	list(data,function(err,jsonData){
		var json = {
			'code' : 200
		}
		if(err){
			json.code = 201
		}else{
			json.data = jsonData;
		}
		connect.write('json',json);
	});
}
