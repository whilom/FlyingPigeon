<template>
  <div class="email-wrap">
    <!-- <el-form :model="form" ref="form" label-width="80px" enctype="multipart/form-data"> -->
    <el-form :model="form" ref="form" label-width="80px">
      <el-form-item label="发件人">
        <el-select v-model="form.fromAddress" placeholder="选择发件账号" @change="change">
          <el-option
            v-for="item in options"
            :key="item.fromAddress"
            :label="item.fromAddress"
            :value="item.fromAddress"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收件人" prop="email">
        <el-input v-model="form.email" type="input" :rows="2" placeholder="请输入邮箱地址" />
      </el-form-item>
      <el-form-item label="主题" prop="title">
        <el-input v-model="form.title" type="input" :rows="2" placeholder="请输入主题" />
      </el-form-item>
      <el-form-item label="正文" prop="content">
        <quill-editor
          ref="myQuillEditor"
          v-model="form.content"
          class="editor"
          style="height: 240px"
          :options="editorOption"
        />
      </el-form-item>
      <el-form-item>
        <br />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发送</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
// import axios from 'axios'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'clean'], // 加粗，斜体，下划线，删除线，清除字体样式
            ['image'], //上传图片
            ['blockquote', 'code-block'], // 引用，代码块

            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: 'ordered' }, { list: 'bullet' }], // 列表
            [{ script: 'sub' }, { script: 'super' }], // 上下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            [{ direction: 'rtl' }], // 文本方向

            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题

            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            [{ font: [] }], // 字体
            [{ align: [] }], // 对齐方式
          ]
        },
        theme: 'snow'
      },
      options: [],
      form: {}
    }
  },
  computed: {
    showUserId() {
      this.userId = Cookies.get('userId')
    }
  },
  async mounted() {
    this.showUserId
    await this.tableDisplay()
  },
  methods: {
    async change() {
      await this.$axios.get("dept/query", { params: { userId: this.userId, userName: this.form.fromAddress } }).then(Response => {
        let res = Response.data
        if (res.total !== 0) {
          this.maildata = res.data
        }
      })
      this.mailServerHost = this.maildata[0].mailServerHost
      this.mailServerPort = this.maildata[0].mailServerPort
      this.userName = this.maildata[0].userName
      this.password = this.maildata[0].password
    },
    async tableDisplay() {
      await this.$axios.get("dept/query", { params: { userId: this.userId } }).then(Response => {
        let res = Response.data
        if (res.total !== 0) {
          this.options = res.data
        }
      })
    },
    onSubmit() {
      if (!this.form.fromAddress) {
        this.$message.error('请选择发件账号')
        return
      }
      if (!this.form.email) {
        this.$message.error('请输入收件人邮箱地址')
        return
      }
      if (!this.form.title) {
        this.$message.error('请输入标题')
        return
      }
      if (!this.form.content) {
        this.$message.error('请输入内容')
        return
      }

      //验证邮箱
      var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;

      if (myReg.test(this.form.email)) {
        this.$axios.post("/email", {
          "mailServerHost": this.mailServerHost,
          "mailServerPort": this.mailServerPort,
          "userName": this.userName,
          "password": this.password,
          "fromAddress": this.form.fromAddress,
          "email": this.form.email,
          "title": this.form.title,
          "content": this.form.content
        }).then(res => {
          alert(res.data.message)
          this.$refs.form.resetFields()
        }).catch(res => {
          alert(res.data.message)
        })
      } else {
        this.$message.error({ message: '邮箱格式错误，请重新输入' })
      }
    },
    cancel() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.email-wrap {
  margin-top: 30px;
  margin-right: 30px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.editor {
  height: 200px;
}
.file {
  margin-top: 110px;
}
</style>
