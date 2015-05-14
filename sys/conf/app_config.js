/**
 * 此文件为项目配置文件
 * 切不可直接传至服务端，需要手动配置
 * 
 */

module.exports = {
	host : '*',
  //端口号
	port : 80,
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
    //根目录
    base : '/frontEnd/develop/',
    //屌丝版版本
    loser_version : '20141217',
    //后台管理版本
    admin_version : '20141217',
    //尝鲜版版本号
    singlepage_version : '20141217',
    //图床地址
    img_domain : '/asset'
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
		host: 'localhost',
		port: 27017,
		user: 'lay',
		pass: '19900927',
		db_name: 'blog'
	}
}; 