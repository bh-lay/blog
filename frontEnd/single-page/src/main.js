// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import filters from './filters/index.js'
import Footer from './components/footer/index.vue'
import UILibrary from './ui-library/index.js'

Vue.use(filters)
Vue.use(UILibrary)
Vue.component('Footer', Footer)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
})
