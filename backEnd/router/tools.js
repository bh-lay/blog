// 用户登录认证
let snsLogin = require('../controller/snsLogin.js')
let imgRobber =  require('../controller/img-robber/index.js')
let redirect =  require('../controller/redirect.js')

module.exports = [
	{
		path: 'get /r/:target',
		controller: redirect
	},
	// 用户登录认证
	{
		path: 'all /snsLogin/:from',
		controller(route, connect, app) {
			if(route.params.from == 'github'){
				snsLogin.github(connect,app)
			}else{
				connect.write('json',{
					'code' : 500
				})
			}
		}
	},
	// 通用图片盗链方法
	{
		path: 'get /img-robber/:source*',
		controller: imgRobber.render
	},
]