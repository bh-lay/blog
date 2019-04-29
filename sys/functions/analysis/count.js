let DB = require('../../core/DB.js')


module.exports = ({type, params}) => {
	return new Promise((resolve) => {
		DB.getCollection('analysis')
			.then(({collection, client}) => {
				collection.countDocuments({
					type,
					params
				}, (err, count) => { 
					resolve({
						pv: count || 0
					})
				})
			})
			.catch(() => {
				resolve({pv: 0})
			})
	})
}
