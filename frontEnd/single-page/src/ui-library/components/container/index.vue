<style lang="stylus" rel="stylesheet/stylus" scoped>
.container
	width 90%
	max-width 1800px
	margin auto
@media screen and (max-width 600px)
	.container
		width auto
		margin-right 15px
		margin-left 15px
</style>
<template>
<div class="container"><slot /></div>
</template>
<script>
export default {
	name: 'ui-container',
	data () {
		return {}
	},
	methods: {
	}
}
</script>
