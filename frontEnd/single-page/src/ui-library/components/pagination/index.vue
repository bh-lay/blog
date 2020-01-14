<template type="text/template" id="template_pagination">
	<section class="pages-wrap" v-show="total > size">
		<ul class="pagination clearfix">
			<li :class="{'disabled': current == 1}">
				<a href="javascript:;" @click="clickCurrent(1)">首页</a>
			</li>
			<li :class="{'disabled': current == 1}">
				<a href="javascript:;" @click="clickCurrent(current - 1)">上一页</a>
			</li>
			<li v-for="p in setList" :class="{'active': current == p.val}" :key="p.val">
				<a href="javascript:;" v-if="current == p.val" @click="clickCurrent(p.val)">{{ p.text }}</a>
				<a href="javascript:;" v-else @click="clickCurrent(p.val)">{{ p.text }}</a>
			</li>
			<li :class="{'disabled': current == page}">
				<a href="javascript:;" @click="clickCurrent(current + 1)">下一页</a>
			</li>
			<li :class="{'disabled': current == page}">
				<a href="javascript:;" @click="clickCurrent(page)">尾页</a>
			</li>
		</ul>
	</section>
</template>
<script>
export default {
	props: {
		pagegroup: {
			type: Number,
			required: false,
			default: 5
		},
		total: {
			type: Number,
			required: true
		},
		size: {
			type: Number,
			required: true
		},
		current: {
			type: Number,
			required: true,
			default: 1
		},
		pageInfo: {}
	},
	computed: {
		page () {
			return Math.ceil(this.total / this.size)
		},
		setList () {
			var len = this.page
			let temp = []
			let list = []
			let count = Math.floor(this.pagegroup / 2)
			let center = this.current
			if (len <= this.pagegroup) {
				while (len--) {
					temp.push({ text: this.page - len, val: this.page - len })
				}
				return temp
			}
			while (len--) {
				temp.push(this.page - len)
			}
			var idx = temp.indexOf(center)
			idx < count && (center = center + count - idx)
			this.current > this.page - count && (center = this.page - count)
			temp = temp.splice(center - count - 1, this.pagegroup)
			do {
				var t = temp.shift()
				list.push({
					text: t,
					val: t
				})
			} while (temp.length)
			if (this.page > this.pagegroup) {
				this.current > count + 1 &&
					list.unshift({ text: '...', val: list[0].val - 1 })
				this.current < this.page - count &&
					list.push({ text: '...', val: list[list.length - 1].val + 1 })
			}
			return list
		}
	},
	created () {
		return {
			page: 0
		}
	},
	methods: {
		clickCurrent (idx) {
			if (this.current !== idx && idx > 0 && idx < this.page + 1) {
				this.$emit('update:current', idx)
			}
		}
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.pages-wrap
	text-align center

.pagination
	display inline-block
	padding-left 0
	margin 20px 0
	border-radius 4px

.pagination > li
	display inline

.pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > span, .pagination > .active > span:hover
	z-index 3
	color #fff
	cursor default
	background-color #337ab7
	border-color #337ab7

.pagination > .disabled > a, .pagination > .disabled > a:hover, .pagination > .disabled > span, .pagination > .disabled > span:hover
	color #777
	cursor not-allowed
	background-color #fff
	border-color #ddd

.pagination > li > a:hover, .pagination > li > span:hover
	z-index 2
	color rgba(0, 0, 0, 0.6)
	background-color #eee
	border-color #ddd

.pagination > li > a, .pagination > li > span
	position relative
	float left
	padding 6px 12px
	margin-left -1px
	line-height 1.42857143
	color #000
	text-decoration none
	background-color #fff
	border 1px solid #ddd
</style>
