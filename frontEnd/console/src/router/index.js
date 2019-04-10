import Vue from 'vue'
import Router from 'vue-router'
import Panel from '@/pages/panel/index'
import Article from '@/pages/content/article'
import Labs from '@/pages/content/labs'
import Links from '@/pages/content/links'
import Comments from '@/pages/content/comments'

import ArticleEditor from '@/pages/editor/article'
import Moment from '@/pages/moment/list'
import MomentCache from '@/pages/moment/cache/list'
import MomentCacheEditor from '@/pages/moment/cache/editor'
import MomentEditor from '@/pages/moment/editor'

import LabsEditor from '@/pages/editor/labs'

import Gallery from '@/pages/gallery/index'

Vue.use(Router)
let routes = [{
  path: '/',
  redirect: '/panel'
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
  path: '/content/moment',
  name: '剧中人的朋友圈列表页面',
  component: Moment
},
{
  path: '/content/moment/cache',
  name: '剧中人的朋友圈缓存页面',
  component: MomentCache
},
{
  path: '/editor/moment/cache/:name',
  name: '剧中人的朋友圈缓存页面',
  component: MomentCacheEditor
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
},
{
  path: '/content-links',
  name: '前端英雄榜',
  component: Links
},
{
  path: '/editor-article/:id',
  name: '博文发布',
  component: ArticleEditor
},
{
  path: '/editor/labs/:id',
  name: '实验室发布',
  component: LabsEditor
},
{
  path: '/editor/moment/:id',
  name: '剧中人的朋友圈发布',
  component: MomentEditor
}

]
export default new Router({
  routes
})
