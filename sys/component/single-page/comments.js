
var mongo = require('../../core/DB.js');
var utils = require('../../core/utils/index.js');

/**
 * 转换emoji表情
 */
function strToEmoji(str){
  return str.replace(/\:((\w|\-)+)\:/g,'<span class="emoji-box"><span class="emoji s_$1"></span></span>');
}

function getUserInfo(id,callback){
  var method = mongo.start();
  method.open({'collection_name':'user'},function(err,collection){
    if(err){
      callback && callback(err);
      return;
    }
    collection.find({'id' : id}).toArray(function(err, docs) {
      method.close();
      if(err || docs.length == 0){
        callback && callback(err);
        return;
      }
      callback && callback(null,{
        avatar: docs[0].avatar,
        id: docs[0].id,
        username: docs[0].username
      });
    });
  });
}

/**
 * 处理评论数据
 *  增加用户信息
 *
 **/
function handleData(docs,callback){
  /**
   * 统一调用回调
   */
  function endFn(){
      //处理用户信息字段
      docs.forEach(function(item){
          if(users[item.uid]){
              item.user = users[item.uid];
          }else if(item.user != null && typeof(item.user) == "object"){
              delete item.user.email;
          }else{
              item.user = {};
          }
      });
      callback&&callback(docs);
  }

  var users = {};
  var uidsLength = 0;
  var overLength = 0;

  docs.forEach(function(item){
    //获取所有需要的用户id
    var uid = item.uid;
    if(uid && !users[uid]){
      users[uid] = {};
      uidsLength++;
    }
    //处理url
    if(item.cid == 'define-1'){
      item.url = '/bless' + '#comments-' + item._id;
    }else{
      item.url = '/' + item.cid.replace(/\-/g,'/') + '#comments-' + item._id;
    }
    //转换时间格式
    item.time = utils.parse.time(item.time,"{h}:{i} {m}-{d}");
    //替换表情
    item.content = strToEmoji(item.content);
  });
  if(uidsLength == 0){
      endFn();
  }else{
    //遍历所有需要的用户id
    for(var id in users){
      //获取单个用户信息
      getUserInfo(id,function(err,userInfo){
        overLength++;
        if(!err){
          users[id] = userInfo;
        }
        if(overLength >= uidsLength){
          endFn();
        }
      });
    }
  }
}

//获取最近评论
function getCommentList(callback){
  var method = mongo.start();

  method.open({
    collection_name: 'comments'
  },function(err,collection){
    if(err){
      callback && callback(err);
      return;
    }
    collection.count(function(err,count){
      collection.find({}, {
        limit: 8
      }).sort({time:-1}).toArray(function(err, docs) {
        method.close();

        handleData(docs,function(list){
          callback&&callback(err,list,count);
        });
      });
    });
  });
};

exports.produce = function(temp,data,callback){
  getCommentList(function(err,list){
    var html = !err ? utils.juicer(temp,{
      list: list
    }) : '';
    callback && callback(err,html);
  });
};