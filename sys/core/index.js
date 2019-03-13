/**
 * @author bh-lay
 * @version 1.0
 * @modified 2014-6-27 23:14
 */
const pathToRegexp = require('path-to-regexp')
var http = require('http'),
	connect = require('./connect.js'),
	views = require('./views.js'),
	cache = require('./cache.js'),
	staticFile = require('./staticFile.js'),
	url_redirect = require('../conf/301url'),
	config = require('../conf/app_config.js'),
	utils = require('./utils/index.js'),
	session_factory = require('./session.js')


/**
 * application 类
 */
class APP {
	constructor () {
		this.routes = []
		this.fileReader = new staticFile(config.static)
		// server start
		var server = http.createServer((req,res) => {
			// 屏蔽非法用户
			if(this.isAbnormalVisitor(req)){
				res.writeHead(500)
				res.end('hello I\'m bh-lay !')
				return
			}
			// 实例化一个connect对象
			let newConnect = new connect(req, res, this.session)
			let path = newConnect.url
			let matchedRoutes = this.matchRequestInRoutes(path.pathname, newConnect.request.method)
			if(matchedRoutes.length){
				// 第一顺序：执行get方法设置的回调
				// 使用匹配的最后一个 controller
				let usedRoute = matchedRoutes[matchedRoutes.length - 1]
				usedRoute.route.controller(usedRoute, newConnect, this)
			}else{
				// 第二顺序：使用静态文件
				this.fileReader.read(path.pathname, req,res, () => {
					// 第三顺序：查找301重定向
					if(url_redirect[path.pathname]){
						newConnect.write('define',301,{
							'location' : url_redirect[path.pathname]
						})
					}else{
						// 最终：只能404了
						this.views('system/404',{
							content : '文件找不到啦！'
						},function(err,html){
							newConnect.write('notFound',html)
						})
					}
				})
			}
		})
		server.listen(config.port)
	}
	/**
	 * 检测是否为正常用户
	 */
	isAbnormalVisitor (req) {
		var url = req.url
		// 检测路径中是否包含 ../
		if(url.match(/\.\.\//)){
			return true
		}
		return false
	}
	/**
	 * 设置前端请求路径
	 */
	setRoute (urlRule, callback) {
		if(typeof(callback) !== 'function' || typeof(urlRule) !== 'string'){
			return
		}
		// URL 转换为全小写
		let urlRulePrefix = urlRule.toLowerCase()
		// 匹配 method，并清理 url method 部分
		let method = 'all'
		urlRulePrefix = urlRulePrefix.replace(/^(\w+)\s/, (result, key) => {
			method = key.match(/^(get|post|options|put|delete)$/) ? key : 'all'
			return ''
		})
		let keys = []
		let rule = pathToRegexp(urlRulePrefix, keys)

		this.routes.push({
			originalRule: urlRule,
			keys: keys.map(key => key.name),
			rule,
			method,
			controller: callback
		})
	}
	// 在 routes 配置中查找于请求匹配的路由
	matchRequestInRoutes (path, method) {
		let result = []
		let currentMethod = method.toLowerCase()
		// 遍历所有路由配置
		this.routes.forEach(route => {
			// 第一步，检查 method 是否匹配
			if (route.method !== 'all' && route.method !== currentMethod) {
				return
			}
			// 第二步，检查 URL 规则是否匹配
			let testMatches = route.rule.exec(path)
			if (!testMatches) {
				return
			}
			// 从 URL 中国呢获取参数
			let param = {}
			testMatches.forEach((value, index) => {
				if (index > 0) {
					let key = route.keys[index - 1]
					param[key] = value
				}
			})
			// 标记匹配结果
			result.push({
				path,
				param,
				route
			})
		})
		return result
	}
}


APP.prototype.views = views
APP.prototype.cache = new cache({
	useCache: config.cache.use ? true : false,
	max_num: config.cache.max_num,
	root: config.cache.root
})
APP.prototype.session = new session_factory({
	root : config.session.root
})
APP.prototype.utils = utils
APP.prototype.config = config

module.exports = APP