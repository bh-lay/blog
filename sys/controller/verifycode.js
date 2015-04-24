
exports.model = function(req, res, callback) {
  
  connect.session(function(session_this){
    //session 记录验证码值
    session_this.set({
      vcode : 'asdf'
    });
    
    res.write('json',{
      code : 200,
      msg : 'not done !'
    },buf)
  });
};