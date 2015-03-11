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
	//前端静态资源根目录（css、js、图片、字体）
	frontEnd_root : '/frontEnd/develop/',
    //静态资源版本
    frontEnd_version : '20141217',
	//图床
	img_domain : '/asset',
    //缓存配置
    cache: {
        use: true,
        max_num: 1000,
        root: './temporary/cache/'
    },
	mongo : {
		host: 'localhost',
		port: 27017,
		user: 'lay',
		pass: '19900927',
		db_name: 'blog'
	}
}; 