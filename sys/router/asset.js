
//图库
let asset = require('../controller/api/asset/index')
module.exports = [
	// 静态资源
	{
		path: 'all /ajax/asset',
		controller: asset.list
	},
	{
		path: 'all /ajax/asset/upload',
		controller: asset.upload
	},
	{
		path: 'all /ajax/asset/del',
		controller: asset.deleteFile
	},
	{
		path: 'all /ajax/asset/rename',
		controller: asset.renamePath
	},
	{
		path: 'all /ajax/asset/delDir',
		controller: asset.deleteDir
	},
	{
		path: 'all /ajax/asset/createDir',
		controller: asset.createPath
	}
]