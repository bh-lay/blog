<style scoped lang="less" rel="stylesheet/less">
  .header {
    padding: 10px;
    margin-bottom: 20px;
    background: #fff;
  }
  .list {
    min-height: 100px;
    background: #fff
  }
  .item {
    & + .item {
      border-top: 1px solid #dee7ed
    }
    &:hover {
      background: #f2f5f8;
    }
    &.folder {
      .filename{
        cursor: pointer;
        background-image: -webkit-gradient(linear, 0 0, 100% 0, from(transparent),to(transparent));
        transition: .5s;
        &:hover {
          background-image: -webkit-gradient(linear, 0 0, 100% 0, from(#c2ced6),to(#f2f5f8));
        }
      }
    }
  }
  .filename {
    display: inline-block;
    min-width: 200px;
    height: 30px;
    padding: 5px 30px;
    line-height: 30px;
    font-size: 14px;
    cursor: default;
    i {
      margin-right: .5em;
      color: #9da8af;
    }
    strong {
      color: #3d505c
    }
    span{
      color: #a7b5be;
    }
  }
</style>

<template>
  <div>
    <div class="header">
      <el-button @click="handleCreate" type="button" size="small">xxx</el-button>
      <span v-for="item in pathSplit">{{item.path}}---</span>
    </div>
    <div class="list">
      <div class="item" v-for="file in files" :class="{folder: file.parsed.type === 'folder'}">
        <div class="filename" @click="clickHandle(file)">
          <i v-if="file.parsed.type === 'folder'" class="el-icon-fa-folder"></i>
          <i v-if="file.parsed.type === 'picture'" class="el-icon-fa-file-image-o"></i>
          <i v-if="file.parsed.type === 'compressed'" class="el-icon-fa-file-archive-o"></i>
          <i v-if="file.parsed.type === 'other'" class="el-icon-fa-file"></i>
          <strong>{{file.parsed.filename}}</strong><span>{{file.parsed.extension}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import querystring from 'querystring'

function parseFile (fullname, isdir) {
  fullname = fullname || ''
  // 文件基础名
  let filename
  // 文件扩展名
  let extension = ''
  let type = 'other'

  if (!isdir) {
    let match = fullname.match(/(.*)\.(\w+)$/)
    // 文件基础名
    filename = match ? match[1] : fullname
    // 文件扩展名
    extension = match ? '.' + match[2] : ''
    if (extension.match(/^\.(jpg|gif|bmp|jpeg|png)$/i)) {
      type = 'picture'
    } else if (extension.match(/^\.(zip|rar|tar)$/i)) {
      type = 'compressed'
    }
  } else {
    filename = fullname
    type = 'folder'
  }
  return {
    filename,
    extension,
    type
  }
}
export default {
  data () {
    return {
      currentPath: '',
      pathSplits: [],
      files: []
    }
  },
  created () {
    this.currentPath = '/'
    this.getData()
  },
  watch: {
    currentPath (after) {
      let pathSplit = after.replace(/^\//, '').split('/')
      let basePath = ''
      this.pathSplit = pathSplit.map((item) => {
        basePath += '/' + item
        return {
          part: item,
          path: basePath
        }
      })
    }
  },
  methods: {
    getData () {
      fetch('/ajax/asset?path=' + this.currentPath, {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(({files}) => {
        // 文件排序
        files.sort((fileA, fileB) => {
          if (fileA.isdir !== fileB.isdir) {
            // 第一顺序：目录在前，文件在后
            return fileA.isdir ? -1 : 1
          } else {
            // 第二顺序：按照字母排序
            return fileA.name.localeCompare(fileB.name)
          }
        })
        files.forEach(item => {
          item.parsed = parseFile(item.name, item.isdir)
        })
        this.files = files
      })
    },
    handleCurrentChange () {
      this.getData()
    },
    clickHandle (file) {
      if (!file.isdir) {
        return
      }
      let newPath = this.currentPath + '/' + file.name
      this.currentPath = newPath.replace(/\/+/g, '/')
      this.getData();
    },
    delete (id) {
      let queryStr = querystring.stringify({
        id: id
      })
      return fetch('/ajax/del?' + queryStr, {
        method: 'POST',
        credentials: 'same-origin'
      })
      .then(response => response.json())
    },
    handleDelete (item) {
      this.$confirm('三思啊，删了可就没啦！', '提示', {
        confirmButtonText: '删除',
        type: 'warning'
      }).then(() => {
        this.delete(item.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    handleCreate () {
    }
  }
}
</script>
