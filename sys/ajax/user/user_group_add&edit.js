/**
 * @author bh-lay
 * 
 * demo $.post('/ajax/user',{},function(d){console.log(d)})
 */

var mongo = require('../../conf/mongo_connect');
var session = require('../../mod/session');
var parse = require('../../lib/parse');

function add(parm,res_this){
	var parm = parm;
	
	mongo.start(function(method){
		
		method.open({'collection_name':'user_group'},function(err,collection){
			collection.find({}, {}).toArray(function(err, docs) {
				parm.id = parse.createID();
	
				collection.insert(parm,function(err,result){
					if(err) throw err;
					res_this.json({
						'code' : 1 ,
						'id' : parm.id ,
						'msg' : 'sucess'
					})
					method.close();
				});
			});
		});
	});
}

function edit(parm,res_this){
	var parm = parm;
	
	mongo.start(function(method){
		
		method.open({'collection_name':'user_group'},function(error,collection){
			collection.update({'id':parm.id}, {$set:parm}, function(err,docs) {
				if(err) {
					res_this.json({
						'code' : 2 ,
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
			'user_group_nick':decodeURI(data['user_group_nick']),
			'user_group_name':data['user_group_name']||'',
			'power':data['power']||'',
		};
		if(parm['user_group_name']){
			if(parm['id']&&parm['id'].length>2){
				edit(parm,res_this)
			}else{
				add(parm,res_this);
			}
		}else{
			res_this.json({
				'code' : 2,
				'msg' : 'please insert complete code !'
			});
		}
	});
}
