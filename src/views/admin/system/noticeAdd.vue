<template>
  <div class="bodyBox">
    <el-form ref="form" :model="formData" class="formBox" label-width="80px">

      <el-form-item label="通知标题" prop="noticeTitle" verify>
        <el-input
          class="formItem"
          v-model="formData.noticeTitle"
          maxlength="20"
          placeholder="请设置通知标题"
        ></el-input>
      </el-form-item>

      <el-form-item verify  label="设置图标" prop="iconUrl">
        <p class="describe">提示：本地上传图片大小不能超过1M</p>
        <el-upload
          :action="upImgUrl"
          :data="access_token"
          :show-file-list="false"
          :on-change="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadSuccessIcon"
        >
          <img v-if="iconUrl" :src="iconUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-input class="inputs none imgArea" v-model="formData.iconUrl"></el-input>
        </el-upload>
      </el-form-item>

      <el-form-item verify  label="设置内容图片" prop="iconUrl">
        <p class="describe">提示：本地上传图片大小不能超过1M</p>
        <el-upload
          :action="upImgUrl"
          :data="access_token"
          :show-file-list="false"
          :on-change="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadSuccessDetailUrl"
        >
          <img v-if="detailUrl" :src="detailUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-input class="inputs none imgArea" v-model="formData.detailUrl"></el-input>
        </el-upload>
      </el-form-item>

      <!--   发布按钮     -->
      <div class="footer">
        <el-button type="primary" @click="addNotice">{{$route.query.noticeInfo?'确认修改':'确认添加'}}</el-button>
        <el-button @click="cancelAndBack">取  消</el-button>
        <!--          <el-button type="primary" @click="previewData()">预览</el-button>-->
      </div>
    </el-form>
  </div>
</template>

<script>
    import {
        noticeAdd
    } from "@/api/table";

    export default {
        name: "NOTICE_ADD",
        components: {},
        data() {
            return {
                formData:{
                    noticeTitle:"",
                    iconUrl:"",
                    detailUrl:"",
                },
                openAddPage:false,
                cardList:[],
                labelList:[],
                fontList:[],
                rolesList:[
                    {
                        roleId:"1",
                        roleName:"超级管理员",
                        roleDesc:"超级管理员",
                        roleType:"1",
                        createTime:"2020-02-02",
                        isDeleted:"1",
                    },
                    {
                        roleId:"2",
                        roleName:"运营人员",
                        roleDesc:"运营人员",
                        roleType:"2",
                        createTime:"2020-02-02",
                        isDeleted:"1",
                    },
                    {
                        roleId:"3",
                        roleName:"平台创作者",
                        roleDesc:"平台创作者",
                        roleType:"3",
                        createTime:"2020-02-02",
                        isDeleted:"1",
                    },
                ],
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
                labelTypes: {
                    "1":"标签类型1" ,
                    "2":"标签类型2" ,
                    "3":"标签类型3" ,
                    "4":"标签类型3" ,
                },
                labelTypeList:[],
                icon:"",
                //上传图片所需
                upImgUrl: process.env[this.$base] + "/medias/image/upload",
                access_token: {
                    access_token: this.$store.getters.token
                },
                userHeadImageUrl:"",
                labelListTree:[],
                //树形所需
                defaultProps: {
                    children: "child",
                    label: "labelText"
                },
                //查询出当前标签的父节点
                curLabelParent:[],
                //选中父节点
                checkParentLabelId:"",
                //标签业务类型
                labelBusinessTypeList:[
                    {
                        labelBusinessType:1,
                        name:"作品"
                    },
                    {
                        labelBusinessType:2,
                        name:"用户"
                    },
                ],
                iconUrl:"",
                detailUrl:"",
            }
        },
        created() {},
        methods: {
            //上传图片
            handleAvatarSuccess(file, fileList) {},
            beforeAvatarUpload(file) {
                var type = "image/jpg,image/jpeg,image/png,image/gif";
                const isJPG = type.indexOf(file.type) != -1;
                const isLt1M = file.size / 1024 / 1024 < 1;

                if (!isJPG) {
                    this.$message.error("上传图片只能是 JPG,JPEG,PNG,GIF 格式!");
                }
                if (!isLt1M) {
                    this.$message.error("上传图片大小不能超过 1MB!");
                }
                return isJPG && isLt2M;
            },
            uploadSuccessIcon(response, file, fileList) {
                if (response.code == "200") {
                    this.formData.iconUrl = response.data.fileUrl;
                    this.iconUrl = response.data.fileUrl;
                }
            },
            uploadSuccessDetailUrl(response, file, fileList) {
                if (response.code == "200") {
                    this.formData.detailUrl = response.data.fileUrl;
                    this.detailUrl = response.data.fileUrl;
                }
            },
            //添加标签
            addNotice() {
                // console.log(this.formData);
                //组装添加数据：
                //如果userId不为空，那就是修改
                if (this.$route.query.noticeInfo) {
                    //组装数据
                    //修改
                }
                else {
                    this.$refs['form'].validate((valid) => {
                            if (valid) {
                                //组装添加数据
                                let data = {
                                    noticeTitle:this.formData.noticeTitle,
                                    iconUrl:this.formData.iconUrl,
                                    detailUrl:this.formData.detailUrl,
                                };
                                //添加
                                noticeAdd(data).then(res => {
                                    if (res.code == "200") {
                                        this.$message({
                                            message: "添加成功！",
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
                            }});

                }

            },
            checkLabel() {
                console.log(this.formData.labelBusinessType)
            },
            //选则父标签
            checkParentLabel(item,node,self) {
                //共三个参数，依次为：item:data属性的数组中该节点所对应的对象、node:节点本身是否被选中、self:节点的子树中是否有被选中的节点(感觉永远为false)
                //需要两个事件同时作用，才可达到单选
                if(node){
                    this.$refs.tree.setCheckedKeys([item.labelTreeCode]);
                    this.checkParentLabelId = this.$refs.tree.getCheckedKeys();
                    this.checkParentLabelId = item.labelTreeCode;
                    console.log(this.checkParentLabelId)
                }
                else {
                    this.checkParentLabelId = this.$refs.tree.getCheckedKeys();
                    if(this.checkParentLabelId.length === 0){
                        //不选则是一级
                        this.checkParentLabelId = -1;
                    }
                }
                //赋值
                this.formData.labelParentTreeCode = this.checkParentLabelId;
            },
            cancelAndBack(){
                this.formData ={};
                this.$emit('func',this.openAddPage)
            }
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
