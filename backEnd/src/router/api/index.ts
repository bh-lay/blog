import { routeItemConfig } from '@/core/index'
import commentsRestController, { list as commentsListController} from '@/controller/api/comments/index'
import blogRestController, { getList as blogListController, blogTagList } from '@/controller/api/blog/index'
import labsListController from '@/controller/api/labs/list'
import labsRestController from '@/controller/api/labs/rest'
import { list as panoListController } from '@/controller/api/pano/index'
import { list as photographyListController } from '@/controller/api/photography/index'
import singlePageSideDataController from '@/controller/api/single-page-side/index'
import loginController from '@/controller/api/user/login'
import userDetailController from '@/controller/api/user/get-detail'
import { upload as uploadDemoController } from '@/controller/api/demo/index'
import cacheClearController from '@/controller/api/clear-cache'
import functionController from '@/controller/api/functions'
// let wechat = require('../../controller/api/wechat.js')


const routes: routeItemConfig[] = [
  // 评论
  {
    path: 'get /api/comments/',
    controller: commentsListController
  },
  {
    path: 'rest /api/comments/:id',
    controller: commentsRestController
  },
  // 博文
  {
    path: 'get /api/blog',
    controller: blogListController
  },
  {
    path: 'rest /api/blog/:id',
    controller: blogRestController
  },
  {
    path: 'get /api/blogtag/',
    controller: blogTagList
  },
  // 实验室
  {
    path: 'get /api/labs',
    controller: labsListController
  },
  {
    path: 'rest /api/labs/:id',
    controller: labsRestController
  },
  // 单页项目获取侧边数据
  {
    path: 'get /api/single-page-side',
    controller: singlePageSideDataController
  },
  // 清除缓存
  {
    path: 'post /api/clear-cache',
    controller: cacheClearController
  },
  {
    path: 'post /api/functions/:act',
    controller: functionController
  },
  {
    path: 'all /api/pano/list',
    controller: panoListController
  },
  {
    path: 'all /api/photography/list',
    controller: photographyListController
  },
  // // 获取微信公众号配置
  // {
  // 	path: 'get /api/wechat-sign-signature',
  // 	controller: wechat.getWechatJsapiSign
  // },
  {
    path: 'post /api/user/login',
    controller: loginController
  },
	
  {
    path: 'post /api/user/detail',
    controller: userDetailController
  },
  // 前端演示用的demo
  {
    path: 'all /ajax/demo/upload',
    controller: uploadDemoController
  },
]
export default routes
