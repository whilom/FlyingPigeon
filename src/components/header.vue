<template>
  <div class="header">
    <el-menu background-color="#F5F5F5" class="el-menu-demo" mode="horizontal">
      <div class="logo">
        <img src="../assets/logo.png" alt="element-logo" class="nav-logo" />
      </div>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-user-solid" />
          {{ showUserName }}
        </template>
        <el-menu-item index="2-1" @click="toUser">个人中心</el-menu-item>
        <el-menu-item index="2-2" @click="signOut">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="line"></div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import store from '../store/store'
import * as types from '../store/types'

export default {
  data() {
    return {
      activeIndex: '1',
      username: ''
    }
  },
  computed: {
    showUserName() {
      return Cookies.get('uName')
    }
  },
  methods: {
    signOut() {
      this.$router.push({ path: '/' })
      store.commit(types.LOGOUT)
    },
    toUser() {
      store.commit(types.TITLE, window.localStorage.getItem('token'))
      this.$router.push({ path: '/home/personalCenter' })
    }
  }
}

</script>
<style lang="scss" scoped>
.logo {
  outline: none;
}

.header {
  width: 100%;
  position: fixed;
  z-index: 99;
  .el-menu-demo {
    width: 100%;
    min-width: 500px;
    border-radius: 0;
    display: flex;
    .menuSub {
      flex: 6;
      position: relative;
    }
    .logo {
      flex: 1;
      position: relative;
      top: 10px;
      left: 10px;
    }
  }
}
</style>
