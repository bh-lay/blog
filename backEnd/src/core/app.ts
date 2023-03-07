/**
 * @author bh-lay
 * @version 1.0
 * @modified 2014-6-27 23:14
 */
import pathToRegexp from 'path-to-regexp'
import http from 'http'
import Connect from './connect'
import FilerReader from './staticFile'
import getAppConfig from '../conf/app-config'
import urlRedirectConfig from '../conf/301url'
import { httpMethod, routeHttpMethod, searchParams, controller, routeItemParsed, routeItemMatched, componentFn, componentRegisted } from './index'
import Cache from './cache'
import initTemporary from './utils/init-temporary'

function crossCheck(connect: Connect){
	const referer = connect.request.headers.referer || ''
	const subDomainMatched = referer.match(/(http(s|)\:\/\/[^\.\/]+\.bh-lay\.com)/)
	if (subDomainMatched) {
		connect.setHeader('Access-Control-Allow-Origin', subDomainMatched[0])
		connect.setHeader('Access-Control-Allow-Methods', 'GET')
	}
}
function defaultErrorHandler(error: Error){
	console.log(error)
	console.trace('Crazy Error')
}
type appOptions = {
	errorHandler?: (e: Error) => void,
	port: string
}
/**
 * application 类
 */
export default class App {
	routes: routeItemParsed[]
	fileReader: FilerReader
	cache: Cache
	config
	options: appOptions
	components: componentRegisted
	private errorHandler: ((e: Error) => void)
	constructor (options: appOptions) {
		this.routes = []
		const config = getAppConfig()
		this.config = config
		this.options = options
		this.cache = new Cache({
			useCache: config.cache.use ? true : false,
			max_num: config.cache.max_num,
			root: config.cache.root
		})
		this.components = {}
		this.fileReader = new FilerReader(config.static)
		this.errorHandler = options.errorHandler || defaultErrorHandler
		// 初始化临时目录
		initTemporary(config.temporaryPath)
		this.serverListen()
		this.errorCatch()
	}
	private serverListen() {
		const config = this.config
		// server start
		const server = http.createServer((req, res) => {
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
			const matchedRoutes = this.matchRequestInRoutes(pathname, newConnect.request.method || '')
			// 第一顺序，执行跨域检测
			crossCheck(newConnect)
			if(matchedRoutes.length){
				// 第二顺序：执行get方法设置的回调
				// 使用匹配的最后一个 controller
				const usedRoute = matchedRoutes[matchedRoutes.length - 1]
				newConnect.route = usedRoute
				usedRoute.controller(usedRoute, newConnect, this).catch(async (error) => {
					console.error('\ncontroller failed\n|-------------->\n$', usedRoute, '\n', error, '<--------------|')
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
		server.listen(this.options.port)
		console.log('Server start at port: ' + this.options.port)
	}
	private errorCatch() {
		process.on('uncaughtException', (error: Error) => {
			this.errorHandler(error)
		})
		process.on('unhandledRejection', (error: Error) => {
			this.errorHandler(error)
		})
	}
	/**
	 * 检测是否为正常用户
	 */
	isAbnormalVisitor (req: http.IncomingMessage) {
		const url = req.url || ''
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
		const keys: pathToRegexp.Key[] = []
		const rule = pathToRegexp(urlRulePrefix, keys)
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
		const result: routeItemMatched[] = []
		const currentMethod = method.toLowerCase() as httpMethod
		// 遍历所有路由配置
		this.routes.forEach((routeConfigItem: routeItemParsed) => {
			// 第一步，检查 method 是否匹配
			const methodMatch = routeConfigItem.method === 'rest' || routeConfigItem.method === 'all' || routeConfigItem.method === currentMethod
			if (!methodMatch) {
				return
			}
			// 第二步，检查 URL 规则是否匹配
			const testMatches = routeConfigItem.rule.exec(path)
			if (!testMatches) {
				return
			}
			// 从 URL 中获取参数
			const params: searchParams = {}
			testMatches.forEach((value, index) => {
				if (index > 0) {
					const key = routeConfigItem.keys[index - 1]
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
}
