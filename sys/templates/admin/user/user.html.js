/**
 * @author bh-lay
 * 
 * url  path + /user.html?userid=____
 */

var fs = require('fs');
var url = require('url');
var temp=fs.readFileSync('./templates/admin/user/user.html', "utf8");
var querystring=require('querystring');
var mongo = require('../../../conf/mongo_connect');

var user_group = {
	'admin' : '管理员',
	'editor' : '编辑',
	'test' : '测试',
};

function valueInit(data){
	var txt = temp.replace(/\{(user_group)}/g,function(){
		var user_group_tpl = '';
		data['user_group'] = '';
		for(var i in user_group){
			if(data['user_group'] == i){
				user_group_tpl += '<option value="'+ i +'" selected="selected">' + user_group[i] + '</option>';
			}else{
				user_group_tpl += '<option value="'+ i +'">' + user_group[i] + '</option>';
			}
		}
		return user_group_tpl;
	}).replace(/\{(\w*)}/g,function(){
		return data[arguments[1]]||'';
	});
	return txt;
}
exports.render = function (req,res_this){

	var search = url.parse(req.url).search;
	search&&(search=search.replace('?',''));
	var userID = querystring.parse(search).userid;
	if(userID){
		var method = mongo.start();
	
		method.open({'collection_name':'user'},function(err,collection){
	
			collection.find({'id':userID}).toArray(function(err, docs) {		
				if(docs.length == 0){
					res_this.json({'msg':'this user is not found !'});
				}else{
					var txt = valueInit(docs[0]);
					res_this.html(200,txt);
				}
				
				method.close();
			});
			
		});
	}else{
		res_this.html(200,valueInit({}));
	}
}
