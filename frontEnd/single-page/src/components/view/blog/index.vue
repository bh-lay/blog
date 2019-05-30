<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
$tag_cnt_bj = #fff;
/** 博文列表页 **/
.articleListPage {
  min-height: 600px;
  padding-bottom: 20px;
  background: #dee3e7;
  .blank-content {
    margin-top: 0;
  }
  .status {
    height: 52px;
  }
  .l-loading-panel {
    margin: 0;
    padding: 15px 0;
    max-width: none;
    opacity: 1;
    transition .4s;
    &.hide {
      opacity: 0;
    }
  }
  .l-loading {
    width: 20px;
    height: 20px;
  }
  .header {
    $header_bj: #fafafa;
    position: relative;
    padding: 4rem 0 1rem;
    background: $header_bj;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 50px;
      background: $tag_cnt_bj;
      background-image: -webkit-linear-gradient($header_bj, $tag_cnt_bj);
      background-image: linear-gradient($header_bj, $tag_cnt_bj);
    }
    .mac {
      position: relative;
      width: 15rem;
      height: 7.5rem;
      margin: auto;
      padding-top: 1.5rem;
      text-align: center;
      background: #fafafa;
      background: linear-gradient(to right bottom, #fff, #eee);
      border: 6px solid #222;
      border-width: 6px 6px 8px;
      border-radius: 8px 8px 0 0;
      &:after {
        content: '';
        position: absolute;
        width: 134%;
        left: -17%;
        bottom: -14px;
        height: 6px;
        border-radius: 0px 0px 40px 40px / 0px 0px 5px 5px;
        background: #ccc;
      }
      p {
        font-size: 1rem;
        color: #333;
      }
    }
    .logo {
      margin-bottom: 10px;
      font-size: 3.5rem;
      color: #000;
    }
  }
}

.articleListPage-tags-cnt {
  margin-bottom: 20px;
}

.articleListPage-tags {
  width: 100%;
  background: $tag_cnt_bj;
  border-bottom: 1px solid #c4cdd4;
  z-index: 5;
  .content {
    padding: 12px 0 5px 5px;
  }
  a {
    position: relative;
    display: inline-block;
    max-width: 100%;
    height: 24px;
    margin: 0 10px 5px 0;
    line-height: 24px;
    padding: 0 8px 0 18px;
    border-radius: 0 4px 4px 0;
    background: #eee;
    font-size: 12px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span {
      opacity: .3;
      padding: 0 0 0 5px;
    }
    &:before {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-width: 12px 12px 12px 0;
      border-color: $tag_cnt_bj transparent $tag_cnt_bj transparent;
      border-style: solid;
    }
    &:after {
      position: absolute;
      content: '';
      width: 4px;
      height: 4px;
      top: 10px;
      left: 8px;
      border-radius: 100%;
      background: $tag_cnt_bj;
    }
    &:hover {
      background: #333;
      color: #fff;
    }
    &.active {
      background: #f70;
      color: #fff;
    }
  }
}

.articleList {
  position: relative;
  margin-bottom: 10px;
}

.article-item {
  margin-bottom: 10px;
  overflow: hidden;
  background: #fff;
  transition: box-shadow .3s ease-out;
  transition-delay: .1s;
  .link {
    display: block;
  }
  .title {
    display: block;
    padding: 1em .5em .2em;
    font-weight: normal;
    line-height: 1.5em;
    text-align: center;
    font-size: 18px;
    color: #000;
    outline: none;
  }

	img {
		display: block;
		background: #eee;
		max-width: 100%;
		margin: auto;
	}
  .info {
    padding: 10px 20px;
    line-height: 1.4;
    font-size: 13px;
    color: #888;
    text-indent: 2em
  }
  .label {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    background: #f70;
    box-shadow: -1px 1px 2px #000;
    &:before {
      position: absolute;
      content: '';
      width: 0;
      height: 0;
      top: 0;
      right: 0;
      border: 1px solid #fff;
      border-width: 0 30px 30px 0;
      border-color: transparent transparent #fff transparent;
    }
    span {
      position: absolute;
      display: block;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      -webkit-transform: rotate(45deg) scale(.8);
      transform: rotate(45deg) scale(.8);
      text-align: center;
      line-height: 15px;
      color: #fff;
    }
  }
  footer {
    display: table;
    width: 100%;
    padding: 10px 0;
    border-top: 1px solid #e8e8e8;
    background: #fbfbfb;
    .tags {
      display: table-cell;
      width: 99%;
      padding-left: 10px;
      font-size: 13px;
      strong {
        margin-right: 5px;
        color: #aaa;
        font-weight: normal;
      }
      a {
        display: inline-block;
        margin-right: 5px;
        color: #777;
        &:hover {
          text-decoration: underline;
          color: #000;
        }
      }
    }
    .time {
      display: table-cell;
      vertical-align: middle;
      width: 1%;
      padding-right: 10px;
      white-space: nowrap;
      color: #888;
      font-size: 12px;
    }
  }
  &.pure-text {
    .link {
      background: url("./blog-card.jpg") no-repeat top right #fff;
      background-size: 170px 34px;
    }
  }
  &:hover {
    box-shadow: 5px 10px 10px -5px rgba(0, 0, 0, .2);
  }
}

