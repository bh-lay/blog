<style>
.user-info-item{
  margin-right: 10px;
}
</style>
 
<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-row>
          <el-col :span="8">
            评论在：<a :href="reverseUrl(props.row.cid)" target="_blank">{{props.row.cid}}</a>
          </el-col>
          <el-col :span="16">
            <div v-if="props.row.user">
              <span class="user-info-item">
                <i class="el-icon-fa-user"></i>
                <span>{{ props.row.user.username }}</span>
              </span>
              <span v-if="props.row.user.blog" class="user-info-item">
                <i class="el-icon-fa-home"></i>
                <span>{{ props.row.user.blog }}</span>
              </span>
              <span v-if="props.row.user.email" class="user-info-item">
                <i class="el-icon-fa-envelope"></i>
                <span>{{ props.row.user.email }}</span>
              </span>
            </div>
            <div v-if="!props.row.user">
              <strong>UID：</strong>{{ props.row.uid }}
            </div>
          </el-col>
        </el-row>
        <div style="margin: 10px 0;padding:10px;background: #eee;">
          {{ props.row.content }}
        </div>
      </template>
    </el-table-column>
      <el-table-column
        prop="content"
        label="内容">
      </el-table-column>
      <el-table-column
        label="发布日期"
        width="200">
        <template slot-scope="scope">
          {{transformDate(scope.row.time)}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <a href="javascript:void(0)"></a>
          <a href="javascript:void(0)"></a>
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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

    <el-dialog
      title="修改评论"
      :visible.sync="editorVisible"
      width="35%">
      <commentsEditor
        v-if="editorVisible"
        :id="selectedID"
        @update="getData()"
        @close="editorVisible = false"
      ></commentsEditor>
    </el-dialog>
  </div>
</template>Î

<script>

import querystring from 'querystring'
import dateFormat from 'dateformat'
import commentsEditor from '../editor/comments.vue'

export default {
  components: {
    commentsEditor
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      tableData: [],

      editorVisible: false,
      selectedID: null
    }
  },
  created () {
    this.getData()
  },
  methods: {
    reverseUrl (id) {
      return id === 'define-1' ? '/bless' : '/' + id.replace(/-/g, '/')
    },
    getData () {
      let queryStr = querystring.stringify({
        isadmin: true,
        skip: (this.currentPage - 1) * this.pageSize,
        limit: this.pageSize
      })
      fetch('/ajax/comments/list?' + queryStr, {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(({data}) => {
        let {count, list} = data
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
      return fetch('/ajax/comments/del?id=' + id, {
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
        this.delete(item._id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    handleEdit (item) {
      this.editorVisible = true
      this.selectedID = item._id
    }
  }
}
</script>
