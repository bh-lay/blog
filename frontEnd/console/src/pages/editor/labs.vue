<style>
</style>

<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" label-position="top">

      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="名字">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item label="正文">
        <markdown ref="markdownEditor" :content="form.content"></markdown>
      </el-form-item>
      <el-form-item label="缩略图">
        <el-input v-model="form.cover"></el-input>
      </el-form-item>
      <el-form-item label="Github URL">
        <el-input v-model="form.git_full_name"></el-input>
      </el-form-item>
      <el-form-item label="Demo URL">
        <el-input v-model="form.demo_url"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          <span v-if="id">修改实验室</span>
          <span v-if="!id">发布实验室</span>
        </el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>Î

<script>
import markdown from '../../components/markdown'

function getBlogDtail (id) {
  return fetch(`/api/labs/${id}`, {
    method: 'GET',
    credentials: 'same-origin'
  })
  .then(response => response.json())
}
export default {
  components: {
    markdown
  },
  data () {
    return {
      id: null,
      // create edit
      mode: 'create',
      inputVisible: false,
      inputValue: '',
      form: {
        name: '',
        title: '',
        cover: '',
        content: '',
        git_full_name: '',
        demo_url: '',
        intro: ''
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    this.mode = this.id === 'new' ? 'create' : 'edit'
    if (this.mode === 'edit') {
      getBlogDtail(this.id).then(({code, detail = {}}) => {
        this.form.name = detail.name
        this.form.title = detail.title
        this.form.cover = detail.cover
        this.form.content = detail.content
        this.form.git_full_name = detail.git_full_name
        this.form.demo_url = detail.demo_url
        this.form.intro = detail.intro
      })
    }
  },
  methods: {
    handleClose (tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.form.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    onSubmit () {
      let data = {
        name: this.form.name,
        title: this.form.title,
        cover: this.form.cover,
        intro: this.form.intro,
        content: this.$refs.markdownEditor.getContent(),
        demo_url: this.form.demo_url,
        git_full_name: this.form.git_full_name
      }
      if (!data.title || !data.content) {
        this.$alert('二货，咱写点儿干货行不行呐！')
      }
      let url
      let method
      if (this.mode === 'edit') {
        url = '/api/labs/' + this.id
        method = 'PUT'
      } else {
        url = '/api/labs/0'
        method = 'POST'
      }
      return fetch(url, {
        method,
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(() => {
        let msg = this.mode === 'edit' ? '更新成功！' : '发布成功'
        this.$alert(msg, {
          callback: action => {
            this.$router.push('/content-labs')
          }
        })
      })
    },
    onCancel () {
      this.$router.push({
        path: '/content-labs'
      })
    }
  }
}
</script>
