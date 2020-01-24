<style lang="stylus" rel="stylesheet/stylus" scoped>
button,
a
	box-sizing border-box
	display: inline-block
	vertical-align bottom
	margin 0
	padding 0
	outline none
	border-radius 4px
	border 1px solid #dcdfe6
	line-height 1
	white-space nowrap
	cursor pointer
	text-align center
	transition .1s
	font-weight 500
	&:disabled
		pointer-events none

// size 尺寸
.ui-button-small
	padding 8px 10px
	font-size 12px
.ui-button-middle
	padding 12px 20px
	font-size 14px

// type 样式
.ui-button-text
	border none
	background transparent
	font-size 14px
	color #fff
	&:hover
		text-decoration underline
	&:disabled
		color #333
.ui-button-default
	border-color #dcdfe6
	background #fff
	color #606266
	&:hover
		border-color #f90
		color #f90
	&:disabled
		border-color #888
		color #888
.ui-button-primary
	border-color transparent
	background #f90
	color #fff
	&:hover
		background #f70
	&:disabled
		background #aaa
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
		},
		size: {
			type: String,
			// small、middle、large
			default: 'middle'
		}
	},
	render (createElement) {
		let nodeName
		let attrs = {}
		let classNameList = [`ui-button-${this.type}`]
		// 文本类型不设置尺寸
		if (this.type !== 'text') {
			classNameList.push(`ui-button-${this.size}`)
		}
		if (this.href) {
			nodeName = 'a'
			attrs = {
				href: this.href,
				target: this.target
			}
		} else {
			nodeName = 'button'
		}
		return createElement(
			nodeName,
			{
				class: classNameList,
				attrs,
				on: {
					click: () => {
						this.$emit('click')
					}
				}
			},
			[
				this.$slots.default
			]
		)
	}
}
</script>
