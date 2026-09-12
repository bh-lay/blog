import { imgRobber } from '@/common/js/img-robber'
function panoListParser(panoList) {
    return panoList.map(function (item) {
        let thumb = `https://ssl-thumb2.720static.com/${item.thumbUrl}?imageMogr2/thumbnail/560`
        return {
            title: item.name,
            url: `https://720yun.com/t/${item.dataHashid}?from=bh-lay`,
            thumb: imgRobber(thumb, 'https://720yun.com'),
            pv: item.pvCount,
            like: item.likeCount,
        }
    })
}