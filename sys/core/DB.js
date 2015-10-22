/**
 * @author bh-lay
 */


var mongodb = require('mongodb'),
    utils = require('./utils/index.js'),
    conf = require('./../conf/app_config').mongo,
    host = conf.host,
    port = conf.port,
    user = conf.user,
    pass = conf.pass,
    db_name = conf.db_name;

/** 
 * @param DB,collection_name,callback
 * 
 */
function connect(collection_name,callback){  
  var that = this;
  this.DB.authenticate(user, pass, function (err, val) {
    if (err) {
      callback&&callback('authorize failed !',undefined);
    } else {
      that.DB.createCollection(collection_name, function(err,collection){
        callback&&callback(undefined,collection);
      });
    }  
  });
}

function START(){
  var mongoserver = new mongodb.Server(host, port, {w:-1});
  this.DB = new mongodb.Db(db_name, mongoserver,{safe:true});
  this.state = 'close';
}
START.prototype = {
  'open' : function(parm,callback){
    var collection_name = parm['collection_name']||'article';
    var that = this;
    if(this.state == 'close'){
      this.state = 'open_process';
      this.DB.open(function (error, client) {
        that.state = 'open';
        if (error){
           callback&&callback('can not open datebase !',undefined);
          return; 
        }
    //    that.client = client;
        connect.call(that,collection_name,callback);
      });
    }else if(this.state == 'open_process'){
      var try_use = setInterval(function(){
        if(that.state == 'open'){
          clearInterval(try_use);
          connect.call(that,collection_name,callback);
        }
      },100);
    }else{
      connect.call(that,collection_name,callback);
    }
  },
  'close' : function(){
    this.state = 'close';
    this.DB.close();
  }
};

/****************************************************************************
 @demo
  var this_mongo = mongo.start();
  this_mongo.open({'collection_name':'article'},function(err,collection){
    //dosomething……
    //at last or you needn't connect to datebase,you should close it;
    this_mongo.close();
  });
 ***************************************************************************/
exports.start = function(callback) {
  return new START();
};


/**
 * 增加一条用户记录
 * 
 */
exports.add_user = function (parm,callback){
  var parm = parm,
      method = new START();
    
  method.open({'collection_name':'user'},function(err,collection){
    parm.id = utils.createID();

    collection.insert(parm,function(err,result){

      method.close();
      callback && callback(err,parm.id);
    });
  });
};


exports.get_power = function (user_group,callback){
  var method = new START();
  method.open({'collection_name':'user_group'},function(err,collection){
    collection.find({'user_group':user_group}).toArray(function(err, docs) {
      method.close();
      var power_data = docs.length ? docs[0]['power'] : null;
      callback&&callback(err,power_data);
    });
  });
};

exports.ObjectID = mongodb.ObjectID;