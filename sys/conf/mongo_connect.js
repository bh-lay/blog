/**
 * @author bh-lay
 * 
 */
/****************************************************************************
 @demo
	exports.start(function(method){
		method.open({'collection_name':'article'},function(err,collection){
			//dosomething……
			//at last or you needn't connect to datebase,you should close it;
			method.close();
		});
	});
 ***************************************************************************/

var mongodb = require('mongodb');
var conf = CONFIG.mongo,
	host = conf.host,
	port = conf.port,
	user = conf.user,
	pass = conf.pass,
	db_name = conf.db_name;

/** 
 * @param DB,collection_name,callback
 * 
 */
function open(DB,collection_name,callback){
	var parm = parm||{};
	
	DB.open(function (error, client) {
		if (error){
		 	callback('can not open datebase !',undefined);
			return; 
		}
		DB.authenticate(user, pass, function (err, val) {
			if (err) {
				callback('authorize failed !',undefined);
			} else {
				DB.createCollection(collection_name, function(err,collection){
					callback(undefined,collection);
				});
			}	
		});
	});
}

exports.start = function(callback) {
	var mongoserver = new mongodb.Server(host, port, {w:-1});
	var DB = new mongodb.Db(db_name, mongoserver,{safe:true});
	callback({
		'open' : function(parm,callback){
			var collection_name = parm['collection_name']||'article';
			var callback = callback||null;
			open(DB,collection_name,callback);
		},
		'close' : function(){
			DB.close();
		}
	});
};