/**
 * @author bh-lay
 */
import http, { OutgoingHttpHeaders } from 'node:http'
import { promises as fs } from 'fs'
import zlib from 'zlib'
import Session from './session'
import { writeCookie } from './utils/index'
import { parseCookie, parseRequestBody, parseURL, typeParsedUrl } from './utils/parse'
import { componentContext, componentRegisted, routeItemMatched, typeResponse, juicer } from './index'
import { replaceComponent } from './views'
import writeStaticFile from './write-static-file'
import path from 'path'

const baseViewRoot = './src/views/'
/**
 * 单次连接类
 *
 */
export default class CONNECT {
  url: typeParsedUrl
  request: http.IncomingMessage
  response: typeResponse
  sessionRoot: string
  components: componentRegisted
  route: routeItemMatched | null
  _session: Session | null
  _sended: boolean
  constructor (req: http.IncomingMessage, res: typeResponse, options: {
    sessionRoot: string,
    components: componentRegisted
  }) {
    this.url = parseURL(req.url || '')
    this.request = req
    this.response = res
    this.sessionRoot = options.sessionRoot
    this.components = options.components
    this._session = null
    this.route = null
    // 是否已向客户端发送信息体
    this._sended = false
  }
  // 统一返回客户端信息方法
  private sendResponse (status: number, headers: OutgoingHttpHeaders, content: string | null) {
    if (this._sended) {
      console.trace('write after end', this.url)
      return
    }
    this._sended = true
    
    headers = headers || {}
    content = content || null

    headers['server'] = 'nodejs'
    headers['Connection'] = 'keep-alive'
    headers['Content-Encoding'] = 'gzip'
    this.response.statusCode = status
    for (const i in headers) {
      this.setHeader(i, headers[i] as string)
    }
    if (content) {
      zlib.gzip(content, (err, result) => {
        this.response.end(result)
      })
    } else {
      this.response.end()
    }
  }
  writeCustom (status: number, headers: OutgoingHttpHeaders, content: string | null) {
    return this.sendResponse(status, headers, content)
  }
  writeJson (data: Record<string, unknown> | unknown[]) {
    this.sendResponse(200, {
      'Content-Type' : 'application/json',
      'charset' : 'utf-8',
    }, JSON.stringify(data))
  }
  /**
   * response jsonp data
   *   data can be object or string
   */
  writeJSONP (data: unknown) {
    const json_str = typeof(data) == 'string' ? data : JSON.stringify(data),
      callbackName = this.url.search.callback || 'jsonpCallback'
    this.sendResponse(200,{
      'Content-Type' : 'application/x-javascript',
      'charset' : 'utf-8',
    }, `${callbackName}(${json_str});`)
  }
  /**
   * response html page
   */
  writeHTML (status: number, content: string) {
    this.sendResponse(status,{
      'Content-Type': 'text/html',
      'charset': 'utf-8'
    }, content)
  }
  writeFile (filePath: string, options: { maxAge: number }) {
    return writeStaticFile(filePath, this.request.headers, this.response, {
      maxAge: options.maxAge
    })
  }

  setHeader (key: string, value: string | number) {
    this.response.setHeader(key, value)
  }

  /**
   *  //获取完整cookie
   *  connect.cookie();
   *
   *  //获取特定cookie
   *  connect.cookie('sessionverify');
   *
   * //写入cookie
   *  connect.cookie({
   *    'session_verify' : sessionID,
   *    'path' : '/',
   *    'Max-Age' : 60*60*24*2
   *  },{
   *    'UID':'23w'
   *  }); 
   */
  cookie (input?: Record<string, unknown> | string) {
    const cookieInRequest = this.request.headers.cookie || ''
    if (typeof(input) === 'object') {
      // 写入cookie
      writeCookie(input, this.response)
    } else if (typeof(input) === 'string') {
      // 获取特定cookie
      const parsedCookie = parseCookie(cookieInRequest)
      return parsedCookie[input]
    } else {
      // 获取完整cookie
      return parseCookie(cookieInRequest)
    }
  }
  /**
   *  session相关操作
   *
   *  //启动session模块
   *  connect.session(function(methods){
   *    //获取session
   *    var UID = methods.get('UID');
   *    //设置session
   *    methods.set({
   *      'UID' : 324
   *    });
   *    //校验权限
   *    var canIDo = methods.power(23);
   *  });
   */
  async session (): Promise<Session> {
    const me = this
    if (this._session) {
      // session已被打开,直接使用
      return Promise.resolve(this._session)
    }
    // 启用session
    return new Promise((resolve, reject) => {
      const cookie = this.cookie() as Record<string, string | number>
      const session = new Session(this.sessionRoot, cookie)
      session.init(function (cookieObj) {
        me.cookie(cookieObj)
      }).then(() => {
        resolve(session)
      }).catch(e => {
        reject(e)
      })
    })
  }
  async views (URI: string, data: Record<string, unknown>) {
    const realPath = path.join(baseViewRoot, `${URI}.html`)
    data = data || {}
    // 读取模版
    let viewTemplate = ''
    try {
      viewTemplate = await fs.readFile(realPath, 'utf8')
    } catch (e) {
      return ''
    }
    // 替换变量
    viewTemplate = juicer(viewTemplate, data)
  
    // 解析模版的component
    const context: componentContext = {
      connect: this
    }
    return replaceComponent(viewTemplate, this.components, context)
  }
  ip () {
    const req = this.request
    return req.headers['x-forwarded-for'] || req.connection['remoteAddress']
  }
  parseRequestBody () {
    return parseRequestBody(this.request)
  }
}


