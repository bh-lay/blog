/*
 * @author bh-lay
 */
var myTuchongData = require('../functions/myTuchongData.js');

exports.render = function (connect,app){
  var url = connect.request.url;

  app.cache.use(url,['ajax','photography'],function(this_cache){
    connect.write('json',this_cache);
  },function(save_cache){
    myTuchongData.get(function(err, data){
      if(err){
        connect.write('json',{});
        return;
      }
      save_cache(JSON.stringify(data));
    });
  });
}
