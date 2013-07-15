/**
 * @author bh-lay
 * 
 */
/*
demo
	$.post('/ajax/addArticle',{
		'title':'我是剧中人4',
		'content':'12457898765',
	});
 * 
 */

var mongo = require('../conf/mongo_connect');
var session= require('../conf/session');
var querystring=require('querystring');

function add(parm,res){
	var parm = parm;
	mongo.start({'collection_name':'opus'},function(err,collection,close){
		collection.find({}, {}).toArray(function(err, docs) {
			parm.id=Date.parse(new Date()).toString(16);

			collection.insert(parm,function(err,result){
				if(err) throw err;
				res.end("{'code':1,'id':"+parm.id+",'msg':'sucess'}");
				close();
			});
		});
	});
}
function edit(parm,res){
	var parm = parm;
	mongo.start({'collection_name':'opus'},function(error,collection,close){
		collection.update({'id':parm.id}, {$set:parm}, function(err,docs) {
			if(err) {
			    res.end('fail');        
			}else {
		        res.end('ok');
//		        res.end(docs[0]['title']);
			}
			close();
		});
	});
}

exports.render = function (req,res){
	if (req.method != 'POST'){
		res.end('please use [post] instead [get] to submit');
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
			'opus_pic':data['opus_pic']||'',
			'opus_time_create':data['opus_time_create']||Date.parse(new Date()),
			'tags':data['tags']||'',
			'content':data['content'],
			'intro':data['intro']||data['content'].slice(0,200),
		};
		if(parm['title']&&parm['content']){
			var session_this = session.start(req,res);
			
			if(parm['id']&&parm['id'].length>2){
				if(session_this.power(9)){
					edit(parm,res)
				}else{
					response(res,{
						'code':2,
						'msg':'no power to edit opus !'
					});
				}
			}else{
				if(session_this.power(8)){
					add(parm,res);
				}else{
					response(res,{
						'code':2,
						'msg':'no power to add opus !'
					});
				}
			}
		}else{
			res.end('{\'code\':2,\'msg\':\'please insert complete code !\'}');
		}
	});
}
