import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/index'
import Panel from '@/pages/panel/index'

Vue.use(Router)
let routes = [{
  path: '/',
  redirect: '/panel'
},
{
  path: '/xxxx',
  name: 'login',
  component: Login
},
{
  path: '/panel',
  name: '控制台',
  component: Panel
}
]
export default new Router({
  routes
})
