<style scoped lang="less" rel="stylesheet/less">
  .header {
    padding: 10px;
    margin-bottom: 20px;
    background: #fff;
  }
  .list {
    background: #fff
  }
  .item {
    position: relative;
    & + .item {
      border-top: 1px solid #dee7ed
    }
    .actions {
      position: absolute;
      top: 50%;
      right: 40px;
      margin-top: -15px;
      line-height: 30px;
      opacity: 0;
      visibility: hidden;
      transition: .4s;
    }
    &:hover {
      background: #f2f5f8;
      .actions {
        opacity: 1;
        visibility: visible;
      }
    }
    &.folder {
      .filename{
        cursor: pointer;
        transition: .5s;
        &:hover {
          background-image: -webkit-gradient(linear, 0 0, 100% 0, from(#dee7ed),to(#f2f5f8));
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
  .current-path {
    padding-left: 20px;
    span {
      i {
        padding: 0 4px;
        font-style: normal;
        color: #c7cdd1;
      }
      a {
        text-decoration: none;
        color: #8f9ba3;
        &:hover {
          color: #3d505c;
        }
      }
    }
  }
  .empty{
    padding: 30px 60px;
    font-size: 20px;
    color: #abb4ba;
  }
</style>

<template>
  <div>
    <div class="header">
      <el-button @click="handleCreate" type="button" size="small">
          <i class="el-icon-fa-folder"></i> 创建目录
      </el-button>
      <el-button @click="handleCreate" type="button" size="small">
          <i class="el-icon-fa-upload"></i> 上传
      </el-button>
      <span class="current-path">
        <span v-for="item in pathSplits">
          <i>/</i><a href="javascript:void(0)" @click="jumpTo(item.path)">{{item.part}}</a>
        </span>
      </span>
    </div>
    <div class="list">
      <div v-if="files.length == 0" class="empty">
        这是一个空目录
      </div>
      <div class="item" v-for="file in files" :class="{folder: file.parsed.type === 'folder'}">
        <div class="filename" @click="clickHandle(file)">
          <i v-if="file.parsed.type === 'folder'" class="el-icon-fa-folder-o"></i>
          <i v-if="file.parsed.type === 'picture'" class="el-icon-fa-file-image-o"></i>
          <i v-if="file.parsed.type === 'compressed'" class="el-icon-fa-file-archive-o"></i>
          <i v-if="file.parsed.type === 'other'" class="el-icon-fa-file-o"></i>
          <strong>{{file.parsed.filename}}</strong><span>{{file.parsed.extension}}</span>
        </div>
        <div class="actions">
          <el-button type="text" size="small">重命名</el-button>
          <el-button @click="handleDelete(file)" type="text" size="small">删除</el-button>
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
function createPath (foldername, root) {
  root = (root + '/').replace(/\/\//g, '/')
  return fetch('/ajax/asset/createDir', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: querystring.stringify({
      root,
      name: foldername
    })
  })
  .then(response => response.json())
}
// 删除文件、目录
function deletePath (pathname, isFolder) {
  pathname = pathname.replace(/\/\//g, '/')
  let folderAPI = '/ajax/asset/delDir'
  let fileAPI = '/ajax/asset/del'
  let useAPI = isFolder ? folderAPI : fileAPI
  return fetch(useAPI, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: querystring.stringify({
      path: pathname
    })
  })
  .then(response => response.json())
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
      this.pathSplits = pathSplit.map((item) => {
        basePath += '/' + item
        return {
          part: item,
          path: basePath
        }
      })
      this.pathSplits.unshift({
        part: 'root',
        path: '/'
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
    refresh () {
      this.getData()
    },
    clickHandle (file) {
      if (!file.isdir) {
        return
      }
      let newPath = this.currentPath + '/' + file.name
      this.jumpTo(newPath)
    },
    jumpTo (newPath) {
      this.currentPath = newPath.replace(/\/+/g, '/')
      this.getData()
    },
    handleDelete (item) {
      this.$confirm('三思啊，删了可就没啦！', '提示', {
        confirmButtonText: '删除',
        type: 'warning'
      }).then(() => {
        let path = this.currentPath + '/' + item.name;
        deletePath(path, item.isdir).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.refresh()
        })
      }).catch(() => {})
    },
    handleCreate () {
      this.$prompt('请输入目录名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(\w|\d|-)+$/,
        inputErrorMessage: '目录只能用字母、数字'
      }).then(({ value }) => {
        createPath(value, this.currentPath).then(() => {
          this.refresh()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    }
  }
}
</script>
