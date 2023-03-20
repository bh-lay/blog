
/**
 * @author bh-lay
 * 
 */

export default function (data: Record<string, unknown>) {
  const params = {
    id : data.id || null,
    userid : data.userid || null,
    title: decodeURI(data.title as string || ''),
    cover: data.cover||'',
    content: data.content,
    originalUrl: data.originalUrl,
    tags: typeof data.tags === 'string' ? data.tags.split(/\s*,\s*/) : [],
    createTime: data.createTime || new Date().getTime().toString()
  }
  return params.title && params.content ? params : null
}