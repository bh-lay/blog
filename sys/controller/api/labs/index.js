/*
 * @author bh-lay
 */
let power = require('../../../conf/power.js')
let utils = require('../../../core/utils/index.js')
let detail = require('./detail.js')
let list = require('./list.js')
let addLabs = require('./add.js')
let editLabs = require('./edit.js')
let deleteLabs = require('./del.js')

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
		if(!session_this.power(power.LABS_EDIT)){
			connect.write('json', {
				code: 206,
				msg: '没有权限'
			})
			return
		}
		utils.parse.request(connect.request, (err, data) => {
			editLabs(data)
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

exports.post = function (route, connect){
	connect.session(function(session_this){
		if(!session_this.power(power.LABS_CREATE)){
			connect.write('json', {
				code: 206,
				msg: '没有权限'
			})
			return
		}
		utils.parse.request(connect.request, (err, data) => {
			addLabs(data)
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
			if(session_this.power(power.LABS_DELETE)){
				deleteLabs(ID)
					.then(() => {
							connect.write('json',{
								'code' : 200
							})
							// 清除所有缓存
							app.cache.clear('comment')
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
