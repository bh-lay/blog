
//author bh-lay
var utils = require('../core/utils/index.js');
var mongo = require('../core/DB');

function getList(callback){
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
        console.dir( item );
        var hasGithub = item.github_username && item.github_username.length > 2,
            hasCover = item.cover && item.cover.length > 10,
            hasBlog = item.url && item.url.length > 10;
        item.score = hasGithub * 4 + hasBlog * 3 + hasCover * 2;
        collection.save( item, function(){});
      });
      method.close();
    });
  });
}
function updateFriendsScore( callback ){
	getList(function(err,docs){
		if( err ){
			callback && callback(err);
			return;
		}
		// console.log( docs );
	});

}

exports.update = updateFriendsScore;