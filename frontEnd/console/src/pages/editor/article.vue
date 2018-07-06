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
        <markdown ref="markdownEditor" :content="form.content"></markdown>
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
      <el-form-item label="文章作者">
        <el-input v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          type="datetime"
          placeholder="选择日期" v-model="form.time" style="width: 100%;"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          <span v-if="id">修改文章</span>
          <span v-if="!id">发布文章</span>
        </el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>Î

<script>
import markdown from '../../components/markdown'
import querystring from 'querystring'

function submit (data) {
  data.category = 'blog'

  return fetch('/ajax/add_edit', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: querystring.stringify(data)
  })
  .then(response => response.json())
}
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
      dateFormat: 'yyyy-MM-dd hh:mm:ss',
      inputVisible: false,
      inputValue: '',
      form: {
        title: '',
        intro: '',
        content: '',
        cover: '',
        tags: [],
        author: '剧中人',
        time: new Date()
      }
    }
  },
  created () {
    let idInRouter = this.$route.params.id
    this.id = idInRouter === 'new' ? null : idInRouter
    if (this.id) {
      getBlogDtail(this.id).then(({code, detail}) => {
        this.form.title = detail.title
        this.form.intro = detail.intro
        this.form.content = detail.content
        this.form.cover = detail.cover
        this.form.tags = detail.tags
        this.form.author = detail.author
        this.form.time = new Date(parseInt(detail.time_show, 10))
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
        title: this.form.title,
        intro: this.form.intro,
        content: this.$refs.markdownEditor.getContent(),
        cover: this.form.cover,
        tags: this.form.tags.join(','),
        author: this.form.author,
        time_show: this.form.time.getTime(),
        id: this.id
      }
      if (!data.title || !data.content) {
        this.$alert('二货，咱写点儿干货行不行呐！')
      }
      submit(data).then(() => {
        let msg = this.id ? '更新成功！' : '发布成功'
        this.$alert(msg, {
          callback: action => {
            this.$router.push('/content-article')
          }
        })
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
