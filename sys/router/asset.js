
//图库
let ajax_asset = require('../ajax/asset/index')
module.exports = [
	// 静态资源
	{
		path: 'all /ajax/asset',
		controller: ajax_asset.list
	},
	{
		path: 'all /ajax/asset/upload',
		controller: ajax_asset.upload
	},
	{
		path: 'all /ajax/asset/del',
		controller: ajax_asset.deleteFile
	},
	{
		path: 'all /ajax/asset/rename',
		controller: ajax_asset.renamePath
	},
	{
		path: 'all /ajax/asset/delDir',
		controller: ajax_asset.deleteDir
	},
	{
		path: 'all /ajax/asset/createDir',
		controller: ajax_asset.createPath
	}
]