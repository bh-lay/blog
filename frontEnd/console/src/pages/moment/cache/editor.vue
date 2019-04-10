<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="标题">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="缓存">
        <el-input v-model="form.content" type="textarea"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          <span v-if="cacheName">更新缓存</span>
          <span v-if="!cacheName">创建缓存</span>
        </el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>Î

<script>
import querystring from 'querystring'

function getCacheDtail (name) {
  return fetch(`/api/moment/cache/${name}`, {
    method: 'GET',
    credentials: 'same-origin'
  })
  .then(response => response.json())
}
export default {
  data () {
    return {
      cacheName: null,
      // create edit
      mode: 'create',
      form: {
        name: '',
        content: ''
      }
    }
  },
  created () {
    this.cacheName = this.$route.params.name
    this.mode = this.cacheName === 'new' ? 'create' : 'edit'
    if (this.mode === 'edit') {
      getCacheDtail(this.cacheName).then(({code, data = {}}) => {
        this.form.name = data.name
        this.form.content = JSON.stringify(data.content)
      })
    }
  },
  methods: {
    onSubmit () {
      return fetch('/api/moment/cache/' + this.form.name, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: querystring.stringify({
          content: this.form.content
        })
      })
      .then(response => response.json())
      .then(() => {
        let msg = this.mode === 'edit' ? '更新成功！' : '发布成功'
        this.$alert(msg, {
          callback: action => {
            this.$router.push('/content/moment')
          }
        })
      })
    },
    onCancel () {
      this.$router.push({
        path: '/content/moment'
      })
    }
  }
}
</script>
