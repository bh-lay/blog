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
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="文章描述">
        <el-input type="textarea" v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item label="文章正文">
        <markdown :content="form.content"></markdown>
      </el-form-item>
      <el-form-item label="缩略图">
        <el-input v-model="form.cover"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-tag
          :key="tag"
          v-for="tag in form.tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="form.time_show" style="width: 100%;"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          <span v-if="id">修改文章</span>
          <span v-if="!id">发布文章</span>
        </el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>Î

<script>
import markdown from '../../components/markdown'
import querystring from 'querystring'

function getBlogDtail (id) {
  let queryStr = querystring.stringify({
    format: 'markdown',
    act: 'get_detail',
    id: id
  })
  return fetch('/ajax/blog?' + queryStr, {
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

      inputVisible: false,
      inputValue: '',
      form: {
        title: '',
        intro: '',
        content: '',
        cover: '',
        tags: [],
        time_show: ''
      }
    }
  },
  created () {
    let idInRouter = this.$route.params.id
    this.id = idInRouter === 'new' ? null : idInRouter
    if (this.id) {
      getBlogDtail(this.id).then(({code, detail}) => {
        this.form.content = detail.content
        this.form.cover = detail.cover
        this.form.intro = detail.intro
        this.form.tags = detail.tags
        this.form.time_show = detail.time_show
        this.form.title = detail.title
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
      console.log('submit!')
    }
  }
}
</script>
