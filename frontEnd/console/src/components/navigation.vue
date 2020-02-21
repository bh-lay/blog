<template>
  <div class="navigation">
    <el-button class="trigger-button" icon="el-icon-menu" @click="mobileVisible = !mobileVisible"></el-button>
    <el-menu router :class="['navigation-list', mobileVisible ? 'mobile-visible' : '']">
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
          <el-menu-item index="/content/moment">朋友圈动态</el-menu-item>
          <el-menu-item index="/moment/friends">朋友圈好友</el-menu-item>
          <el-menu-item index="/content/moment/cache">朋友圈缓存</el-menu-item>
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
  name: 'navigation',
  data () {
    return {
      mobileVisible: false
    }
  },
  methods: {},
  watch: {
    '$route' () {
      this.mobileVisible = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
.navigation {
  padding-top: 50px;
  .trigger-button {
    display: none
  }
}
.el-menu {
	border-right: none;
}

@media screen and (max-width: 800px){
	.navigation {
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    overflow: visible;
    z-index: 2000;
    .navigation-list {
      position: absolute;
      top: 50px;
      right: 10px;
      width: 240px;
      max-height: 80vh;
      box-shadow: 2px 2px 12px rgba(0, 0, 0, .15), 1px 1px 3px rgba(0, 0, 0, .1);
      overflow: auto;
      opacity: 0;
      visibility: hidden;
      transition: .15s;
      transform: translateY(-15px);
      &.mobile-visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
    }
    .trigger-button {
      position: absolute;
      display: block;
      top: 10px;
      right: 10px
    }
	}
}
</style>
