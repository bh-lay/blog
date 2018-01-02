<template>
  <div class="navigation">
    <div style="height: 80px"></div>
    <el-menu router class="el-menu-vertical-demo">
      <el-menu-item index="/panel">
        <i class="el-icon-menu"></i>
        <span slot="title">快速操作</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/content-article">博文</el-menu-item>
          <el-menu-item index="/content-labs">实验室</el-menu-item>
          <el-menu-item index="/content-comments">评论管理</el-menu-item>
          <el-menu-item index="/content-links">前端英雄榜</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/gallery">
        <i class="el-icon-picture"></i>
        <span slot="title">图库</span>
      </el-menu-item>
    </el-menu>
  </div>

</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {}
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-menu {
	border-right: none;
}
</style>
