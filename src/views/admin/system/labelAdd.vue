<template>
  <div class="bodyBox">
    <el-form ref="form" :model="formData" class="formBox" label-width="80px">
      <p class="title">当前父节点标签：{{this.parentInfo.labelBusinessType==="1"?"分类标签":this.parentInfo.labelBusinessType==="2"?"作品标签":"用户标签"}}
        \{{this.parentInfo.parentInfo ==={}?"":this.parentInfo.parentInfo.labelPathText }}</p>
      <el-form-item label="标签名" prop="labelText" verify>
        <el-input
          class="formItem"
          v-model="formData.labelText"
          maxlength="10"
          placeholder="请设置标签名"
        ></el-input>
        <span class="describe">标签名长度不超过10</span>
      </el-form-item>
      <el-form-item label="排序" prop="labelDisplayIndex"  verify>
        <el-input class="formItem" type="number" v-model="formData.labelDisplayIndex" placeholder="排序"></el-input>
        <span class="describe">序号越大越排前面</span>
      </el-form-item>

      <!--   发布按钮     -->
      <div class="footer">
        <el-button type="primary" @click="addLabel">{{$route.query.labelInfo?'确认修改':'确认添加'}}</el-button>
        <el-button @click="cancelAndBack">取 消</el-button>
        <!--          <el-button type="primary" @click="previewData()">预览</el-button>-->
      </div>
    </el-form>
  </div>
</template>

<script>
    import {
        labelListAll,
        labelAdd,
        labelUpdateText
    } from "@/api/table";

    export default {
        name: "LABEL_ADD",
        components: {},
        props:['message'],
        watch: {
            message(newV,oldV){
                this.parentInfo =JSON.parse(JSON.stringify(newV));
            }
        },
        data() {
            return {
                formData:{
                    labelId:"",
                    labelText:"",
                    labelPathText:"",
                    labelBusinessType:"",
                    labelStatus:"",
                    labelDisplayIndex:"",
                    labelType:"",
                    labelTreeCode:"",
                    labelParentTreeCode:"",
                },
                openAddPage:false,
                cardList:[
                ],
                labelList:[],
                fontList:[
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
                        password: "123456",
                        state: "1",
                        type: "1",
                    },
                    {
                        userId:"2",
                        accountName: "normal",
                        headImageUrl: "头像2",
                        lastLoginTime: "2020-2-3",
                        nickName: "普通用户",
                        password: "123456",
                        state: "2",
                        type: "2",
                    },
                    {
                        userId:"3",
                        accountName: "bl",
                        headImageUrl: "头像3",
                        lastLoginTime: "2020-2-3",
                        nickName: "blblbl",
                        password: "123456",
                        state: "3",
                        type: "3",
                    },
                ],
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
                labelTypeList:[
                    {
                        labelType:"1",
                        name:"贺卡类型"
                    },
                    {
                        labelType:"2",
                        name:"条漫类型"
                    },
                    {
                        labelType:"3",
                        name:"用户类型"
                    },
                ],
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
                parentInfo:{},
            }
        },
        created() {
            this.parentInfo = this.message;

            if (this.$route.query.labelInfo) {
                let labelInfo = this.$route.query.labelInfo;
                this.formData.labelId = labelInfo.labelId;
                this.formData.labelText = labelInfo.labelText;
                //默认选中parentLabel
            }
            //遍历所有标签，进行标签树组装
            labelListAll().then(result => {
                if(result.code == 200){
                    //将数据转为map，以labelTreeCode为标识
                    let map = {};
                    result.data.data.list.forEach( item => {
                        map[item.labelTreeCode] = item
                    });
                    let labelArr = [];
                    //然后遍历，只要当前item存在父标签parent则一直找，找到就设为其子标签
                    result.data.data.list.forEach(item => {
                        let parent = map[item.labelParentTreeCode];
                        if(parent){
                            (parent.child || (parent.child = [])).push(item)
                        }else {
                            //没有父标签，则就是一级标签
                            labelArr.push(item)
                        }
                    });
                    //重组标签树
                    this.labelList = labelArr;
                    // console.log(JSON.stringify(this.labelList))
                }
            }).catch(err => {});
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
                    this.formData.headImg = response.data;
                    this.imageUrl = response.data;
                }
            },
            cancelAndBack(){
                this.formData ={};
                this.$emit('func',this.openAddPage)
            },
            //添加标签
            addLabel() {
                // console.log(this.formData);
                //组装添加数据：
                //如果userId不为空，那就是修改
                if (this.$route.query.labelInfo) {
                    this.$refs['form'].validate((valid) => {
                            if (valid) {
                                //组装数据
                                let data = {
                                    labelId:this.formData.labelId,
                                    labelText:this.formData.labelText,
                                    labelDisplayIndex:this.formData.labelDisplayIndex
                                };
                                //修改 labelUpdateText
                                //编辑
                                labelUpdateText(data).then(res => {
                                    if (res.data.isSuccessful === "Y") {
                                        this.$message({
                                            message: "修改成功！",
                                            type: "success"
                                        });
                                        setTimeout(() => {
                                            this.$router.go(0);
                                        }, 2000);
                                        //跳转到列表
                                    } else {
                                        this.$message.error(res.data.message);
                                    }
                                });
                            }});

                }
                else {
                    this.$refs['form'].validate((valid) => {
                            if (valid) {
                                //组装添加数据
                                let data = {
                                    parentTreeCode:this.parentInfo.parentInfo ==={} ?"-1":this.parentInfo.parentInfo.labelTreeCode,
                                    labelBusinessType:this.parentInfo.labelBusinessType,
                                    labelText:this.formData.labelText,
                                    labelDisplayIndex:this.formData.labelDisplayIndex,
                                };
                                //添加
                                labelAdd(data).then(res => {
                                    if (res.data.isSuccessful === "Y") {
                                        this.$message({
                                            message: "添加成功！",
                                            type: "success"
                                        });
                                        this.$emit('handleFun');
                                        //跳转到列表
                                    } else {
                                        this.$message.error(res.data.message);
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
