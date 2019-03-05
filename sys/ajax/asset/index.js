/**
 * @author bh-lay
 */
var utils = require('../../core/utils/index.js')
var read = require('./fileList')
var upload = require('./upload')
var del = require('./delete')
var rename = require('./rename')
var createDir = require('./createDir')

const getList = connect => {
	utils.parse.request(connect.request,function(err,data){
		var pathStr = data.path
		
		read.list(pathStr,function(err,files){
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
	})
}
const uploadFile = connect => {
	upload.upload(connect.request,function(err,files){
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
}
const deleteFile = connect => {
	del.file(connect.request,function(err){
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
}
const renamePath = connect => {
	rename.rename(connect.request, function(err){
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
}
const createPath = connect => {
	createDir.createDir(connect.request,function(err){
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
}

const doFn = (fnName, connect) => {
	connect.session(function(session_this){
		if(session_this.get('user_group') == 'admin'){
			switch (fnName) {
			case 'getList':
				getList(connect)
				break
			case 'upload':
				uploadFile(connect)
				break
			case 'deleteFile':
				deleteFile(connect)
				break
			case 'renamePath':
				renamePath(connect)
				break
			case 'createPath':
				createPath(connect)
				break
			}
		}else{
			connect.write('json',{
				code : 201,
				msg : 'no power'
			})
		}
	})
}


exports.list = (route, connect) => {
	doFn('getList', connect)
}
exports.upload = (route, connect) => {
	doFn('upload', connect)
}
exports.deleteFile = (route, connect) => {
	doFn('deleteFile', connect)
}
exports.deleteDir = (route, connect) => {
	connect.write('json',{
		code : 203
	})
}
exports.renamePath = (route, connect) => {
	doFn('renamePath', connect)
}
exports.createPath = (route, connect) => {
	doFn('createPath', connect)
}
