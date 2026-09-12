<style lang="scss" scoped>
.labs-list-pager {
  background: #383736;
}
.labs-list-header {
  position: relative;
  height: 600px;
  min-height: 32.6vw;
}
.labs-hero-section {
  display: flex;
  flex-direction: row-reverse;
  padding: 150px 20px 0 0;
  .labs-hero-wording {
	width: 500px;
	text-align: right;
	color: #2b211d;
	h1 {
		margin: 0 0 0.2em;
		font-size: 60px;
		font-weight: 800;
		text-shadow: 5px 5px rgba(165, 160, 151, 0.5);
	}
	p {
		margin: 0 0 3em;
		font-size: 18px;
		font-weight: 500;
		text-shadow: 1px 1px rgba(165, 160, 151, 0.5);
	}
  }
}

.labs-list-archive {
	padding: 60px 0;
	.post-list-title {
		margin-bottom: 20px;
		font-size: 24px;
		font-weight: 600;
		color: #fff;
		small {
			margin-left: 1em;
			font-size: 16px;
			font-weight: 400;
			color: #bbb;
		}
	}
}
.post-list {
  min-height: 400px;
  margin: 0 -8px;
  display: flex;
  flex-wrap: wrap;
}
.post-list .post-item,
.post-list > i {
  width: 360px;
  flex-grow: 1;
  margin: 0 8px 16px;
}
.post-list > i {
  display: block;
  height: 0;
  margin-bottom: 0;
  padding: 0;
  line-height: 0;
  font-size: 0;
}
</style>
<template>
<div class="labs-list-pager">
	<div class="labs-list-header">
		<headerBanner
			:photoGraphaList="[{imgSrc: headerBg,title: '小剧书房',author: '剧中人'}]"
			:photoGraphaIndex="0"
			:mask="false"
			:authorVisible="false"
			:navigationShadowVisible="false"
			@nextIndex="() => {}"
		>
			<Container class="labs-hero-section">
				<div class="labs-hero-wording">
					<h1>小剧实验室</h1>
					<p>小剧也曾不知天高地厚的造过不少「轮子」，虽然不好用<br/>却也是我成长路上一个个深深浅浅的脚印</p>
					<div class="button">
						<Button href="https://github.com/bh-lay" target="_blank" type="primary" size="large">Github</Button>
					</div>
				</div>
			</Container>
		</headerBanner>
	</div>
	<LaysWorkbench />
	<woodCut />
	<Container class="labs-list-archive">
		<div class="post-list-title">古早作品<small>已无实用价值</small></div>
		<div class="post-list">
			<Item
				v-for="item in postList"
				:key="item.id"
				:post="item"
			/>
			<i /><i /><i /><i /><i /><i />
		</div>
	</Container>
	<Footer />
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import headerBanner from '@/components/header-banner/index.vue'
import LaysWorkbench from './lays-workbench.vue'
import woodCut from './wood-cut.vue'
import Item from './item.vue'
import headerBg from './images/hero-bg.jpg'

