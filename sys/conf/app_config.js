/**
 * 此文件为项目配置文件
 * 切不可直接传至服务端，需要手动配置
 * 
 */

module.exports = {
	host : '*',
  //端口号
	port : 8888,
  //静态资源
  static: {
    //静态资源根目录
    root: '../web/',
    //静态资源缓存时间
    maxAge: 60 * 60 * 24 * 365,
    //定义文件类型 Mime-Type
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
	//前端版本控制（css、js、图片、字体）
	frontEnd: {
    //图床地址
    img_domain : 'http://127.0.0.1:8088'
  },
  //SESSION配置
  session : {
    root : './temporary/session/'
  },
  //缓存配置
  cache: {
    use: false,
    max_num: 1000,
    root: './temporary/cache/'
  },
  //数据库链接
	mongo : {
		host: '127.0.0.1',
		port: 27017,
		user: 'bloguser',
		pass: '123456',
		db_name: 'blog'
	}
}; 