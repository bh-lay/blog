/**
 * @author bh-lay
 */
var expire_hour = 24;
var parse = require('../lib/parse');

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
var session={
	'lib':{},
	'expire':{},
};


function session_set(sessionID){
	var this_session = session['lib'][sessionID];
	return function(param){
		for(var i in param){
			if( i == 'time_expire' || i == 'power' || i == 'user_group' || i == 'usernick'){
				this_session[i] = param[i];
			}
		}		
	}
}
function session_get(sessionID){
	var this_session = session['lib'][sessionID];
	return function(name){
		var getData = null;
		if(name == 'user_group' || name == 'time_expire' || name == 'usernick'){
			getData = this_session[name];
		}
		return getData;
	}
}
function session_power(sessionID){
	var power_list = session['lib'][sessionID]['power'];
	return function(code){
		if(code&&power_list[code]){
			return true;
		}else{
			return false;
		}
	}
}

/*
 * user session start 
 *   match or create an sessionID
 *   return session data and set function
 */
exports.start = function(req,res_this){

// get cookie from browser
	var cookieStr = req.headers.cookie||'';
	var cookieObj = parse.cookie(cookieStr);
// get sessionID/IP/userAgent
	var cookie_sessionID = cookieObj['session_verify']||null;
	var IP = req['connection']['remoteAddress'];
	var userAgent = req['headers']['user-agent'];
	
	var sessionID;
	
// find sessionID in session library
	if(session['lib'][cookie_sessionID]){
		sessionID = cookie_sessionID;
	}else{
		sessionID = new Date().getTime() + Math.ceil(Math.random()*1000);
		session['lib'][sessionID] = {
			'time_cerate':new Date(),
			'time_expire' : '',
			'ip' : IP ,
			'user-agent' : userAgent ,
			'user_group':'guest',
			'usernick' : null,
			'power' : [],
			'data':{}
		};
		res_this.cookie({
			'session_verify' : sessionID,
			'path' : '/',
			'Max-Age' : 60*60*24*2
		});
	}
	return {
		'data' : session['lib'][sessionID]['data'] ,
		'set' : session_set(sessionID) ,
		'get' : session_get(sessionID),
		'power' : session_power(sessionID)
	}
};
