<style scoped>
.list {
  display: flex;
  flex-wrap: wrap;
}
.list .item {
  flex-grow: 1;
  width: 200px;
  height: 40px;
  margin: 10px 15px;
  padding: 10px;
  border: 1px solid #eee;
  cursor: pointer;
}
.list .item.active {
  border-color: #f00;
}
.list .item .avatar{
  display: inline-block;
  vertical-align: middle;
  width: 40px;
  height: 40px;
  background-size: cover;
}
.footer {
  padding: 20px;
  text-align: right;
}
</style>

<template>
  <div>
    <div class="list">
        <div
          class="item"
          v-for="item in list"
          :key="item.id"
          :class="[selectedUserid === item.id ? 'active' : '']"
          @click="selectUser(item.id)"
        >
          <div
            class="avatar"
            :style="{
              backgroundImage: `url(${item.avatar})`
            }"
          />
          <span>{{item.title}}</span>
          <span>{{item.id}}</span>
        </div>
    </div>
    <el-pagination
      background
      :current-page.sync="page.current"
      :page-size="page.size"
      layout="prev, pager, next"
      :total="page.total">
    </el-pagination>
    <div class="footer">
      <el-button
        @click="confirm"
        type="primary"
      >确定</el-button>
    </div>
  </div>
</template>Î

<script>
export default {
  props: ['userid'],
  data () {
    return {
      selectedUserid: '',
      list: [],
      page: {
        current: 1,
        size: 20,
        total: 0
      }
    }
  },
  created () {
    this.reloadUserList()
  },
  methods: {
    reloadUserList () {
      let skip = this.page.size * (this.page.current - 1)
      return fetch(`/api/moment/friend/?limit=${this.page.size}&skip=${skip}`, {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(json => {
        this.list = json.list || []
        this.page.total = json.count || 0
      })
    },
    selectUser (id) {
      this.selectedUserid = id
    },
    confirm () {
      this.$emit('selected', this.selectedUserid)
    }
  },
  watch: {
    userid () {
      this.selectedUserid = this.userid
    },
    'page.current' () {
      this.reloadUserList()
    }
  }
}
</script>
