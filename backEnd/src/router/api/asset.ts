import { routeItemConfig } from '@/core/types'
import assetRestController from '@/controller/api/asset/index'
import createFolderController from '@/controller/api/asset/create-folder'

const routes: routeItemConfig[] = [
	// 静态资源
	{
		path: 'rest /api/asset/path/:path',
		controller: assetRestController
	},
	{
		path: 'post /api/asset/createDir',
		controller: createFolderController
	}
]

export default routes
