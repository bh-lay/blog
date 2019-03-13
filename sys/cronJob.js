const CronJob = require('cron').CronJob

/**
 * 计划任务
 **/
let updateLabsDataFromGithub = require('../sys/functions/updateLabsDataFromGithub.js')
let updateFriendsScore = require('../sys/functions/updateFriendsScore.js')
let my720Data = require('../sys/functions/my720Data.js')
let myTuchongData = require('../sys/functions/myTuchongData.js')
let myGithubData = require('../sys/functions/myGithubData.js')

exports.start = app => {
	// 每晚三点
	new CronJob('01 01 03 * * *', function() {
		// 更新实验室里的Github数据
		updateLabsDataFromGithub.all()
		// 更新个人Github信息
		myGithubData.update()
		// 更新前端英雄榜分数
		updateFriendsScore.update()
		// 更新720云数据
		my720Data.update()
		// 更新图虫数据
		myTuchongData.update()
	}, null, true, 'Asia/Hong_Kong')

	// 每晚三点零十分
	new CronJob('01 10 03 * * *', function() {
		// 清除全部缓存
		app.cache.clear()
	}, null, true, 'Asia/Hong_Kong')
}