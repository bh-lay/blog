<style scoped lang="less" rel="stylesheet/less">
  .header {
    padding: 10px;
    background: #fff;
  }
  .upload-list{
    padding: 10px;
    background: #f9fafa;
    border-top: 1px solid #e3e6e8;
  }

  .list {
    margin-top: 20px;
    background: #fff
  }
  .item {
    position: relative;
    transition: .2s;
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
  }
  .filename {
    display: inline-block;
    min-width: 140px;
    height: 30px;
    padding: 5px 30px;
    line-height: 30px;
    font-size: 14px;
    cursor: pointer;
    transition: .5s;
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
    &:hover {
      background-image: -webkit-gradient(linear, 0 0, 100% 0, from(#dee7ed),to(transparent));
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
      <el-button @click="uploadVisible = !uploadVisible" type="button" size="small">
          <i class="el-icon-fa-upload"></i> 上传管理
      </el-button>
      <span class="current-path">
        <span v-for="item in pathSplits">
          <i>/</i><a href="javascript:void(0)" @click="jumpTo(item.path)">{{item.part}}</a>
        </span>
      </span>
    </div>
    <div class="upload-list" v-show="uploadVisible">
      <el-upload
        action="/ajax/asset/upload"
        :data="{
          act: 'addFile',
          root: currentPath
        }"
        multiple
        :limit="3"
        :on-success="refresh"
        >
        <el-button size="small" type="primary">
          <i class="el-icon-fa-upload"></i> 上传
        </el-button>
      </el-upload>
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
          <el-button @click="handleRename(file)" type="text" size="small">重命名</el-button>
          <el-button @click="handleDelete(file)" type="text" size="small" v-if="file.parsed.type !== 'folder'">删除</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      title="文件路径"
      :visible.sync="pathDialogVisible">
      <el-form ref="form" :model="selectedFile" label-width="80px" v-if="selectedFile.parsed">
        <el-form-item label="物理路径">
          <el-input v-model="selectedFile.parsed.path"></el-input>
        </el-form-item>
        <el-form-item label="回源地址">
          <el-input v-model="domain + selectedFile.parsed.path"></el-input>
        </el-form-item>
        <el-form-item label="CDN地址">
          <el-input v-model="cdnDomain + selectedFile.parsed.path"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pathDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import querystring from 'querystring'

function cleanPath (path) {
  return (path || '').replace(/\/+/g, '/')
}
function parseFile ({name, isFolder, basePath}) {
  let fullname = name || ''
  // 文件基础名
  let filename
  // 文件扩展名
  let extension = ''
  let type = 'other'
  let path = cleanPath(basePath + '/' + fullname)
  if (!isFolder) {
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
    type,
    path
  }
}
function createPath (foldername, root) {
  root = cleanPath(root + '/')
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
  pathname = cleanPath(pathname)
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
// 重命名
function rename (pathname, newName) {
  return fetch('/ajax/asset/rename', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: querystring.stringify({
      pathname,
      newName
    })
  })
  .then(response => response.json())
}

export default {
  data () {
    return {
      currentPath: '',
      pathSplits: [],
      files: [],

      uploadVisible: false,

      domain: 'http://static.bh-lay.com',
      cdnDomain: 'http://static.bh-lay.com',
      selectedFile: {},
      pathDialogVisible: false
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
          item.parsed = parseFile({
            basePath: this.currentPath,
            name: item.name,
            isFolder: item.isdir
          })
        })
        this.files = files
      })
    },
    refresh () {
      this.getData()
    },
    clickHandle (file) {
      let newPath = this.currentPath + '/' + file.name
      if (!file.isdir) {
        this.selectedFile = file
        this.pathDialogVisible = true
      } else {
        this.jumpTo(newPath)
      }
    },
    jumpTo (newPath) {
      this.currentPath = cleanPath(newPath)
      this.getData()
    },
    handleRename (item) {
      console.log('item', item)
      this.$prompt('请输入邮箱', '提示', {
        confirmButtonText: '重命名',
        cancelButtonText: '取消',
        inputValue: item.parsed.filename,
        inputPattern: /^(\w|\d|-)+$/,
        inputErrorMessage: '只能使用字母、数字'
      }).then(({ value }) => {
        let path = this.currentPath + '/' + item.name
        rename(path, value).then(() => {
          this.$message({
            type: 'success',
            message: '重命名成功!'
          })
          this.refresh()
        })
      }).catch(() => {})
    },
    handleDelete (item) {
      this.$confirm('三思啊，删了可就没啦！', '提示', {
        confirmButtonText: '删除',
        type: 'warning'
      }).then(() => {
        let path = this.currentPath + '/' + item.name
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
        confirmButtonText: '创建',
        inputPattern: /^(\w|\d|-)+$/,
        inputErrorMessage: '目录只能用字母、数字'
      }).then(({ value }) => {
        createPath(value, this.currentPath).then(() => {
          this.refresh()
        })
      }).catch(() => {})
    }
  }
}
</script>
