/*
 * @author bh-lay
 */
/*
@demo
-----------------------------------------------------------------
get_list:
  $.ajax({
    'type':'GET',
    'url':'/ajax/blog',
    'data':{
      'act' : 'get_list',
      'limit_num' : '12',
      'skip_num' : '34',
      'tag' : 'javascript'
    }
  });

get_detail
  $.ajax({
    'type':'GET',
    'url':'/ajax/blog',
    'data':{
      'act' : 'get_detail',
      'id' :'123456789'
    }
  });
-----------------------------------------------------------------
 */

let DB = require('../core/DB.js')

let showdown  = require('showdown')

function get_list(data,callback){
	let limit_num = parseInt(data['limit']) || 10
	let skip_num = parseInt(data['skip']) || 0
	let findKeys = {}

	//过滤标签
	if(data.tag){
		findKeys.tags = data.tag
	}
	DB.getCollection('article')
		.then(({collection, closeDBConnect}) => {
			//count the all list
			let resJSON = {
				code: 1,
				limit: limit_num,
				skip: skip_num,
			}
			collection.countDocuments(findKeys,function(err,count){
				resJSON['count'] = count
				collection.find(findKeys,{
					limit: limit_num
				}).sort({
					time_show: -1
				}).skip(skip_num).toArray(function(err, docs) {
					closeDBConnect()
					if(err){
						resJSON.code = 2
					}else{
						for(let i in docs){
							delete docs[i]['content']
						}
						resJSON['list'] = docs
					}
					callback&&callback(resJSON)
				})
			})
		}).catch(() => {
			callback&&callback({
				code: 500
			})
			return
		})
  
}
function get_detail(data,callback){
	var articleID = data['id'],
		//内容格式 html/markdown
		format = data['format'] || 'markdown',
		resJSON={
			code: 200,
			id : articleID,
			format : format
		}
	DB.getCollection('article')
		.then(({collection, closeDBConnect}) => {
			collection.find({
				id:articleID
			}).toArray(function(err, docs) {
				closeDBConnect()
				if(arguments[1].length==0){
					resJSON['code'] = 2
					resJSON['msg'] = 'could not find this blog !'
				}else{
					resJSON['detail'] = docs[0]
					if(format == 'html'){
						var converter = new showdown.Converter()
						resJSON['detail'].content = converter.makeHtml(resJSON['detail'].content)
					}
				}
				callback&&callback(resJSON)
			})
		}).catch(() => {
			resJSON.code = 500
			callback&&callback(resJSON)
		})
}

function this_control(connect,callback){
	var data = connect.url.search,
		act = data['act']

	if( act == 'get_list' ){
		get_list(data,function(json_data){
			callback&&callback(json_data)
		})

	}else if( act == 'get_detail' ){
		if(data['id']){
			get_detail(data,function(json_data){
				callback&&callback(json_data)
			})
		}else{
			callback&&callback({
				code : 2,
				msg : 'plese tell me which blog article you want to get !'
			})
		}
	}else{
		callback&&callback({
			code : 2,
			msg : 'plese use [act] get_detail or get_list !'
		})
	}
}

exports.render = function (connect,app){
	var url = connect.request.url

	app.cache.use(url,['ajax','article'],function(this_cache){
		connect.write('json',this_cache)
	},function(save_cache){
		this_control(connect,function(this_data){
			save_cache(JSON.stringify(this_data))
		})
	})
}
