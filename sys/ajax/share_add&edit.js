/**
 * @author bh-lay
 * 
 */
/*
@ demo
	$.ajax({
		'type':'POST',
		'url':'/ajax/share',
		'data':{
			'id' : 'text',
			'title' : 'text',
			'cover' : 'text',
			'time_show' : 'text',
			'tags' : 'text,text,text',
			'from' : 'text',
			'from_url' : 'text',
			'content' : 'text',
			'intro' : 'text',
		},
	});
 */

var mongo = require('../conf/mongo_connect');
var querystring = require('querystring');
var parse = require('../lib/parse');

function add(parm,res_this){
	var parm = parm;
	mongo.start(function(method){
		
		method.open({'collection_name':'share'},function(err,collection){
			collection.find({}, {}).toArray(function(err, docs) {
				
				parm.id = parse.createID();
	
				collection.insert(parm,function(err,result){
					if(err) throw err;
					
					res_this.json({
						'code' : 1,
						'id' : parm.id ,
						'msg' : 'sucess'
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
		
		method.open({'collection_name':'share'},function(error,collection){
			collection.update({'id':parm.id}, {$set:parm}, function(err,docs) {
				if(err) {
				    res_this.json({
						'code' : 2,
						'msg' : 'fail'
					});         
				}else {
			        res_this.json({
						'code' : 1,
						'msg' : 'sucess'
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
			'code' : 2,
			'msg' : 'please use [post] instead [get] to submit'
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
			'time_show':data['time_show']||new Date().getTime(),
			'tags':data['tags']||'',
			'content':data['content'],
			'from':data['from'],
			'from_url':data['from_url'],
			'intro':data['intro']||data['content'].slice(0,200),
		};
		if(parm['title']&&parm['content']){
			if(parm['id']&&parm['id'].length>2){
				edit(parm,res_this)
			}else{
				add(parm,res_this);
			}
		}else{
			res_this.json({
				'code':2,
				'msg':'please insert complete code !'
			});
		}
	});
}
