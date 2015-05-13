
var mongo = require('../../core/DB.js');
var utils = require('../../core/utils/index.js');

var collection_name = 'blog_friend';

function insert(parm,callback){
	var parm = parm;
	
	var method = mongo.start();

	method.open({
    collection_name: collection_name
  },function(err,collection){
		if(err){
			callback && callback(err);
			return
		}
		parm.id = utils.createID();

		collection.insert(parm,function(err,result){
			if(err){
				callback && callback(err);
				return
			}
			callback && callback(null);
			
			method.close();
		});
	});
}

function filter_param(data){
	var param = {
		id : data['id']||'',
		title: decodeURI(data['title']),
		cover: data['cover']||'',
		url: data['url']||'',
		isShow: 0,//1:show;0:hidden
    github_username : data.github_username || null,
		discription: data['discription']
	};
	if(param['id'].length < 2){
		param['time_create'] = new Date().getTime();
	}
	if(!(param['title']&&param['url'])){
		return null;
	}
	return param;
}

module.exports = function (connect,app){
  //获取数据
  utils.parse.request(connect.request,function(err,dataO){
    //过滤数据
    var data = filter_param(dataO);

    if(!data){
      //数据不全
      connect.write('json',{
        code: 204,
        msg: '字段不全!'
      });
      return
    }
    //新增
    insert(data,function(err){
      if(err){
        connect.write('json',{
          code: 2,
          msg: 'add fail !'
        });
      }else{
        connect.write('json',{
          code: 200,
          id : data.id,
          msg: 'added success !'
        });
        app.cache.clear('links');
      }
    });
  });
}