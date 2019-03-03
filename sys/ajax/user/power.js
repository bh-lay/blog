/*
 * @author bh-lay
 */
/*
@demo
-----------------------------------------------------------------
get_list: 								|		get_detail
	$.ajax({                      |       	$.ajax({
		'type':'GET',              |       		'type':'GET',
		'url':'/ajax/blog',        |       		'url':'/ajax/blog',
		'data':{                   |       		'data':{
			'act' : 'get_list',     |       			'act' : 'get_detail',
			'limit_num' : '12',		|					'id' :'123456789'
			'skip_num' : '34'			|				}
		}	       						|       	});
	});                           |
-----------------------------------------------------------------
 */

var DB = require('../../core/DB.js')
var querystring=require('querystring')

var add_editPower = require('./power_add&edit.js')


function get_list(data,callback){
	var limit_num = parseInt(data['limit'])||10,
		skip_num = parseInt(data['skip'])||0
	
	var resJSON = {
		'code':1,
		'limit':limit_num,
		'skip':skip_num,
	}
	DB.getCollection('power')
		.then(({collection, closeDBConnect}) => {
			collection.countDocuments(function(err,count){
				resJSON['count'] = count
				
				collection.find({},{limit:limit_num}).sort({id:1}).skip(skip_num).toArray(function(err, docs) {
					closeDBConnect()
					if(err){
						resJSON.code = 2
					}else{
						resJSON['list'] = docs
					}
					callback&&callback(resJSON)
				})
			})
		}).catch(err => {
			callback && callback(err)
		})
}
function get_detail(data,callback){
	var ID = data['id']
	
	var resJSON={
		'code':1,
		'id' : ID
	}
	DB.getCollection('power')
		.then(({collection, closeDBConnect}) => {
			collection.find({'id':ID}).toArray(function(err, docs) {
				closeDBConnect()
				if(arguments[1].length==0){
					resJSON['code'] = 2
					resJSON['msg'] = 'could not find this power !'
				}else{ 
					resJSON['detail'] = docs[0]
				}
				callback&&callback(resJSON)
			})
		}).catch(err => {
			callback && callback(err)
		})
}

function this_control(data,callback){
	
	if(data['act']=='get_list'){
		get_list(data,function(json_data){
			callback&&callback(json_data)
		})
		
	}else if(data['act']=='get_detail'){
		if(data['id']){
			get_detail(data,function(json_data){
				callback&&callback(json_data)
			})
		}else{
			callback&&callback({
				'code' : 2,
				'msg' : 'plese tell me which power you want to get !'
			})
		}
	}else{
		callback&&callback({
			'code' : 2,
			'msg' : 'plese use [act] get_detail or get_list !'
		})
	}
}

exports.render = function (req,res_this,path){	
	// var url = req.url
	var pathnode = path.pathnode
	if(pathnode.length == 2){
		// var search = url.split('?')[1]
		// var data = querystring.parse(search)
		// cache.use(url,['ajax'],function(this_cache){
		// 	res_this.json(this_cache)
		// },function(save_cache){
		// 	this_control(data,function(this_data){
		// 		save_cache(JSON.stringify(this_data))
		// 	})
		// })
	}else if(pathnode.length == 3){
		if(pathnode[2] == 'add_edit'){
			add_editPower.render(req,res_this)
		}
	}
}