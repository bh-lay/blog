/*
 * author bh-lay
 * 
 */
/*
 @DEMO
	$.ajax({
		'type':'POST',
		'url':'/ajax/addArticle',
		'data':{
			'id' : 'text',
			'title' : 'text',
			'cover' : 'text',
			'time_show' : 'text',
			'tags' : 'text,text,text',
			'author' : 'text',
			'content' : 'text',
			'intro' : 'text',
		},
	});
 */

var mongo = require('../conf/mongo_connect');
var session = require('../lib/session');
var post = require('../lib/post');

function add(parm,res_this){
	var parm = parm;
	
	mongo.start(function(method){
		
		method.open({'collection_name':'article'},function(err,collection){
			collection.find({}, {}).toArray(function(err, docs) {
				parm.id=Date.parse(new Date()).toString(16);
	
				collection.insert(parm,function(err,result){
					if(err) throw err;
					res_this.json({
						'code' : 1,
						'id' : parm.id,
						'msg' : 'add blog sucess !'
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
		
		method.open({'collection_name':'article'},function(error,collection){
			collection.update({'id':parm.id}, {$set:parm}, function(err,docs) {
				if(err) {
					res_this.json({
						'code' : 2,
						'id' : parm.id,
						'msg' : 'edit blog fail !'
					});       
				}else {
					res_this.json({
						'code':1,
						'id' : parm.id,
						'msg':'edit blog success !'
					});
				}
				method.close();
			});
		});
	});
}

exports.render = function (req,res_this,res){
	if (req.method != 'POST'){
		res_this.json({
			'code':2,
			'msg':'please use [post] instead [get] to submit'
		});
		return ;
	}
	post.parse(req,function(err,data){
		
		var data = data;
		var parm={
			'id' : data['id']||'',
			'title':decodeURI(data['title']),
			'cover':data['cover']||'',
			'time_show':data['time_show']||Date.parse(new Date()),
			'tags':data['tags']||'',
			'author':data['author']||'',
			'content':data['content'],
			'intro':data['intro']||data['content'].slice(0,200),
		};
		
		if(parm['title']&&parm['content']){
		
			var session_this = session.start(req,res);
		
			if(parm['id']&&parm['id'].length>2){
				if(session_this.power(3)){
					edit(parm,res_this,res)
				}else{
					res_this.json({
						'code':2,
						'msg':'no power to edit blog !'
					});
				}
			}else{
				if(session_this.power(2)){
					add(parm,res_this,res);
				}else{
					res_this.json({
						'code':2,
						'msg':'no power to add blog !'
					});
				}
			}
		}else{
			res_this.json({
				'code':2,
				'msg':'please insert complete code !'
			});
		}
	});
}
