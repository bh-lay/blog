/**
 * 此文件为项目配置文件
 * 切不可直接传至服务端，需要手动配置
 * 
 */

module.exports = {
	host : '*',
	port : 80,
    //静态资源根目录
    staticFileRoot: '../web/',
	//前端资源（css、js、图片、字体）
	frontEnd: {
        //根目录
        base : '/frontEnd/develop/',
        //版本
        version : '20141217',
        //图床地址
        img_domain : '/asset'
    },
    //缓存配置
    cache: {
        use: false,
        max_num: 1000,
        root: './temporary/cache/'
    },
	mongo : {
		host: 'localhost',
		port: 27017,
		user: 'lay',
		pass: '19900927',
		db_name: 'blog'
	},
    //定义文件类型 Mime-Type
    mime : {
      html : 'text/html',
      js : 'application/x-javascript',
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
}; 