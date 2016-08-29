'use strict';

var request = require('request'),
    jsSHA = require('jssha'),
    config = require('../conf/wechat.js'),
    private_wechat_token = null,
    private_wechat_jsapi_ticket = null,
    private_is_debug = true;


/**
 * 获取微信access_token，根据 http://mp.weixin.qq.com/wiki/15/54ce45d8d30b6bf6758f68d2e95bc627.html 要求，7200秒请求一次
 * @callmethod GET
 *
 * @return {String} 返回 JSON 字符串,包括:

 access_token: 微信访问句柄
 *
 * @example {"access_token":"546566e633068be173afdba9"}
 *
 * @exception 返回 JSON 字符串,其中 access_token 值为 null
 *
 * @example {"access_token": null}
 */

function getWechatToken( callback ) {

  var wechat_token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config.weixin.AppId + "&secret=" + config.weixin.AppSecret;

  //检查缓存里wechat_token是否过期
  var old_token = private_wechat_token;
  if (!Boolean(old_token) ) {
    //空
    getAndSetToken(function( new_token ) {
      if(new_token) {
        callback(null, new_token);
      } else {  //刷新失败
        callback('Failed to get Wechat access_token', null);
      }
    });

  } else {
    if( private_is_debug ) console.log("old access_token: ", old_token.token.access_token);
    
    //token还有20秒就过期，需要刷新
    if((new Date()).getTime() - old_token.time > 7180000) {
      getAndSetToken(function(new_token) {
        if(new_token) {
          callback(null, new_token);
        } else {  //刷新失败
          callback(null, old_token.token.access_token);
        }
      });
    } else {  //还不需要刷新
      callback(null, old_token.token.access_token);
    }
  }

  function getAndSetToken(cb) {
    request(wechat_token_url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if( private_is_debug ) console.log("Get Wechat access token: " + body);
        var new_token = JSON.parse(body);
        if(new_token.errcode) {
          cb(null);
        } else {
          private_wechat_token = {
            token: new_token,
            time: (new Date()).getTime()
          };
          
          if( private_is_debug ) console.log("new token: " + new_token.access_token);
          cb(new_token.access_token);
        }
      } else {
        cb(null);
      }
    });
  }

}


/**
 * 获取微信JS API ticket，根据 http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html 要求，7200秒请求一次
 * @callmethod GET
 *
 * @return {String} 返回 JSON 字符串,包括:

 jsapi_ticket: 微信 JS API ticket
 *
 * @example {"jsapi_ticket":"546566e633068be173afdba9"}
 *
 * @exception 返回 JSON 字符串,其中 jsapi_ticket 值为 null
 *
 * @example {"jsapi_ticket": null}
 */

function getWechatJsapiTicket (search, callback) {
  getWechatToken(function(err, token) {
    if(err) {
      callback('Failed to get Wechat token');
    }
    if(token) {
      var jsapi_ticket_url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + token + "&type=jsapi";

      //检查缓存里wechat_token是否过期
      var old_ticket = private_wechat_jsapi_ticket;
      if( private_is_debug ) console.log(old_ticket ? JSON.stringify(old_ticket) : "null");
      //空
      if (!Boolean(old_ticket)) {
        getAndSetTicket(function(new_ticket) {
          if(new_ticket) {
            callback(null, new_ticket);
          } else {  //刷新失败
            callback('Failed to get Wechat JS API ticket', null);
          }
        });
      } else {
        if( private_is_debug ) console.log("old ticket: ", old_ticket.ticket.ticket);
        if((new Date()).getTime() - old_ticket.time > 7180000) {  //token还有20秒就过期，需要刷新

          getAndSetTicket(function(new_ticket) {
            if(new_ticket) {
              callback(null, new_ticket);
            } else {  //刷新失败
              callback(null, old_ticket.ticket.ticket);
            }
          });

        } else {  //还不需要刷新
          callback(null, old_ticket.ticket.ticket);
        }
      }
    }

    function getAndSetTicket(cb) {
      request(jsapi_ticket_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          if( private_is_debug ) console.log("Get Wechat JS API ticket: " + body);
          var new_ticket = JSON.parse(body);

          if(new_ticket.errcode == 0) {
            private_wechat_jsapi_ticket = {
              ticket: new_ticket,
              time: (new Date()).getTime()
            };
            if( private_is_debug ) console.log("new ticket: " + new_ticket.ticket);
            cb(new_ticket.ticket);
          } else {
            cb(null);
          }
        } else {
          cb(null);
        }
      });
    }
  });
}


var raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort();
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};


/**
 * 生成微信JS API 签名，根据 http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E9.99.84.E5.BD.951-JS-SDK.E4.BD.BF.E7.94.A8.E6.9D.83.E9.99.90.E7.AD.BE.E5.90.8D.E7.AE.97.E6.B3.95
 * @callmethod GET
 * @param {String} url 必须参数，签名用的url必须是调用JS接口页面的完整URL，其中的特殊字符，例如&、空格必须转义为%26、%20，参考：http://www.w3school.com.cn/tags/html_ref_urlencode.html
 * noncestr 必须参数，使用者自己生成的一个随机字符串，签名用的noncestr必须与wx.config中的nonceStr相同
 * timestamp 必须参数，使用者在调用微信 JS API 时的Unix时间戳，签名用的timestamp必须与wx.config中的timestamp相同

 *
 * @return {String} 返回 JSON 字符串,包括:

 signature: 微信 JS API 签名
 *
 * @example {"signature":"546566e633068be173afdba9"}
 *
 * @exception 返回 JSON 字符串,其中 signature 值为 null
 *
 * @example {"signature": null}
 */
var sign = function (jsapi_ticket, url) {
  var ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: new Date().getTime().toString( 16 ),
    timestamp: new Date().getTime(),
    url: url
  };
  var string = raw(ret);
  var shaObj = new jsSHA('SHA-1', 'TEXT');  //new jsSHA(string, 'TEXT');
  shaObj.update(string);

  return {
    appId: config.weixin.AppId,
    timestamp: ret.timestamp,
    nonceStr: ret.nonceStr,
    signature: shaObj.getHash("HEX")  //shaObj.getHash('SHA-1', 'HEX');
  };
};


exports.getWechatToken = function () {
  // getWechatToken(function(err, token) {
  //   if( private_is_debug ) console.log("API send token: ", token);
  //   res.send({
  //     access_token: token
  //   });
  // });
};

exports.getWechatJsapiTicket = function () {
  // getWechatJsapiTicket(search, function(err, ticket) {
  //   if( private_is_debug ) console.log("API send jsapi_ticket: ", ticket);
  //   res.send({jsapi_ticket: ticket});
  // });
};

exports.getWechatJsapiSign = function ( connect, app ) {
  var search = connect.url.search,
      url = decodeURI(search.url).replace(/%26/g, '&');
  getWechatJsapiTicket(search, function(err, ticket) {
    var returns = {
          code: 200,
          config: sign(ticket, url)
        };
    if( err ){
      returns.code = 500;
      returns.msg = err;
    }

    connect.write( 'jsonp', returns);
  });
};