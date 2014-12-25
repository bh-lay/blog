var indexPage = require('./indexPage.js');
exports.index = function(connect,app){
    indexPage(function(err,data){
        var json = data || {};
        if(err){
            json.code = 500;
        }else{
            json.code = 200;
        }
        connect.write('json',json);
    });
};