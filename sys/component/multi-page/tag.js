
var getTags = require('../../functions/getTags.js'),
    utils = require('../../core/utils/index.js');

exports.produce = function(temp,data,callback){

    getTags.getTagsList(function(err,list){
      if(list.length > 100){
        list.length = 100;
      }
      var html = utils.juicer(temp,{
        list: list
      });
      callback && callback(null,html);
    });
};
