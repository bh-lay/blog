/*
 * @author bh-lay
 */
let cache = require('../../../functions/moment/cache.js')
exports.detail = function (route, connect){
	let cacheName =  route.params.name

	cache.get(cacheName)
		.then(data => {
			connect.write('json', data)
		})
		.catch(err => {
			connect.write('json', err)
		})
}
