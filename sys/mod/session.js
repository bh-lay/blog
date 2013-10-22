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
var session_pool={
	'lib':{},
	'expire':{},
};


function SESSION(req,res_this){

// get cookie from browser
	var cookieStr = req.headers.cookie||'';
	var cookieObj = parse.cookie(cookieStr);
// get sessionID/IP/userAgent
		
	this.sessionID = cookieObj['session_verify']||new Date().getTime() + Math.ceil(Math.random()*1000);
	this.IP = req['connection']['remoteAddress'];
	this.userAgent = req['headers']['user-agent'];
	this.data = {
		'user_group' : 'guest'
	};
	this.power_data = [];
	var that = this;
// find sessionID in session library
	if(!session_pool['lib'][this.sessionID]){
		session_pool['lib'][this.sessionID] = {
			'time_cerate':new Date(),
			'ip' : this.IP,
			'user-agent' : this.userAgent,
			'power' : this.power_data,
			'data':this.data
		};
		res_this.cookie({
			'session_verify' : that.sessionID,
			'path' : '/',
			'Max-Age' : 60*60*24*2
		});
	}
}
SESSION.prototype = {
	'set' : function (param){
		var this_session = this.data;
		for(var i in param){
			session_pool['lib'][this.sessionID]['data'][i] = param[i];
		}
	},
	'get' : function (name){
		var this_session = this.data;
		var getData = null;
		getData = session_pool['lib'][this.sessionID]['data'][name];
		return getData;
	},
	'set_power' : function(array){
		session_pool['lib'][this.sessionID]['power'] = array;
	},
	'power' : function (code){
		if(code&&session_pool['lib'][this.sessionID]['power'][code]){
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
exports.start = function(req,res_this){
	return new SESSION(req,res_this);
};
