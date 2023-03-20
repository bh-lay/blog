import { routeItemConfig } from '@/core/index'
import { get as imgRobberGetController } from '@/controller/img-robber/index'
import redirectController from '@/controller/redirect'
import snsLoginController from '@/controller/sns-login/index'

const routes: routeItemConfig[] = [
  {
    path: 'get /r/:target',
    controller: redirectController
  },
  // 用户登录认证
  {
    path: 'all /sns-login/:from',
    controller: snsLoginController
  },
  // 通用图片盗链方法
  {
    path: 'get /img-robber/:source*',
    controller: imgRobberGetController
  },
]

export default routes
