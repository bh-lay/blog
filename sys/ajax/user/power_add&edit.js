/**
 * @author bh-lay
 * 
 * demo $.post('/ajax/user',{},function(d){console.log(d)})
 */

var mongo = require('../../core/DB.js');
function add(parm,res_this){
	var parm = parm;
	
	var method = mongo.start();
		
	method.open({'collection_name':'power'},function(err,collection){
		collection.find({}, {}).toArray(function(err, docs) {

			collection.insert(parm,function(err,result){
				if(err){
					console.log(err)
				};
				res_this.json({
					'code' : 1 ,
					'id' : parm.id ,
					'msg' : 'sucess'
				})
				method.close();
			});
		});
	});
}

function edit(parm,res_this){
	var parm = parm;
	
	var method = mongo.start();
		
	method.open({'collection_name':'power'},function(error,collection){
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
}

exports.render = function (req,res_this){
	parse.request(req,function(error,fields, files){
		var data = fields;
		var parm={
			'id' : data['id']||'',
			'name':decodeURI(data['name']),
			'discription':data['discription']||'',
		};
		if(parm['id']&&parm['name']){
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
