/*
 * @author bh-lay
 */
let detail = require('./detail.js')
let list = require('./list.js')



exports.list = function (route, connect,app){
	var url = connect.request.url
	app.cache.use(url,['ajax','article'],function(this_cache){
		connect.write('json',this_cache)
	},function(save_cache){
			let data = connect.url.search
			list(data, function(json_data){
				save_cache(JSON.stringify(json_data))
			})
	})
}

exports.get = function (route, connect,app){
	var url = connect.request.url
	app.cache.use(url,['ajax','article'],function(this_cache){
		connect.write('json',this_cache)
	},function(save_cache){
			let data = connect.url.search
			let id = route.params.id
			// 内容格式 html/markdown
			let format = data['format'] || 'markdown'
			detail(id, format, function(json_data){
				save_cache(JSON.stringify(json_data))
			})
			
	})
}
