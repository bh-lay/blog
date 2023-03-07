/**
 * 此文件为项目配置文件
 * 具体配置需要预先在环境变量中设定
 * 
 */

/* eslint-disable no-undef */

export default function getAppConfig() {
	const temporaryPath = process.env.temporaryPath
	return {
		host : process.env.host || '*',
		// 端口号
		port : process.env.port,
		// 静态资源
		static: {
			// 静态资源根目录
			root: '../web/',
			// 静态资源缓存时间
			maxAge: 60 * 60 * 24 * 365,
			// 定义文件类型 Mime-Type
			mime : {
				html : 'text/html',
				js : 'application/x-javascript',
				json : 'application/json',
				css : 'text/css',
				ico : 'image/x-icon',
				jpg : 'image/jpeg',
				png : 'image/png',
				gif : 'image/gif',
				rar : 'application/zip',
				zip : 'application/zip',
				pdf : 'application/pdf',
				txt : 'text/plain'
			}
		}, 
		// 前端版本控制（css、js、图片、字体）
		frontEnd: {
			// 图床地址
			cdnDomain : process.env.cdnDomain
		},
		// SESSION配置
		session : {
			root : temporaryPath + '/session/'
		},
		imgRobber : {
			root : temporaryPath + '/img-robber/'
		},
		// 缓存配置
		cache: {
			use: false,
			max_num: 1000,
			root: temporaryPath + '/cache/'
		},
		// 数据库链接
		mongo : {
			host: process.env.mongoHost,
			port: process.env.mongoPort,
			user: process.env.mongoUser,
			pass: process.env.mongoPwd,
			dbName: process.env.MongoDBName
		},
		github: {
			clientId: process.env.githubClientId,
			clientSecret: process.env.githubClientSecret,
			redirectUri: process.env.githubRedirectUri,
		},
		wechat: {
			AppId: process.env.wechatAppId,
			AppSecret: process.env.wechatAppSecret
		}
	}
}