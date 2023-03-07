import { routeItemConfig } from '../core/index'
import apiRoutes from './api/index'
import momentApiRoutes from './api/moment'
import assetApiRoutes from './api/asset'
import pageRoutes from './page'
import toolsRoutes from './tools'

const empty: routeItemConfig[] = []
const routes: routeItemConfig[] = empty.concat(pageRoutes, apiRoutes, momentApiRoutes, assetApiRoutes, toolsRoutes)

export default routes