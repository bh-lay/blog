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

//FIXME 不要忘了删除过期的session

var fs = require('fs');
var session_root = './temporary/session/';

function save_session(){
	var pathname = this.path;
	var data = JSON.stringify(this);
//	fs.unlink(pathname,function(){
		fs.writeFileSync(pathname,data);
	//	fs.writeFile(pathname,data,function(err){
	//		if(err){
	//		};
	//	});
//	});
}

function SESSION(cookieObj,writeCookie,callback){
	//检测session id 或创建
	this.sessionID = cookieObj['session_verify'] || new Date().getTime() + Math.ceil(Math.random()*1000);
	this.path = session_root + this.sessionID + '.txt';
	this.power_code = [];
	
	var that = this;
	// find sessionID in session library
	fs.exists(this.path, function(exists) {
		if(exists){
			//read session file
			fs.readFile(that.path,'UTF-8',function(err,file){
				if(err){
					callback && callback(err);
					return;
				}
				var JSON_file = JSON.parse(file);
				for(var i in JSON_file){
					that[i] = JSON_file[i];
				}
				
				callback&&callback();
			});
		}else{
			//create session file
			that.time_cerate = new Date();
			
			that.data = {
				'user_group' : 'guest'
			};
			writeCookie({
				'session_verify' : that.sessionID,
				'path' : '/',
				'Max-Age' : 60*60*24*7,//session浏览器端保存七天
				'HttpOnly' : true//前端脚本不可见
			});
			
			callback&&callback();
		}
	});
}
SESSION.prototype = {
	'set' : function (param){
		for(var i in param){
			if(i == 'power_data'){
				this.power_code = param[i];
			}else{
				this.data[i] = param[i];
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
		if(code && this.power_code[code]=='1'){
			return true;
		}else{
			return false;
		}
	}
};
module.exports = SESSION;