<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ads-1
    height 140px
    background #333
</style>
<template>
  <div class="post-list">
   <div class="ads-1"></div>
  </div>
</template>

<script>
export default {
  name: 'post-list',
  components: {},
  data () {
    return {
      postList: [1, 1, 1, 1, 1]
    }
  },
  created () {
  }
}
</script>
