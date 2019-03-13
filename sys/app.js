// 第一步，引入环境变量配置
require('dotenv').config()

// 引入app框架
const appFactory = require('../sys/core/index.js')
const routes = require('./router/index.js')
const cronJob = require('./cronJob.js')


// 创建app
let app = new appFactory()

// 定义路由
routes.forEach(({path, controller}) => {
	app.setRoute(path, controller)
})

cronJob.start(app)
