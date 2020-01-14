<style lang="stylus" rel="stylesheet/stylus" scoped>
button,
a
	box-sizing border-box
	display: inline-block
	vertical-align bottom
	margin 0
	padding 12px 20px
	outline none
	border-radius 4px
	border 1px solid #dcdfe6
	line-height 1
	white-space nowrap
	cursor pointer
	text-align center
	transition .1s
	font-weight 500
	font-size 14px
.ui-button-default
	border-color #dcdfe6
	background #fff
	color #606266
	&:hover
		border-color #f90
		color #f90
.ui-button-primary
	border-color transparent
	background #f90
	color #fff
	&:hover
		background #f70
</style>

<script>
export default {
	name: 'ui-button',
	props: {
		type: {
			type: String,
			default: 'default'
		},
		href: {
			type: String,
			default: ''
		},
		target: {
			type: String,
			default: '_blank'
		}
	},
	render (createElement) {
		if (this.href) {
			return createElement(
				'a',
				{
					class: `ui-button-${this.type}`,
					attrs: {
						href: this.href,
						target: this.target
					}
				},
				[
					this.$slots.default
				]
			)
		}
		return createElement(
			'button',
			{
				class: `ui-button-${this.type}`
			},
			[
				this.$slots.default
			]
		)
	}
}
</script>
