import type { RouteLocationNormalized } from 'vue-router'
import './view-transition.scss'

interface ArticleData {
	id?: string
	[key: string]: any
}

const isSupportViewTransition = !!(document as any).startViewTransition
const baseRouterTransitionClass = 'base-router-transition'
const articleRouterTransitionClass = 'article-router-transition'

let hasClickArticleBefore = false
let lastClickedArticleData: ArticleData | null = null

export function markArticleClick(clickedNode: Element | null, articleData: ArticleData) {
	if (!clickedNode) {
		return
	}
	hasClickArticleBefore = true
	lastClickedArticleData = articleData
	clickedNode.classList.add('router-transition-article-item')
}

export function getLastClickedArticle(): ArticleData | null {
	const lastData = lastClickedArticleData
	lastClickedArticleData = null
	return lastData
}

function getScrollTop(): number {
	return Math.max(document.documentElement.scrollTop, document.body.scrollTop)
}

function setBodyScrollToRouteView() {
	const node = document.querySelector<HTMLElement>('.view-page')
	if (!node) {
		return
	}
	const scrollTop = getScrollTop()
	node.style.height = '100vh'
	node.style.overflow = 'hidden'
	node.scrollTop = scrollTop
}

export function beforeRouterChange(
	to: RouteLocationNormalized,
	from: RouteLocationNormalized
) {
	const isFirstPage = !from.name
	const isSameView = to.name === from.name
	if (isFirstPage || isSameView || !isSupportViewTransition) {
		return
	}

	const addClassForTransition = hasClickArticleBefore
		? articleRouterTransitionClass
		: baseRouterTransitionClass
	setBodyScrollToRouteView()
	document.documentElement.classList.add(addClassForTransition)
	// 返回一个 Promise，并在 startViewTransition 回调内 resolve：旧快照捕获后、过渡开始前
	// 完成导航，使切换后的 DOM 被过渡动画捕获。去掉 next 参数后不再触发弃用警告。
	return new Promise<void>((resolve) => {
		const viewTransition = (document as any).startViewTransition(() => {
			window.scrollTo(0, 0)
			resolve()
		})
		viewTransition.finished.finally(() => {
			document.documentElement.classList.remove(addClassForTransition)
			hasClickArticleBefore = false
		})
	})
}
