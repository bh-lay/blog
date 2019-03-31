
let pageRoutes = require('./page.js')
let apiRoutes = require('./api.js')
let assetRoutes = require('./asset.js')
let toolsRoutes = require('./tools.js')

const routes = [].concat(pageRoutes, apiRoutes, assetRoutes, toolsRoutes)

module.exports = routes