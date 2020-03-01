<template>
  <div class="bodyBox">
    <form  :model="data" >
    </form>
    <div class="header">
      <el-button type="primary" size="small"  @click="openAdd">新增账号</el-button>
    </div>

    <el-table
      :data="usersList"
      border
      style="width: 100%"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column prop="userAccountName" align="center" label="用户名"></el-table-column>
      <el-table-column prop="userNickName" align="center" label="昵称"></el-table-column>
      <el-table-column prop="userHeadImageUrl" align="center" label="头像" width="260">
        <template slot-scope="scope">
          <span>
            <img v-image-preview  :src="scope.row.userHeadImageUrl == null? ' ':scope.row.userHeadImageUrl" width="50" height="50" />
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="address" align="center" label="权限"></el-table-column> -->
      <el-table-column prop="userLastLoginTime" align="center" label="最后登录" width="260">
        <template slot-scope="scope">
          <span>{{scope.row.userLastLoginTime === null ?"还未登录过":$timeUtil.getFormatTime(scope.row.userLastLoginTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用"  align="center" width="260">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.userState"
            :active-value="1"
            :inactive-value="2"
            @change="setStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
<!--          <el-button type="text" @click="checkRoles(scope.row.userId)" size="small">设置角色</el-button>-->
<!--          <router-link  type="primary" round icon="el-icon-edit" :to="{name: 'USER_ADD', query: {id: scope.row.userId}}">
            <el-button type="text" size="small" >编辑</el-button>
          </router-link>-->
          <el-button @click="openEdit(scope.row.userId)"   type="text" size="small">编辑</el-button>
          <el-button @click="delAll(scope.row.userId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


<!--    &lt;!&ndash;  底部操作工具栏  &ndash;&gt;
    <div class="footer flex-between">
      <div>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <el-button type="primary" v-if="!checkItem" size="mini" @click="delAll">删除</el-button>
      </div>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="data.page"
        :page-size="10"
        background
        layout="total, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>-->


    <!--  弹出层设置角色  -->
    <el-dialog
      title="请选择角色"
      :visible.sync="checkRolesShow"
      width="30%"
      :destroy-on-close="true"
      >
      <el-checkbox-group v-model="checkRolesList">
        <div v-for="(item , index) in rolesList" :key="index" >
          <div class="content">
            <el-checkbox :label="item.roleId" :key="item.roleId">{{item.roleName}}</el-checkbox>
          </div>
        </div>
      </el-checkbox-group>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="checkAllRoles" size="mini">全选</el-button>
        <el-button @click="cancelCheckAllRoles" size="mini">取消全选</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkRolesShow = false">取 消</el-button>
        <el-button type="primary" @click="changeRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="新增账号"
      :visible.sync="openAddPage">
      <userAdd :message="this.curUserId" v-if="this.curUserId !== ''" @func="getMsgFormSon"></userAdd>
    </el-dialog>

    <el-dialog
      title="编辑账号"
      :visible.sync="openEditPage">
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

        <el-form-item verify  label="设置头像" prop="userHeadImageUrl">
          <p class="describe">提示：本地上传图片大小不能超过1M【图片尺寸比例建议：(1:1)】</p>
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
<!--        <el-form-item  label="原始密码" prop="userPassword" verify>
          <el-input
            class="formItem"
            v-model="formData.userPassword"
            maxlength="30"
            placeholder="请输入原始密码"
          ></el-input>
          <span class="describe">长度不低于6位</span>
        </el-form-item>-->
        <el-form-item  label="新密码" prop="newPassword" verify>
          <el-input
            class="formItem"
            v-model="formData.newPassword"
            maxlength="20"
            placeholder="请设置新密码"
            type="password"
          ></el-input>
          <span class="describe">长度不低于6位</span>
        </el-form-item>

        <el-form-item label="选择角色" verify  prop="roleIds">
          <el-select
            class="formItem"
            v-model="checkRoles"
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

        <!--   发布按钮     -->
        <div class="footer">
          <el-button type="primary" @click="edit">确认修改</el-button>
          <!--          <el-button type="primary" @click="previewData()">预览</el-button>-->
        </div>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
    import {
        userList,
        userState,
        roleList,
        userDelete,
        userInfo,
        userUpdate,
        userInfoAndRoles
    } from "@/api/table";
    import userAdd from "./userAdd";
    export default {
        name: "USERS_LIST",
        components: {userAdd},
        data() {
            return {
                data:{
                    page: 1
                },
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
                usersList: [],
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
                checkRolesShow: false,
                checkRolesList:[],//绑定角色选择列表
                //当前用户角色列表，用于渲染
                curUserRolesList:[],
                count: 10,
                multipleSelection: [],
                //分页
                isIndeterminate: false,
                checkAll: false,
                curUserInfo:{},
                /*弹出新增页面*/
                openAddPage:false,
                //当前用户id
                curUserId:'',
                /*弹出编辑页面*/
                openEditPage:false,
                userHeadImageUrl:"",
                //上传图片所需
                upImgUrl: process.env[this.$base] + "/medias/image/upload",
                access_token: {
                    access_token: this.$store.getters.token
                },
                checkRoles:[],

            }
        },
        props: {
            checkItem: Boolean,
            selectArr: Array
        },
        created() {

            this.init();
        },
        methods: {
            init(){
                //获取用户信息，加载表格数据
                let data = JSON.parse(JSON.stringify(this.data));
                data.page --;
                userList(data).then(result => {
                    if(result.code == 200){
                        this.usersList = result.data.data;
                        this.count = result.data.data.length;
                        // console.log(JSON.stringify(this.usersList))
                    }
                }).catch(err => {});
                //获取角色列表，用于设置角色
                roleList().then(res => {
                    if(res.data.isSuccessful === "Y"){
                        this.rolesList = res.data.data;
                        // console.log(JSON.stringify(this.rolesList))
                    }else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {});
            },
            //修改状态
            setStatus(userInfo) {
                userState({ userId: userInfo.userId, state: parseInt(userInfo.userState) })
                    .then(res => {
                        if (res.data.isSuccessful === "Y") {
                            this.$message({
                                message: "操作成功",
                                type: "success"
                            });
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                    .catch(err => {
                        this.$message.error(err);
                    });
            },
            //设置角色
            changeRole() {
                //组装选择的角色数据
                console.log(this.checkRolesList);
                let roles  = "";
                for (let i=0 ;i< this.checkRolesList.length ;i++){
                    if(i===0){
                        roles += this.checkRolesList[i]
                    }else {
                        roles += ','+this.checkRolesList[i]
                    }
                }
                console.log(roles);
                //todo  修改角色
                //todo 修改完之后将弹出层关闭 或者重加载列表
                this.checkRolesShow = false;
            },
            checkAllRoles() {
              //将checkRolesList赋值\
                let list = [];
                this.rolesList.forEach(e => {
                    list.push(e.roleId)
                });
                this.checkRolesList = list;
            },
            cancelCheckAllRoles() {
                this.checkRolesList = [];
            },
            // handleClose(done) {
            //   this.$confirm('确认关闭？')
            //       .then( e => {
            //           done();
            //       })
            //       .catch(e => {});
            // }
            //监听选择的内容
            handleSelectionChange(val) {
                //val 为选中数据的集合
                this.multipleSelection = val;
                console.log(this.multipleSelection)
            },
            //加载第几页
            handleCurrentChange(val) {
                this.data.page = val;
                //修改页数，重新加载
                this.init();
            },
            //右下按钮全选，切换保证和表格的全选一致
            handleCheckAllChange(val) {
                if (this.checkAll) {
                    this.$refs.multipleTable.toggleAllSelection();
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
                this.isIndeterminate = false;
            },
            //批量删除
            delAll(rowKey) {
                //是字符串类型则就是 rowKey
                if(typeof(rowKey) =='string'){
                    this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then( () => {
                        userDelete(rowKey).then(res => {
                            console.log(res);
                            if (res.code == 200) {
                                this.$message({
                                    message: "删除成功",
                                    type: "success"
                                });
                                setTimeout(() => {
                                    this.init();
                                }, 2000);
                                //跳转到列表
                            } else {
                                this.$message.error(res.description);
                            }
                        }).catch(err => {console.log("错误了")});
                    }).catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
                }else {
                    //不是字符串类型是对象类型
                    console.log(this.multipleSelection);

                }
                //todo 组装keys，调用删除接口
            },
            /*打开资源编辑弹出层*/
            openAdd(userId){
                //有则是修改
                if(userId){
                    this.curUserId = userId;
                }else {
                    console.log("yy")
                }
                this.openAddPage = true;
            },
            /*打开编辑页面*/
            openEdit(userId){
                this.curUserId = userId;
                //查询用户信息,并赋值
                userInfoAndRoles({userId:userId}).then(res => {
                    if(res.code == 200){
                        console.log(JSON.stringify(res));
                        this.formData = res.data.data.userInfo;
                        this.userHeadImageUrl = res.data.data.userInfo.userHeadImageUrl
                        this.checkRoles = res.data.data.roles
                    }
                }).catch(err => {});
                this.openEditPage = true;
            },
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
            getMsgFormSon(data){
                this.openAddPage = data;
            },
            checkRole() {
                this.formData.roleIds = this.checkRoles;
                console.log(this.formData.roleIds===[]?'':this.formData.roleIds.join(","));
            },
            edit(){
                //修改
                this.formData.userId = this.curUserId;
                //组装修改所需参数
                let data = {
                    userId:this.formData.userId,
                    headPath:this.formData.userHeadImageUrl,
                    userNickName:this.formData.userNickName,
                    password:this.formData.userPassword,
                    newPassword: this.formData.newPassword,
                    roleIds:this.checkRoles===[]?'':this.checkRoles.join(","),
                };
                console.log(data);
                // return false;
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
            },
        },
    }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .header {
    margin-top: 20px;
    margin-bottom: 20px;
    .inputs {
      width: 260px;
      margin-right: 20px;
    }
    .times {
      width: 320px;
      margin-right: 20px;
    }
  }
  .content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 6px;
    .el-checkbox {
      width: 160px;
      padding: 6px 0;
    }
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
