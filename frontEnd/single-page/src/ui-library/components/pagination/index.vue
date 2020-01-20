<template type="text/template" id="template_pagination">
	<section class="ui-pagination" v-show="total > size">
		<span @click="clickCurrent(1)" :class="{
			disabled: current == 1
		}">首页</span>
		<span @click="clickCurrent(current - 1)" :class="{
			disabled: current == 1
		}">上一页</span>
		<span
			v-for="p in setList"
			:key="p.val"
			:class="{
				active: current == p.val
			}"
			@click="clickCurrent(p.val)"
		>{{ p.text }}</span>
		<span @click="clickCurrent(current + 1)" :class="{
			disabled: current == page
		}">下一页</span>
		<span @click="clickCurrent(page)" :class="{
			disabled: current == page
		}">尾页</span>
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
					temp.push({
						text: this.page - len,
						val: this.page - len
					})
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
				if (this.current > count + 1) {
					list.unshift({
						text: '...',
						val: list[0].val - 1
					})
				}
				if (this.current < this.page - count) {
					list.push({
						text: '...',
						val: list[list.length - 1].val + 1
					})
				}
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
.ui-pagination
	text-align center
	span
		display inline-block
		padding 6px 12px
		line-height 1.5
		background #fff
		color #526a7a
		text-decoration none
		cursor pointer
		transition .15s ease-in-out
		&:hover
			background-color #eee
			border-color #ddd
		&.active
			background #428bca
			color #fff
			font-size 22px
			cursor default
			&:hover
				cursor default
		&.disabled
			opacity .5
			cursor not-allowed
			&:hover
				cursor default
</style>
