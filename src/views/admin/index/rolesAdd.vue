<template>
  <div class="bodyBox">
    <el-form ref="form" :model="formData" class="formBox" label-width="80px">
      <p class="title">角色信息</p>

      <el-form-item label="角色名" v-if="!$route.query.id" prop="roleName" verify>
        <el-input
          class="formItem"
          v-model="formData.roleName"
          maxlength="20"
          placeholder="请设置角色名"
        ></el-input>
        <span class="describe">长度不超过xx</span>
      </el-form-item>

      <el-form-item label="描述" v-if="!$route.query.id" prop="roleDesc" verify>
        <el-input
          class="formItem"
          v-model="formData.roleDesc"
          maxlength="20"
          placeholder="请设置角色描述"
        ></el-input>
        <span class="describe">长度不超过50</span>
      </el-form-item>

      <el-form-item label="分配权限" prop="moduleIds" verify>
        <el-tree
          ref="tree"
          :data="modules"
          show-checkbox
          node-key="moduleId"
          :props="defaultProps"
          :default-checked-keys="curUserPermissions"
          :default-expanded-keys="curUserPermissions"
          @check-change="handleCheckChange"
        >

        </el-tree>

        <div style="margin-top: 20px">
          <el-button type="primary" @click="checkAllTree" size="mini">全选</el-button>
          <el-button @click="cancelAllTree" size="mini">取消全选</el-button>
        </div>
      </el-form-item>


<!--      <el-form-item label="角色类型" verify prop="roleType">
        <el-select
          class="formItem"
          v-model="formData.roleType"
          placeholder="请选择角色类型"
          @change="checkRoleType"
        >
          <el-option
            v-for="item in roleTypeList"
            :key="item.roleType"
            :label="item.name"
            :value="item.roleType"
          ></el-option>
        </el-select>
      </el-form-item>-->

      <!--   发布按钮     -->
      <div class="footer">
        <el-button type="primary" @click="addRole">{{$route.query.id?'确认修改':'确认添加'}}</el-button>
        <!--          <el-button type="primary" @click="previewData()">预览</el-button>-->
      </div>
    </el-form>
  </div>
</template>

