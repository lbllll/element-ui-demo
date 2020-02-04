

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 4px;
  overflow: hidden;
}
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
}
.portraitBtn {
  margin-top: 15px;
}
.formBox {
  margin-top: 20px;
  padding-right: 100px;
}
.bodyBox {
  padding-top: 15px;
}
.submitBtn {
  display: block;
  margin-left: 145px;
}
</style>


<template>
  <div class="bodyBox flex-center direction_column">
    <el-upload
      class="avatar-uploader"
      :action="upImgUrl"
      :data="access_token"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <p class="portraitBtn" type="primary">修改头像</p>
    </el-upload>
    <el-form
      class="formBox"
      ref="ruleForm"
      label-position="right"
      label-width="100px"
      :model="formLabelAlign"
    >
      <el-form-item verify prop="name" label="用户名">
        <el-input v-model="formLabelAlign.name" disabled></el-input>
      </el-form-item>
      <el-form-item verify prop="password" label="旧密码">
        <el-input type="password" v-model="formLabelAlign.password"></el-input>
      </el-form-item>
      <el-form-item verify prop="newPassword" label="新密码">
        <el-input type="password" v-model="formLabelAlign.newPassword"></el-input>
      </el-form-item>
      <el-form-item
        :verify="verifyPassword"
        prop="confirmWord"
        :watch="formLabelAlign.newPassword"
        label="确认密码"
      >
        <el-input type="password" v-model="formLabelAlign.confirmWord"></el-input>
      </el-form-item>
      <el-button class="submitBtn" type="primary" @click="submitForm('ruleForm')">提交修改</el-button>
    </el-form>
  </div>
</template>


<script>
import { userInfo, userSetPassword, userSetHeadPath } from "@/api/table";

export default {
  name: "HOME_SETTING",
  data() {
    return {
      imageUrl: "",
      formLabelAlign: {
        name: "",
        password: "",
        newPassword: "",
        confirmWord: ""
      },
      upImgUrl: process.env[this.$base] + "/medias/image/upload",
      access_token: {
        access_token: this.$store.getters.token
      },
      loding: false,
      name: ""
    };
  },
  created() {
    if(window.sessionStorage.getItem('avatar')){
      this.imageUrl = window.sessionStorage.getItem('avatar')
    }
    userInfo()
      .then(res => {
        if (res.code == 200) {
          this.formLabelAlign.name = res.data.userName;
          this.name = res.data.userName;
        }
      })
      .catch(err => {});
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.formLabelAlign.password == this.formLabelAlign.newPassword) {
            this.$message({
              message: "新密码不能与旧密码相同",
              type: "warning"
            });
            return;
          }
          if (this.loding) {
            return;
          }
          this.loding = true;
          var data = JSON.parse(JSON.stringify(this.formLabelAlign));
          delete data.name;
          delete data.confirmWord;
          userSetPassword(data)
            .then(res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$refs[formName].resetFields();
              this.formLabelAlign.name = this.name;
              this.loding = false;
            })
            .catch(err => {
              this.loding = false;
            });
          console.log("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    verifyPassword(rule, val, callback) {
      if (val !== this.formLabelAlign.newPassword)
        callback(Error("两次输入密码不一致!"));
      else callback();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data;
      this.$confirm("此操作将替换账号头像, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          userSetHeadPath({ headPath: this.imageUrl })
            .then(result => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              window.sessionStorage.setItem('avatar',res.data)
              location.reload()
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.imageUrl = "";
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    beforeAvatarUpload(file) {
      var type = "image/jpg,image/jpeg,image/png,image/gif";
      const isJPG = type.indexOf(file.type) != -1;
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG,JPEG,PNG,GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 5MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
