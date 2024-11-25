import "./view-transition.styl"
const baseRouterTransitionClass = "base-router-transition"
const articleRouterTransitionClass = "article-router-transition"

let hasClickArticleBefore = false;
export function markArticleClick(clickedNode) {
	if (!clickedNode) {
		return
	}
	hasClickArticleBefore = true;
	clickedNode.classList.add("router-transition-article-item")
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
	const isSupportViewTransition = !!document.startViewTransition;
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
