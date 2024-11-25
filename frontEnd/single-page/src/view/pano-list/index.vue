<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'

.pano-list-pager
	background #f0f1f5
.pano-header
	position relative
	background #ddd
	.header-gallery
		opacity 0
		transition 2s
	&.header-visible
		.header-gallery
			opacity 1
	.panorama-author
		position absolute
		bottom 10px
		left 0
		width: 100%
		text-align right
		opacity .2
		transition .4s
		a
			font-size 12px
			color #fff
			text-shadow 1px 1px 1px #000, 0 0 5px rgba(0, 0, 0, 0.5)
			&:hover
				text-decoration underline
	&:hover .panorama-author
		opacity 1
.pano-profile-card
	display flex
	align-items center
	height 54px
	padding 0 15px 10px 20px
	border-radius 8px 8px 0 0
	background #365463
	img
		width 68px
		height 24px
	span
		display block
		flex-grow 1
		padding 0 20px
		line-height 30px
		font-size 14px
		color #a4b7c1

.post-list
	min-height 400px
	margin-top -10px
	padding 24px
	display flex
	flex-wrap wrap
	gap 15px
	background #fff
	border-radius 8px
	.post-item,
	& > i
		width 240px
		flex-grow 1
	& > i
		display block
		height 0
		padding 0
		line-height 0
		font-size 0
