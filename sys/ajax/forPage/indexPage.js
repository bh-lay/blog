
var mongo = require('../../core/DB.js');

function get_friend_list(callback){
	var method = mongo.start();
	method.open({'collection_name':'blog_friend'},function(err,collection){
        if(err){
            callback && callback(err);
            return
        }
        //count the all list
        collection.count(function(err,count){
            if(err){
                callback && callback(err);
                return
            }
            collection.find({
                isShow: '1'
            },{
                _id: false,
                cover: true,
                discription: true,
                id: true,
                title: true,
                url: true
            }).sort({id:-1}).toArray(function(err, docs) {
                method.close();
                if(err){
                    callback && callback(err);
                    return
                }
                callback && callback(null,docs);
            });
        });
	});
}

module.exports = function(callback){
    get_friend_list(function(err,list){
        callback && callback(err,{
            'friends' : list
        });
    });
};