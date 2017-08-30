
var utils = require('../../core/utils/index.js'),
    myGithubData = require('../../functions/myGithubData.js');


exports.produce = function(temp,data,callback){
  myGithubData.get(function(err,user_data){
	  var html = temp.replace(/\>\>(\w+)\<\</g, function (a, key) {
	    return user_data[key] || 0;
    });

  	callback && callback(null, html);
  });
};