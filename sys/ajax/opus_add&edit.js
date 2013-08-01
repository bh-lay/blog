/**
 * @author bh-lay
 * 
 */
/*
@ demo
	$.ajax({
		'type':'POST',
		'url':'/ajax/opus',
		'data':{
			'id' : 'text',
			'title' : 'text',
			'cover' : 'text',
			'opus_time_create' : 'text',
			'tags' : 'text,text,text',
			'opus_pic' : 'text',
			'content' : 'text',
			'intro' : 'text',
		},
	});
 */

var querystring=require('querystring');
var mongo = require('../conf/mongo_connect');
var session= require('../lib/session');
var parse = require('../lib/parse');

function add(parm,res_this){
	var parm = parm;
	mongo.start(function(method){
		
		method.open({'collection_name':'opus'},function(err,collection){
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
		
		method.open({'collection_name':'opus'},function(error,collection){
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
			'opus_pic':data['opus_pic']||'',
			'opus_time_create':data['opus_time_create']||new Date().getTime(),
			'tags':data['tags']||'',
			'content':data['content'],
			'intro':data['intro']||data['content'].slice(0,200),
		};
		if(parm['title']&&parm['content']){
			var session_this = session.start(req,res);
			
			if(parm['id']&&parm['id'].length>2){
				if(session_this.power(9)){
					edit(parm,res_this)
				}else{
					res_this.json({
						'code':2,
						'msg':'no power to edit opus !'
					});
				}
			}else{
				if(session_this.power(8)){
					add(parm,res_this);
				}else{
					res_this.json({
						'code':2,
						'msg':'no power to add opus !'
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
