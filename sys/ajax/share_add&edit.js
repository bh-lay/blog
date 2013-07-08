/*
 * author bh-lay
 * demo $.post('/ajax/addArticle',{'title':'我是剧中人4','content':'12457898765','gd':43},function(d){console.log(d)})
 */

var mongo = require('../conf/mongo_connect');
var querystring = require('querystring');

function add(parm,res){
	var parm = parm;
	mongo.open({'collection_name':'share'},function(err,collection,close){
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
	mongo.open({'collection_name':'share'},function(error,collection,close){
		collection.update({'id':parm.id}, {$set:parm}, function(err,docs) {
			if(err) {
			    res.end('fail');        
			}else {
		        res.end('ok');
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
			'time_show':data['time_show']||Date.parse(new Date()),
			'tags':data['tags']||'',
			'content':data['content'],
			'from':data['from'],
			'from_url':data['from_url'],
			'intro':data['intro']||data['content'].slice(0,200),
		};
		if(parm['title']&&parm['content']){
			if(parm['id']&&parm['id'].length>2){
				edit(parm,res)
			}else{
				add(parm,res);
			}
		}else{
			res.end('{\'code\':2,\'msg\':\'please insert complete code !\'}');
		}
	});
}
