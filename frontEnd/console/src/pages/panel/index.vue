<template>
  <el-row :gutter="20">
    <el-col :span="16">
      <el-card class="box-card">
        <h1>剧中人你还有脸回来！</h1>
        <p>你有多久没有更新博文了？</p>
        <p>博客还想不想要了？</p>
        <p>人生就此荒废你开心么？</p>
        <a href="/" target="_blank">
          <el-button type="primary">去看看博客</el-button>
        </a>
      </el-card>
      <br>
      <el-card class="box-card">
        <h3>发布台
          <small>增加博客内容</small>
        </h3>
        <div class="list-group">
          <router-link to="/editor-article/new">
            <el-button>写博文</el-button>
          </router-link>
          <el-button>实验室</el-button>
          <el-button>加友链</el-button>
        </div>
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

        <el-button @click="executeFunction('updateFriendsScore')" >更新前端英雄榜分数</el-button>
        <el-button @click="executeFunction('update720yun')">更新720yun数据</el-button>
      </el-card>
      <br>
      <el-card class="box-card">
        <h3>评论管理</h3>
        <p>好激动呦，有没有人给我写评论呢！</p>
        <router-link to="/content-comments">
          <el-button>评论管理</el-button>
        </router-link>
      </el-card>
      <br>
      <el-card class="box-card">
        <h3>图库
          <small>静态资源管理</small>
        </h3>
        <p>远程镜像至七牛云存储，新增操作直接上传即可。修改或删除操作需要进入七牛后台进行重复操作。</p>
        <router-link to="/gallery">
          <el-button>进入图库</el-button>
        </router-link>
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
      fetch('/ajax/clear_cache?type=?' + this.selectedCaches.join(','), {
        method: 'POST',
        credentials: 'same-origin'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '已发起清除缓存请求!'
        })
      })
    },
    executeFunction (functionName, confirmText) {
      this.$confirm('确定要执行么？', '提示', {
        type: 'warning'
      }).then(() => {
        fetch('/ajax/functions/' + functionName, {
          method: 'POST',
          credentials: 'same-origin'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '已发起清除缓存请求!'
          })
        })
      })
    }
  }
}
</script>
