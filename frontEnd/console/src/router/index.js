import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/index'
import Panel from '@/pages/panel/index'
import Article from '@/pages/content/article'
import Labs from '@/pages/content/labs'
import Comments from '@/pages/content/comments'

import Gallery from '@/pages/gallery/index'

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
},
{
  path: '/content-article',
  name: '博文页面',
  component: Article
},
{
  path: '/gallery',
  name: '图库',
  component: Gallery
},
{
  path: '/content-labs',
  name: '实验室',
  component: Labs
},
{
  path: '/content-comments',
  name: '评论管理',
  component: Comments
}
]
export default new Router({
  routes
})
