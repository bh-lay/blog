<template>
  <el-row :gutter="20">
    <el-col :span="16">
      <el-card class="box-card">
        <h1>${username}你还有脸回来！</h1>
        <p>你有多久没有更新博文了？</p>
        <p>博客还想不想要了？</p>
        <p>人生就此荒废你开心么？</p>
        <p>
          <a class="btn btn-primary btn-lg" href="/" target="_blank" role="button">去看看博客</a>
        </p>
      </el-card>
      <br>
      <el-card class="box-card">
        <h3>清除缓存
          <small>不选则清除全部</small>
        </h3>
        <el-checkbox-group v-model="selectedCaches">
          <el-checkbox :label="item" v-for="(item,index) in cacheType" :key="index"></el-checkbox>
        </el-checkbox-group>
        <br>
        <el-button type="primary" @click="clearCache">清除</el-button>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="box-card">
        <h3>更新数据</h3>
        <p>默认每天更新一次，等不及的话可以手动更新。</p>
        <a class="btn btn-default" title="更新前端英雄榜分数" href="/ajax/functions/updateFriendsScore" data-action-ajaxConfirm="确定要更新么？">更新前端英雄榜分数</a>
        <a class="btn btn-default" title="更新720yun数据" href="/ajax/functions/update720yun" data-action-ajaxConfirm="确定要更新么？">更新720yun数据</a>
      </el-card>
      <br>
      <el-card class="box-card">
        <h3>评论管理</h3>
        <p>好激动呦，有没有人给我写评论呢！</p>
        <a class="btn btn-default custom-lofox" href="/admin/comments">评论管理</a>
      </el-card>
      <br>
      <el-card class="box-card">
        <h3>发布台
          <small>增加博客内容</small>
        </h3>
        <div class="list-group">
          <a class="list-group-item custom-lofox" href="/admin/publish/article">写博文</a>
          <a class="list-group-item custom-lofox" href="/admin/publish/labs">实验室</a>
          <a class="list-group-item custom-lofox" href="/admin/publish/friends">加友链</a>
        </div>
      </el-card>
      <br>
      <el-card class="box-card">
        <h3>图库
          <small>静态资源管理</small>
        </h3>
        <p>远程镜像至七牛云存储，新增操作直接上传即可。修改或删除操作需要进入七牛后台进行重复操作。</p>
        <a class="btn btn-info custom-lofox" href="/admin/gallery">进入图库</a>
      </el-card>
    </el-col>
  </el-row>
</template>Î

<script>
export default {
  data () {
    return {
      selectedCaches: [],
      cacheType: ['ajax', 'comment', 'html', 'labs', 'article', 'links', 'tags']
    }
  },
  methods: {
    clearCache () {
      return fetch('/ajax/clear_cache?type=?' + this.selectedCaches.join(','), {
        method: 'POST',
        credentials: 'same-origin'
      }).then(response => response.json())
    }
  }
}
</script>
