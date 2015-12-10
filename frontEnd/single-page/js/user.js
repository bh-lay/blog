/**
 * 全局登录方法
 *   需要污染一个命名空间：appLoginCallback
 * 公用数据中心
 *   L.dataBase.user(fn);
 *    err :是否获取到用户信息
 *    info:用户信息
 *    type：用户类型（online、local）
 */

define([
  'exports',
  'js/Base',
  'js/md5'
],function(exports,utils,hex_md5){
      //存储当前用户的信息
  var userInfo = null,
      //存储程序需要用到的登录回调
      LoginCallbacks = [];

  //相应登录的回调函数
  window.appLoginCallback = function(data){
    for(var i=0,total=LoginCallbacks.length;i<total;i++){
      LoginCallbacks[i](data);
    }
    LoginCallbacks = [];
  };

  function getMyInfo(callback){
    utils.fetch({
      url : '/ajax/user/detail',
      type : 'POST',
      callback : function(err,data){
        if(!err && data && data.code == 200){
          callback && callback(null,data.detail);
        }else{
          callback && callback('error');
        }
      }
    });
  }

  exports.setLocalUser = function(data){
    var data_str = JSON.stringify({
      username : data.username,
      email : data.email,
      blog : data.blog,
      avatar: data.avatar
    });
    localStorage.setItem("userInfo",data_str);
    userInfo = data;
  };
  exports.info = function(callback,useCacheFlag){
    var useCache = typeof(useCacheFlag) == 'boolean' ? useCacheFlag : true;
    //是否已有用户信息缓存
    if(useCache && userInfo){
      callback && callback(null,userInfo);
    }else{
      //向服务器请求用户信息
      getMyInfo(function(err,user){
        if(!err){
          //优先级一：已登陆
          userInfo = user;
          callback && callback(err,user,'online');
        }else{
          //优先级二：本地缓存
          var user = localStorage.getItem("userInfo");
          if(user){
            userInfo = JSON.parse(user);
            //增加gravatar头像(md5邮箱)
            if(userInfo.email.length){
              userInfo.avatar = '//www.gravatar.com/avatar/' + hex_md5(userInfo.email);
            }
            callback && callback(null,userInfo,'local');
          }else{
            callback && callback('未登录');
          }
        }
      });
    }
  };
});
