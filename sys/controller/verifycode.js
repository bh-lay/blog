
exports.model = function(connect) {
  
	connect.session(function(session_this){
		//session 记录验证码值
		session_this.set({
			vcode : 'asdf'
		})
		connect.write('json',{
			code : 200,
			msg : 'not done !'
		})
	})
}