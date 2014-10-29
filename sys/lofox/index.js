/**
 * @author bh-lay
 * @github https://github.com/bh-lay/lofox
 * @version 1.0
 * @modified 2014-6-27 23:14
 *  location fox
 */

var http = require('http');
var connect = require('./connect.js');
var views = require('./views.js');
var cache = require('./cache.js');
var staticFile = require('./staticFile.js');
var url_redirect = require('../conf/301url');
var config = require('../conf/app_config');

/**
 * 格式化path 
 */
function pathParser(input){
	//去除首尾的‘/’
	input = input.replace(/^\/*|\/*$/g,'');
	//分割路径
	var output = input.split(/\//);
	
	if(output.length == 1 && output[0] == ''){
		output = [];
	}
	
	return output;
}
/**
 * 格式化search 
 */
function searchParser(search){
	var resultObj = {};
	if(search && search.length > 1){
		var items = search.split('&');
		for(var index = 0 ; index < items.length ; index++ ){
			if(! items[index]){
				continue;
			}
			var kv = items[index].split('=');
			resultObj[kv[0]] = typeof kv[1] === "undefined" ? "":kv[1];
		}
	}
	return resultObj;
}
/**
 * 在 MAPS 匹配url并返回对应值
 * @param {Object} url
 */
function findUrlInMaps(inputPath,MAPS){
	//定义从url中取到的数据｛变量｝
	var matchValue = {};
	//记录找到的maps项
	var this_mapsItem = null;
	
	//遍历maps
	for(var i in MAPS){
		//获取maps当前项数组形式的url节点
		var pathData = pathParser(i);
		//路径与maps当前节点长度不一致，或最后配置不为通配符“*”跳过
		if(pathData.length != inputPath.length && pathData[pathData.length -1] != '*'){
			continue
		}
		
		this_mapsItem = MAPS[i];
		//遍历maps当前url节点
		for(var s=0,total=pathData.length;s<total;s++){
			//1.比对输入url与maps对应url是否一致
			if(pathData[s] != inputPath[s]){
				//2.检测当前节点是否为变量
				var tryMatch = pathData[s].match(/{(.+)}/);
				if(tryMatch){
					var key = tryMatch[1];
					matchValue[key] = inputPath[s];
				}else if(pathData[s] != '*'){
					//既不一致，又不是变量，也不是通配符，丢弃此条maps记录
					this_mapsItem = null;
					matchValue = {};
					break
				}
				//else{} //符合条件
			}
			//else{} //符合条件
		}
		//若已经匹配出结果，不再继续匹配
		if(this_mapsItem){
			break
		}
	}
	if(this_mapsItem){
		return {
			'mapsItem' : this_mapsItem,
			'data' : matchValue
		};
	}else{
		return false;
	}
}

/**
 * application 类
 *   arguments[0] 端口号
 */
function APP(port){
	var me = this;
	
	this.staticFileRoot = './'
	this.MAPS = {};
	this.REST = null;
	
	// server start
	var server = http.createServer(function (req,res) {
		
		var new_connect = new connect(req,res);
		var path = new_connect.url;
		var pathNode = pathParser(path.pathname);
		var result = findUrlInMaps(pathNode,me.MAPS);
		
		if(result){
			//第一顺序：执行set方法设置的回调
			var data = result.data;
			result.mapsItem.call(this,data,new_connect);
		}else{
			//第二顺序：使用静态文件
			staticFile.read((me.staticFileRoot + path.pathname),req,function(status,headers,content){
				new_connect.write('define',status,headers,content);
			},function(){
				//第三顺序：查找301重定向
				if(url_redirect[path.pathname]){
					new_connect.write('define',301,{
						'location' : url_redirect[path.pathname]
					});
				}else{
					//第四顺序：执行定义的方法
					if(me.REST){
						me.REST.call(this,new_connect);
					}else{
						//最终：只能404了
						new_connect.write('notFound','<h1>404</h1><p>找不到文件了，咋办啊！</p>');
					}
				}
			});
		}
	});
	
	server.listen(port, 0,0,0,0);
	console.log('server start with port ' + port);
};

/**
 * 设置前端请求路径
 */
APP.prototype.get = function(urls,callback){
	var me = this;
	var routerNames = [].concat(urls);
	
	if(typeof(callback) != 'function'){
		return;
	}
	routerNames.forEach(function(url,a,b){
		if(typeof(url) != 'string'){
			return;
		}
		me.MAPS[url] = callback;
	});
};

/**
 * 应用设置
 */
APP.prototype.set = function(key,value){
	if(key == 'staticFileRoot'){
		this.staticFileRoot = value;
	}
};
/**
 * 404页面
 */
APP.prototype.rest = function(callback){
	if(typeof(callback) =='function'){
		this.REST = callback;
	}
};
APP.prototype.views = views;
APP.prototype.cache = cache;
APP.prototype.config = config;

module.exports = APP;