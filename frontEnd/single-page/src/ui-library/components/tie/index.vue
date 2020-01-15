<template>
<div><slot /></div>
</template>
<script>
import Tie from './tie.js'

export default {
	name: 'ui-tie',
	props: {
		tieTop: {
			type: Number,
			default: 50
		}
	},
	data () {
		return {
			// eslint-disable-next-line
			_tie: null
		}
	},
	mounted () {
		this.init()
	},
	methods: {
		init () {
			this.$nextTick(() => {
				this._tie = new Tie({
					dom: this.$el,
					scopeDom: this.$el.parentNode,
					fixed_top: this.tieTop
				})
			})
		}
	},
	beforeDestroy () {
		this._tie.destroy()
	}
}
</script>
