<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="尊姓大名">
      </el-table-column>
      <el-table-column
        label="添加发布"
        width="200">
        <template slot-scope="scope">
          {{transformDate(scope.row.time_create)}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <a href="javascript:void(0)"></a>
          <a href="javascript:void(0)"></a>
          <el-button type="text" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="totalSize">
    </el-pagination>
  </div>
</template>Î

<script>

import querystring from 'querystring'
import dateFormat from 'dateformat'

export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      tableData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let queryStr = querystring.stringify({
        skip: (this.currentPage - 1) * this.pageSize,
        limit: this.pageSize
      })
      fetch('/ajax/links/list?' + queryStr, {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(({count, list}) => {
        this.tableData = list
        this.totalSize = count
      })
    },
    handleCurrentChange () {
      this.getData()
    },
    transformDate (dateStamp) {
      return dateFormat(parseInt(dateStamp), 'yyyy-mm-dd HH:MM:ss')
    },
    delete (id) {
      let queryStr = querystring.stringify({
        from: 'blog_friend',
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
