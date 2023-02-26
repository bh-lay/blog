import { routeItemConfig, routeItemMatched, Connect, App, singleController } from '@/core/types'
import isbot from 'node-isbot'
// 首页
import indexController from '@/controller/index'
import singlePageJsController from '@/controller/single-page-js'
import singlePageVueController from '@/controller/single-page-vue'
import { list as blogListController, detail as blogDetailController } from '@/controller/blog'
import { list as labsListController, detail as labsDetailController } from '@/controller/labs'
import panoListController from '@/controller/pano'
import { list as tuchongListController } from '@/controller/photography'
import { list as blessListController } from '@/controller/bless'

/**
 * 视图切换方法
 *   SSR 静态版本
 *   Vue 动态视图版本
 *   JS 原生动态版本
 */
function adaptionViewForSinglePage (controller: singleController): singleController {
	function wrappedController(route: routeItemMatched, connect: Connect, app: App) {
		const isBotRequest = isbot(connect.request.headers['user-agent'] || '')
		const uiVersion = connect.cookie('ui_version')

		if (isBotRequest) {
			// 若命中搜索引擎标识，执行回调默认视图
			return controller(route, connect, app)
		}
		if (uiVersion === 'vue') {
			return singlePageVueController(route, connect, app)
		}
		if (uiVersion === 'js') {
			return singlePageJsController(route, connect, app)
		}
		
		// 执行回调默认视图
		return controller(route, connect, app)
	}
	return wrappedController
}
const routes: routeItemConfig[] = [
	// 首页
	{
		path: 'get /',
		controller: adaptionViewForSinglePage(indexController)
	},
	{
		path: 'get /blog',
		controller: adaptionViewForSinglePage(blogListController)
	},
	{
		path: 'get /blog/:id',
		controller: adaptionViewForSinglePage(blogDetailController)
	},
	{
		path: 'get /labs',
		controller: adaptionViewForSinglePage(labsListController)
	},
	{
		path: 'get /720',
		controller: adaptionViewForSinglePage(panoListController)
	},
	{
		path: 'get /photography',
		controller: adaptionViewForSinglePage(tuchongListController)
	},
	// 留言
	{
		path: 'get /bless',
		controller: adaptionViewForSinglePage(blessListController)
	},
	{
		path: 'get /labs/:name',
		controller: labsDetailController
	},
]
export default routes
