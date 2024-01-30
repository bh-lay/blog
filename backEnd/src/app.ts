import * as dotenv from 'dotenv'
import { App } from '@/core/index'
import registerRouteComponents from './register-route-components'
import startCronjob from './cronjob'
import { imgRobborPathName } from '@/constants/index'

// 引入环境变量配置
dotenv.config({
  path: './.env'
})
// 创建app
const app = new App({
  // 端口号
  port: process.env.port || '',
  temporaryPath: process.env.temporaryPath || '',
  extraSubTempPaths: [imgRobborPathName],
  useCache: process.env.useCache === 'true',
  maxCacheCount: 1000,
  staticRoot: process.env.staticPath || '',
  // 静态资源缓存时间
  staticFileMaxAge: 60 * 60 * 24 * 365,
  frontendCdnDomain: process.env.cdnDomain || '',
})

// 注册路由、组件
registerRouteComponents(app)

// 启动定时任务
startCronjob(app)
