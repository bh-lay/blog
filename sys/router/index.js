
let pageRoutes = require('./page.js')
let apiRoutes = require('./api.js')
let assetRoutes = require('./api.js')

const routes = [].concat(pageRoutes, apiRoutes, assetRoutes)

module.exports = routes