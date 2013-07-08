/**
 * @author bh-lay
 * 
 * @demo
	exports.open({'collection_name':'article'},function(err,collection,close){
		//dosomething……
		//at last or you needn't connect to datebase,you should close it;
		close();
	});
 */

var conf={
	'host':'localhost',
	'port':27017,
	'user':'lay',
	'pass':'19900927',
	'db_name':'blog'
};

var mongodb = require('mongodb');

//exports.mongodb = mongodb;
//exports.db = db;

exports.open = function(parm,callback) {
	var mongoserver = new mongodb.Server(conf.host, conf.port, {w:-1});
	var DB = new mongodb.Db(conf.db_name, mongoserver,{safe:true});
	
	var parm = parm||{};
	var collection_name=parm['collection_name']||'article';
	
	DB.open(function (error, client) {
		if (error){
			callback('can not open datebase !',undefined);
			return; 
		}
		DB.authenticate(conf.user, conf.pass, function (err, val) {
			if (err) {
				callback('authorize failed !',undefined);
			} else {
				var collection = new mongodb.Collection(client, collection_name);
				callback(undefined,collection,function(){
					DB.close();
				});
			}	
		});
	});
};

