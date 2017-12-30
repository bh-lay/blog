<style lang="less" rel="stylesheet/less">
  .mditor-outer {
    line-height: initial;
    textarea {
      display: block;
      min-height: 300px;
      box-sizing: border-box;
      width: 100%;
      min-height: 300px;
      resize: vertical;
      padding: 10px;
      font-size: 14px;
      font-family: inherit;
      border: none;
      &:focus{
        outline: none;
      }
    }
    .article {
      min-height: 300px;
      max-height: 800px;
      overflow: auto;
      img {
        max-width: 80%;
      }
    }
  }
</style>

<template>
  <el-tabs type="border-card" class="mditor-outer" @tab-click="handleClick">
    <el-tab-pane label="编辑">
      <textarea v-model="markdownContent"></textarea>
    </el-tab-pane>
    <el-tab-pane label="预览">
      <div class="article" v-html="htmlContent"></div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import marked from 'marked'
import '../assets/github-article.less'
export default {
  props: ['content'],
  data () {
    return {
      markdownContent: '',
      htmlContent: ''
    }
  },
  watch: {
    content: function (val) {
      this.markdownContent = val
    }
  },
  methods: {
    handleClick (tab, event) {
      this.getHtml()
    },
    getContent () {
      let content = this.markdownContent
      localStorage.setItem('mditor', content)
      return content
    },
    getHtml () {
      let text = this.getContent()
      this.htmlContent = marked(text)
      return this.htmlContent
    }
  }
}
</script>
