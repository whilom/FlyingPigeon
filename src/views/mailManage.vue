<template>
  <div class="mailManage">
    <el-button type="primary" @click="Add">新增</el-button>
    <span>&emsp;添加邮箱账号前，请先前往该邮箱设置中打开POP3/SMTP服务并获取授权码</span>
    <div class="tableMain">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="mailbox" label="邮箱类型" width="240"></el-table-column>
        <el-table-column prop="userName" label="邮箱账号" width="240"></el-table-column>
        <el-table-column prop="mailServerHost" label="发件服务器" width="240"></el-table-column>
        <el-table-column prop="pop3Server" label="收件服务器" width="240"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="Edit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="Delete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="邮箱信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="邮箱类型" :label-width="formLabelWidth">
          <el-select v-model="form.mailbox" placeholder="选择邮箱" @change="change">
            <el-option label="QQmail" value="QQmail"></el-option>
            <el-option label="163mail" value="163mail"></el-option>
            <el-option label="Sinamail" value="Sinamail"></el-option>
            <el-option label="Gmail" value="Gmail"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱账号" :label-width="formLabelWidth">
          <el-input v-model="form.userName" required="true"></el-input>
        </el-form-item>
        <el-form-item label="授权码" :label-width="formLabelWidth">
          <el-input show-password v-model="form.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="Update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      tableData: [{
        mailbox: '',
        userName: '',
        password: '',
        mailServerHost: '',
        mailServerPort: '',
        pop3Server: '',
        protocol: ''
      }],
      dialogFormVisible: false,
      formLabelWidth: '80px',
      form: {},
      updateType: ''
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
    checkValidity() {
      let isValid = true
      if (!this.form.mailbox || !this.form.userName || !this.form.password) {
        this.$message.error({ message: '表单数据不能为空' })
        return false
      }
      return isValid
    },
    Add() {
      this.form = {
        mailbox: '',
        address: '',
        password: ''
      }
      this.dialogFormVisible = true
      this.updateType = 1
    },
    Edit(index) {
      this.form = this.tableData[index]
      this.dialogFormVisible = true
      this.updateType = 2
    },
    change() {
      if (this.form.mailbox === 'QQmail') {
        this.form.mailServerHost = 'smtp.qq.com',
          this.form.mailServerPort = '587',
          this.form.pop3Server = 'pop.qq.com',
          this.form.protocol = 'pop3'
      } else if (this.form.mailbox === '163mail') {
        this.form.mailServerHost = 'smtp.163.com',
          this.form.mailServerPort = '25',
          this.form.pop3Server = 'pop.163.com',
          this.form.protocol = 'pop3'
      } else if (this.form.mailbox === 'Sinamail') {
        this.form.mailServerHost = 'smtp.sina.cn',
          this.form.mailServerPort = '25',
          this.form.pop3Server = 'pop.sina.cn',
          this.form.protocol = 'pop3'
      } else {
        this.form.mailServerHost = 'smtp.gmail.com',
          this.form.mailServerPort = '465',
          this.form.pop3Server = 'pop.gmail.com',
          this.form.protocol = 'pop3'
      }
    },
    async tableDisplay() {
      await this.$axios.get("dept/query", { params: { userId: this.userId } }).then(Response => {
        let res = Response.data
        if (res.total !== 0) {
          this.tableData = res.data
        }
      })
    },
    Update() {
      if (this.checkValidity()) {
        let config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        //验证邮箱
        var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;

        if (myReg.test(this.form.userName)) {
          if (this.updateType === 1) {
            this.$axios.post("dept/add", {
              userId: this.userId,
              mailbox: this.form.mailbox,
              userName: this.form.userName,
              password: this.form.password,
              fromAddress: this.form.userName,
              mailServerHost: this.form.mailServerHost,
              mailServerPort: this.form.mailServerPort,
              pop3Server: this.form.pop3Server,
              protocol: this.form.protocol
            }, config).then(res => {
              if (res.data.msg === "添加成功") {
                this.$message.success({ message: res.data.msg })
                this.tableDisplay()
              } else {
                this.$message.error({ message: res.data.msg })
              }
            }).catch(res => {
              alert(res.data.msg)
            })
          } else {
            this.$axios.put("dept/update", {
              id: this.form.id,
              mailbox: this.form.mailbox,
              userName: this.form.userName,
              password: this.form.password,
              fromAddress: this.form.userName,
              mailServerHost: this.form.mailServerHost,
              mailServerPort: this.form.mailServerPort,
              pop3Server: this.form.pop3Server,
              protocol: this.form.protocol
            }, config).then(res => {
              if (res.data.msg === "更新成功") {
                this.$message.success({ message: res.data.msg })
                this.tableDisplay()
              } else {
                this.$message.error({ message: res.data.msg })
              }
            }).catch(res => {
              alert(res.data.msg)
            })
          }
          this.dialogFormVisible = false
        } else {
          this.$message.error({ message: '邮箱格式错误，请重新输入' })
        }
      }
    },
    Delete(index) {
      this.$confirm('此操作将永久删除该账号，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form = this.tableData[index]
        this.$axios.delete("dept/delete", { params: { id: this.form.id } }).then(res => {
          if (res.data.msg === "删除成功") {
            this.$message.success({ message: res.data.msg })
            this.tableDisplay()
          } else {
            this.$message.error({ message: res.data.msg })
          }
        }).catch(res => {
          alert(res.data.msg)
        })
      }).catch(() => {
        this.$message.info({ message: '取消删除' })
      })
    },
    cancel() {
      this.tableDisplay()
      this.dialogFormVisible = false
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
}
</style>
