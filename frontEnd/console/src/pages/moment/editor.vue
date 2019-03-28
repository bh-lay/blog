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
      <el-form-item label="谁发布的？">
        {{form.userid}}
        <el-button type="text" @click="userSelectorVisible = true">选择发布者</el-button>
      </el-form-item>
      <el-form-item label="文章标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="文章描述">
        <markdown ref="markdownEditor" :content="form.content"></markdown>
      </el-form-item>
      <el-form-item label="缩略图">
        <el-input v-model="form.cover"></el-input>
      </el-form-item>
      <el-form-item label="原始地址">
        <el-input v-model="form.originalUrl"></el-input>
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
        <el-date-picker
          type="datetime"
          placeholder="选择日期" v-model="form.createTime" style="width: 100%;"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          <span v-if="id">修改动态</span>
          <span v-if="!id">发布动态</span>
        </el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="谁发布的？" width="1200px" :visible.sync="userSelectorVisible">
        <userSelector
          :userid="form.userid"
          @selected="handleUserSelected"
        />
    </el-dialog>
  </el-card>
</template>Î

<script>
import userSelector from './user-selector.vue'
import markdown from '../../components/markdown'
import querystring from 'querystring'

function getBlogDtail (id) {
  let queryStr = querystring.stringify({
    format: 'markdown'
  })
  return fetch(`/api/moment/post/${id}?` + queryStr, {
    method: 'GET',
    credentials: 'same-origin'
  })
  .then(response => response.json())
}
export default {
  components: {
    markdown,
    userSelector
  },
  data () {
    return {
      id: null,
      // create edit
      mode: 'create',
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
      },

      userSelectorVisible: false
    }
  },
  created () {
    this.id = this.$route.params.id
    this.mode = this.id === 'new' ? 'create' : 'edit'
    if (this.mode === 'edit') {
      getBlogDtail(this.id).then(({code, detail = {}}) => {
        this.form.userid = detail.userid
        this.form.title = detail.title
        this.form.cover = detail.cover
        this.form.content = detail.content
        this.form.originalUrl = detail.originalUrl
        this.form.tags = detail.tags.length ? detail.tags.split(',') : []
        this.form.createTime = detail.createTime
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
    handleUserSelected (id) {
      console.log('id', id)
      this.userSelectorVisible = false;
      this.form.userid = id
    },
    onSubmit () {
      let data = {
        id: this.id,
        userid: this.form.userid,
        title: this.form.title,
        cover: this.form.cover,
        content: this.$refs.markdownEditor.getContent(),
        originalUrl: this.form.originalUrl,
        tags: this.form.tags.join(','),
        createTime: this.form.time.getTime()
      }
      if (!data.title || !data.content) {
        this.$alert('二货，咱写点儿干货行不行呐！')
      }
      let url
      let method
      if (this.mode === 'edit') {
        url = '/api/moment/post/' + this.id
        method = 'PUT'
      } else {
        url = '/api/moment/post/0'
        method = 'POST'
      }
      return fetch(url, {
        method,
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: querystring.stringify(data)
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
