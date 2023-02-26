/**
 * @author bh-lay
 */
import { promises as fs } from 'fs'
import { isFileExists } from '@/controller/img-robber/static-file'
type paramOptions = {
	useCache: boolean
	max_num: number
	root: string
}

export default class Cache {
	useCache: boolean
	cache_max_num: number
	root: string
	constructor (param: paramOptions){
		param = param || {}
		this.useCache = param.useCache
		this.cache_max_num = param.max_num
		// 缓存存放目录
		this.root = param.root
	}

	// 清除缓存
	clear(tags?: string | null){
		if(typeof(tags) !== 'string' || tags.length > 0){
			// 暴力清除
			this.try_del_each_cache()
			return
		}
		const tagList = tags.split(',')
		// 精准清除
		this.try_del_each_cache(function(file_tags){
			// 遍历缓存文件的标签
			for(let i=0,total=file_tags.length; i<total; i++){
				const file_tag_item = file_tags[i]
				// 遍历待删除缓存标签
				for(let s=0,all=tagList.length; s<all; s++){
					const clear_tag_item = tagList[s]
					// 对比标签，相等就删除
					if(file_tag_item == clear_tag_item){
						return true
					}
				}
			}
			return false
		})
	}

	private async writeCache(
		cacheName: string,
		tags: string[],
		cacheContent: string | Record<string, unknown>
	) {
		const tagsStr = tags.sort().join('_')
		const cachePath = this.root + tagsStr + '--' + cacheName

		// 兼容JSON数据
		if(typeof(cacheContent) === 'object'){
			cacheContent = JSON.stringify(cacheContent)
		}

		// 保存缓存至对应目录
		await fs.writeFile(cachePath, cacheContent)
		this.try_del_extra_cache()
	}
	/**
	 * 使用缓存
	 */
	async getWithCreate(
		cacheName: string,
		cacheTags: string[],
		createContent: () => Promise<string | Record<string, unknown>>
	): Promise<string> {
		if(typeof(cacheName) !== 'string'){
			throw Error('缓存名必须为字符格式')
		}
		if(!cacheTags || cacheTags.length < 1){
			throw Error('缓存必须指定标签')
		}
		if(typeof(createContent) !== 'function'){
			throw Error('创建函数必须指定')
		}
		
		// 读取配置是否需要使用缓存
		if(!this.useCache){
			let newCache = await createContent()
			if (typeof (newCache) !== 'string') {
				newCache = JSON.stringify(newCache)
			}
			return newCache
		}
		cacheName = cacheName.replace(/\/|\?/g,'_')
		const tagsStr = cacheTags.sort().join('_')
		const cache_path = this.root + tagsStr + '--' + cacheName
			
		// 检测此条缓存是否存在
		const isCacheExist = await isFileExists(cache_path)
	
		// 存在，直接读取缓存
		if(isCacheExist){
			return await fs.readFile(cache_path, 'utf-8')
		}
		// 不存在，调用创建缓存函数
		let newCache = await createContent()
		if (typeof (newCache) !== 'string') {
			newCache = JSON.stringify(newCache)
		}
		await this.writeCache(cacheName, cacheTags, newCache)

		// 通知调用方使用新的缓存
		return newCache
	}
	private async try_del_extra_cache() {
		try {
			// 检查缓存数量
			const files = await fs.readdir(this.root)
			// 缓存过多，清空
			if(files.length > this.cache_max_num){
				this.try_del_each_cache()
			}
		} catch (e) {
			console.error(e)
		}
	}
	// 尝试遍历删除缓存文件
	private async try_del_each_cache(callback?: (tags: string[], name: string) => boolean){
		const root = this.root
		const files = await fs.readdir(root)
		const total = files.length
			
		for(let i = 0;i < total;i++){
			const filename_split = files[i].split('--'),
				tags = (filename_split[0] || '').split('_'),
				name = filename_split[1] || ''
			// 跳过被忽略的文件
			if(files[i] == 'readMe.md' || files[i] == '.gitignore'){
				continue
			}
			// 没有定义检查函数，或者检查函数返回值为true，删除缓存
			if(!callback || callback(tags,name)){
				fs.unlink(root + files[i])
			}
		}
	}

}
