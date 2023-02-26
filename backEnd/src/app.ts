import * as dotenv from 'dotenv'
import App from '@/core/index'
import registerRouteComponents from './register-route-components'
import startCronjob from './cronjob'

// 引入环境变量配置
dotenv.config({
	path: './.env'
})

// 创建app
const app = new App()

// 注册路由、组件
registerRouteComponents(app)

// 启动定时任务
startCronjob(app)
