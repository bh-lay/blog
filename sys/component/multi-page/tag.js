
var getTags = require('../../functions/getTags.js'),
    utils = require('../../core/utils/index.js');

exports.produce = function(temp,data,callback){
  var tag = data.tag;
  getTags.getTagsList(function(err,list){
    if(list.length > 100){
      list.length = 100;
    }
    if(tag){
      for(var i=0,total=list.length;i<total;i++){
        if(tag == list[i].name){
          list[i].active = true;
        }
      }
    }
    var html = utils.juicer(temp,{
      list: list
    });
    callback && callback(null,html);
  });
};
