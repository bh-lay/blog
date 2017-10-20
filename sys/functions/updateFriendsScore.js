
//author bh-lay
var utils = require('../core/utils/index.js');
var mongo = require('../core/DB');




exports.update = function (callback){
  var method = mongo.start();
  method.open({
    collection_name: 'blog_friend'
  },function(err,collection){
    if(err){
      callback && callback(err);
      return;
    }
    collection.find({
      isShow: '1'
    }).toArray(function(err, docs) {
      if(err){
        callback && callback(err);
        return;
      }
      docs.forEach(function(item){
        item = item || {};
        var hasGithub = item.github_username && item.github_username.length > 2 ? 1 : 0,
            hasCover = item.cover && item.cover.length > 10 ? 1 : 0,
            hasBlog = item.url && item.url.length > 10 ? 1 : 0,
            adminScore = parseInt( item.adminScore || 0 );
        item.score = hasGithub * 4 + hasBlog * 3 + hasCover * 2 + adminScore;
        collection.save( item, function(){});
      });
      method.close();

      callback && callback();
    });
  });
};