<template>
  <div class="leftMenu">
    <el-menu
      background-color="#F5F5F5"
      :default-active="$route.path"
      @open="handleOpen"
      @close="handleClose"
      router
    >
      <el-menu-item index="/home/">
        <i class="el-icon-s-home"></i>首页
      </el-menu-item>
      <el-menu-item index="/home/writeLetter">
        <i class="el-icon-s-promotion"></i>写信
      </el-menu-item>
      <el-menu-item index="/home/receiveLetter">
        <i class="el-icon-s-grid"></i>收件箱
      </el-menu-item>
      <el-menu-item index="/home/mailManage">
        <i class="el-icon-s-management"></i>邮箱管理
      </el-menu-item>
      <el-menu-item index="/home/personalCenter">
        <i class="el-icon-s-custom"></i>个人中心
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>
<style lang="scss">
.leftMenu {
  display: block;
  position: fixed;
  bottom: 0;
  top: 60px;
  width: 190px;
  left: 0;
  z-index: 999;
  ul {
    height: 100%;
    border-radius: 0;
  }
}
</style>
