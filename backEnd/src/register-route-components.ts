import { App } from '@/core/index'
import routes from '@/router/index'
import tagComponent from '@/components/multi-page/tag'
import navigationBootstrap from '@/components/navigation-bootstrap'
import comments from '@/components/single-page/comments'
import github from '@/components/single-page/github'

export default function(app: App) {
	// 定义路由
	routes.forEach(({path, controller}) => {
		app.setRoute(path, controller)
	})
	app.registerComponent('multi-page/tag', tagComponent)
	app.registerComponent('navigation-bootstrap', navigationBootstrap)
	app.registerComponent('single-page/comments', comments)
	app.registerComponent('single-page/github', github)
}