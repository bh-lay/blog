import "./view-transition.styl"

const isSupportViewTransition = !!document.startViewTransition;
const baseRouterTransitionClass = "base-router-transition"
const articleRouterTransitionClass = "article-router-transition"

let hasClickArticleBefore = false;
let lastClickedArticleData = null;
export function markArticleClick(clickedNode, articleData) {
	if (!clickedNode) {
		return
	}
	hasClickArticleBefore = true;
	lastClickedArticleData = articleData
	clickedNode.classList.add("router-transition-article-item")
}
export function getLastClickedArticle() {
	const lastData = lastClickedArticleData
	lastClickedArticleData = null
	return lastData
}

function getScrollTop () {
	return Math.max(document.documentElement.scrollTop, document.body.scrollTop)
}
function setBodyScrollToRouteView () {
	const node = document.querySelector(".view-page")
	let scrollTop = getScrollTop()
	node.style.height = "100vh"
	node.style.overflow = "hidden"
	node.scrollTop = scrollTop
}
export function beforeRouterChange (to, from, next) {
	const isFirstPage = !from.name;
	const isSameView = to.name === from.name;
	if (isFirstPage || isSameView || !isSupportViewTransition) {
		return next()
	}

	const addClassForTransition = hasClickArticleBefore ? articleRouterTransitionClass : baseRouterTransitionClass;
	setBodyScrollToRouteView()
	document.documentElement.classList.add(addClassForTransition)
	const viewTransition = document.startViewTransition(() => {
		window.scrollTo(0, 0)
		next()
	})
	viewTransition.finished.finally(() => {
		document.documentElement.classList.remove(addClassForTransition)
		hasClickArticleBefore = false
	})
}
