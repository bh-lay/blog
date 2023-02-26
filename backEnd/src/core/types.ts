import http from 'http'
import AppClass from "./index"
import ConnectClass from './connect'
import SessionClass from './session'

export type App = AppClass
export type Connect = ConnectClass
export type Session = SessionClass
export type httpMethod = 'get' | 'post' | 'put' | 'delete'
export type routeHttpMethod = 'rest' | 'all' | httpMethod
export type typeResponse = http.ServerResponse<http.IncomingMessage> & {
	req: http.IncomingMessage;
}

export type searchParams = Record<string, string | number>
// router & controller
type controllWithApp = (route: routeItemMatched, connect: Connect, app: AppClass) => Promise<unknown>
type controllWithoutApp = (route: routeItemMatched, connect: Connect) => Promise<unknown>
export type singleController = controllWithApp | controllWithoutApp
export type restController = {
  get?: singleController
  post?: singleController
  put?: singleController
  delete?: singleController
}
export type controller = singleController | restController

type routeItemConfigSingle = {
  path: `${httpMethod | 'all'} /${string | ''}`
  controller: singleController
}
type routeItemConfigRest = {
  path: `rest /${string}`
  controller: restController
}
export type routeItemConfig = routeItemConfigSingle | routeItemConfigRest

export type routeItemParsed = {
	originalRule: string,
	keys: (string | number)[],
	rule: RegExp,
	method: routeHttpMethod,
	controller: controller
}
export type routeItemMatched = {
	path: string,
	params: searchParams,
	route: routeItemParsed,
	controller: singleController
}

export type componentContext = {
	connect: Connect,
}
export type componentFnWithoutContext = (template: string, params: Record<string, unknown>) => Promise<string>
export type componentFnWithContext = (template: string, params: Record<string, unknown>, context: componentContext) => Promise<string>
export type componentFn = componentFnWithContext | componentFnWithoutContext | undefined
export type componentRegisted = Record<string, componentFn>