/*
 * @author bh-lay
 */


var DB = require('../../../core/DB.js')

function get_detail(id,callback){
	
	var resJSON = {
		code: 200,
		id : id,
	}
	DB.getCollection('blog_friend')
		.then(({collection, closeDBConnect}) => {
			collection.find({
				id: id
			}).toArray(function(err, docs) {
				closeDBConnect()
				if(arguments[1].length==0){
					resJSON['code'] = 2
					resJSON['msg'] = 'could not find this blog !'				
				}else{ 
					resJSON['detail'] = docs[0]
				}
				callback&&callback(resJSON)
			})
		}).catch(err => {
			callback && callback(err)
		})
}

module.exports = function (route, connect, app){
	let id = route.param.id
	var url = connect.request.url
	app.cache.use(url,['ajax','links'],function(this_cache){
		connect.write('json',this_cache)
	},function(save_cache){

		get_detail(id,function(json_data){
			save_cache(JSON.stringify(json_data))
		})
	})
}