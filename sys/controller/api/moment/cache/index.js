/*
 * @author bh-lay
 */
let cache = require('../../../../functions/moment/cache.js')
let power = require('../../../../conf/power.js')
let utils = require('../../../../core/utils/index.js')
let list = require('./list.js')
let deleteCache = require('./del.js')

exports.list = function (route, connect,app){
	let data = connect.url.search
	list(data, function(json_data){
		connect.write('json',json_data)
	})
}

exports.get = function (route, connect,app){
	let cacheName =  route.params.name
	cache.get(cacheName)
		.then(data => {
			connect.write('json', {
				code: 200,
				data
			})
		})
		.catch(err => {
			connect.write('json', {
				code: 404
			})
		})
}
exports.put = function (route, connect){
	let cacheName =  route.params.name
	connect.session(function(session_this){
		if(!session_this.power(power.BLOG_EDIT)){
			connect.write('json', {
				code: 206,
				msg: '没有权限'
			})
			return
		}
		utils.parse.request(connect.request, (err, data) => {
			console.log('data', data)
			let content = JSON.parse(data.content)
			cache.save(cacheName, content)
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
				})
		})
	})
}


// 删除
exports.delete = function (route, connect,app){
	let ID = route.params.id
	if(ID.length<2){
		connect.write('json',{
			'code' : 2,
			'msg' : 'please input [id] for del !'
		})
	}else{
		connect.session(function(session_this){
			// 校验权限
			if(session_this.power(power.BLOG_DELETE)){
				deleteCache(name)
					.then(() => {
						connect.write('json',{
							'code' : 200
						})
					})
					.catch((err) => {
						connect.write('json',{
							'code' : 500
						})
					})
			}else{
				connect.write('json',{
					'code' : 201
				})
			}
		})
	}
}
