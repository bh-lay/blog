
// 图库
let asset = require('../controller/api/asset/index')
module.exports = [
	// 静态资源
	{
		path: 'rest /api/asset/path/:path',
		controller: asset
	},
	{
		path: 'post /api/asset/createDir',
		controller: asset.createPath
	}
]