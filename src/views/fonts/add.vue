<template>
  <div class="bodyBox">
    <el-form ref="form" :model="formData" class="formBox" label-width="80px">
      <p class="title">系统字体信息</p>

      <el-form-item label="字体名" prop="fontName" verify>
        <el-input
          class="formItem"
          v-model="formData.fontName"
          maxlength="20"
          placeholder="请设置字体名"
        ></el-input>
      </el-form-item>

      <el-form-item label="字体文件" prop="fontUrl" verify>
        <el-upload
          :action="uploadUrl"
          :data="access_token"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
<!--          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> upload-demo-->
        </el-upload>
      </el-form-item>


      <el-form-item label="字体大小" prop="fontSize" verify>
        <el-input class="formItem" type="number" v-model="formData.fontSize" placeholder="设置字体大小"></el-input>
      </el-form-item>


      <!--   发布按钮     -->
      <div class="footer">
        <el-button type="primary" @click="addFont">{{$route.query.id?'确认修改':'确认添加'}}</el-button>
        <!--          <el-button type="primary" @click="previewData()">预览</el-button>-->
      </div>
    </el-form>
  </div>
</template>

<script>
    export default {
        name: "fontAdd",
        components: {},
        data() {
            return {
                formData:{
                    fontId:"",
                    fontName:"",
                    fontSize:"",
                    fontUrl:"",
                },
                cardList:[
                    {
                        cardId:"1",
                        categoryId:"1",
                        createTime:"2020-20-2",
                        isDeleted:"N",
                        updateTime:"2020-20-3",
                        cardType:"heka",
                        cardName:"贺卡1",
                        memberId:"老王id",
                        nickName:"老王名字",
                        headPath:"头像",
                        cardImagePath:"贺卡图片地址",
                        status:"in",
                        labelIds:"1,2,3",
                        labels:"1,2,3",
                        authorRemark:"作者备注",
                        musicId:"音乐关联id",
                        cardWord:"祝福语",
                        markerId:"标记图片id",
                        coverUrl:"封面图地址",
                        fontId:"字体id"
                    },
                    {
                        cardId:"2",
                        categoryId:"2",
                        createTime:"2020-20-2",
                        isDeleted:"N",
                        updateTime:"2020-20-3",
                        cardType:"chahua",
                        cardName:"贺卡2",
                        memberId:"老李id",
                        nickName:"老李",
                        headPath:"老李头像",
                        cardImagePath:"贺卡图片地址",
                        status:"out",
                        labelIds:"1,2,3",
                        labels:"1,2,3",
                        authorRemark:"作者备注",
                        musicId:"音乐关联id",
                        cardWord:"祝福语",
                        markerId:"标记图片id",
                        coverUrl:"封面图地址",
                        fontId:"字体id"
                    },
                    {
                        cardId:"3",
                        categoryId:"1",
                        createTime:"2020-20-2",
                        isDeleted:"N",
                        updateTime:"2020-20-3",
                        cardType:"heka",
                        cardName:"贺卡3",
                        memberId:"老张id",
                        nickName:"老张",
                        headPath:"老张头像",
                        cardImagePath:"贺卡图片地址",
                        status:"in",
                        labelIds:"1,2",
                        labels:"1,2",
                        authorRemark:"作者备注",
                        musicId:"音乐关联id",
                        cardWord:"祝福语",
                        markerId:"标记图片id",
                        coverUrl:"封面图地址",
                        fontId:"字体id"
                    },
                ],
                labelList:[
                    {
                        labelId:"1",
                        parentLabelId:"-1",
                        labelType:"心意类型",
                        name:"祝福标签",
                        description:"祝福标签的描述",
                        icon:"图标地址",
                        sort:"0",
                        createTime:"2020-20-3",
                        updateTime:"2020-20-3",
                        isDeleted:"N",
                    },
                    {
                        labelId:"2",
                        parentLabelId:"-1",
                        labelType:"心意类型",
                        name:"幽默",
                        description:"祝福标签的描述",
                        icon:"图标地址",
                        sort:"2",
                        createTime:"2020-20-3",
                        updateTime:"2020-20-3",
                        isDeleted:"N",
                    },
                    {
                        labelId:"3",
                        parentLabelId:"-1",
                        labelType:"心意类型",
                        name:"春节",
                        description:"祝福标签的描述",
                        icon:"图标地址",
                        sort:"3",
                        createTime:"2020-20-3",
                        updateTime:"2020-20-3",
                        isDeleted:"N",
                    },
                    {
                        labelId:"4",
                        parentLabelId:"-1",
                        labelType:"心意类型",
                        name:"浪漫",
                        description:"祝福标签的描述",
                        icon:"图标地址",
                        sort:"4",
                        createTime:"2020-20-3",
                        updateTime:"2020-20-3",
                        isDeleted:"N",
                    },
                ],
                fontList:[
                    {
                        fontId:"1",
                        fontName:"第一个字体名字",
                        fontSize:"第一个字体大小",
                        fontUrl:"第一个字体地址",
                    },
                ],
                categoryList:[
                    {
                        categoryId:"1",
                        prentId:"-1",
                        name:"第一个种类名字",
                        icon:"第一个种类图标",
                        description:"描述",
                        createTime:"2020-20-3",
                        updateTime:"2020-20-3",
                        isDeleted:"N",
                        sort:"0",
                    },
                ],
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
                roleTypeList: [
                    {
                        roleType:"1",
                        name:"超级管理员",
                    },
                    {
                        roleType:"2",
                        name:"运营人员",
                    },
                    {
                        roleType:"3",
                        name:"平台创作者",
                    },

                ],
                roleType: {
                    "1":"超级管理员",
                    "2":"运营人员",
                    "3":"平台创作者",
                },
                //上传文件所需
                uploadUrl: process.env[this.$base] + "/medias/image/upload",
                access_token: {
                    access_token: this.$store.getters.token
                },
                userHeadImageUrl:"",
                fileList:[],
            }
        },
        created() {},
        methods: {
            //选择角色类型
            checkRoleType() {
                console.log(this.formData.roleType)
            },
            //新增编辑角色
            addFont() {
                //如果有roleId则是，修改
                if(this.$route.query.id){
                    //赋值
                    this.formData.fontId = this.$route.query.id;
                    //todo 修改
                    console.log(this.formData)
                }
                else {
                    //删除roleId字段
                    delete this.formData.fontId;
                    //todo 添加
                    console.log(this.formData)
                    // 成功条转到上一页面 this.$router.go(-1);
                }
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
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
