/**
 * 图片懒加载配置项
 */
export interface LazyLoadOptions {
	/** 可视区域容器，默认 window */
	root?: Element | null
	/** 根元素边缘扩展距离，用于提前加载 */
	rootMargin?: string
	/** 交叉比例阈值 */
	threshold?: number | number[]
	/** 存放真实图片路径的属性名，默认 'data-src' */
	srcAttr?: string
	/** 占位图路径，在真实图片加载前显示 */
	placeholder?: string
	/** 加载失败 fallback 图 */
	fallback?: string
}

type ImageOrImageCollection = HTMLImageElement | HTMLImageElement[] | NodeListOf<HTMLImageElement>

/**
 * 将图片元素集合转换为图片元素数组
 */
function imgOrImgList2ImgArray (imgOrImgList: ImageOrImageCollection): HTMLImageElement[] {
	if (Array.isArray(imgOrImgList)) {
		return imgOrImgList
	}
	if (imgOrImgList instanceof NodeList) {
		return Array.from(imgOrImgList)
	}
	return [imgOrImgList as HTMLImageElement]
}

/**
 * 加载图片
 */
function loadImage (src: string, nextFn: (isError: boolean) => void) {
	const realImg = new Image()
	let isFinished = false
	const handleResult = (isError: boolean) => {
		if (isFinished) return
		isFinished = true
		clearTimeout(timeoutTimer)
		nextFn(isError)
	}
	realImg.onload = () => handleResult(false)
	realImg.onerror = () => handleResult(true)
	const timeoutTimer = setTimeout(() => {
		handleResult(true)
	}, 10000)
	// 开始加载真实图片
	realImg.src = src
}

/**
 * 图片懒加载管理器
 * 基于 IntersectionObserver API 实现图片懒加载
 */
export class LazyLoadManager {
	observer: IntersectionObserver | null = null
	imgCallbackMap: Map<HTMLImageElement, () => void> | null = new Map()
	options: LazyLoadOptions
	destroyed = false

	constructor (options: LazyLoadOptions = {}) {
		this.options = options

		this.observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue
					const el = entry.target as HTMLImageElement
					this.handleLazyLoadTrigger(el)
				}
			},
			{
				// root: options.root || undefined,
				rootMargin: options.rootMargin || '100px',
				threshold: options.threshold || 0
			}
		)
	}

	/**
	 * 处理单个元素的懒加载触发
	 */
	private handleLazyLoadTrigger (el: HTMLImageElement) {
		const callback = this.imgCallbackMap?.get(el)
		if (callback) {
			callback()
		}
		// ⚠️ 一旦进入视口，立即停止观察，防止 observer 持有 DOM 引用
		this.removeSingleLazyLoad(el)
	}

	/**
	 * 单张图片懒加载
	 */
	private singleLazyLoad (el: HTMLImageElement) {
		if (!el) return

		const { srcAttr = 'data-src', placeholder, fallback } = this.options
		const realSrc = el.getAttribute(srcAttr)
		if (!realSrc) return

		el.src = placeholder || ''

		const handleImageIntersection = () => {
			// 添加加载状态类，用于 CSS 动画
			el.classList.add('lazy-loading')

			loadImage(realSrc, (isError) => {
				const nextDisplaySrc = isError && fallback ? fallback : realSrc
				el.classList.add('lazy-loaded-start')
				el.src = nextDisplaySrc
				setTimeout(() => {
					el.classList.remove('lazy-loading')
					el.classList.remove('lazy-loaded-start')
					el.classList.add('lazy-loaded')
					setTimeout(() => {
						el.classList.remove('lazy-loaded')
						if (isError) {
							el.classList.add('lazy-load-failed')
						}
					}, 3000)
				}, 20)
			})
		}

		this.imgCallbackMap?.set(el, handleImageIntersection)
		this.observer?.observe(el)
	}

	/**
	 * 移除单张图片的懒加载
	 */
	private removeSingleLazyLoad (el: HTMLImageElement) {
		this.observer?.unobserve(el)
		this.imgCallbackMap?.delete(el)
		el.onload = null
		el.onerror = null
	}

	/**
	 * 通用懒加载方法
	 */
	lazyLoad (imgOrImgList: ImageOrImageCollection): () => void {
		if (this.destroyed) {
			console.warn('LazyLoadManager 已销毁，无法调用 lazyLoad')
			return () => {}
		}
		const imgList = imgOrImgList2ImgArray(imgOrImgList)

		for (const img of imgList) {
			this.singleLazyLoad(img)
		}

		return () => {
			this.removeLazyLoad(imgOrImgList)
		}
	}

	/**
	 * 移除图片集合的懒加载
	 */
	removeLazyLoad (imgOrImgList: ImageOrImageCollection) {
		if (this.destroyed) {
			console.warn('LazyLoadManager 已销毁，无法调用 removeLazyLoad')
			return
		}
		const imgList = imgOrImgList2ImgArray(imgOrImgList)
		for (const img of imgList) {
			this.removeSingleLazyLoad(img)
		}
	}

	/**
	 * 销毁懒加载管理器实例
	 */
	destroy () {
		if (this.destroyed) return

		this.imgCallbackMap?.forEach((_, el) => {
			this.removeSingleLazyLoad(el)
		})
		this.imgCallbackMap?.clear()
		this.observer?.disconnect()

		this.imgCallbackMap = null
		this.observer = null

		this.destroyed = true
	}
}