@media (max-width: 660px) {
  .articleListPage-tags {
    position: static !important;
  }

  .articleListPage .status,
  .articleList {
    margin: 0 10px;
    width: auto;
  }
}
</style>
<template>
<div class="articleListPage">
	<div class="header">
		<div class="mac">
			<div class="logo"><i class="l-icon l-icon-layLogo"></i></div>
			<p>剧中人是个懒孩子</p>
		</div>
	</div>
	<div class="articleListPage-tags-cnt">
		<div class="articleListPage-tags">
			<div class="page-container">
				<tagList />
			</div>
		</div>
	</div>
	<div class="page-container">
		<Stick
			:list="list"
			imgKey="cover"
			@onSrollEnd="loadMore"
		>
			<template slot-scope="scope">
				<div class="article-item">
					<img v-if="scope.data.cover" :src="scope.data.cover"/>
					<h2>{{scope.data.title}}</h2>
					<p>{{scope.data.intro}}</p>
				</div>
			</template>
		</Stick>
		<div class="status"><div class="l-loading-panel"><span class="l-loading"></span></div></div>
	</div>
</div>
</template>

<script>

// function LIST (tag, onLoadStart, onLoaded) {
//   this.skip = 0;
//   this.limit = 10;
//   this.count = -1;
//   this.tag = tag || null;
//   this.onLoadStart = onLoadStart;
//   this.onLoaded = onLoaded;
//   this.isLoading = false;
//   this.loadMore();
// }

