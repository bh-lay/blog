<style lang="stylus" rel="stylesheet/stylus" scoped>
.post-list
  padding 20px 20px 50px
.item
  display flex
  margin-bottom 20px
  .user
    width 40px
    height 40px
    margin-right 20px
    background #333
  .content
    flex-grow 1
    height 200px
    background #eee
</style>
<template>
  <div class="post-list">
    <div
      class="item"
      v-for="(item, index) in postList"
      :key="index"
    >
      <div class="user">
      </div>
      <div class="content">
        <div class="title"></div>
        <div class="cover"></div>
      </div>
    </div>
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
