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



//接口
exports.add = function (connect,app){
	var data = connect.url.search;
	connect.session(function(session_this){
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
}

//接口
exports.list = function (connect,app){
	var data = connect.url.search;
	list(data,function(err,data){
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
}
