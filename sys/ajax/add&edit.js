/**
 * @author bh-lay
 * 
 */

let DB = require('../core/DB.js')
let utils = require('../core/utils/index.js')

function add(parm,collection_name,callback){	
	DB.getCollection(collection_name)
		.then(({collection, closeDBConnect}) => {
			parm.id = utils.createID()

			collection.insertOne(parm,function(err){
				if(err){
					callback && callback(err)
					return
				}
				callback && callback(null)
			
				closeDBConnect()
			})
		}).catch(err => {
			callback && callback(err)
		})
}
function edit(parm,collection_name,callback){
	DB.getCollection(collection_name)
		.then(({collection, closeDBConnect}) => {
			collection.updateOne({
				id: parm.id
			}, {
				$set:parm
			}, function(err) {
				if(err) {
					callback && callback(err)
				}else {
					callback && callback(null)
				}
				closeDBConnect()
			})
		}).catch(err => {
			callback && callback(err)
		})
}

////////////////////////////////////////////////
function filter_request(connect,callback){

	connect.session(function(session_this){
		let need_power
		let error = null
		let data_filter = {
			data : {},
			collection_name : null
		}
		
		utils.parse.request(connect.request,function(err,data){
			let category = data['category'] || ''
			switch(category){
			case 'blog' :
				data_filter = filter_request.blog(data)
				data_filter['collection_name'] = 'article'
				need_power = 3
				break
			case 'labs' :
				data_filter = filter_request.labs(data)
				data_filter['collection_name'] = 'labs'
				need_power = 3
				break
			default :
				error = 'please input category [blog,labs]'
			}
			if(!session_this.power(need_power)){
				error = 'no power'
			}
			callback(error,data_filter)
		})	
	})

}

filter_request.blog = function(data){
	let error = null
	let param = {
		id : data['id']||null,
		title :decodeURI(data['title']),
		cover: data['cover']||'',
		time_show: data['time_show'] || new Date().getTime().toString(),
		tags: data['tags'] ? data['tags'].split(/\s*,\s*/) : [],
		author: data['author']||'',
		content: data['content'],
		intro: data['intro'] || data['content'].slice(0,200),
	}
	if(!(param['title']&&param['content'])){
		error = 'please insert complete code !'
	}
	return {error:error,data:param}
}

filter_request.labs = function(data){
	let error = null
	let param = {
		'id' : data['id']||'',
		'name' : data['name']||'',
		'title':decodeURI(data['title']),
		'cover':data['cover']||'',
		'time_create':data['time_create']||new Date().getTime(),
		'content':data['content'],
		'git_full_name' : data['git_full_name'],
		'demo_url' : data['demo_url'],
		'intro':data['intro'] || data['content'].slice(0,200),
	}
	if(!(param['title']&&param['content'])){
		error = 'please insert complete code !'
	}
	return {
		'error' : error,
		'data' : param
	}
}

//////////////////////////////////////////////////////
exports.render = function (connect,app){

	filter_request(connect,function(err,param){
		if(err){
			connect.write('json',{
				'code':2,
				'msg':err
			})
			return
		}
		let data = param['data']
		let collection_name = param['collection_name']
		
		if(data['id']&&data['id'].length > 2){
			edit(data,collection_name,function(err){
				if(err){
					connect.write('json',{
						code:2,
						msg: 'edit fail !'
					})
				}else{
					connect.write('json',{
						code: 1,
						id : data.id,
						msg: 'edit success !'
					})
					app.cache.clear()
				}
			})
		}else{
			add(data,collection_name,function(err){
				if(err){
					connect.write('json',{
						code: 2,
						msg: 'edit fail !'
					})
				}else{
					connect.write('json',{
						code: 1,
						id : data.id,
						msg: 'edit success !'
					})
					app.cache.clear()
				}
			})
		}
	})
}