@media screen and (min-width $pad-portrait-width)
	.pano-header
		height 540px
		&:before
			content ""
			position absolute
			left 0
			bottom 0
			width 100%
			height 100%
			z-index 1
			background-image linear-gradient(0deg, #f0f1f5, transparent 300px), linear-gradient(0deg, #f0f1f5, transparent 100px)
		&:after
			content ""
			position absolute
			left 0
			bottom -10px
			width 100%
			height 20px
			z-index 1
			background-image linear-gradient(0deg, transparent, #f0f1f5, transparent)
		.panorama-author
			bottom 150px
			z-index 2
	.main-pager
		position relative
		z-index 1
		margin-top -140px !important
		padding-bottom 50px
@media screen and (max-width $pad-portrait-width)
	.pano-header
		height 40vw
		margin-bottom 20px
	.pano-profile-card
		padding 0 12px 10px
		img
			width 40px
			object-fit contain
		span
			padding 0 12px
			font-size 12px
	.main-pager
		padding-bottom 20px
	.post-list
		padding 12px
		gap 10px
		.post-item,
		& > i
			width 170px
</style>
<template>
<div class="pano-list-pager">
	<div class="pano-header" :class="panoVisible ? 'header-visible' : ''">
		<header-gallery @pano-ready="panoVisible = true"/>
		<div class="panorama-author">
			<Container>
				<a href="https://www.720yun.com/t/0bcjO5tusy1?scene_id=2337588" target="_blank">《妹纸们》素材来自 @SNH48 后期 By 剧中人</a>
			</Container>
		</div>
	</div>
	<Container class="main-pager">
		<div class="pano-profile-card">
			<img :src="logo" alt="720yun" />
			<span>作品托管在 720 云平台</span>
			<Button :href="thirdProfile.url" target="_blank" type="primary" size="small">小剧的 720 云主页</Button>
		</div>
		<div class="post-list" v-loading="isLoading">
			<Item
				v-for="item in postList"
				:key="item.id"
				:post="item"
			/>
			<i /><i /><i />
		</div>
	</Container>
	<Footer />
</div>
</template>

<script>

import Item from './item.vue'
export default {
	name: 'pano-page',
	components: {
		Item,
		HeaderGallery: () => import('./header-gallery.vue')
	},
	data () {
		return {
			logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIgAAAAwCAYAAADKIzJKAAAMu0lEQVR4Xt1debS+1RR+HlPGJHOTBg1aKkRkSCWVVGgu0SA0SPOg0jyQZmOoZIpY0rwyFBUVIZTIPIaizLPHeq7zfc499x3OO333fvY/v7V+33n32e959zlnD8/el5KWB/AuAE/GZOgOAHuS/FY6naSnAzgLwLIlogjAHwH8GsAPAJjXjQCuJ/m3PsWX9HAAmwFYH8CaAJ4A4EEACMBy/AnATwB8GcA1AC4hadn+r4iSvMDPnPBb3UZylkJKegCAHwN4XAtZfgfgAwDeRPLnLZ4fPyLJynkYgB2DQuSys8K8D8BJXWSQ9EAAXov5IJH8QzyxFcQ7b9ICeQc+jKQXdYbCh/lhx1XxDt6X5DlN+Ui6L4BDARwBwB+pLVmGIwGcQdLvmU2SDgZwLIBFsh/qd6Dl9Wm4Gck/m7UV5CoAG/Y7Ty23G0g+Ox4l6T4AbgGwWu3T9QMOIXly/bCxci4G4GMANsh9JmPcRQB2Sndk2XOSHgXgFwDun8F76CF7kXzHSEEs2DEAVh161sD/uwCOJunFmEWSHgvgAABLFsjiHf5gAB5ju8lyl643gBeS/GzdO0mycnjc0yrG/gvA9wHcDsDX2UMAPAnAygAsVxndAGCjHCWRZF7frpN3Qr8fT/KNMwoyoQl7n0bSMgBeAmCv8KHSOWwEr0by3xW71h/3iooT1Mp8pk8XkjaMU4V+NIDtAbwewAol83wSwBZ1142k+wGwzCv2vljNGHq91iH5halWkNE7h4X1vf2GgnXYmKSv0EKS5F3iZ1P6a7BFziT5z7r1DQa2T76jS+y5A0memsHHSr8HgIfWjR3odyvHFfGaDXaCSPKVZU/Ac9i+MH2d5IeHeDlJbwunScz+bJK7F80naRXLU/BBfVJsStLuayOS9DwAFwN4RPKgjfFVSdotnioaUkE+AmDbZDV2Jnn+ECsU4hY/tXcU8b+VZKHRK+njALZMZLEH8lySVpxWJMkhA3sCjpnEdC7JV7ViOo8PDaIgkpYAYJc1dp/vBrA0SR/fg5Akn062CUZkV83u9Cw7JLjU3yswMHcleV5X4STtHQJ+MSuHE/z+d3XlP8nnh1IQe0WOBcR0IsnDh3w5SY5jnBTNYb9+0TTCWTDOj1xL8vl9yBdc9i+FCGzM8nUk397HHJPi0buClEREbegtT9JXwGAkaU8A6QdYnOQ98aSS7NY6hB7ThiQ/3ZdwkrYGcGHC72KSL+1rjknwGUJBdgDwoUT4i0huMfQLSfKp5dNrRL5afMXMRAVNYXf/FoBzLSP6FYAlqlziprJLcjTU10lsE91J0tfv1NAQCvJFAGsnK7Aeyc8NvSqSrrORGc1zN0nHKsYk6ZEAbA/FdCHJ1KDuLK6kywFskiisr7xxiqHzJAMz6FVBJDnreXMic6kn0ee7SVoLwE0JzytJxh/IJ4ijsI6KxnQCSedgeiVJp4TIcMx3qS7JvF4FzGDWt4I4m7lTMq9T++/MkKX1EEnOX/jkMlwgpn1IGj4wJkkrAfhOMu5gkm9pLUDJg5JslB+f/LwcyR8lMi0XbKKqsH3f4tXxu53kdb0pSEg22QiNM6H3BtduUJxEyU61O223ctZ1UqIgB5A8rW7Fmv4uybCBE6oURJKvxE81hBY0FaXt+MP7VJDUxbRQp5Pcv610Oc9J2tfzFIw9i+Q+6f8vQAUpCijmvPokxtzbi4KEfIjvdecSRmQPYhWSTngNQkE5vPPT97D34NB2aozaBim6YubzBHk/gFcMskDdmd7Vl4K8DMAnEnmc9HlxdxnncpBkuX23+wgvou1IfrTohwWoIM5ZXR1gDEMsV1ue/wDwmr4UpCjwtAnJK9tKV/ZcyLmc6xR6yRgjufareH5BnSCWU5Kzt08F4JT/QiBHoO8wZqezgkgytvQbyTHvPMfKfQaewkI+BYBPBn/kInLkcgeSBvgU0kI7QRaCNlTJ0IeCGJpmDENM+5E8o6+XD1eKjV1fK2V4UWeJX03SR2MpTbuCSNocgFFwI7qH5KV9rXXKp5OCSFoUgFHkMcDFLq2DQYbmdaaQGfbHr8KLZge6pllBJD0HgKPF8Xcb1FPsqiBFLmYpSKeptkjaGICt/Fnh8ojPXwDsTtJjsmjKFSRNJbhEwUnQOd5a1mJkDGqtICHpZZBtjKG0cbM6yVsz5q66BhxRdNLNXkqZjC6c2pKkkfDZNK0KIskpA+d2YjqW5FHZL99iYBcF8e5OvZRrSKZp9EZiSVocwAU1pRj+3SF8R2ob0TQqSLDBvgrARvqIDGHw6dF4DZosWBcFMRr8Rclk3tFpPCRbHknOSVjpXAJQRL8HsHeTKyVlMqUKslWo24lf50iSx2UvbsuBrRRE0hNDwmsERvb0BuSukIMCL5I1gJw/A+DxJe/iHbQtSbvQrWnaFCRc5cbIxqWqPj2c9GvlCPhEqivDGC1wWwVxeDsNRh1GMob7ZX/EoBzGi5QZo0asu3Sgc4H2FCrINiH2E6/nMSRdYtGIJLl2xzXMjt76X2e7S+uGzLyxgkhyVdnPEl/cmdNl2gByQwGUK9CKkFZ/B2Ac53sarUTF4GlSkGB7fA3AGtEr2XNZlqRRcY1IkuMlm0YPHUEyzTbP4tlGQV4b2kXEjM4nuXMjaf8bYrayWTmKShN8fLoizXmK3mjKFMT4Vdf4xnQKyYPaLIgkK1ts6DqouDbJr5Txa6Mgvg9XTxiu1bLQ6N2OfhYI5zt2A5K2O3qlEgU5iKTRX72SJKPUUkNyDmCobFJJRucZpTciX7G281q1uJDkIrIUvOWQxJokfVrPoUYKImm9kHmMGd1IMsWg1i50CIIVJfOM13wByRQ+WMszZ8ACgBwuWVS4nsouyR6iPcWYziO5a857ViidAeUGlsd0FMmiEtRmNkhJNdqOJFMUe+U7BIigNbco6Vaaqu+yMKNnQ5zlNwmvoUDLaSjABmEWaFnS9QAcWh+Lbk+mqDNTk3UJ2XCfzMbmjsgRaRe6p1jdfAUJxqRdzLh/hcsFbJwWHk8VWrwbgCLD860kXSk/GFWUPXhnl2aBmwpUUvbwS5Jlbvz/NKH4pL6cZGxgNhUp5m+Y4+ejmmn/dhlJt9yaRdlXjCRbuylA5ziSaQVdreCSvlnQE814VqPABsWvWjhJLpBKk3+VnQBqXyoZIKnIPc0qnJJkw9zXeUy9lo6UFLu7p4pjUWPKUpCwG/wB4ziFLWC7W3MawVQtpqRnAHBZYkq7kDQqfnCSZC8g7UDkRniuzu9M4ZSygWkQUEy1pZeSbM8ZoR/TzSS9br1RaJxjdP9jIqb2cmywjltn5SrIKwGkVfmt7u2Sk8hKZmWrxHL0tTqSlg5dElME125t+pulckkyWDrFw2QVb0u6DEAK1dyepMHNvZIk43hmWk1FtA1Jt+OaoVwF8Y5PNdhdaJx+bkSSHPd4VvLQySQPacSo42BJTvhtl7CxB+X3au1ehxPAV0QKbDqHpG2vUpLk8IGz0/F38clt17b3zROchduSjLydhzVGEdZaBQn9LtwqM6ZbSKbHZ+0nC+h3J9zS3hnrkrTRNDGSZJiCbaG0o6AR8ZuTTN+5VjZJ64QGMjHiy89lNZApUdpDSb65dvKWAyTtAsAY35jGSdccBfkggJcnDAzte29TmcLRnnbZseew2CSM01ReSW5bdWLBe/g6cK7j1JydG2w02zU22Iu6FO5Psqh2Zzx1UFg3yUur61YauHTEPVy8KYwOHNEFJGdiJZUKEroOurltvMucA3DF2rhiPldRQifltLVTluuXO0eTccGYvKTgzh+xsVvvRKHtrTsLFMwdF0dN7AxVKCKHyr0jK3umSnLp54EFDNwUxxCKRj1XG6yDc2Bu1Bdn5m8iOWMG1ClIUai4tb1QEok14MVIqaEWYLRWPqmuTrEkktyewW5vVbdpB7hcT2ur32kAY3CNWfE1FS9s+l2udXV/TjV/QSeABt+496Hu6mg3vVxBQudhnx5xz1Iv8ookW3VEDk3evGjzSXuQdG/6+Hj38eqd2mehl0sw7LpnnbSS3AVx0DLVBou+NUn3cKtUEPvHjpTGdClJw+5bUegs6Ht2PukqkoZLzqJw3fiItx3hLHNbchba2JjUfazkF9B0ToTGDWfaytDlOV9nW42uxNIrJmAR7PLEHZjXJ+kOfq2oJODWileHh9z71Gj8QpK0FAC73IYvNOlXau/Mhruv4HRjZYkrad3Ao6wpbxafloNsW7p9l6PjY5e6zgbxXz6wle+/wOA2jvZoOpEkN4o7OySLar2oTpPNfth90qzcTi7Wgm0CVsVXjkPe7jviPwdihbHMtknsutouGf05ENciZ10nVe8UNqYNx0k29Hcuzc7CnKbB/wFazQgjjVRjRwAAAABJRU5ErkJggg==',
			thirdProfile: {
				url: 'https://720yun.com/u/19023widcyv'
			},
			postList: [],
			panoVisible: false,
			isLoading: false
		}
	},
	created () {
		this.getList()
	},
	methods: {
		handleLoaded() {
			alert(11)
		},
		getList () {
			this.isLoading = true
			fetch('/api/pano/list?act=get_list', {
				method: 'GET'
			})
				.then(response => response.json())
				.then(data => {
					const panoList = data?.data?.list || []
					panoList.forEach(function (item) {
						let thumb = `https://ssl-thumb2.720static.com/${item.property.thumbUrl}?imageMogr2/thumbnail/560`
						item.title = item.property.name
						item.desc = item.property.remark
						item.url = `https://720yun.com/t/${item.property.pid}?from=bh-lay`
						item.thumb = '/img-robber/' + btoa(thumb + '-https://720yun.com')
						item.pv = item.pvCount
						item.like = item.likeCount
					})
					panoList.sort((itemA, itemB) => itemB.pv - itemA.pv)
					this.postList = panoList
				})
				.catch(() => {})
				.then(() => {
					this.isLoading = false
				})
		}
	}
}
</script>
