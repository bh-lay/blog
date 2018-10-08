var mongo = require('../core/DB.js'),
  collection_name = 'cache',
  mongon_ID = '720yun_bh-lay',
  request = require('request'),
  clientUserAgent = 'Spider for http://bh-lay.com Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';


//从数据库读取
function getFromDataBase (callback) {
  var method = mongo.start();
  method.open({
    collection_name: collection_name
  }, function (err, collection) {
    if (err) {
      callback && callback(err);
      return;
    }
    collection.find({
      id: mongon_ID
    }).toArray(function (err, docs) {
      method.close();
      if (arguments[1].length == 0) {
        //若不存在，则从 720yun 上获取
        updateFrom720(function (err, data) {
          callback && callback(err, data);
        });
      } else {
        callback && callback(null, docs[0]);
      }
    });
  });
}

//保存到数据库
function saveDataToDataBase (data) {
  var method = mongo.start();

  data.id = mongon_ID;

  method.open({
    collection_name: collection_name
  }, function (error, collection) {
    //查询用户信息
    collection.find({
      id: mongon_ID
    })
    //计算条数
      .count(function (err, count) {
        if (count > 0) {
          // 条数存在，则直接更新
          collection.update({
            id: mongon_ID
          }, {
            $set: data
          }, function (err, docs) {
            method.close();
          });
        } else {
          // 不存在则插入为新数据
          collection.insert(data, function (err, result) {
            method.close();
          });
        }
      });
  });
}

//从720yun更新数据
function updateFrom720 (callback) {
  request({
    url: 'https://apiv4.720yun.com/author/19023widcyv/products?sort=0&page=1&selected=2',
    method: 'GET',
    headers: {
      'User-Agent': clientUserAgent,
      ':authority': 'apiv4.720yun.com',
      ':method': 'OPTIONS',
      ':path': '/author/19023widcyv/products?sort=0&page=1&selected=2',
      ':scheme': 'https',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,en-US;q=0.4',
      'Access-Control-Request-Headers': 'app-authorization,app-key',
      'Access-Control-Request-Method': 'GET',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Host': 'apiv4.720yun.com',
      'Origin': 'http://720yun.com',
      'Pragma': 'no-cache',
      'Referer': 'http://720yun.com/u/19023widcyv',
      'App-Authorization': 'mv593k78gqm0g8kim1e7enlpdwylrez1',
      'App-Key': 'eByjUyLDG2KtkdhuTsw2pY46Q3ceBPdT'
    }
  }, function (err, response, body) {
    response = response || {};
    if (err || response.statusCode !== 200) {
      callback && callback('error');
      return;
    }
    try {
      var userData = JSON.parse(body || {});
      callback && callback(null, userData);
      //保存到数据库
      saveDataToDataBase(userData);
    } catch (e) {
      console.warn('720yun data fetch failed ')
      callback && callback('parse error', null);
    }
  });
}

exports.update = updateFrom720;
exports.get = getFromDataBase;