<template>
  <div class="login-panel">
    <el-card class="box-card">
      <h3>登陆</h3>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登陆</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import querystring from 'querystring'

export default {
  name: 'login',
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit () {
      let {email, password} = this.form
      if (email.length < 1) {
        this.$message.error('二逼，快输用户名！')
      } else if (password.length < 1) {
        this.$message.error('忘写密码了吧，二货！')
      } else {
        fetch('/ajax/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          credentials: 'same-origin',
          body: querystring.stringify({
            email,
            password
          })
        })
        .then((resp) => resp.json())
        .then(({code, msg}) => {
          if (code === 200) {
            location.reload()
          } else {
            this.$message.error(msg || '登录失败！')
          }
        })
      }
    }
  }
}
</script>

<style scoped>
html,
body {
	margin: 0;
	padding: 0;
}

.login-panel {
	width: 400px;
	margin: 80px auto;
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.login-panel h3 {
  text-align: center
}
</style>