const postList = [
  {
    "_id": "5e1d25bbd7b43063e645c2cc",
    "id": "1asal8rps3i",
    "name": "vue-image-filler",
    "title": "图像[填充]剪裁工具",
    "cover": "/labs/vue-image-filler.jpg",
    "time_create": 1578968507768,
    "git_full_name": "/bh-lay/vue-image-filler",
    "demo_url": "https://bh-lay.github.io/vue-image-filler/demo/",
    "intro": "vue-image-filler 是一款用于图像剪裁的工具，交互设计更为轻便简洁。与传统自由拖拽的图像剪裁工具不同的是，她更适用于限定输出尺寸的场景。",
    "github": {
      "name": "vue-image-filler",
      "full_name": "bh-lay/vue-image-filler",
      "html_url": "https://github.com/bh-lay/vue-image-filler",
      "description": "图像[填充]剪裁工具 [ Vue Image clipping tool ]",
      "created_at": "2020-01-10T14:13:25Z",
      "updated_at": "2022-05-19T05:21:45Z",
      "pushed_at": "2022-05-19T05:21:41Z",
      "git_url": "git://github.com/bh-lay/vue-image-filler.git",
      "homepage": "https://bh-lay.github.io/vue-image-filler/demo/",
      "stargazers_count": 3,
      "watchers_count": 3,
      "forks_count": 1
    }
  },
  {
    "_id": "5392b028b18ec28a64000001",
    "cover": "/labs/panel.jpg",
    "demo_url": "https://bh-lay.github.io/panel/build/",
    "git_full_name": "/bh-lay/panel",
    "github": {
      "name": "panel",
      "full_name": "bh-lay/panel",
      "html_url": "https://github.com/bh-lay/panel",
      "description": "右键菜单组件",
      "created_at": "2013-08-16T10:54:20Z",
      "updated_at": "2024-01-23T03:48:41Z",
      "pushed_at": "2018-10-11T07:15:20Z",
      "git_url": "git://github.com/bh-lay/panel.git",
      "homepage": "http://bh-lay.github.io/panel/build/",
      "stargazers_count": 9,
      "watchers_count": 9,
      "forks_count": 2
    },
    "id": "14675001d8c",
    "intro": "panel.js是一个基于JQUERY的右键菜单插件，用于用户交互较为复杂的项目。",
    "name": "panel",
    "time_create": 1539242179484,
    "title": "右键菜单组件"
  },
  {
    "_id": "54fea41d994f45335f30c686",
    "cover": "/labs/iframer.jpg",
    "demo_url": "http://bh-lay.github.io/iframer/",
    "git_full_name": "/bh-lay/iframer",
    "github": {
      "name": "iframer",
      "full_name": "bh-lay/iframer",
      "html_url": "https://github.com/bh-lay/iframer",
      "description": "一款基于iframe的单页应用组件（single page application）",
      "created_at": "2015-01-14T12:20:11Z",
      "updated_at": "2022-09-30T01:44:04Z",
      "pushed_at": "2022-05-19T05:23:20Z",
      "git_url": "git://github.com/bh-lay/iframer.git",
      "homepage": "http://bh-lay.github.io/iframer/",
      "stargazers_count": 58,
      "watchers_count": 58,
      "forks_count": 11
    },
    "id": "14c02b111ab",
    "intro": "一款基于iframe的单页应用组件，用在音频、IM类站点，避免因页面跳转而引起的播放停顿、聊天状态丢失等问题。",
    "name": "iframer",
    "time_create": 1425974301084,
    "title": "基于iframe的单页应用组件"
  },
  {
    "_id": "533ee6a6ccc3e54128000001",
    "api_url": "",
    "cover": "/labs/UI.jpg",
    "demo_url": "/demo/lab/UI/demo.html",
    "git_full_name": "bh-lay/UI",
    "github": {
      "name": "UI",
      "full_name": "bh-lay/UI",
      "html_url": "https://github.com/bh-lay/UI",
      "description": "响应式用户交互组件库",
      "created_at": "2014-01-23T03:12:50Z",
      "updated_at": "2026-08-13T07:21:18Z",
      "pushed_at": "2017-04-17T07:00:32Z",
      "git_url": "git://github.com/bh-lay/UI.git",
      "homepage": "http://bh-lay.github.io/UI/",
      "stargazers_count": 76,
      "watchers_count": 76,
      "forks_count": 34
    },
    "id": "1452db4facb",
    "intro": "UI是前端公用的视觉交互（user interface 、 user interaction）类公用组建，用于和用户间的对话及动态界面展示。",
    "name": "user-interaction",
    "time_create": 1420363762571,
    "title": "响应式用户交互组件库"
  },
  {
    "_id": "5474144c4038c41b5173fc16",
    "cover": "/labs/github-widget-user.png",
    "demo_url": "http://htmlpreview.github.io/?https://github.com/bh-lay/github-widget-user/blob/master/demo.html",
    "git_full_name": "bh-lay/github-widget-user",
    "github": {
      "name": "github-widget-user",
      "full_name": "bh-lay/github-widget-user",
      "html_url": "https://github.com/bh-lay/github-widget-user",
      "description": "github名片——显示github用户个人信息的widget组件。",
      "created_at": "2014-11-05T05:37:16Z",
      "updated_at": "2021-12-10T10:58:34Z",
      "pushed_at": "2015-05-19T02:46:23Z",
      "git_url": "git://github.com/bh-lay/github-widget-user.git",
      "homepage": "http://bh-lay.com",
      "stargazers_count": 43,
      "watchers_count": 43,
      "forks_count": 20
    },
    "id": "149e56f4967",
    "intro": "一个可以在网站中显示github个人信息的jquery widget组件，提高bigger的又一利器。",
    "name": "github-widget-user",
    "time_create": 1416893622355,
    "title": "github个人名片组件"
  },
  {
    "_id": "53bf73e1a32529f758000001",
    "cover": "/labs/lofox.jpg",
    "demo_url": "https://bh-lay.github.io/lofox/index.html",
    "git_full_name": "/bh-lay/lofox",
    "github": {
      "name": "lofox",
      "full_name": "bh-lay/lofox",
      "html_url": "https://github.com/bh-lay/lofox",
      "description": "用于实现单页面路由控制的工具。",
      "created_at": "2013-07-31T11:20:05Z",
      "updated_at": "2026-04-21T02:43:07Z",
      "pushed_at": "2022-05-19T10:15:59Z",
      "git_url": "git://github.com/bh-lay/lofox.git",
      "homepage": "http://bh-lay.github.io/lofox/index.html",
      "stargazers_count": 21,
      "watchers_count": 21,
      "forks_count": 10
    },
    "id": "14723dca9d2",
    "intro": "一个用于单页面路由管理的工具。",
    "name": "lofox",
    "time_create": 1409042262055,
    "title": "lofox 单页面路由管理工具"
  },
  {
    "_id": "53063b7d86a96ed944000001",
    "api_url": "https://raw.github.com/bh-lay/loader/master/README.md",
    "cover": "/labs/loader.jpg",
    "demo_url": "",
    "git_full_name": "bh-lay/loader",
    "github": {
      "name": "loader",
      "full_name": "bh-lay/loader",
      "html_url": "https://github.com/bh-lay/loader",
      "description": "简单的js、css资源加载器。",
      "created_at": "2013-11-27T01:34:48Z",
      "updated_at": "2024-07-20T14:59:27Z",
      "pushed_at": "2015-04-18T16:37:49Z",
      "git_url": "git://github.com/bh-lay/loader.git",
      "homepage": "http://bh-lay.com",
      "stargazers_count": 10,
      "watchers_count": 10,
      "forks_count": 4
    },
    "id": "1445058615b",
    "intro": "loader是一个用于加载项目资源的工具，用于剥离文件间的耦合关系，提高模块加载效率。",
    "name": "loader.js",
    "time_create": 1407402809395,
    "title": "loader-资源加载利器"
  },
  {
    "_id": "533ee928ccc3e54128000002",
    "api_url": "",
    "cover": "/labs/uploader.jpg",
    "demo_url": "",
    "git_full_name": "bh-lay/uploader",
    "github": {
      "name": "uploader",
      "full_name": "bh-lay/uploader",
      "html_url": "https://github.com/bh-lay/uploader",
      "description": "依靠原生html元素处理上传的javascript类。",
      "created_at": "2014-02-14T07:07:01Z",
      "updated_at": "2022-02-17T03:20:41Z",
      "pushed_at": "2015-06-03T13:34:45Z",
      "git_url": "git://github.com/bh-lay/uploader.git",
      "homepage": "",
      "stargazers_count": 5,
      "watchers_count": 5,
      "forks_count": 3
    },
    "id": "1452dbec7f6",
    "intro": "uploader是一个依靠原生html元素处理上传的javascript类，具备丰富的事件型API。",
    "name": "uploader.js",
    "time_create": 1407402782726,
    "title": "uploader.js 文件上传组件"
  }
]


</script>
