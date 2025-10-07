<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'
.potography-item
	position relative
	img
		position relative
		display block
		width 100%
		height 100%
		object-fit cover
	.potography-info
		position absolute
		top 0
		left 0
		width 100%
		height 100%
		background rgba(0, 0, 0, .6)
		opacity 0
		transition .3s
		.title
			padding 10px 15px
			font-size 16px
			color #fff
		.desc
			padding 10px 15px
			font-size 14px
			color #fff
			opacity .7
	&:hover
		.potography-info
			opacity 1
</style>

<script>
import filters from '@/filters/index.js'
export default {
	props: {
		post: {
			type: Object,
			default () {
				return {}
			}
		}
	},
	data () {
		return {
		}
	},
	render(h) {
		const targetUrl = this.post.url
		let printImageWidth = 10;
		let printImageHeight = 10;
		let printImageUrl = '';
		const printImage = (this.post?.images || [])[0]
		if (printImage) {
			printImageWidth = printImage.width;
			printImageHeight = printImage.height;
			printImageUrl = printImage.source?.l || '';
		} else {
			const titleImage = this.post.title_image || {}
			printImageWidth = titleImage.width;
			printImageHeight = titleImage.height;
			printImageUrl = titleImage.url
		}

		return h(
			'div', {
				class: 'potography-item',
				style: {
					flexBasis: `calc(var(--base-width) * ${printImageWidth / printImageHeight})`,
					aspectRatio: printImageWidth/printImageHeight,
				},
			},
			[
				h('img', {
					class: 'photo',
					directives: [
						{
							name: 'lazy',
							value: printImageUrl,
						}
					],
				}),
				h(
					'a', {
						class: 'potography-info',
						attrs: {
							href: targetUrl,
							target: '_blank'
						}
					},
					[
						h('div', {
							class: 'title'
						}, this.post.title),
						h('div', {
							class: 'desc'
						}, this.post.excerpt)
					]
				)
			]
		)
	},
}
</script>
