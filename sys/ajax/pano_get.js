/*
 * @author bh-lay
 */
var my720Data = require('../functions/my720Data.js');

exports.render = function (connect,app){
  var url = connect.request.url;

  app.cache.use(url,['ajax','pano'],function(this_cache){
    connect.write('json',this_cache);
  },function(save_cache){
    my720Data.get(function(err, data){
      if(err){
        connect.write('json',{});
        return;
      }
      save_cache(JSON.stringify(data));
    });
  });
}
