<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/assets/stylus/variable.styl"
.container
	width 90%
	max-width 1200px
	margin auto
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
