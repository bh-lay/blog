/**
 * @author bh-lay
 * 
 * demo $.post('/ajax/user',{
	
	});
 */

var mongo = require('../conf/mongo_connect');
var session = require('../mod/session');

function add(parm,res_this){
	var parm = parm;
	
	var method = mongo.start();
		
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
}

function edit(parm,res_this){
	var parm = parm;
	
	var method = mongo.start();
		
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
}
function add_edit (){
	var that = this;
	parse.request(this.request,function(error,fields, files){
		var data = fields;
		var parm = {
			'id' : data['id'] || '',
			'username':data['username'] || '',
			'password':data['password'] ? parse.md5(data['password']) : null,
			'email':data['email'] || null,
			'user_group':data['user_group'] || '',
		};
		if(!parm['username']){
			that.res.json({
				'code' : 2,
				'msg' : 'please insert complete code !'
			});
			return
		}
		
		session.start(that.request,that.res,function(){
			var session_this = this;
			if(parm['id']&&parm['id'].length>2){
				//check edit user power
				if(session_this.power(12)){
					if(parm['password'] == null){
						delete parm['password'];
					}
					edit(parm,that.res);
				}else{
					that.res.json({
						'code':2,
						'msg':'no power to edit user !'
					});
				}
			}else{
				//check add user power
				if(session_this.power(11)){
					add(parm,that.res);
				}else{
					that.res.json({
						'code':2,
						'msg':'no power to edit user !'
					});
				}
			}
		});
	});
}

function signup(){
	var that = this;
	parse.request(this.request,function(error,data){
		var param = {};
		param['email'] = data['email'] || null;
		param['password'] = parse.md5(data['password'] || '');
		param['user_group'] = 'user';
		param['id'] = parse.createID();
		if(param['email']&&param['password']){
			var method = mongo.start();
			method.open({'collection_name':'user'},function(err,collection){
				collection.find({}, {}).toArray(function(err, docs) {
					collection.insert(param,function(err,result){
						method.close();
						if(err){
							console.log(err);
						}
						that.res.json({
							'code' : 1,
							'id' : param.id ,
							'msg' : 'sucess !'
						});
					});
				});
			});
		}else{
			that.res.json({
				'code' : 2,
				'msg' : 'signup fail'
			});
		}
	});
}
exports.render = function (req,res_this,path){
	this.request = req;
	this.res = res_this;
	this.path = path;
	if(path.pathnode.length == 2){
		add_edit.call(this);
	}else if(path.pathnode.length == 3){
		switch(path.pathnode[2]){
			case 'signup':
				signup.call(this);
			break
			default :
				res_this.json({
					'code' : 2,
					'msg' : 'wrong path'
				});
		}
	}else{
		res_this.json({
			'code' : 2,
			'msg' : 'wrong path'
		});
	}
}
