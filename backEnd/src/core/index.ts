/**
 * @author bh-lay
 * @version 1.0
 * @modified 2014-6-27 23:14
 */
import pathToRegexp from 'path-to-regexp'
import http from 'http'
import Connect from './connect'
import FilerReader from './staticFile'
import getAppConfig from '../conf/app_config'
import urlRedirectConfig from '../conf/301url'
import { httpMethod, routeHttpMethod, searchParams, controller, routeItemParsed, routeItemMatched, componentFn, componentRegisted } from './types'
import Cache from './cache'

function crossCheck(connect: Connect){
	let referer = connect.request.headers.referer || ''
	let subDomainMatched = referer.match(/(http(s|)\:\/\/[^\.\/]+\.bh-lay\.com)/)
	if (subDomainMatched) {
		connect.setHeader('Access-Control-Allow-Origin', subDomainMatched[0])
		connect.setHeader('Access-Control-Allow-Methods', 'GET')
	}
}

/**
 * application 类
 */
export default class App {
	routes: routeItemParsed[]
	fileReader: FilerReader
	cache: Cache
	config
	components: componentRegisted
	constructor () {
		this.routes = []
		const config = getAppConfig()
		this.config = config
		this.cache = new Cache({
			useCache: config.cache.use ? true : false,
			max_num: config.cache.max_num,
			root: config.cache.root
		})
		this.components = {}
		this.fileReader = new FilerReader(config.static)
		// server start
		var server = http.createServer((req,res) => {
			// 屏蔽非法用户
			if(this.isAbnormalVisitor(req)){
				res.writeHead(500)
				res.end('hello I\'m bh-lay !')
				return
			}
			// 实例化一个connect对象
			const newConnect = new Connect(req, res, {
				sessionRoot: config.session.root,
				components: this.components
			})
			const path = newConnect.url
			const pathname = path.pathname
			let matchedRoutes = this.matchRequestInRoutes(pathname, newConnect.request.method || '')
			// 第一顺序，执行跨域检测
			crossCheck(newConnect)
			if(matchedRoutes.length){
				// 第二顺序：执行get方法设置的回调
				// 使用匹配的最后一个 controller
				let usedRoute = matchedRoutes[matchedRoutes.length - 1]
				newConnect.route = usedRoute
				usedRoute.controller(usedRoute, newConnect, this).catch(async (error) => {
					console.error(`\ncontroller failed\n|-------------->\n$`, usedRoute, '\n', error, '<--------------|')
					const html = await newConnect.views('system/mongoFail',{error})
					newConnect.writeHTML(500, html)
				})

			}else{
				// 第三顺序：使用静态文件
				this.fileReader.read(pathname, req,res, () => {
					// 第四顺序：查找301重定向
					if(urlRedirectConfig[pathname]){
						newConnect.writeCustom(301,{
							'location' : urlRedirectConfig[path.pathname]
						}, '')
					}else{
						// 最终：只能404了
						newConnect.views('system/404',{
							content : '文件找不到啦！'
						})
						.then(function(html){
							newConnect.writeHTML(404, html)
						})
					}
				})
			}
		})
		server.listen(config.port)
		console.log('Server start at port: ' + config.port)
	}
	/**
	 * 检测是否为正常用户
	 */
	isAbnormalVisitor (req: http.IncomingMessage) {
		var url = req.url || ''
		// 检测路径中是否包含 ../
		if(url.match(/\.\.\//)){
			return true
		}
		return false
	}
	/**
	 * 设置前端请求路径
	 */
	setRoute (urlRule: string, callback: controller) {
		if(typeof(urlRule) !== 'string'){
			return
		}
		// URL 转换为全小写
		let urlRulePrefix = urlRule.toLowerCase()
		// 匹配 method，并清理 url method 部分
		let method: routeHttpMethod = 'all'
		urlRulePrefix = urlRulePrefix.replace(/^(\w+)\s/, (result, key) => {
			method = key.match(/^(rest|get|post|put|delete)$/) ? key : 'all'
			return ''
		})
		let keys: pathToRegexp.Key[] = []
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
	matchRequestInRoutes (path: string, method: string) {
		let result: routeItemMatched[] = []
		let currentMethod = method.toLowerCase() as httpMethod
		// 遍历所有路由配置
		this.routes.forEach((routeConfigItem: routeItemParsed) => {
			// 第一步，检查 method 是否匹配
			let methodMatch = routeConfigItem.method === 'rest' || routeConfigItem.method === 'all' || routeConfigItem.method === currentMethod
			if (!methodMatch) {
				return
			}
			// 第二步，检查 URL 规则是否匹配
			let testMatches = routeConfigItem.rule.exec(path)
			if (!testMatches) {
				return
			}
			// 从 URL 中获取参数
			let params: searchParams = {}
			testMatches.forEach((value, index) => {
				if (index > 0) {
					let key = routeConfigItem.keys[index - 1]
					params[key] = value
				}
			})

			// rest API 会主动去找与当前 method 相匹配的方法
			const routerConfigController = routeConfigItem.controller
			let controller = routerConfigController
			if (routeConfigItem.method === 'rest' && typeof routerConfigController === 'object' && routerConfigController[currentMethod]) {
				controller = routerConfigController[currentMethod] as controller
			}
			if (typeof controller !== 'function') {
				return
			}
			// 标记匹配结果
			result.push({
				path,
				params,
				route: routeConfigItem,
				controller
			})
		})
		return result
	}

	registerComponent(componentName: string, conponentFunction?: componentFn) {
		this.components[componentName] = conponentFunction || undefined
	}
// App.prototype.utils = utils
}