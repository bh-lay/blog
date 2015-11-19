
var utils = require('../../core/utils/index.js'),
    myGithubData = require('../../functions/myGithubData.js');


exports.produce = function(temp,data,callback){
  myGithubData.get(function(err,user_data){
	var html = utils.juicer(temp,user_data);
  	callback && callback(null,html);
  });
};