import components from './components/index.js'
import directives from './directives/index.js'
import filters from './filters/index.js'

export default {
	install (Vue) {
		for (let componentKey in components) {
			Vue.component(componentKey, components[componentKey])
		}
		for (let directiveKey in directives) {
			Vue.directive(directiveKey, directives[directiveKey])
		}
		for (let filterKey in filters) {
			Vue.filter(filterKey, filters[filterKey])
		}
	}
}
