<template>
  <div class="login-root">
    <div class="login-container">
      <div class="login-meta">
        <img src="../assets/bigLogo.png" />
        <p>飞鸽邮箱</p>
      </div>
      <div class="login-form" @keyup.enter="doLogin">
        <p>系统登录</p>
        <label>
          <el-input prefix-icon="el-icon-user" type="text" v-model="username" placeholder="用户名" />
        </label>
        <label>
          <el-input prefix-icon="el-icon-lock" show-password v-model="password" placeholder="密码" />
        </label>
        <label>
          <el-input
            prefix-icon="el-icon-lock"
            show-password
            v-model="password2"
            placeholder="确认密码"
          />
        </label>
        <router-link to="/">
          <span>已有账号？立即登录</span>
        </router-link>
        <button @click="register()">注册</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
      password2: ''
    }
  },
  methods: {
    checkValidity() {
      let isValid = true
      if (!this.username || !this.password || !this.password2) {
        this.$message.error({ message: this.username ? '密码不能为空' : '用户名不能为空' })
        return false
      }
      return isValid
    },
    register: function () {
      if (this.checkValidity()) {
        let fd = new FormData();
        fd.append("userName", this.username);
        fd.append("passwd", this.password);

        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }

        if (this.password === this.password2) {
          this.$axios.post("user/register", fd, config).then(res => {
            if (res.data.msg === "注册成功") {
              this.$message.success({ message: res.data.msg })
              this.$router.push({
                path: '/'
              })
            } else {
              this.$message.error({ message: res.data.msg })
            }
          }).catch(res => {
            alert(res.data.msg)
          })
        } else {
          this.$message.error({ message: '两次输入的密码不同，请重新输入' })
        }
      }
    }
  },
}
</script>
<style lang="scss" scoped>
p {
  color: white;
}

span {
  float: left;
  margin: 20px 0px 0px 50px;
  font-size: 14px;
  color: #20a0ff;
}

.login-root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("../assets/background.jpg");
  background-size: cover;
  text-align: center;
  font-weight: lighter;
}

.login-container {
  border-radius: 4px;
  position: absolute;
  width: 800px;
  height: 300px;
  top: 40%;
  left: 50%;
  background-color: #43586d;
  transform: translate(-50%, -50%);
}

.login-meta {
  width: 400px;
  padding: 60px 0;
  font-size: 20px;
  letter-spacing: 1px;
  img {
    width: 150px;
    margin-bottom: 20px;
  }
}

.login-form {
  box-sizing: border-box;
  width: 340px;
  position: absolute;
  right: 60px;
  border-radius: 4px;
  height: 300px;
  top: 0px;
  font-weight: lighter;
  background-color: white;

  p {
    font-size: 26px;
    color: #20a0ff;
    margin: 30px;
  }

  label {
    display: block;
    color: #ccc;
    font-size: 20px;
    height: 20px;
    margin: 30px 0;
  }

  .el-input {
    width: 80%;
  }

  button {
    float: right;
    outline: none;
    margin: 10px 30px 0 0;
    height: 34px;
    width: 80px;
    border: none;
    background-color: #20a0ff;
    color: white;
    font-size: 14px;
    font-weight: lighter;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      background-color: #4db3ff;
    }
    &:active {
      background-color: #1d90e6;
    }
  }
}
</style>
