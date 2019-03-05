//引入app框架
const app_factory = require('../sys/core/index.js')
const CronJob = require('cron').CronJob
const routes = require('./router/index.js')

//创建app
let app = new app_factory()

// 定义路由
routes.forEach(({path, controller}) => {
	app.setRoute(path, controller)
})
/**
 * 计划任务
 **/
var updateLabsDataFromGithub = require('../sys/functions/updateLabsDataFromGithub.js'),
	updateFriendsScore = require('../sys/functions/updateFriendsScore.js'),
	my720Data = require('../sys/functions/my720Data.js'),
	myTuchongData = require('../sys/functions/myTuchongData.js'),
	myGithubData = require('../sys/functions/myGithubData.js')
//每晚三点
new CronJob('01 01 03 * * *', function() {
	//更新实验室里的Github数据
	updateLabsDataFromGithub.all()
	//更新个人Github信息
	myGithubData.update()
	// 更新前端英雄榜分数
	updateFriendsScore.update()
	// 更新720云数据
	my720Data.update()
	// 更新图虫数据
	myTuchongData.update()
}, null, true, 'Asia/Hong_Kong')

//每晚三点零十分
new CronJob('01 10 03 * * *', function() {
	//清除缓存
	app.cache.clear()
}, null, true, 'Asia/Hong_Kong')