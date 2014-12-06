/**
 * @author bh-lay
 * 
 */

var mongo = require('../../core/DB.js');
var parse = require('../../core/parse.js');


//获取所有博文的标签
exports.allBlogList = function (connect,app){
	var method = mongo.start();
	method.open({'collection_name':'article'},function(err,collection){
      //count the all list
		var resJSON = {};
		collection.find().toArray(function(err, docs) {
			method.close();
			if(err){
				resJSON.code = 2;
			}else{
				var tags = [];
				for(var i=0,total=docs.length;i<total;i++){
					tags.push({
						id: docs[i].id,
						title: docs[i].title,
						tag:docs[i].tags
					});
				}
				resJSON['list'] = tags;
			}
			connect.write('json',resJSON);
		});
	});
}

exports.list = function (connect,app){
	var method = mongo.start();
	method.open({'collection_name':'article'},function(err,collection){
      //count the all list
		var resJSON = {};
		collection.find().toArray(function(err, docs) {
			method.close();
			if(err){
				resJSON.code = 2;
			}else{
				var tagsObj = {};
				var tagsArray = [];
				//获取所有标签
				for(var i=0,total=docs.length;i<total;i++){
					var this_tags = docs[i].tags;
					if(Object.prototype.toString.call(this_tags) == '[object Array]'){
						for(var s=0,count=this_tags.length;s<count;s++){
							var tagStr = this_tags[s];
							tagsObj[tagStr] = tagsObj[tagStr] ? tagsObj[tagStr] + 1 : 1;
						}
					}
				}
				//转换为数组
				for(var i in tagsObj){
					tagsArray.push({
						name : i,
						count : tagsObj[i]
					});
				}
				tagsArray.sort(function(x,y){
					if(x.count > y.count){
                  		return -1;
					}else{
						return 1;
					}
				});
				resJSON['list'] = tagsArray;
			}
			connect.write('json',resJSON);
		});
	});

}
