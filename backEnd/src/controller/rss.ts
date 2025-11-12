/**
 * @author bh-lay
 * RSS Feed Controller
 */
import { routeItemMatched, Connect, App } from '@/core/index'
import { getDbCollection } from '@/database/DB'

/**
 * XML 转义函数，转义 XML 特殊字符
 */
function escapeXML (str: string): string {
  if (typeof str !== 'string') {
    return ''
  }
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * 生成 RSS XML
 */
function generateRSSXML (articles: any[], siteInfo: {
  title: string
  description: string
  link: string
  language: string
  copyright: string
  managingEditor: string
  webMaster: string
}) {
  const { title, description, link, language, copyright, managingEditor, webMaster } = siteInfo
  
  // RSS 2.0 标准日期格式 (RFC 822)
  function formatRSSDate (date: Date | string | number): string {
    let d: Date
    if (typeof date === 'string') {
      d = new Date(parseInt(date))
    } else if (typeof date === 'number') {
      d = new Date(date)
    } else {
      d = date
    }
    
    // 检查日期是否有效
    if (isNaN(d.getTime())) {
      d = new Date()
    }
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const day = days[d.getUTCDay()]
    const month = months[d.getUTCMonth()]
    const year = d.getUTCFullYear()
    const hours = String(d.getUTCHours()).padStart(2, '0')
    const minutes = String(d.getUTCMinutes()).padStart(2, '0')
    const seconds = String(d.getUTCSeconds()).padStart(2, '0')
    
    return `${day}, ${String(d.getUTCDate()).padStart(2, '0')} ${month} ${year} ${hours}:${minutes}:${seconds} +0000`
  }

  let itemsXML = ''
  for (const article of articles) {
    const pubDate = formatRSSDate(article.time_show)
    const articleLink = `${link}/blog/${article.id}`
    const articleTitle = escapeXML(article.title || '')
    const articleDescription = escapeXML(article.intro || article.content?.substring(0, 200) || '')
    const articleAuthor = escapeXML(article.author || managingEditor)
    
    itemsXML += `    <item>
      <title>${articleTitle}</title>
      <link>${articleLink}</link>
      <description>${articleDescription}</description>
      <author>${articleAuthor}</author>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${articleLink}</guid>
    </item>
`
  }

  const lastBuildDate = articles.length > 0 ? formatRSSDate(articles[0].time_show) : formatRSSDate(new Date())

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXML(title)}</title>
    <link>${link}</link>
    <description>${escapeXML(description)}</description>
    <language>${language}</language>
    <copyright>${escapeXML(copyright)}</copyright>
    <managingEditor>${escapeXML(managingEditor)}</managingEditor>
    <webMaster>${escapeXML(webMaster)}</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${link}/rss" rel="self" type="application/rss+xml"/>
${itemsXML}  </channel>
</rss>`
}

/**
 * 获取文章列表用于 RSS
 */
async function getArticlesForRSS (limit: number = 20) {
  const { collection, client } = await getDbCollection('article')
  
  const docs = await collection.find({}, {
    limit: limit,
    projection: {
      id: 1,
      title: 1,
      intro: 1,
      content: 1,
      time_show: 1,
      author: 1
    }
  }).sort({
    time_show: -1
  }).toArray()
  
  client.close()
  return docs
}

/**
 * RSS Feed 控制器
 */
export async function rss (route: routeItemMatched, connect: Connect, app: App) {
  try {
    // 从缓存获取或生成 RSS
    const cache_name = 'rss_feed'
    const rssXML = await app.cache.getWithCreate(cache_name, ['rss', 'article'], async function () {
      const articles = await getArticlesForRSS(20)
      
      // 网站信息配置（可以从环境变量或配置文件中读取）
      const siteInfo = {
        title: '小剧客栈_剧中人的个人博客',
        description: '剧中人的文笔很差，却也喜欢时常写点东西，不管是技术上的分享，生活上的感悟，还是天马行空的乱弹，小剧都会写在这里！',
        link: process.env.siteUrl || 'http://bh-lay.com',
        language: 'zh-cn',
        copyright: `Copyright ${new Date().getFullYear()} 剧中人`,
        managingEditor: 'bh-lay@example.com (剧中人)',
        webMaster: 'bh-lay@example.com (剧中人)'
      }
      
      return generateRSSXML(articles, siteInfo)
    })
    
    connect.writeCustom(200, {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }, rssXML)
  } catch (error) {
    console.error('RSS generation error:', error)
    connect.writeCustom(500, {
      'Content-Type': 'text/plain; charset=utf-8'
    }, 'RSS feed generation failed')
  }
}

