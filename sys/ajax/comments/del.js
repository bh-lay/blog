/**
 * @author bh-lay
 * 
 */
/**************************************************************
***************************************************************/

var mongo = require('../../core/DB.js');
var ObjectID = mongo.ObjectID;

/**
 * delet method
 */
module.exports = function (ID,callback){
	
	if(!ID || ID.length < 1){
		callback && callback('missing ID'); 
		return;
	}
	var method = mongo.start();
	method.open({
		'collection_name' : 'comments'
	},function(err,collection){
		if(err) {
			callback && callback(err);
			return;
		}
		if (isNaN(parseInt(ID))) {
			callback && callback('id 不合法');
			return
		}
		collection.remove({
			'_id' : ObjectID(ID)
		},function(err,docs){
			console.log('docs')
			if(err) {
				callback && callback(err);
			}else {
				callback && callback(null);
			}
			method.close();
		});
	});
}
