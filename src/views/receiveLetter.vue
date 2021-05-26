<template>
  <div class="mailManage">
    <el-select style="width: 150px" v-model="form.fromAddress" placeholder="选择邮箱" @change="change">
      <el-option
        v-for="item in options"
        :key="item.fromAddress"
        :label="item.mailbox"
        :value="item.fromAddress"
      ></el-option>
    </el-select>
    <span>&emsp;查看最近的一封邮件</span>
    <el-card class="box-card">
      <el-divider>最新邮件</el-divider>
      <div :key="tableData" v-html="tableData" class="text item">{{tableData}}</div>
    </el-card>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      tableData: '',
      dialogFormVisible: false,
      formLabelWidth: '80px',
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
    await this.change()
  },
  methods: {
    async change() {
      await this.$axios.get("dept/query", { params: { userName: this.form.fromAddress, userId: this.userId } }).then(Response => {
        let res = Response.data
        if (res.total !== 0) {
          this.maildata = res.data
        }
      })
      this.pop3Server = this.maildata[0].pop3Server
      this.protocol = this.maildata[0].protocol
      this.userName = this.maildata[0].userName
      this.password = this.maildata[0].password
      await this.Receive()
    },
    async tableDisplay() {
      await this.$axios.get("dept/query", { params: { userId: this.userId } }).then(Response => {
        let res = Response.data
        if (res.total !== 0) {
          this.options = res.data
        }
      })
    },
    async Receive() {
      await this.$axios.post("/receive", {
        "pop3Server": this.pop3Server,
        "protocol": this.protocol,
        "username": this.userName,
        "password": this.password
      }).then(Response => {
        let res = Response.data
        if (res.flag == true) {
          this.tableData = res.data
        }
      })
    }
  }
}
</script>
<style lang="scss">
.mailManage {
  margin: 30px 0 0 20px;

  .tableMain {
    margin: {
      top: 10px;
    }
  }

  .el-dialog {
    width: 600px;
  }

  .text {
    font-size: 18px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    margin-top: 20px;
  }
}
</style>
