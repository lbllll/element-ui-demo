<template>
  <div class="bodyBox">
    <el-form ref="form" :model="formData" class="formBox" label-width="80px">
<!--      <p class="title">用户信息</p>-->

      <el-form-item label="用户昵称" prop="userNickName" verify>
        <el-input
          class="formItem"
          v-model="formData.userNickName"
          maxlength="20"
          placeholder="请设置昵称"
        ></el-input>
        <span class="describe">长度不超过30</span>
      </el-form-item>

      <el-form-item verify v-if="this.curUserId" label="设置头像" prop="userHeadImageUrl">
        <p class="describe">提示：本地上传图片大小不能超过2M【图片尺寸比例建议：(1:1)】</p>
        <el-upload
          :action="upImgUrl"
          :data="access_token"
          :show-file-list="false"
          :on-change="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadSuccess"
        >
          <img v-if="userHeadImageUrl" :src="userHeadImageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-input class="inputs none imgArea" v-model="formData.userHeadImageUrl"></el-input>
        </el-upload>
      </el-form-item>

      <el-form-item label="账号" v-if="!this.curUserId" prop="userAccountName" verify>
        <el-input
          class="formItem"
          v-model="formData.userAccountName"
          maxlength="20"
          placeholder="请设置账号"
        ></el-input>
        <span class="describe">长度不超过20</span>
      </el-form-item>

      <el-form-item label="登录密码" v-if="!this.curUserId" prop="userPassword" verify>
        <el-input
          class="formItem"
          v-model="formData.userPassword"
          maxlength="20"
          placeholder="请设置密码"
          type="password"
        ></el-input>
        <span class="describe">长度不低于6位</span>
      </el-form-item>

      <el-form-item label="选择角色" verify  prop="roleIds">
        <el-select
          class="formItem"
          v-model="formData.roleIds"
          prop="roleIds"
          placeholder="选择角色"
          size="small"
          multiple
          @change="checkRole"
        >
          <el-option
            v-for="item in rolesList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="this.curUserId" label="新密码" prop="newPassword" verify>
        <el-input
          class="formItem"
          v-model="formData.newPassword"
          maxlength="20"
          placeholder="请设置新密码"
          type="password"
        ></el-input>
        <span class="describe">长度不低于6位</span>
      </el-form-item>

      <!--   发布按钮     -->
      <div class="footer">
        <el-button type="primary" @click="addUser">{{$route.query.id?'确认修改':'确认添加'}}</el-button>
        <el-button  @click="cancelAdd">取 消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
    import {
        userInfo,
        userAdd,
        userUpdate,
        roleList
    } from "@/api/table";
    export default {
        name: "USER_ADD",
        components: {},
        data() {
            return {
                formData:{
                    userId:"",
                    userAccountName: "",
                    userHeadImageUrl: "",
                    userLastLoginTime: "",
                    userNickName: "",
                    userPassword: "",
                    userState: "",
                    userType: "",
                    newPassword:"",
                    roleIds:""//测试用的角色id
                },
                openAddPage:false,
                curUserId:'',
                labelList:[],
                cardTypeList:[
                    {
                        cardType:"heka",
                        name:"贺卡",
                    },
                    {
                        cardType:"chahua",
                        name:"插画",
                    },
                    {
                        cardType:"tiaoman",
                        name:"条漫",
                    }
                ],
                cardStatusList:{
                    in:"上架",
                    out:"下架",
                },
                userList: [
                    {
                        userId:"1",
                        accountName: "admin",
                        headImageUrl: "头像1",
                        lastLoginTime: "2020-2-3",
                        nickName: "管理员",
                        userPassword: "123456",
                        state: "1",
                        type: "1",
                    },
                    {
                        userId:"2",
                        accountName: "normal",
                        headImageUrl: "头像2",
                        lastLoginTime: "2020-2-3",
                        nickName: "普通用户",
                        userPassword: "123456",
                        state: "2",
                        type: "2",
                    },
                    {
                        userId:"3",
                        accountName: "bl",
                        headImageUrl: "头像3",
                        lastLoginTime: "2020-2-3",
                        nickName: "blblbl",
                        userPassword: "123456",
                        state: "3",
                        type: "3",
                    },
                ],
                rolesList:[],
                usersType:{
                    "1":"用户类型1",
                    "2":"用户类型2",
                    "3":"用户类型3",
                },
                usersState:{
                    "1":"启用",
                    "2":"禁用",
                },
                roleType: {
                    "1":"超级管理员",
                    "2":"运营人员",
                    "3":"平台创作者",
                },
                //上传图片所需
                upImgUrl: process.env[this.$base] + "/medias/image/upload",
                access_token: {
                    access_token: this.$store.getters.token
                },
                userHeadImageUrl:"",
                curUserInfo:'',
            }
        },
        props: ['message',],
/*        watch: {
            message: function (newVal) {
                console.log(newVal)
                this.curUserId = newVal;//newVal就是获取的动态新数据，赋值给newdata
            },
        },*/
        created() {
            //获取角色列表，用于设置角色
            roleList().then(res => {
                if(res.data.isSuccessful === "Y"){
                    this.rolesList = res.data.data;
                    // console.log(JSON.stringify(this.rolesList))
                }else {
                    this.$message.error(res.data.message);
                }
            }).catch(err => {});
            //如果有请求参数那么就是用户信息编辑，需要查询对应用户信息
            if (this.curUserId) {
                let uid = this.curUserId;
                userInfo({userId:uid}).then(res => {
                    if(res.code == 200){
                        console.log(JSON.stringify(res));
                        this.formData = res.data.data;
                        this.userHeadImageUrl = res.data.data.userHeadImageUrl
                    }
                }).catch(err => {});
            }
            console.log(this.upImgUrl);
        },
        methods: {
            //上传图片
            handleAvatarSuccess(file, fileList) {},
            beforeAvatarUpload(file) {
                var type = "image/jpg,image/jpeg,image/png,image/gif";
                const isJPG = type.indexOf(file.type) != -1;
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error("上传图片只能是 JPG,JPEG,PNG,GIF 格式!");
                }
                if (!isLt2M) {
                    this.$message.error("上传图片大小不能超过 2MB!");
                }
                return isJPG && isLt2M;
            },
            uploadSuccess(response, file, fileList) {
                if (response.code == "200") {
                    this.formData.userHeadImageUrl = response.data.fileUrl;
                    this.userHeadImageUrl = response.data.fileUrl;
                }
            },
            checkRole() {
                console.log(this.formData.roleIds===[]?'':this.formData.roleIds.join(","));
            },
            //添加用户
            addUser() {
                //如果userId不为空，那就是修改
                if (this.curUserId) {
                    this.$refs['form'].validate((valid) => {
                        if(valid) {
                            //修改
                            this.formData.userId = this.curUserId;
                            //组装修改所需参数
                            let data = {
                                userId:this.formData.userId,
                                headPath:this.formData.userHeadImageUrl,
                                userNickName:this.formData.userNickName,
                                password:this.formData.userPassword,
                                newPassword: this.formData.newPassword
                            };
                            userUpdate(data).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        message: "修改成功",
                                        type: "success"
                                    });
                                    setTimeout(() => {
                                        this.$router.go(0);
                                    }, 2000);
                                    //跳转到列表
                                } else {
                                    this.$message.error(res.description);
                                }
                            })
                        }});
                    //组装添加数据：
                }
                else {
                    this.$refs['form'].validate((valid) => {
                            if(valid) {
                                //组装新增数据用户信息
                                let data = {
                                    userName:this.formData.userAccountName,
                                    password:this.formData.userPassword,
                                    userNickName:this.formData.userNickName,
                                    roleIds:this.formData.roleIds===[]?'':this.formData.roleIds.join(","),
                                };
                                userAdd(data).then( res => {
                                    if (res.code == 200) {
                                        this.$message({
                                            message: "新增成功",
                                            type: "success"
                                        });
                                        setTimeout(() => {
                                            this.$router.go(0);
                                        }, 2000);
                                        //跳转到列表
                                    } else {
                                        this.$message.error(res.description);
                                    }
                                });
                                //增加
                            }});

                }

            },
            cancelAdd(){
                this.$emit('func',this.openAddPage)
            },
        },
    }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .bodyBox {
  }
  .bodyBox >.title {
    margin: 15px 0;
    font-weight: bold;
    color: #333;
  }
  .formBox {
    margin-top: 15px;
  }
  .formBox .title {
    margin: 15px 0;
    font-weight: bold;
    color: #333;
  }
  .formItem {
    width: 360px;
  }
  .describe {
    color: #999;
    margin-left: 10px;
  }
  .footer {
    margin-top: 20px;
  @include flex-center;
  }
</style>
