<style lang="scss" scoped>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  height: 30px;
  overflow: hidden;
}
.tag-list button {
  flex-grow: 1;
  max-width: 100px;
  margin: 0 10px 5px 0;
  border-color: #e8eaee;
  color: #576575;
}
.tag-list button:hover {
  border-color: #8599ad;
  color: #576575;
}
.tag-list button.ui-button-primary {
  border-color: #576575;
  background: #576575;
  color: #fff;
  cursor: default;
}
</style>
<template>
	<div class="tag-list" v-loading="isLoading">
		<Button
			@click="switchTag('')"
			size="small"
			:type="!$route.query.tag ? 'primary' : 'default'"
		>全部</Button>
		<Button
			v-for="(tag, index) in tagList"
			:key="index"
			:type="$route.query.tag === tag ? 'primary' : 'default'"
			size="small"
			@click="switchTag(tag)"
		>{{tag}}</Button>
	</div>
</template>

<script>
import {getApiData} from '@/common/js/api.js'

export default {
	name: 'post-list',
	components: {},
	data () {
		return {
			tagList: [],
			isLoading: false
		}
	},
	created () {
		this.getTagList()
	},
	methods: {
		getTagList () {
			this.isLoading = true
			getApiData('/blogtag/')
				.then(({list}) => {
					this.tagList = list.map(item => item.name).slice(0, 10)
				})
				.catch(() => {})
				.then(() => {
					this.isLoading = false
				})
		},
		switchTag (tag) {
			let query = {}
			if (this.$route.query.type === 'list') {
				query.type = 'list'
				query.page = 1
			}
			if (tag) {
				query.tag = tag
			}
			this.$router.replace({
				path: '/blog/',
				query
			})
		}
	}
}
</script>
