
let pageRoutes = require('./page.js')
let apiRoutes = require('./api/base.js')
let momentRoutes = require('./api/moment.js')
let assetRoutes = require('./asset.js')
let toolsRoutes = require('./tools.js')

const routes = [].concat(pageRoutes, apiRoutes, momentRoutes, assetRoutes, toolsRoutes)

module.exports = routes