<script>
    import {
        roleAdd,
        roleUpdate,
        moduleList
    } from "@/api/table";
    export default {
        name: "ROLES_ADD",
        components: {},
        data() {
            return {
                formData:{
                    roleId:"",
                    roleName:"",
                    roleDesc:"",
                    moduleIds:"",
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
                        labelId:"100",
                        parentLabelId:"-1",
                        labelType:"1",
                        name:"祝福标签",
                        description:"祝福标签的描述",
                        icon:"图标地址",
                        sort:"0",
                        createTime:"2020-20-3",
                        updateTime:"2020-20-3",
                        isDeleted:"N",
                        state:"1",
                        child:[
                            {
                                labelId:"100100",
                                parentLabelId:"100",
                                labelType:"2",
                                name:"祝福二级标签",
                                description:"祝福二级描述",
                                icon:"图标地址",
                                sort:"0",
                                createTime:"2020-20-3",
                                updateTime:"2020-20-3",
                                isDeleted:"N",
                                state:"1",
                                child:[
                                    {
                                        labelId:"100100100",
                                        parentLabelId:"100100",
                                        labelType:"1",
                                        name:"祝福三级标签",
                                        description:"祝福三级标签描述",
                                        icon:"图标地址",
                                        sort:"0",
                                        createTime:"2020-20-3",
                                        updateTime:"2020-20-3",
                                        isDeleted:"N",
                                        state:"1",
                                        child:[]
                                    },
                                ]
                            },
                            {
                                labelId:"100101",
                                parentLabelId:"100",
                                labelType:"2",
                                name:"祝福二级标签2",
                                description:"祝福二级标签2的新描述",
                                icon:"图标地址",
                                sort:"0",
                                createTime:"2020-20-3",
                                updateTime:"2020-20-3",
                                isDeleted:"N",
                                state:"1",
                                child:[]
                            },
                        ]
                    },
                    {
                        labelId:"101",
                        parentLabelId:"-1",
                        labelType:"2",
                        name:"幽默",
                        description:"幽默标签的描述",
                        icon:"图标地址",
                        sort:"2",
                        createTime:"2020-20-3",
                        updateTime:"2020-20-3",
                        isDeleted:"N",
                        state:"1",
                        child:[
                            {
                                labelId:"101100",
                                parentLabelId:"101",
                                labelType:"1",
                                name:"祝福二级标签",
                                description:"祝福二级标签描述",
                                icon:"图标地址",
                                sort:"0",
                                createTime:"2020-20-3",
                                updateTime:"2020-20-3",
                                isDeleted:"N",
                                state:"1",
                                child:[]
                            },
                        ]
                    },
                    {
                        labelId:"102",
                        parentLabelId:"-1",
                        labelType:"3",
                        name:"春节",
                        description:"春节标签的描述",
                        icon:"图标地址",
                        sort:"3",
                        createTime:"2020-20-3",
                        updateTime:"2020-20-3",
                        isDeleted:"N",
                        state:"1",
                        child:[]
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
                //树形所需
                defaultProps: {
                    children: "child",
                    label: "moduleName"
                },
                //组装权限列表的载体
                checkPermissions:[],
                //模拟 角色当前拥有权限
                curUserPermissions:[],
                //权限列表
                modules:[],
            }
        },
        created() {
            //获取权限列表，供设置权限
            moduleList().then(result => {
                if(result.code == 200){
                    //组装成权限列表
                    let menuParentArr = [];
                    let menuChildArr = [];
                    let authArr = [];
                    result.data.data.forEach(e => {
                        //组装一级菜单
                        if(e.moduleType === "MENU" && e.moduleParentTreeCode == -1) {
                            e.child = [];
                            menuParentArr.push(e)
                        }
                        //非一级菜单
                        if(e.moduleType === "MENU" && e.moduleParentTreeCode != -1){
                            e.child = [];
                            menuChildArr.push(e)
                        }
                        //所有按钮权限
                        if(e.moduleType === "AUTH"){
                            authArr.push(e)
                        }
                    });
                    //先将按钮权限插入到，二级菜单权限
                    menuChildArr.forEach(child => {
                        authArr.forEach(auth => {
                            if(child.moduleTreeCode === auth.moduleParentTreeCode){
                                child.child.push(auth)
                            }
                        });
                    });
                    //再是遍历一级菜单，插入所属二级菜单
                    menuParentArr.forEach(item  => {
                        menuChildArr.forEach(child => {
                            if(item.moduleTreeCode === child.moduleParentTreeCode){
                                item.child.push(child);
                            }
                        });
                    });
                    this.modules = menuParentArr;
                    console.log("========"+this.modules );
                }
            }).catch(err => {});
        },
        methods: {
            //选择角色类型
            checkRoleType() {
                console.log(this.formData.roleType)
            },
            //权限选择
            handleCheckChange() {
                //需要加ref="tree"
                let arr = [];
                //全选中和半选中状态合并则是选中的所有
                let checkedKeys = this.$refs.tree.getCheckedKeys();
                let hafCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
                arr = checkedKeys.concat(hafCheckedKeys);
                this.checkPermissions = arr;
                this.formData.moduleIds = this.checkPermissions.join(",");
                console.log(this.checkPermissions)
            },
            //新增编辑角色
            addRole() {
                //如果有roleId则是，修改
                if(this.$route.query.id){
                    //组装编辑数据
                    let data = {
                        roleId:this.$route.query.id,
                        // roleName:this.formData.roleName,
                        // roleDesc:this.formData.roleDesc,
                        moduleIds:this.formData.moduleIds,
                    };
                    //编辑
                    roleUpdate(data).then(res => {
                        if (res.data.isSuccessful === "Y") {
                            this.$message({
                                message: "修改成功！",
                                type: "success"
                            });
                            setTimeout(() => {
                                window.location()
                                // this.$router.go(0);
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
                        roleName:this.formData.roleName,
                        roleDesc:this.formData.roleDesc,
                        moduleIds:this.formData.moduleIds,
                    };
                    //添加
                    roleAdd(data).then(res => {
                        if (res.data.isSuccessful === "Y") {
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
                    console.log(this.formData)
                }

            },
            //全选树
            checkAllTree() {
                this.$refs.tree.setCheckedNodes(this.modules)
            },
            cancelAllTree() {
                this.$refs.tree.setCheckedNodes([])
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
