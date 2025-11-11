<style lang="scss" scoped>
.container {
  width: 90%;
  max-width: 1280px;
  margin: auto;
}
@media screen and (max-width: 600px) {
  .container {
    width: auto;
    margin-right: 10px;
    margin-left: 10px;
  }
}
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
