/**
 * @author bh-lay
 */
var utils = require('../core/utils/index.js'),
  updateFriendsScore = require('../functions/updateFriendsScore.js'),
    my720Data = require('../functions/my720Data.js'),
    myTuchongData = require('../functions/myTuchongData.js');

function isAdmin (connect, successFn, failFn) {
  connect.session(function (session_this) {
    if (session_this.get('user_group') == 'admin') {
      successFn && successFn();
    } else {
      failFn && failFn();
    }
  });
}

module.exports = function (connect, app, act) {
  if (connect.request.method !== 'POST') {
    connect.write('json', {
      'code': 201,
      'msg': 'please use POST to clear cache !'
    });
    return;
  }
  isAdmin(connect, function () {
    var responseJson = {
      code: 200,
      msg: 'update success !'
    };
    switch (act) {
      case 'updateFriendsScore':
        updateFriendsScore.update();
        break;
      case 'update720yun':
        my720Data.update();
        break;
      case 'updateTuchong':
        myTuchongData.update();
        break;
      default:
        responseJson.code = 203;
        responseJson.msg = 'wrong action !';
    }
    connect.write('json', responseJson);
  }, function () {
    connect.write('json', {
      'code': 201,
      'msg': 'no power !'
    });
  });
}
