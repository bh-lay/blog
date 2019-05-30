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
		text-decoration: none;
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
    display: flex;
		justify-content: space-between;
    padding: 10px;
    border-top: 1px solid #e8e8e8;
    background: #fbfbfb;
    .tags {
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
				text-decoration: none;
        &:hover {
          text-decoration: underline;
          color: #000;
        }
      }
    }
    .time {
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
				<div :class="['article-item', !scope.data.cover ? 'pure-text' : '']">
					<a :href="'/blog/'+ scope.data.id" :title="scope.data.title" class="link">
						<div class="label" v-if="scope.data.is_new"><span>new</span></div>
						<img v-if="scope.data.cover" :src="scope.data.cover | imgHosting('zoom', 400)" :alt="scope.data.title" />
						<div class="title">{{scope.data.title}}</div>
						<div class="info"><p>{{scope.data.intro}}</p></div>
					</a>
					<footer>
						<div class="tags">
							<strong>tags</strong>
							<a :href="'/blog?tag=' + tag" v-for="tag in scope.data.tags" :key="tag">{{tag}}</a>
						</div>
						<div class="time" :title="scope.data.time_show | timeFormat">{{scope.data.time_show | dateDiff}}</div>
					</footer>
				</div>
			</template>
		</Stick>
		<div class="status"><div class="l-loading-panel"><span class="l-loading"></span></div></div>
	</div>
</div>
</template>

<script>

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
			page: {
				skip: 0,
				tag: '',
				limit: 20,
				count: Infinity
			},
			list: []
		}
	},
	mounted () {
		this.getParamsFromRoute()
		this.loadMore()
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
			if (this.page.skip >= this.page.count) {
				return
			}
			fetch(`/api/blog?skip=${this.page.skip}&limit=${this.page.limit}&tag=${this.page.tag}`, {
				method: 'GET'
			})
				.then(response => response.json())
				.then(data => {
					console.log('data', data)
					this.page.count = data.count
					this.page.skip += this.page.limit
					this.list = this.list.concat(data.list)
				})
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
