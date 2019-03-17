/**
 * @author bh-lay
 */
var utils = require('../../../core/utils/index.js')
var fileList = require('./fileList')
var upload = require('./upload')
var delPath = require('./delete')
var rename = require('./rename')
var createDir = require('./createDir')
var assetPath = '../static/'
var fs = require('fs')

const base64Decode = str => {
	/* eslint-disable-next-line no-undef */
	return Buffer.from(str, 'base64').toString()
}

const ifHashPermission = (connect, callback) => {
	connect.session(function(session_this){
		if(session_this.get('user_group') == 'admin'){
			callback && callback(connect)
		}else{
			connect.write('json',{
				code : 201,
				msg : 'no power'
			})
		}
	})
}

// 获取某一目录下文件（文件夹）列表
exports.get = (route, connect) => {
	ifHashPermission(connect, () => {
		let pathBase64 = route.params.path
		let pathStr = base64Decode(pathBase64)
		pathStr = pathStr.replace(/^\/|\/$/g,'')

		var pathname = assetPath + pathStr
		let stat = fs.lstat(pathname, (err, stat) => {
			if (err) {
				connect.write('json',{
					code: 201,
					msg: 'read failed'
				})
				return
			}
			if (stat.isDirectory()) {
				// 读取目录
				fileList(pathStr, function(err,files){
					var json = {
						code : 200,
						files : files
					}
					if(err){
						json.code = 404
						json.msg = 'Directory does not exist!'
					}
					connect.write('json',json)
				})
			} else {
				connect.write('json',{
					code: 201,
					msg: 'not support file reader'
				})
			}
		})
	})
}
// 上传文件
exports.post = (route, connect) => {
	ifHashPermission(connect, () => {
		let pathBase64 = route.params.path
		let path = base64Decode(pathBase64)
		upload(path, connect.request, function(err,files){
			if(err){
				connect.write('json',{
					code : 201
				})
				return
			}
			connect.write('json',{
				code : 200,
				files : files
			})
		})
	})
}
// 重命名
exports.put = (route, connect) => {
	ifHashPermission(connect, () => {
		let pathBase64 = route.params.path
		let path = base64Decode(pathBase64)
		rename(path, connect.request, function(err){
			if(err){
				connect.write('json',{
					code : 201
				})
				return
			}
			connect.write('json',{
				code : 200
			})
		})
	})
}
// 删除
exports.delete = (route, connect) => {
	ifHashPermission(connect, () => {
		let pathBase64 = route.params.path
		let path = base64Decode(pathBase64)
		delPath(path, connect.request, function(err){
			if(err){
				connect.write('json',{
					code : 201,
					msg: err || '删除失败'
				})
				return
			}
			connect.write('json',{
				code : 200
			})
		})
	})
}

exports.createPath = (route, connect) => {
	ifHashPermission(connect, () => {
		createDir(connect.request, err => {
			if(err){
				connect.write('json',{
					code : 201,
					msg: err || '创建目录失败 ！'
				})
				return
			}
			connect.write('json',{
				code : 200
			})
		})
	})
}
