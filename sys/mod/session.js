/**
 * @author bh-lay
 */
var expire_hour = 24;

/**
 * @seesion format
 * {ID:{time_create,time_expire,data}}
 * ID=Date.parse+Random
 * 
 * @expire_sheet format
 * 	date+hour
 * {
 *   '05-12':{
 *     sessionID:{},
 *     sessionID:{},
 *   },
 * }
 * 
 */

//FIXME don't forget to delete expire session

var fs = require('fs');
var session_root = './cache/session/';

function save_session(){
	var pathname = this.path;
	var data = JSON.stringify(this);
//	fs.unlink(pathname,function(){
		fs.writeFile(pathname,data,function(err){
			if(err){
				console.log('create session error');
			};
		});
//	});
}

function SESSION(req,res_this,callback){

// get cookie from browser
	var cookieStr = req.headers.cookie||'';
	var cookieObj = parse.cookie(cookieStr);
// get sessionID/IP/userAgent
	var IP = req['connection']['remoteAddress'];
	var userAgent = req['headers']['user-agent'];
	
	this.sessionID = cookieObj['session_verify']||new Date().getTime() + Math.ceil(Math.random()*1000);
	this.path = session_root + this.sessionID + '.txt';
	var that = this;
// find sessionID in session library
	fs.exists(this.path, function(exists) {
		if(exists){
			//read session file
			fs.readFile(that.path,'UTF-8',function(err,file){
				if(err){
					console.log('readFile error');
				}
				var JSON_file = JSON.parse(file);
				that.time_cerate = JSON_file['time_create'];
				that.power_code = JSON_file['power_code'];
				that.userAgent = JSON_file['userAgent'];
				that.ip = JSON_file['ip'];
				that.data = JSON_file['data'];
				
				callback&&callback();
			});
		}else{
			//create session file
			that.time_cerate = new Date();
			that.power_code = [];
			that.userAgent = userAgent;
			that.ip = IP;
			that.data = {
				'user_group' : 'guest'
			};
			res_this.cookie({
				'session_verify' : that.sessionID,
				'path' : '/',
				'Max-Age' : 60*60*24*2
			});
			
			callback&&callback();
		}
	});
}
SESSION.prototype = {
	'set' : function (param){
		var this_session = this.data;
		for(var i in param){
			if(i == 'power_data'){
				this.power_code = param[i];
			}else{
				this_session[i] = param[i];
			}
		}
		save_session.call(this); 
	},
	'get' : function (name){
		var this_session = this.data;
		var getData = this_session[name] || null;
		return getData;
	},
	'power' : function (code){
		if(code&&this.power_code[code]){
			return true;
		}else{
			return false;
		}
	}
};
/*
 * user session start 
 *   match or create an sessionID
 *   return session data and set function
 */
exports.start = function(req,res_this,callback){
	var session_this = new SESSION(req,res_this,function(){
		callback&&callback.call(session_this,session_this);
	//	console.log(session_this,session_this.prototype)
	});
};
