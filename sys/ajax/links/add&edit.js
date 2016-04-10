
var mongo = require('../../core/DB.js');
var utils = require('../../core/utils/index.js');
var collection_name = 'blog_friend';

function add(parm,callback){
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
function edit(parm,callback){
	var parm = parm;

	var method = mongo.start();

	method.open({
    collection_name: collection_name
  },function(error,collection){
		collection.update({
      id: parm.id
    }, {
      $set:parm
    }, function(err,docs) {
			if(err) {
				callback && callback(err);
			}else {
				callback && callback(null);
			}
			method.close();
		});
	});
}

function filter_param(data){
	var param = {
		id : data['id']||'',
		title: decodeURI(data['title']),
		avatar: data['avatar']||'',
		url: data['url']||'',
		isShow: data['isShow']||1,//1:show;0:hidden
    adminScore: data['adminScore'] || 0,
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


var need_power = 18;

module.exports = function (connect,app){

  //校验权限
  connect.session(function(session_this){
    //没有编辑权限
    if(!session_this.power(need_power)){
      connect.write('json',{
        code: 201,
        msg: 'no power !'
      });
      return
    }

    //获取数据
    utils.parse.request(connect.request,function(err,data){
      //过滤数据
      var data = filter_param(data);

      if(!data){
        //数据不全
        connect.write('json',{
          code: 204,
          msg: '字段不全!'
        });
      }else if(data['id'] && data['id'].length > 2){
        //编辑
        edit(data,function(err){
          if(err){
            connect.write('json',{
              code:2,
              msg: 'edit fail !'
            });
          }else{
            connect.write('json',{
              code: 1,
              id : data.id,
              msg: 'edit success !'
            });
            app.cache.clear('links');
          }
        });
      }else{
        //新增
        add(data,function(err){
          if(err){
            connect.write('json',{
              code: 2,
              msg: 'edit fail !'
            });
          }else{
            connect.write('json',{
              code: 1,
              id : data.id,
              msg: 'edit success !'
            });
            app.cache.clear('links');
          }
        });
      }

    });
  });
}
