import CronJob from 'cron'
import updateLabsFromGithub from '@/functions/update-labs-from-github'
import { updateDatabaseFromGithub as updateMyInfoFromGithub } from '@/functions/my-github-data'
import syncMoment from '@/functions/moment/index'
import { updateFrom720 } from '@/functions/my-720-data'
import { App } from '@/core/index'
import { updateFromTuchong } from '@/functions/my-tuchong-data'
/**
 * 计划任务
 **/

export default function (app: App) {
  // 每晚三点
  new CronJob.CronJob('01 01 03 * * *', function () {
    // 更新实验室里的Github数据
    updateLabsFromGithub().catch((e) => {
      console.warn(e)
    })
    // 更新个人Github信息
    updateMyInfoFromGithub().catch((e) => {
      console.warn(e)
    })
    // 更新剧中人的朋友圈数据
    syncMoment().catch((e) => {
      console.warn(e)
    })
    // 更新720云数据
    updateFrom720().catch((e) => {
      console.warn(e)
    })
    // 更新图虫数据
    updateFromTuchong().catch((e) => {
      console.warn(e)
    })
  }, null, true, 'Asia/Hong_Kong')

  // // 每晚三点零十分
  // new CronJob.CronJob('01 10 03 * * *', function () {
  //   // 清除全部缓存
  //   app.cache.clear()
  // }, null, true, 'Asia/Hong_Kong')
}