/**
 * @author bh-lay
 * RSS Feed Controller
 */
import { routeItemMatched, Connect, App } from '@/core/index'
import { getDbCollection } from '@/database/DB'

const showdown = require('showdown')

type ArticleForRSS = {
  id: string
  title?: string
  intro?: string
  content?: string
  time_show?: Date | string | number
  author?: string
  tags?: string[]
  cover?: string
}

type SiteInfo = {
  title: string
  description: string
  link: string
  language: string
  copyright: string
  managingEditor: string
  webMaster: string
  generator?: string
  docs?: string
  image?: {
    url: string
    title: string
    link: string
  }
  assetDomain?: string
  selfUrl: string
  authorEmail: string
  defaultAuthorName: string
}

const markdownConverter = new showdown.Converter()

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

function sanitizeForCDATA (str: string): string {
  if (typeof str !== 'string') {
    return ''
  }
  // 转义 CDATA 结束标记
  let sanitized = str.replace(/\]\]>/g, ']]&gt;')
  // 修复 HTML 中无效的实体引用（& 后面不是有效的实体）
  // 匹配 & 后面不是 #、字母或分号的情况，将其转义为 &amp;
  sanitized = sanitized.replace(/&(?!(?:[a-zA-Z][\w-]*|#\d+|#x[a-fA-F0-9]+);)/g, '&amp;')
  return sanitized
}

function wrapCDATA (str: string): string {
  return `<![CDATA[${sanitizeForCDATA(str)}]]>`
}

function formatRSSDate (date: Date | string | number): string {
  let d: Date
  if (typeof date === 'string') {
    d = new Date(parseInt(date))
  } else if (typeof date === 'number') {
    d = new Date(date)
  } else {
    d = date
  }

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

function resolveAssetUrl (raw: unknown, siteInfo: SiteInfo): string | null {
  if (typeof raw !== 'string' || raw.length === 0) {
    return null
  }
  if (/^https?:\/\//i.test(raw)) {
    return raw
  }
  if (raw.startsWith('//')) {
    return `https:${raw}`
  }
  const assetBase = siteInfo.assetDomain || siteInfo.link
  const base = assetBase.replace(/\/$/, '')
  const normalizedPath = raw.startsWith('/') ? raw : `/${raw}`
  return `${base}${normalizedPath}`
}

function guessMimeTypeFromUrl (url: string): string {
  const matched = url.split('?')[0].split('.').pop()
  if (!matched) {
    return 'application/octet-stream'
  }
  const ext = matched.toLowerCase()
  if (ext === 'png') {
    return 'image/png'
  }
  if (ext === 'gif') {
    return 'image/gif'
  }
  if (ext === 'webp') {
    return 'image/webp'
  }
  if (ext === 'svg' || ext === 'svgz') {
    return 'image/svg+xml'
  }
  if (ext === 'jpeg' || ext === 'jpg') {
    return 'image/jpeg'
  }
  return 'application/octet-stream'
}

/**
 * 清理 HTML 中的无效标签
 */
function cleanInvalidHtmlTags (html: string): string {
  if (typeof html !== 'string' || html.length === 0) {
    return ''
  }
  let cleaned = html
  
  // 移除无效的复数形式标签（如 </videos>、</audios> 等）
  // 注意：<video> 和 <audio> 是有效的 HTML5 标签，不应该被移除
  // 但它们的复数形式（videos、audios）是无效的
  const invalidPluralTags = ['videos', 'audios']
  for (const tag of invalidPluralTags) {
    // 移除无效的开始标签 <tag> 和 <tag ...>
    cleaned = cleaned.replace(new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi'), '')
    // 移除无效的结束标签 </tag>
    cleaned = cleaned.replace(new RegExp(`</${tag}>`, 'gi'), '')
  }
  
  // 移除没有对应开始标签的孤立结束标签
  // 这是一个更通用的方法，但需要小心处理，避免移除有效的标签
  // 这里我们只处理明显的问题：以 </ 开头但标签名不是标准 HTML 标签的情况
  
  return cleaned
}

/**
 * 将 HTML 内容中的相对 URL 转换为绝对 URL
 */
function normalizeHtmlContent (html: string, siteInfo: SiteInfo): string {
  if (typeof html !== 'string' || html.length === 0) {
    return ''
  }
  const assetBase = (siteInfo.assetDomain || siteInfo.link).replace(/\/$/, '')
  
  // 先清理无效标签
  let normalized = cleanInvalidHtmlTags(html)
  
  // 处理协议相对 URL (//example.com)
  normalized = normalized.replace(/(src|href)=["']\/\/([^"']+)["']/gi, (_match, attr, url) => {
    return `${attr}="https://${url}"`
  })
  
  // 处理绝对路径 (/path/to/file)
  normalized = normalized.replace(/(src|href)=["']\/([^"']*)["']/gi, (_match, attr, url) => {
    return `${attr}="${assetBase}/${url}"`
  })
  
  // 处理 srcset 属性
  normalized = normalized.replace(/(srcset)=["']([^"']+)["']/gi, (_match, attr, value) => {
    const rebuilt = value.split(',').map((part: string) => {
      const trimmed = part.trim()
      if (trimmed.startsWith('//')) {
        return `https:${trimmed}`
      }
      if (trimmed.startsWith('/')) {
        return `${assetBase}${trimmed}`
      }
      return trimmed
    }).join(', ')
    return `${attr}="${rebuilt}"`
  })
  
  // 处理 CSS url() 中的协议相对 URL
  normalized = normalized.replace(/url\((['"]?)\/\/([^'"\)]+)\1\)/gi, (_match, quote, url) => {
    return `url(${quote}https://${url}${quote})`
  })
  
  // 处理 CSS url() 中的绝对路径
  normalized = normalized.replace(/url\((['"]?)\/([^'"\)]+)\1\)/gi, (_match, quote, url) => {
    return `url(${quote}${assetBase}/${url}${quote})`
  })
  
  return normalized
}

function generateRSSXML (articles: ArticleForRSS[], siteInfo: SiteInfo) {
  const {
    title,
    description,
    link,
    language,
    copyright,
    managingEditor,
    webMaster,
    generator,
    docs,
    image,
    selfUrl,
    authorEmail,
    defaultAuthorName
  } = siteInfo
  const siteBase = link.replace(/\/$/, '')

  let itemsXML = ''
  for (const article of articles) {
    const pubDate = formatRSSDate(article.time_show || new Date())
    const articleLink = `${siteBase}/blog/${article.id}`
    const articleTitle = escapeXML(article.title || '')
    const markdownContent = typeof article.content === 'string' ? article.content : ''
    const fallbackText = article.intro || ''
    const fallbackHtml = fallbackText ? `<p>${escapeXML(fallbackText)}</p>` : ''
    const fullContent = markdownContent ? markdownConverter.makeHtml(markdownContent) : fallbackHtml
    const normalizedContent = normalizeHtmlContent(fullContent || fallbackHtml, siteInfo)
    const articleBody = normalizedContent || fallbackHtml
    const articleDescription = wrapCDATA(articleBody)
    const encodedContent = wrapCDATA(articleBody)
    const authorName = (article.author && article.author.trim()) ? article.author.trim() : defaultAuthorName
    const authorField = `${authorEmail} (${authorName})`
    const coverUrl = resolveAssetUrl(article.cover, siteInfo)
    const tags = Array.isArray(article.tags) ? article.tags : []
    const categoryLines = tags.length > 0 ? tags.map(tag => `      <category>${escapeXML(tag)}</category>`).join('\n') + '\n' : ''
    const enclosureLine = coverUrl ? `      <enclosure url="${escapeXML(coverUrl)}" length="0" type="${guessMimeTypeFromUrl(coverUrl)}"/>\n` : ''

    itemsXML += `    <item>
      <title>${articleTitle}</title>
      <link>${articleLink}</link>
      <description>${articleDescription}</description>
      <author>${escapeXML(authorField)}</author>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${articleLink}</guid>
${categoryLines}${enclosureLine}      <content:encoded>${encodedContent}</content:encoded>
    </item>
`
  }

  const lastBuildDate = articles.length > 0 ? formatRSSDate(articles[0].time_show || new Date()) : formatRSSDate(new Date())

  const imageBlock = image ? `    <image>
      <url>${escapeXML(image.url)}</url>
      <title>${escapeXML(image.title)}</title>
      <link>${escapeXML(image.link)}</link>
    </image>
` : ''

  const docsLine = docs ? `    <docs>${escapeXML(docs)}</docs>
` : ''
  const generatorLine = generator ? `    <generator>${escapeXML(generator)}</generator>
` : ''

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXML(title)}</title>
    <link>${link}</link>
    <description>${escapeXML(description)}</description>
    <language>${language}</language>
    <copyright>${escapeXML(copyright)}</copyright>
    <managingEditor>${escapeXML(managingEditor)}</managingEditor>
    <webMaster>${escapeXML(webMaster)}</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXML(selfUrl)}" rel="self" type="application/rss+xml"/>
${generatorLine}${docsLine}${imageBlock}${itemsXML}  </channel>
</rss>`
}

/**
 * 获取文章列表用于 RSS
 */
async function getArticlesForRSS (limit: number = 20): Promise<ArticleForRSS[]> {
  const { collection, client } = await getDbCollection('article')

  const docs = await collection.find({}, {
    limit: limit,
    projection: {
      id: 1,
      title: 1,
      intro: 1,
      content: 1,
      time_show: 1,
      author: 1,
      tags: 1,
      cover: 1
    }
  }).sort({
    time_show: -1
  }).toArray()

  client.close()
  return docs as ArticleForRSS[]
}

/**
 * RSS Feed 控制器
 */
export async function rss (route: routeItemMatched, connect: Connect, app: App) {
  try {
    // 获取实际的请求 URL 用于 atom:link（必须在缓存外部获取，确保每次请求都使用正确的 URL）
    const hostHeader = connect.request.headers.host || ''
    const forwardedProtoHeader = (connect.request.headers['x-forwarded-proto'] as string) || ''
    const forwardedProto = forwardedProtoHeader.split(',')[0]?.trim().toLowerCase()
    const socketAny = connect.request.socket as { encrypted?: boolean } | undefined
    const isEncrypted = forwardedProto ? forwardedProto === 'https' : (socketAny?.encrypted === true)
    const protocol = forwardedProto || (isEncrypted ? 'https' : 'http')
    const rawRequestUrl = connect.request.url || '/rss'
    const normalizedRequestUrl = rawRequestUrl.startsWith('/') ? rawRequestUrl : `/${rawRequestUrl}`
    const configuredSiteUrl = (process.env.siteUrl || '').replace(/\/$/, '')
    const siteBaseFromRequest = hostHeader ? `${protocol}://${hostHeader}` : ''
    const siteBase = (configuredSiteUrl || siteBaseFromRequest || 'https://bh-lay.com').replace(/\/$/, '')
    const selfUrl = `${siteBase}${normalizedRequestUrl}`

    // 从缓存获取或生成 RSS（文章内容可以缓存，但 selfUrl 需要动态获取）
    const cache_name = 'rss_feed'
    const cachedDataStr = await app.cache.getWithCreate(cache_name, ['rss', 'article'], async function () {
      const articles = await getArticlesForRSS(20)
      return { articles }
    })
    const cachedData = JSON.parse(cachedDataStr) as { articles: ArticleForRSS[] }

    // 在缓存外部构建 siteInfo，确保 selfUrl 是动态的
    const defaultAuthorName = process.env.siteAuthorName || '剧中人'
    const configuredEditor = process.env.siteEditor || ''
    const configuredWebMaster = process.env.siteWebMaster || ''
    const editorEmailFromConfig = configuredEditor.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || ''
    const webMasterEmailFromConfig = configuredWebMaster.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || ''
    const authorEmail = process.env.siteAuthorEmail || editorEmailFromConfig || 'mail@bh-lay.com'
    const managingEditor = configuredEditor && editorEmailFromConfig
      ? configuredEditor
      : `${authorEmail} (${defaultAuthorName})`
    const webMaster = configuredWebMaster && webMasterEmailFromConfig
      ? configuredWebMaster
      : `${authorEmail} (${defaultAuthorName})`

    const cdnDomain = (app.options.frontendCdnDomain || '').trim()
    const assetDomainBase = cdnDomain.length > 0 ? cdnDomain : siteBase
    const assetDomain = assetDomainBase.replace(/\/$/, '')

    const rawImageUrl = process.env.siteImageUrl || ''
    const normalizedImageUrl = rawImageUrl
      ? (/^https?:\/\//i.test(rawImageUrl) ? rawImageUrl : `${siteBase}${rawImageUrl.startsWith('/') ? rawImageUrl : `/${rawImageUrl}`}`)
      : undefined
    const rawImageLink = process.env.siteImageLink || siteBase
    const imageLink = /^https?:\/\//i.test(rawImageLink) ? rawImageLink : `${siteBase}${rawImageLink.startsWith('/') ? rawImageLink : `/${rawImageLink}`}`
    const imageTitle = process.env.siteImageTitle || '小剧客栈'

    // 网站信息配置（可以从环境变量或配置文件中读取）
    const siteInfo = {
      title: '小剧客栈_剧中人的个人博客',
      description: '剧中人的文笔很差，却也喜欢时常写点东西，不管是技术上的分享，生活上的感悟，还是天马行空的乱弹，小剧都会写在这里！',
      link: siteBase,
      language: 'zh-cn',
      copyright: `Copyright ${new Date().getFullYear()} 剧中人`,
      managingEditor,
      webMaster,
      generator: process.env.rssGenerator || 'bh-lay.com RSS Generator',
      docs: 'https://cyber.harvard.edu/rss/rss.html',
      image: normalizedImageUrl ? {
        url: normalizedImageUrl,
        title: imageTitle,
        link: imageLink
      } : undefined,
      assetDomain,
      selfUrl,
      authorEmail,
      defaultAuthorName
    }

    const rssXML = generateRSSXML(cachedData.articles, siteInfo)
    
    connect.writeCustom(200, {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, max-age=3600'
    }, rssXML)
  } catch (error) {
    console.error('RSS generation error:', error)
    connect.writeCustom(500, {
      'Content-Type': 'text/plain; charset=utf-8'
    }, 'RSS feed generation failed')
  }
}

