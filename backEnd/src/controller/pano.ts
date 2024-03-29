/**
 * @author bh-lay
 */
import { routeItemMatched, Connect, App } from '@/core/index'
import { base64Encode } from '@/lib/utils'
import { get720Data } from '@/functions/my-720-data'
import { imgRobborRoutePathName } from '@/constants/index'
export default async function (route: routeItemMatched, connect: Connect, app: App) {
  const html = await app.cache.getWithCreate('pano_list',['html','pano'], async function () {
    const data = await get720Data()
    const list = (data.data.list || []).map((item) => {
      const property = item.property
      const thumb = `https://ssl-thumb2.720static.com/${property.thumbUrl}?imageMogr2/thumbnail/560`
      return {
        title: property.name,
        desc: property.remark,
        url: `https://720yun.com/t/${property.pid}?from=bh-lay`,
        thumb: `/${imgRobborRoutePathName}/${base64Encode(thumb + '-https://720yun.com')}`,
        pv: item.pvCount,
        like: item.likeCount,
      }
    })
								
    // 获取视图
    return await connect.views('multi-page/panoList',{
      title : '小剧的全景作品_小剧客栈_剧中人的个人博客',
      keywords : '全景,pano,panorama,vr,剧中人,小剧客栈,前端工程师,设计师,nodeJS',
      description : '剧中人全景拍摄的作品，汇集全景云台、无人机航拍、手机拍全景等多重拍摄方式！',
      list
    })
  })
  connect.writeHTML(200, html)
}
