<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
button
	box-sizing border-box
	display: inline-block
	margin 0
	padding 12px 20px
	outline none
	border-radius 4px
	line-height 1
	white-space nowrap
	cursor pointer
	text-align center
	transition .1s
	font-weight 500
	font-size 14px
.ui-button-default
	border 1px solid #dcdfe6
	background #fff
	color #606266
	&:hover
		border-color #f90
		color #f90
.ui-button-primary
	border none
	background #f90
	color #fff
	&:hover
		background #f70
</style>
<template>
<button :class="`ui-button-${type}`"><slot /></button>
</template>
<script>
export default {
	name: 'ui-button',
	props: {
		type: {
			type: String,
			default: 'default'
		}
	},
	data () {
		return {}
	},
	methods: {
	}
}
</script>
