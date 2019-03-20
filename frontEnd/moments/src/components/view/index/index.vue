<style lang="stylus" rel="stylesheet/stylus" scoped>
.banner
  height 400px
  background #2e3438
.some-tools
  padding 30px 0
  background #f0f1f5
.some-tools-body
  height 240px
  border 1px solid #e0e6eb
  background #fff
.index-main
  background #fff
  border 1px solid #fff
  border-width 1px 0
.index-main-body
  display flex
  min-height 600px
  .index-sidebar
    width 150px
    margin-left -1000px
    padding-left 1000px
    padding-top 30px
    padding-right 30px
    border-right 1px solid #e0e6eb
    background #f6f7f9
  .index-content
    flex-grow 1
    padding-top 30px
  .index-sidebar-secondary
    width 200px
    padding 30px 0 50px 30px
</style>
<template>
  <div class="index-page">
    <div class="banner">
      <div class="page-container">
        23456
      </div>
    </div>
    <div class="some-tools">
      <div class="page-container">
        <div class="some-tools-body"></div>
      </div>
    </div>
    <div class="index-main">
      <div class="page-container">
        <div class="index-main-body">
          <div class="index-sidebar">
            <sidebar />
          </div>
          <div class="index-content">
            <postList
              :disablePagination="true"
            />
            <a href="#/post/page/2">查看全部</a>
          </div>
          <div class="index-sidebar-secondary">
            <sidebarSecondary />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import postList from '@/components/post/list.vue'
import sidebar from './sidebar.vue'
import sidebarSecondary from './sidebarSecondary.vue'

export default {
  name: 'index',
  components: {postList, sidebar, sidebarSecondary},
  data () {
    return {
    }
  },
  created () {
  }
}
</script>
