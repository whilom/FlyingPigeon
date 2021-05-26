<template>
  <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="100px" class="ruleForm">
    <el-form-item label="用户名">
      <span>{{ showUserName }}</span>
    </el-form-item>
    <el-form-item label="修改密码" prop="pass">
      <el-input show-password v-model="ruleForm.pass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input show-password v-model="ruleForm.checkPass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit()">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      ruleForm: {
        pass: '',
        checkPass: ''
      }
    }
  },
  computed: {
    showUserName() {
      return Cookies.get('uName')
    }
  },
  methods: {
    checkValidity() {
      let isValid = true
      if (!this.ruleForm.pass || !this.ruleForm.checkPass) {
        this.$message.error({ message: '密码不能为空' })
        return false
      }
      return isValid
    },
    submit: function () {
      if (this.checkValidity()) {
        let fd = new FormData();
        fd.append("userName", this.showUserName);
        fd.append("passwd", this.ruleForm.pass);

        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }

        if (this.ruleForm.pass === this.ruleForm.checkPass) {
          this.$axios.post('user/update', fd, config).then(res => {
            if (res.data.msg === '修改成功') {
              this.$message.success({ message: '修改成功，请重新登录' })
              setTimeout(() => {
                this.$router.push({
                  path: '/'
                })
              }, 500)
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style>
.ruleForm {
  width: 400px;
  margin-top: 40px;
}
</style>