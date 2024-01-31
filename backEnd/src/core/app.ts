/**
 * @author bh-lay
 * @version 1.0
 * @modified 2014-6-27 23:14
 */
import path from 'path'
import pathToRegexp from 'path-to-regexp'
import http from 'http'
import Connect from './connect'
import querystring from 'querystring'
import urlRedirectConfig from '../conf/301url'
import { httpMethod, routeHttpMethod, searchParams, controller, routeItemParsed, routeItemMatched, componentFn, componentRegisted } from './index'
import Cache from './cache'
import { defaultMimes, mimes } from './utils/mimes'
import initTemporary from './utils/init-temporary'

function crossCheck (connect: Connect) {
  const referer = connect.request.headers.referer || ''
  const subDomainMatched = referer.match(/(http(s|)\:\/\/[^\.\/]+\.bh-lay\.com)/)
  if (subDomainMatched) {
    connect.setHeader('Access-Control-Allow-Origin', subDomainMatched[0])
    connect.setHeader('Access-Control-Allow-Methods', 'GET')
  }
}
function defaultErrorHandler (error: Error) {
  console.log(error)
  console.trace('Crazy Error')
}
export type appOptions = {
  errorHandler?: (e: Error) => void,
  port: string,
  temporaryPath: string,
  useCache: boolean,
  maxCacheCount: number,
  staticRoot: string,
  staticFileMaxAge: number,
  frontendCdnDomain: string,
  extraSubTempPaths: string[],
  mimes: mimes
}
type appOptionsParams = {
  errorHandler?: (e: Error) => void,
  port: string,
  temporaryPath: string,
  useCache: boolean,
  maxCacheCount: number,
  staticRoot: string,
  staticFileMaxAge: number,
  frontendCdnDomain: string,
  extraSubTempPaths?: string[],
  mimes?: mimes
}
/**
 * application 类
 */
export default class App {
  routes: routeItemParsed[]
  cache: Cache
  options: appOptions
  components: componentRegisted
  private errorHandler: ((e: Error) => void)
  constructor (options: appOptionsParams) {
    this.routes = []
    // create options
    this.options = Object.assign({
      mimes: {},
      extraSubTempPaths: [],
    }, options)
    this.options.mimes = Object.assign({}, defaultMimes, options.mimes)

    this.cache = new Cache({
      useCache: options.useCache,
      maxCacheCount: options.maxCacheCount,
      root: path.join(options.temporaryPath, 'cache')
    })
    this.components = {}
    this.errorHandler = options.errorHandler || defaultErrorHandler
    // 初始化临时目录
    initTemporary(options.temporaryPath, options.extraSubTempPaths)
    this.serverListen()
    this.errorCatch()
  }
  private serverListen () {
    // server start
    const server = http.createServer((req, res) => {
      // 屏蔽非法用户
      if (this.isAbnormalVisitor(req)) {
        res.writeHead(500)
        res.end('hello I\'m bh-lay !')
        return
      }
      // 实例化一个connect对象
      const newConnect = new Connect(req, res, {
        sessionRoot: path.join(this.options.temporaryPath, 'session/'),
        components: this.components,
        mimes: this.options.mimes
      })
      const connectPath = newConnect.url
      const pathname = connectPath.pathname
      const matchedRoutes = this.matchRequestInRoutes(pathname, newConnect.request.method || '')
      // 第一顺序，执行跨域检测
      crossCheck(newConnect)
      if (matchedRoutes.length) {
        // 第二顺序：执行get方法设置的回调
        // 使用匹配的最后一个 controller
        const usedRoute = matchedRoutes[matchedRoutes.length - 1]
        newConnect.route = usedRoute
        usedRoute.controller(usedRoute, newConnect, this).catch(async (error) => {
          console.error('\ncontroller failed\n|-------------->\n$', usedRoute, '\n', error, '<--------------|')
          const html = await newConnect.views('system/mongoFail',{error})
          newConnect.writeHTML(500, html)
        })
      } else if (urlRedirectConfig[pathname]) {
        // 第三顺序：查找301重定向
        const originSearch = newConnect.url.search
        const searchStr = Object.keys(originSearch).length > 0 ? '?' + querystring.stringify(newConnect.url.search) : ''
        newConnect.writeCustom(301,{
          location: urlRedirectConfig[connectPath.pathname] + searchStr
        }, '')
      } else if (this.options.staticRoot) {
        // 第四顺序：使用静态文件
        newConnect.writeFile(
          path.join(this.options.staticRoot, pathname),
          {
            maxAge: this.options.staticFileMaxAge
          }
        )
          .catch(function () {
            // 最终：只能404了
            return newConnect.views('system/404',{
              content: '文件找不到啦！'
            }).then((html: string) => {
              newConnect.writeHTML(404, html)
            })
          })
      }
    })
    server.listen(this.options.port)
    console.log(`Server start at port:  ${this.options.port}`)
  }
  private errorCatch () {
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
    if (url.match(/\.\.\//)) {
      return true
    }
    return false
  }
  /**
   * 设置前端请求路径
   */
  setRoute (urlRule: string, callback: controller) {
    if (typeof(urlRule) !== 'string') {
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

  registerComponent (componentName: string, conponentFunction?: componentFn) {
    this.components[componentName] = conponentFunction || undefined
  }
}
