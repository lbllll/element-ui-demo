

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.header {
  height: 50px;
  display: flex;
  align-items: center;
}
.table_header {
  background-color: #f5f5f5 !important;
}
</style>


<template>
  <div class="bodyBox">
    <div class="header">
      <el-button type="primary" @click="showWin()">添加成员</el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%" header-row-class-name="table_header">
      <el-table-column prop="nickName" align="center" label="员工姓名"></el-table-column>
      <el-table-column prop="userName" align="center" label="登陆账号" width="260"></el-table-column>
      <!-- <el-table-column prop="address" align="center" label="权限"></el-table-column> -->
      <el-table-column prop="lastLoginTime" align="center" label="最后登录" width="260"></el-table-column>
      <el-table-column label="是否启用" align="center" width="260">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="ENABLED"
            inactive-value="DISABLED"
            @change="setStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button @click="settings(scope.row.userId)" type="text" size="small">权限设置</el-button>
          <el-button @click="editMember(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="delUser(scope.row.userId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="addMember" width="30%" center>
      <el-form
        class="formBox"
        ref="ruleForm"
        label-position="right"
        label-width="100px"
        :model="formLabelAlign"
      >
        <el-form-item verify prop="nickName" label="姓名">
          <el-input v-model="formLabelAlign.nickName"></el-input>
        </el-form-item>
        <el-form-item verify prop="userName" label="登陆账号">
          <el-input type="text" v-model="formLabelAlign.userName"></el-input>
        </el-form-item>
        <el-form-item v-if="title=='添加成员'" verify prop="roleId" label="所属部门">
          <el-select v-model="formLabelAlign.roleId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.roleId"
              :label="item.description"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item verify prop="password" label="登陆密码">
          <el-input type="password" v-model="formLabelAlign.password"></el-input>
        </el-form-item>
        <el-form-item
          :verify="verifyPassword"
          prop="confirmWord"
          :watch="formLabelAlign.password"
          label="确认密码"
        >
          <el-input type="password" v-model="formLabelAlign.confirmWord"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="submitBtn"
            type="primary"
            @click="submitForm('ruleForm')"
          >{{title=='添加成员'?'立即提交':'确认修改'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
import {
  userList,
  userSetStatus,
  userAdd,
  userUpdate,
  userDelete,
  roleList
} from "@/api/table";

export default {
  name: "HOME_ACCOUNT_LIST",
  data() {
    return {
      addMember: false,
      tableData: [],
      formLabelAlign: {
        nickName: "",
        userName: "",
        roleId: "",
        password: "",
        confirmWord: "",
        userId: ""
      },
      options: [],
      title: "添加成员",
      loding: false
    };
  },
  created() {
    roleList()
      .then(res => {
        this.options = res.data;
      })
      .catch(err => {});
    this.getList();
  },
  methods: {
    getList() {
      userList()
        .then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
          }
        })
        .catch(err => {});
    },
    setStatus(row) {
      userSetStatus({ userId: row.userId, status: row.status })
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
          } else {
            this.$message.error(res.description);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.loding) {
            return;
          }
          this.loding = true;
          var data = JSON.parse(JSON.stringify(this.formLabelAlign));
          var self = this;
          if (this.title == "添加成员") {
            delete data.userId;
          } else {
            delete data.roleId;
          }
          delete data.confirmWord;
          function thens(res) {
            if (res.code == 200) {
              self.$message({
                message: "操作成功",
                type: "success"
              });
              self.addMember = false;
              self.$refs[formName].resetFields();
            } else {
              self.$message.error(res.description);
            }
            self.loding = false;
            self.getList();
          }
          if (this.title == "添加成员") {
            userAdd(data)
              .then(res => {
                thens(res);
              })
              .catch(err => {
                this.$message.error(err);
                this.loding = false;
              });
          } else {
            userUpdate(data)
              .then(res => {
                thens(res);
              })
              .catch(err => {
                this.$message.error(err);
                this.loding = false;
              });
          }
        } else {
          console.log("error submit!!");
          this.loding = false;
          return false;
        }
      });
    },
    delUser(id) {
      this.$confirm("此操作将永久删除该成员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          userDelete({ userId: id })
            .then(res => {
              if (res.code == 200) {
                this.getList();
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
              } else {
                this.$message.error(res.description);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    showWin() {
      this.addMember = true;
      var self = this;
      setTimeout(() => {
        self.$refs["ruleForm"].resetFields();
        self.title = "添加成员";
      }, 0);
    },
    editMember(e) {
      this.addMember = true;
      var self = this;
      setTimeout(() => {
        self.$refs["ruleForm"].resetFields();
        self.formLabelAlign.nickName = e.nickName;
        self.formLabelAlign.userName = e.userName;
        self.formLabelAlign.userId = e.userId;
        self.title = "编辑成员";
      }, 0);
    },
    settings(id) {
      this.$router.push({ name: "HOME_AUTH_LIST", query: { id: id } });
    },
    verifyPassword(rule, val, callback) {
      if (val !== this.formLabelAlign.password)
        callback(Error("两次输入密码不一致!"));
      else callback();
    }
  }
};
</script>
