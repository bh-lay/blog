/**
 * @author bh-lay
 */
var DB = require('../core/DB.js');

function logError(reportData){
	console.log('-------------');
	console.log('report save error!');
	console.log(reportData);
	console.log('-------------');
}

//对外接口
exports.render = function (connect, app){
	var reportData = connect.url.search;

	connect.write('define',200);

	var method = DB.start();

	method.open({
		collection_name: 'report'
	},function(err,collection){
		if(err){
			logError(reportData);
			method.close();
			return
		}

		collection.insert(reportData,function(err){
			method.close();
			if(err){
				logError(reportData);
				return
			}

		});
	});
};