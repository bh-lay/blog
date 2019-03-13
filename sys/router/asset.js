
// 图库
let asset = require('../controller/api/asset/index')
module.exports = [
	// 静态资源
	{
		path: 'get /ajax/asset',
		controller: asset.list
	},
	{
		path: 'post /ajax/asset/upload',
		controller: asset.upload
	},
	{
		path: 'post /ajax/asset/del',
		controller: asset.deleteFile
	},
	{
		path: 'post /ajax/asset/rename',
		controller: asset.renamePath
	},
	{
		path: 'post /ajax/asset/delDir',
		controller: asset.deleteDir
	},
	{
		path: 'post /ajax/asset/createDir',
		controller: asset.createPath
	}
]