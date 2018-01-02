// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'element-ui/lib/theme-chalk/index.css'
import './assets/font-awesome.less'

import Vue from 'vue'
import App from './App'
import Login from './Login'
import router from './router'

import ElementUI from 'element-ui'

Vue.use(ElementUI)

Vue.config.productionTip = false

function getUserInfo () {
  return fetch('/ajax/user/detail', {
    credentials: 'same-origin'
  }).then((resp) => resp.json())
}
getUserInfo().then((json) => {
  if (json.code !== 200) {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      template: '<Login/>',
      components: { Login }
    })
  } else {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    })
  }
})
