
var utils = require('../../core/utils/index.js'),
    myGithubData = require('../../functions/myGithubData.js');


exports.produce = function(temp,data,callback){
  var user_data = myGithubData.get(),
      html = utils.juicer(temp,user_data);
  callback && callback(null,html);
};