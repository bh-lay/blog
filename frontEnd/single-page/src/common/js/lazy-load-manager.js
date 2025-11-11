/**
 * 图片懒加载配置项
 * @typedef {Object} LazyLoadOptions
 * @property {Element|null} [root] 可视区域容器，默认 window
 * @property {string} [rootMargin] 根元素边缘扩展距离，用于提前加载
 * @property {number|number[]} [threshold] 交叉比例阈值，0 表示任意部分进入视口触发，1 表示完全进入才触发
 * @property {string} [srcAttr] 存放真实图片路径的属性名，默认 'data-src'
 * @property {string} [placeholder] 占位图路径，在真实图片加载前显示
 * @property {string} [fallback] 加载失败 fallback 图，当网络错误或图片不存在时显示
 */

/**
 * 图片元素集合类型
 * 支持单个图片元素、图片元素数组或 NodeList
 * @typedef {HTMLImageElement|HTMLImageElement[]|NodeList} ImageOrImageCollection
 */

/**
 * 将图片元素集合转换为图片元素数组
 * @param {ImageOrImageCollection} imgOrImgList 图片元素集合
 * @returns {HTMLImageElement[]} 图片元素数组
 */
function imgOrImgList2ImgArray(imgOrImgList) {
	if (Array.isArray(imgOrImgList)) {
		return imgOrImgList;
	}
	if (imgOrImgList instanceof NodeList) {
		return Array.from(imgOrImgList);
	}
	return [imgOrImgList];
}

/**
 * 加载图片
 * @param {string} src 图片源地址
 * @param {function(boolean): void} nextFn 加载完成回调函数
 */
function loadImage(src, nextFn) {
	const realImg = new Image();
	let isFinished = false;
	const handleResult = (isError) => {
		if (isFinished) return;
		isFinished = true;
		clearTimeout(timeoutTimer);
		nextFn(isError);
	};
	realImg.onload = () => handleResult(false);
	realImg.onerror = () => handleResult(true);
	const timeoutTimer = setTimeout(() => {
		handleResult(true);
	}, 10000);
	// 开始加载真实图片
	realImg.src = src;
}

/**
 * 图片懒加载管理器
 * 基于 IntersectionObserver API 实现图片懒加载
 * 支持占位图、淡入动画、加载失败 fallback
 */
export class LazyLoadManager {
	/**
	 * 创建懒加载管理器实例
	 * @param {LazyLoadOptions} [options={}] 懒加载配置选项
	 */
	constructor(options = {}) {
		/** @type {IntersectionObserver} IntersectionObserver 实例，用于监听元素进入视口 */
		this.observer = null;
		/** @type {Map<HTMLImageElement, function(): void>} 图片元素与加载回调函数的映射表 */
		this.imgCallbackMap = new Map();
		/** @type {LazyLoadOptions} 懒加载配置选项 */
		this.options = options;
		/** @type {boolean} 实例销毁状态标识，防止重复销毁 */
		this.destroyed = false;

		this.observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const el = entry.target;
					this.handleLazyLoadTrigger(el);
				}
			},
			{
				// root: options.root || undefined,
				rootMargin: options.rootMargin || "100px",
				threshold: options.threshold || 0,
			},
		);
	}

	/**
	 * 处理单个元素的懒加载触发
	 * @param {HTMLImageElement} el 图片元素
	 * @private
	 */
	handleLazyLoadTrigger(el) {

		const callback = this.imgCallbackMap.get(el);
		if (callback) {
			callback();
		}
		// ⚠️ 一旦进入视口，立即停止观察，防止 observer 持有 DOM 引用
		this.removeSingleLazyLoad(el);
	}

	/**
	 * 单张图片懒加载
	 * @param {HTMLImageElement} el 图片元素
	 * @returns {function(): void} 销毁函数
	 * @private
	 */
	singleLazyLoad(el) {
		if (!el) return;

		const { srcAttr = "data-src", placeholder, fallback } = this.options;
		const realSrc = el.getAttribute(srcAttr);
		if (!realSrc) return;

		el.src = placeholder || "";

		const handleImageIntersection = () => {
			// 添加加载状态类，用于 CSS 动画
			el.classList.add("lazy-loading");

			loadImage(realSrc, (isError) => {
				const nextDisplaySrc = isError && fallback ? fallback : realSrc;
				el.classList.add("lazy-loaded-start");
				el.src = nextDisplaySrc;
				setTimeout(() => {
					el.classList.remove("lazy-loading");
					el.classList.remove("lazy-loaded-start");
					el.classList.add("lazy-loaded");
					setTimeout(() => {
						el.classList.remove("lazy-loaded");
						if (isError) {
							el.classList.add("lazy-load-failed");
						}
					}, 3000);
				}, 20);
			});
		};

		this.imgCallbackMap.set(el, handleImageIntersection);
		this.observer.observe(el);
	}

	/**
	 * 移除单张图片的懒加载
	 * @param {HTMLImageElement} el 图片元素
	 * @private
	 */
	removeSingleLazyLoad(el) {
		this.observer.unobserve(el);
		this.imgCallbackMap.delete(el);
		el.onload = null;
		el.onerror = null;
	}

	/**
	 * 通用懒加载方法
	 * 根据参数类型自动处理单个或多个图片的懒加载
	 * @param {ImageOrImageCollection} imgOrImgList 图片元素集合（单个元素、数组或 NodeList）
	 * @returns {function(): void} 销毁函数，用于移除懒加载
	 */
	lazyLoad(imgOrImgList) {
		if (this.destroyed) {
			console.warn("LazyLoadManager 已销毁，无法调用 lazyLoad");
			return () => { };
		}
		const imgList = imgOrImgList2ImgArray(imgOrImgList);

		for (const img of imgList) {
			this.singleLazyLoad(img);
		}

		return () => {
			this.removeLazyLoad(imgOrImgList);
		};
	}

	/**
	 * 移除图片集合的懒加载
	 * @param {ImageOrImageCollection} imgOrImgList 图片元素集合
	 */
	removeLazyLoad(imgOrImgList) {
		if (this.destroyed) {
			console.warn("LazyLoadManager 已销毁，无法调用 removeLazyLoad");
			return;
		}
		const imgList = imgOrImgList2ImgArray(imgOrImgList);
		for (const img of imgList) {
			this.removeSingleLazyLoad(img);
		}
	}

	/**
	 * 销毁懒加载管理器实例
	 * 清理所有观察的元素，断开 IntersectionObserver 连接，释放资源
	 * 防止重复调用
	 */
	destroy() {
		if (this.destroyed) return;

		this.imgCallbackMap.forEach((_, el) => {
			this.removeSingleLazyLoad(el);
		});
		this.imgCallbackMap.clear();
		this.observer.disconnect();

		this.imgCallbackMap = null;
		this.observer = null;

		this.destroyed = true;
	}
}
