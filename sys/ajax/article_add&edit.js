/*
 * author bh-lay
 * demo $.post('/ajax/addArticle',{'title':'我是剧中人4','content':'12457898765','gd':43},function(d){console.log(d)})
 */

var mongo = require('../conf/mongo_connect');
var querystring=require('querystring');
var session= require('../conf/session');

function response(res,data){
	res.write(JSON.stringify(data));
	res.end();
}

function add(parm,res){
	var parm = parm;
	mongo.start({'collection_name':'article'},function(err,collection,close){
		collection.find({}, {}).toArray(function(err, docs) {
			parm.id=Date.parse(new Date()).toString(16);

			collection.insert(parm,function(err,result){
				if(err) throw err;
				response(res,{
					'code' : 1,
					'id' : parm.id,
					'msg' : 'add blog sucess !'
				});
				close();
			});
		});
	});
}
function edit(parm,res){
	var parm = parm;
	mongo.start({'collection_name':'article'},function(error,collection,close){
		collection.update({'id':parm.id}, {$set:parm}, function(err,docs) {
			if(err) {
				response(res,{
					'code' : 2,
					'id' : parm.id,
					'msg' : 'edit blog fail !'
				});       
			}else {
				response(res,{
					'code':1,
					'id' : parm.id,
					'msg':'edit blog success !'
				});
			}
			close();
		});
	});
}

exports.render = function (req,res){
	if (req.method != 'POST'){
		response(res,{
			'code':2,
			'msg':'please use [post] instead [get] to submit'
		});
		return ;
	}
	
	var info='';
	req.addListener('data', function(chunk){
		info += chunk; 
	}).addListener('end', function(){
		var data = querystring.parse(info);
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
					edit(parm,res)
				}else{
					response(res,{
						'code':2,
						'msg':'no power to edit blog !'
					});
				}
			}else{
				if(session_this.power(2)){
					add(parm,res);
				}else{
					response(res,{
						'code':2,
						'msg':'no power to add blog !'
					});
				}
			}
		}else{
			response(res,{
				'code':2,
				'msg':'please insert complete code !'
			});
		}
	});
}
