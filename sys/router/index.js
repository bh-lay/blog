let apiRoutes = require('./api.js')
let pageRoutes = require('./page.js')

const routes = [].concat(pageRoutes, apiRoutes)

module.exports = routes