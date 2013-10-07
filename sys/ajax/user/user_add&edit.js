/**
 * @author bh-lay
 * 
 * demo $.post('/ajax/user',{
	
	});
 */

var mongo = require('../../conf/mongo_connect');
var session = require('../../mod/session');

function add(parm,res_this){
	var parm = parm;
	
	mongo.start(function(method){
		
		method.open({'collection_name':'user'},function(err,collection){
		
			collection.find({}, {}).toArray(function(err, docs) {
		
				parm.id = parse.createID();
	
				collection.insert(parm,function(err,result){
					if(err) throw err;
					res_this.json({
						'code' : 1,
						'id' : parm.id ,
						'msg' : 'sucess !'
					});
					method.close();
				});
			});
		});
	});
}

function edit(parm,res_this){
	var parm = parm;
	
	mongo.start(function(method){
		
		method.open({'collection_name':'user'},function(error,collection){
			collection.update({'id':parm.id}, {$set:parm}, function(err,docs) {
				if(err) {
					res_this.json({
						'code' : 1,
						'msg' : 'modified failure !'
					});       
				}else {
					res_this.json({
						'code' : 1,
						'msg' : 'modified success !'
					});
				}
				method.close();
			});
		});
	});
}

exports.render = function (req,res_this){
	parse.request(req,function(error,fields, files){
		var data = fields;
		var parm={
			'id' : data['id']||'',
			'usernick':decodeURI(data['usernick']),
			'username':data['username']||'',
			'password':data['password']||'',
			'user_group':data['user_group']||'',
		};
		if(parm['username']){
			
			var session_this = session.start(req,res_this);
		
			if(parm['id']&&parm['id'].length>2){
				if(session_this.power(12)){
					edit(parm,res_this);
				}else{
					res_this.json({
						'code':2,
						'msg':'no power to edit user !'
					});
				}
			}else{
				if(session_this.power(11)){
					add(parm,res_this);
				}else{
					res_this.json({
						'code':2,
						'msg':'no power to edit user !'
					});
				}
			}
		}else{
			res_this.json({
				'code' : 2,
				'msg' : 'please insert complete code !'
			});
		}
	});
}
