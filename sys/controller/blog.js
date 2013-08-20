/*
 * @author bh-lay
 * view url : /blog    /blog/
 */
var mongo = require('../conf/mongo_connect');

var tpl = require('../lib/module_tpl');
var temp = require('../lib/page_temp');
var parse = require('../lib/parse');
var juicer = require('juicer');

function list_page(res_this){
	var page_temp = temp.get('blogList',{'init':true});

	mongo.start(function(method){

		method.open({'collection_name':'article'},function(err,collection){

			collection.find({}, {limit:10}).sort({id:-1}).toArray(function(err, docs) {

				for(var i in docs){
					docs[i].time_show = parse.time(docs[i].time_show ,'{y}-{m}-{d}');
				}

				var txt = tpl.produce('article_item',{'list' : docs});

				var page = page_temp.replace('{-content-}',txt);

				res_this.html(200,page);

				method.close();
			});

		});

	});
}

function detail_page(res_this,id){
	//get template
	var page_temp = temp.get('blogDetail',{'init':true});

	mongo.start(function(method){

		method.open({'collection_name':'article'},function(err,collection){

			collection.find({id:id}).toArray(function(err, docs) {
				if(arguments[1].length==0){

					res_this.notFound('哇塞，貌似这篇博文不存在哦!');

				}else{
					docs[0].time_show = parse.time(docs[0].time_show ,'{y}-{m}-{d}');

					var txt = juicer(page_temp,docs[0]);
					res_this.html(200,txt);
				}
				method.close();
			});

		});

	});
}

exports.deal = function (req,res_this,path){
	var path_length = path['pathnode'].length;
	if(path_length == 1){
		list_page(res_this);
	}else if(path_length == 2){
		var id = path['pathnode'][1];
		//res_this.error();
		detail_page(res_this,id)
	}else{
		res_this.notFound('小盆友，表逗我玩儿！');
	}

}