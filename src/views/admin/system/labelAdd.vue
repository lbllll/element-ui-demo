<template>
  <div class="bodyBox">
    <el-form ref="form" :model="formData" class="formBox" label-width="80px">
      <p class="title">标签信息</p>

      <el-form-item label="业务类型" v-if="!$route.query.labelInfo" verify prop="labelBusinessType">
        <el-select
          class="formItem"
          v-model="formData.labelBusinessType"
          placeholder="请选择标签业务类型"
          @change="checkLabel"
        >
          <el-option
            v-for="item in labelBusinessTypeList"
            :key="item.labelBusinessType"
            :label="item.name"
            :value="item.labelBusinessType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="父级标签" v-if="!$route.query.labelInfo" verify prop="labelParentTreeCode">
        <div class="header">选择父级标签(不选则是生成一级标签)</div>
        <el-tree
          ref="tree"
          show-checkbox
          :data="labelList"
          node-key="labelTreeCode"
          :props="defaultProps"
          :default-checked-keys="this.curLabelParent"
          :default-expanded-keys="this.curLabelParent"
          @check-change="checkParentLabel"
          :accordion="true"
          check-strictly
        >
        </el-tree>
      </el-form-item>
      <el-form-item label="标签名" prop="labelText" verify>
        <el-input
          class="formItem"
          v-model="formData.labelText"
          maxlength="20"
          placeholder="请设置标签名"
        ></el-input>
        <span class="describe">长度不宜太长，且不能同一级重复</span>
      </el-form-item>

<!--      <el-form-item label="标签描述" v-if="!$route.query.labelInfo" prop="description" verify>
        <el-input
          class="formItem"
          v-model="formData.labelPathText"
          maxlength="20"
          placeholder="标签描述"
        ></el-input>
        <span class="describe">长度不超过xx</span>
      </el-form-item>-->

<!--      <el-form-item verify label="标签图标" prop="icon">
        <p class="describe">提示：本地上传图片大小不能超过2M【图片尺寸比例建议：(1:1)】</p>
        <el-upload
          :action="upImgUrl"
          :data="access_token"
          :show-file-list="false"
          :on-change="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadSuccess"
        >
          <img v-if="icon" :src="icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-input class="inputs none imgArea" v-model="icon"></el-input>
        </el-upload>
      </el-form-item>-->

      <el-form-item label="排序" prop="labelDisplayIndex"  verify>
        <el-input class="formItem" type="number" v-model="formData.labelDisplayIndex" placeholder="排序"></el-input>
        <span class="describe">越大越靠前</span>
      </el-form-item>

      <!--   发布按钮     -->
      <div class="footer">
        <el-button type="primary" @click="addLabel">{{$route.query.labelInfo?'确认修改':'确认添加'}}</el-button>
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
                labelList:[],
                fontList:[
                    {
                        fontId:"1",
                        fontName:"第一个字体名字",
                        fontSize:"第一个字体大小",
                        fontUrl:"第一个字体地址",
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
                ]
            }
        },
        created() {
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
            //添加标签
            addLabel() {
                // console.log(this.formData);
                //组装添加数据：
                //如果userId不为空，那就是修改
                if (this.$route.query.labelInfo) {
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
                                this.$router.go(-1);
                            }, 2000);
                            //跳转到列表
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });

                }
                else {
                    //组装添加数据
                    let data = {
                        parentTreeCode:this.formData.labelParentTreeCode,
                        labelBusinessType:this.formData.labelBusinessType,
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
                            setTimeout(() => {
                                this.$router.go(-1);
                            }, 2000);
                            //跳转到列表
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
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
