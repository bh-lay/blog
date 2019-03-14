<template>
  <div v-loading="isLoading">
    <el-input type="textarea" v-model="content" :autosize="{ minRows: 2, maxRows: 8}"></el-input>
    <div style="padding-top:20px">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="$emit('close')">取 消</el-button>
    </div>
  </div>
</template>Î

<script>
import querystring from 'querystring'

export default {
  props: ['id'],
  data () {
    return {
      isLoading: false,
      content: ''
    }
  },
  mounted () {
    this.isLoading = true
    fetch(`/api/comments/${this.id}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(({code, detail}) => {
      if (detail && detail.content) {
        this.content = detail.content
      }
    }).catch(() => {})
    .then(() => {
      this.isLoading = false
    })
  },
  methods: {
    submit () {
      this.isLoading = true
      fetch('/api/comments/' + this.id, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: querystring.stringify({
          content: this.content
        })
      })
      .then(response => response.json())
      .then(() => {
        this.$alert('修改成功')
        this.$emit('update')
        this.$emit('close')
      })
      .catch(() => {
        this.$alert('修改失败，请重试')
      })
      .then(() => {
        this.isLoading = false
      })
    },
    onCancel () {
      this.$router.push({
        path: '/content-article'
      })
    }
  }
}
</script>
