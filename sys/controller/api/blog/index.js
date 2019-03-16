/*
 * @author bh-lay
 */
let power = require('../../../conf/power.js')
let utils = require('../../../core/utils/index.js')
let detail = require('./detail.js')
let list = require('./list.js')
let addBlog = require('./add.js')
let editBlog = require('./edit.js')

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
exports.put = function (route, connect){
	connect.session(function(session_this){
		if(!session_this.power(power.BLOG_EDIT)){
			connect.write('json', {
				code: 206,
				msg: '没有权限'
			})
			return
		}
		utils.parse.request(connect.request, (err, data) => {
			editBlog(data)
				.then(() => {
					connect.write('json',{
						code: 1,
						msg: 'edit success !'
					})
				})
				.catch(err => {
					connect.write('json',{
						code: 2,
						msg: err.message || 'edit failed !'
					})
					console.log(err)
				})
		})
	})
}

exports.post = function (route, connect){
	connect.session(function(session_this){
		if(!session_this.power(power.BLOG_CREATE)){
			connect.write('json', {
				code: 206,
				msg: '没有权限'
			})
			return
		}
		utils.parse.request(connect.request, (err, data) => {
			addBlog(data)
				.then(() => {
					connect.write('json',{
						code: 1,
						msg: 'create success !'
					})
				})
				.catch(err => {
					connect.write('json',{
						code: 2,
						msg: err.message || 'create failed !'
					})
					console.log(err)
				})
		})
	})
}
