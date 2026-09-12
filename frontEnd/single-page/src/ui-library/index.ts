import type { App } from 'vue'
import components from './components/index'
import directives from './directives/index'
import '@/ui-library/style/index.scss'

export default {
	install (app: App) {
		for (const componentKey in components) {
			app.component(componentKey, (components as any)[componentKey])
		}
		for (const directiveKey in directives) {
			app.directive(directiveKey, (directives as any)[directiveKey])
		}
	}
}
