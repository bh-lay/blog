/**
 * 全局登录方法
 *   需要污染一个命名空间：appLoginCallback
 * 公用数据中心
 *   L.dataBase.user(fn);
 *    err :是否获取到用户信息
 *    info:用户信息
 *    type：用户类型（online、local）
 */
import utils from './Base.js';
import hexMd5 from './md5.js';
// 存储当前用户的信息
let userInfo = null;
// 存储程序需要用到的登录回调
let LoginCallbacks = [];

// 相应登录的回调函数
window.appLoginCallback = function (data) {
  for (let i = 0, total = LoginCallbacks.length; i < total; i++) {
    LoginCallbacks[i](data);
  }
  LoginCallbacks = [];
};

function getMyInfo (onResponse) {
  utils.fetch({
    url: '/ajax/user/detail',
    type: 'POST',
    callback: function (err, data) {
      if (!err && data && data.code === 200) {
        onResponse && onResponse(null, data.detail);
      } else {
        onResponse && onResponse('error');
      }
    }
  });
}

function setLocalUser (data) {
  let dataStr = JSON.stringify({
    username: data.username,
    email: data.email,
    blog: data.blog,
    avatar: data.avatar
  });
  localStorage.setItem('userInfo', dataStr);
  userInfo = data;
}

function info (onResponse, useCacheFlag) {
  let useCache = typeof useCacheFlag === 'boolean' ? useCacheFlag : true;
  // 是否已有用户信息缓存
  if (useCache && userInfo) {
    onResponse && onResponse(null, userInfo);
  } else {
    // 向服务器请求用户信息
    getMyInfo(function (err, user) {
      if (!err) {
        // 优先级一：已登陆
        userInfo = user;
        onResponse && onResponse(err, user, 'online');
      } else {
        // 优先级二：本地缓存
        let user = localStorage.getItem('userInfo');
        if (user) {
          userInfo = JSON.parse(user);
          // 增加gravatar头像(md5邮箱)
          if (userInfo.email.length) {
            userInfo.avatar = '//www.gravatar.com/avatar/' + hexMd5(userInfo.email);
          }
          onResponse && onResponse(null, userInfo, 'local');
        } else {
          onResponse && onResponse('未登录');
        }
      }
    });
  }
}

export default {setLocalUser, info};