// LIST.prototype.loadMore = function () {
//   let me = this;
//   if (this.isLoading || (this.count >= 0 && this.skip >= this.count)) {
//     return;
//   }
//   this.isLoading = true;
//   this.onLoadStart && this.onLoadStart();
//   utils.fetch({
//     url: '/api/blog',
//     data: {
//       skip: this.skip,
//       tag: this.tag || null,
//       limit: this.limit
//     },
//     callback: function (err, data) {
//       if (err || !data || data.code === 200) {
//         // do something
//         return;
//       }
//       let count = data['count'];
//       let list = data['list'];
//       let now = new Date().getTime();
//       for (var i in list) {
//         // 三月内的文章都算最新（多可悲）
//         if ((now - list[i].time_show) / (1000 * 60 * 60 * 24) < 90) {
//           list[i].is_new = true;
//         }
//         list[i].time_show = utils.parseTime(list[i].time_show, '{mm}-{dd} {y}');
//         // 使用七牛图床
//         list[i].cover = imageHosting(list[i].cover, {
//           type: 'zoom',
//           width: 420,
//         });
//       }
//       me.count = count;
//       me.skip += me.limit;
//       me.onLoaded && me.onLoaded(list, count);
//       me.isLoading = false;
//     }
//   });
// };
import Stick from 'vue-stick'
import tagList from './tag-list.vue'
export default {
	name: 'blogPage',
	components: {
		tagList,
		Stick: Stick.component
	},
	data () {
		return {
			pageIndex: 1,
			tag: '',
			list: [
				{
					'title': '合肥城中村 - 全景摄影计划',
					'cover': 'http://static.bh-lay.com/blog/village-in-city/城中村仰视.jpg',
					'intro': '小剧将会在接下来的时间里，去寻找、发现、并拍摄合肥市现存的城中村。其实城市变化很快，只是我们身在变化之中感受不强而已。我希望可以借助于影像的力量，凝固住一个个城中村最后的身姿。'
				},
				{
					'title': '为什么小剧客栈没有友情链接',
					'cover': '',
					'intro': '熟悉小剧的同学应该都知道，小剧客栈上面没有友情链接这样一个东西。很多朋友问过小剧这个问题，我也给过很多版本的原因，今天就来详细说一下为什么小剧客栈没有友情链接。'
				},
				{
					'cover': 'http://static.bh-lay.com/blog/2018-summary/share.jpg',
					'intro': '2018 年对于我来说是非常特殊的一年，一整年工作强度非常大，但依旧会抽出时间去寻找自己的诗和远方。这一年在业余生活上做了很多从未有过的尝试，也因为一些兴趣爱好结交到一帮有趣的小伙伴。',
					'title': '剧中人的2018年终总结'
				},
				{
					'cover': 'http://static.bh-lay.com/blog/2018-bi-layout/layout-data-model.png',
					'intro': '今天的分享主要围绕 可视化布局模块 的一些工作，本文主要从可视化布局模块的交互逻辑的设计上展开，并未涉及到具体代码实现，作为 Odeon 大数据平台在可视化布局模块的一些思路。',
					'title': '可视化布局模块开发分享'
				},
				{
					'cover': 'http://static.bh-lay.com/blog/2018-iflytek-shushan/topic-graphy.jpg',
					'intro': '大蜀山登顶活动是讯飞历次周年庆必有的活动，第一次参加公司全员的登山活动还是挺兴奋的。有幸的是这次小剧是以航拍摄影的身份参与周年庆，简单记录下小剧在登山活动上的一些事，与大家分享。',
					'title': '讯飞19周年庆拍摄小记'
				},
				{
					'cover': 'http://static.bh-lay.com/blog/2018-720yun/take-the-prize.jpg',
					'intro': '上周五，小剧脑袋一热请假去了趟北京，千里迢迢去参加了720云主办的产品发布会。按说这类发布会在家看直播更有意思，为什么小剧要劳民伤财的跑到现场去呢？',
					'title': '720云产品发布会小记'
				},
				{
					'author': '',
					'cover': 'http://static.bh-lay.com/blog/2018-album/yangpuwujiaochang.jpg',
					'intro': '最近闲着无聊，整理了自己觉得还算看得过去的照片，特意挑出五张印刷了二十套。假模假式的拆掉四套照片，模仿着大神的方式做了下签名。', 'title': '记一次「随意」的照片赠送'
				},
				{
					'cover': 'http://static.bh-lay.com/blog/webpack-async-module/cover.jpg',
					'intro': '虽然项目代码经过打包压缩并且有拆分，但是页面在初始化时，这些资源都会一股脑地被加载到页面中。随着项目越来越大，滚雪球效应导致首屏加载时长的问题会越来越明显。因此适当的剥离部分模块，在需要使用的时候按需加载显得格外重要。',
					'title': 'Webpack 异步模块实现'
				},
				{
					'cover': 'http://static.bh-lay.com/blog/see-hefei/cover-2.jpg',
					'intro': '再次见到合肥，在历经五年的沪漂之后，以一种渴望被接纳的姿态来到合肥。这篇文章作为【上海 · 再见】的下篇，原计划在2017年9月前后完成。很遗憾一直拖到了四个月后的2018年。既然已经拖了这么久，索性就当作2017年全年回顾好了。以八月为分界线，聊聊小剧这一年的经历。',
					'title': '再见 · 合肥'
				},
				{
					'author': '',
					'cover': 'http://static.bh-lay.com/blog/odeon-shoot/odeon-1.jpg',
					'intro': '这次拍摄也只是小剧的处女作，并没有多少经验作指导，仅仅是根据自己的思路临场做的尝试。好在团队的小伙伴比较耐心，不厌其烦地微调位置，经过反复拍摄，最终完成了此次拍摄。',
					'title': '记一次团队主题航拍'
				}
			]
		}
	},
	mounted () {
		this.getParamsFromRoute()
	},
	methods: {
		handleParamChange () {
			let tagStr = this.tag ? `?tag=${this.tag}` : ''
			this.$router.replace('/blog/' + tagStr)
		},
		getParamsFromRoute () {
			this.tag = this.$route.query.tag || ''
		},
		loadMore () {
			//  Fetch({
			// 	url: '/api/blog',
			// 	data: {
			// 		skip: this.skip,
			// 		tag: this.tag || null,
			// 		limit: this.limit
			// 	},
			// 	callback: function (err, data) {
			// 		if (err || !data || data.code === 200) {
			// 			// do something
			// 			return;
			// 		}
			// 		let count = data['count'];
			// 		let list = data['list'];
			// 		let now = new Date().getTime();
			// 		for (var i in list) {
			// 			// 三月内的文章都算最新（多可悲）
			// 			if ((now - list[i].time_show) / (1000 * 60 * 60 * 24) < 90) {
			// 				list[i].is_new = true;
			// 			}
			// 			list[i].time_show = utils.parseTime(list[i].time_show, '{mm}-{dd} {y}');
			// 			// 使用七牛图床
			// 			list[i].cover = imageHosting(list[i].cover, {
			// 				type: 'zoom',
			// 				width: 420,
			// 			});
			// 		}
			// 		me.count = count;
			// 		me.skip += me.limit;
			// 		me.onLoaded && me.onLoaded(list, count);
			// 		me.isLoading = false;
			// 	}
			// });
		}
	},
	watch: {
		$route () {
			this.getParamsFromRoute()
		},
		pageIndex () {
			this.handleParamChange()
		},
		tag () {
			this.handleParamChange()
		}
	}
}
</script>
