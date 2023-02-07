/**
 * @author bh-lay
 */
let fileList = require('./fileList')
let upload = require('./upload')
let delPath = require('./delete')
let rename = require('./rename')
let createDir = require('./createDir')
var utils = require('../../../core/utils/index.js')
let fs = require('fs')
let assetPath = '../static/'

const base64Decode = str => {
	/* eslint-disable-next-line no-undef */
	return Buffer.from(str, 'base64').toString()
}
// 校验是否有权限操作
const ifHasPermission = (connect, callback) => {
	connect.session(function(session_this){
		let userGroup = session_this.get('user_group')
		if(userGroup === 'admin'){
			callback && callback()
		}else{
			connect.write('json',{
				code : 201,
				msg : 'no power'
			})
		}
	})
}
// 校验路径是否合法，并返回合法路径
const validatePath = realPath => {
	// 屏蔽非法请求
	if (realPath.indexOf('../') > -1) {
		return null
	} else {
		return assetPath + realPath.replace(/^\/|\/$/g,'')
	}
}
// 有操作权限且路径校验通过
const ifHasPermissionAndPathValidated = (route, connect, callback) => {
	//  从路由中获取 base64 路径参数
	let pathBase64 = route.params.path
	// 转换成正常路径
	let realPath = base64Decode(pathBase64)
	// 转换成可操作路径
	let pathname = validatePath(realPath)
	if (pathname) {
		ifHasPermission(connect, () => {
			callback && callback(pathname)
		})
	} else {
		connect.write('json',{
			code : 201,
			msg : 'no power'
		})
	}
}


// 获取某一目录下文件（文件夹）列表
exports.get = (route, connect) => {
	ifHasPermissionAndPathValidated(route, connect, pathname => {
		
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
	ifHasPermissionAndPathValidated(route, connect, pathname => {

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
	ifHasPermissionAndPathValidated(route, connect, pathname => {
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
	ifHasPermissionAndPathValidated(route, connect, pathname => {
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
	
	utils.parse.request(connect.request, function(err, fields){
		var root = fields.pathname || ''
		var dirName = fields.name || ''
		// 转换成可操作路径
		let pathname = validatePath(root)
		if (!pathname) {
			connect.write('json',{
				code : 201,
				msg : 'no power'
			})
			return
		}
		ifHasPermission(connect, () => {
			createDir(pathname, dirName, err => {
				if(err){
					connect.write('json',{
						code : 201,
						msg: err || '创建目录失败 ！'
					})
					return
				}
				connect.write('json',{
					code : 200,
					msg: 'ooooook'
				})
			})
		})
	})
}
