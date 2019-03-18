/**
 * @author bh-lay
 */
let fileList = require('./fileList')
let upload = require('./upload')
let delPath = require('./delete')
let rename = require('./rename')
let createDir = require('./createDir')
let fs = require('fs')
let assetPath = '../static/'

const base64Decode = str => {
	/* eslint-disable-next-line no-undef */
	return Buffer.from(str, 'base64').toString()
}

const ifHashPermission = (route, connect, callback) => {
	let pathBase64 = route.params.path
	let realPath = base64Decode(pathBase64)
	// 去除首尾 【/】
	realPath = realPath.replace(/^\/|\/$/g,'')
	let pathname = assetPath + realPath
	// 屏蔽非法请求
	if (pathname.indexOf('../') > -1) {
		connect.write('json',{
			code : 201,
			msg : 'no power'
		})
	}
	connect.session(function(session_this){
		if(session_this.get('user_group') == 'admin'){
			callback && callback(pathname)
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
	ifHashPermission(route, connect, pathname => {
		fs.lstat(pathname, (err, stat) => {
			if (err) {
				connect.write('json',{
					code: 201,
					msg: 'read failed'
				})
				return
			}
			if (stat.isDirectory()) {
				// 读取目录
				fileList(pathname, function(err,files){
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
	ifHashPermission(route, connect, pathname => {

		upload(pathname, connect.request, (err,files) => {
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
	ifHashPermission(route, connect, pathname => {
		rename(pathname, connect.request, function(err){
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
	ifHashPermission(route, connect, pathname => {
		delPath(pathname, connect.request, function(err){
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
	ifHashPermission(route, connect, () => {
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
