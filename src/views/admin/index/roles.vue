<template>
  <div class="bodyBox">
    <div class="header">
      <el-button type="primary" size="small" @click="openAdd()">新增角色</el-button>
    </div>

    <el-table
      :data="rolesList"
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
      <el-table-column prop="roleName" align="center" label="角色名"></el-table-column>
      <el-table-column prop="roleDesc" align="center" label="角色描述"></el-table-column>
      <el-table-column prop="roleType" align="center" label="角色类型">
        <template slot-scope="scope">{{roleType[scope.row.roleType]}}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="openDialog(scope.row.roleId)" size="small">分配权限</el-button>
<!--          <router-link  type="primary" round icon="el-icon-edit" :to="{name: 'ROLES_ADD', query: {id: scope.row.roleId}}">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>-->
          <el-button @click="delAll(scope.row.roleId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  底部操作工具栏  -->
    <div class="footer flex-between">
      <div>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
<!--        <el-button type="primary" v-if="!checkItem" size="mini" @click="delAll">删除</el-button>-->
      </div>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="formData.page"
        :page-size="10"
        background
        layout="total, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>


    <!--  弹出层分配权限  -->
    <el-dialog
      title="请设置权限"
      :visible.sync="controlDialog"
      width="50%"
      :open="openThisDialog"
      :close="closeThisDialog"
      :destroy-on-close="true"
      @close="nodeCollapse"
    >

      <el-tree
        ref="tree"
        :data="permissionList"
        show-checkbox
        node-key="moduleId"
        :props="defaultProps"
        :default-checked-keys="curUserPermissions"
        :default-expanded-keys="curUserPermissions"
        @check-change="handleCheckChange"
        :check-strictly="true"
        >
      </el-tree>

      <div style="margin-top: 20px">
        <el-button type="primary" @click="checkAllTree" size="mini">全选</el-button>
        <el-button @click="cancelAllTree" size="mini">取消全选</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCheckModules">取 消</el-button>
        <el-button type="primary" @click="submitBtn">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑角色信息"
      :visible.sync="openAddPage">
      <rolesAdd></rolesAdd>
    </el-dialog>


  </div>
</template>

<script>
    import {
        roleList,
        roleDelete,
        moduleList,
        roleUpdate,
        roleInfo
    } from "@/api/table";
    import rolesAdd from "./rolesAdd";
    export default {
        name: "ROLES_LIST",
        components: {rolesAdd},
        data() {
            return {
                formData:{
                    roleId:"",
                    roleName:"",
                    roleDesc:"",
                    roleType:"",
                    page:1,
                },
                cardList:[],
                labelList:[],
                fontList:[],
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
                userList: [],
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
                count: 6,
                multipleSelection: [],
                //分页
                isIndeterminate: false,
                //全选
                checkAll: false,
                //弹出层控制
                controlDialog:false,
                //权限列表
                permissionList:[],
                //组装权限列表的载体
                checkPermissions:[],
                //模拟 用户当前拥有权限
                curUserPermissions:[],
                //树形所需
                defaultProps: {
                    children: "child",
                    label: "moduleName"
                },
                //暂存角色id，用于修改角色权限
                currRoleId: "",
                /*弹出编辑页面*/
                openAddPage:false,
            }
        },
        props: {
            checkItem: Boolean,
            selectArr: Array
        },
        created() {
            this.init();
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
                    this.permissionList = menuParentArr;
                    // console.log("========"+this.permissionList );
                }
            }).catch(err => {});
        },
        methods: {
            init(){
                //获取用户信息，加载表格数据
                let data = JSON.parse(JSON.stringify(this.formData));
                data.page --;
                roleList(data).then(result => {
                    if(result.code == 200){
                        this.rolesList = result.data.data;
                        //分页的话还需初始化count
                        this.count = result.data.data.length;
                        // console.log(JSON.stringify(this.rolesList))
                    }
                }).catch(err => {});
            },
            //监听选择的内容
            handleSelectionChange(val) {
                //val 为选中数据的集合
                this.multipleSelection = val;
                console.log(this.multipleSelection)
            },
            //加载第几页
            handleCurrentChange(val) {
                this.formData.page = val;
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
            //打开关闭弹窗时触发的
            openThisDialog() {
                //清空上一次打开选中的选项
                this.curUserPermissions = [];
                console.log("打开")
            },
            closeThisDialog() {
                //清空上一次打开选中的选项
                this.curUserPermissions = [];
                console.log("关闭")
            },
            //弹出分配权限界面
            openDialog(roleId) {
                this.currRoleId = roleId;
                //查询相应权限数据，并给当前角色的权限赋值
                roleInfo({roleId:roleId}).then(res => {
                    if (res.data.isSuccessful === "Y") {
                        let arr = [];
                        //获取当前权限列表
                        res.data.data.permissions.forEach(item => {
                            arr.push(item.moduleId);
                        });
                        this.curUserPermissions = arr;
                        //弹出
                        // console.log(res);
                    } else {
                        this.$message.error(res.description);
                    }
                });
                this.controlDialog = true;
            },
            //弹出层的一些方法
            closeCheckModules(){
                //置空当前的权限选项
                this.curUserPermissions = [];
                //提交后将窗口关闭
                this.controlDialog = false;
            },
            submitBtn() {
                //设置权限
                let data={
                    roleId:this.currRoleId,
                    moduleIds:this.checkPermissions.join(",")
                };
                //编辑
                roleUpdate(data).then(res => {
                    if (res.data.isSuccessful === "Y"){
                        this.$message({
                            message: "修改成功！",
                            type: "success"
                        });
                        //置空当前的权限选项
                        this.curUserPermissions = [];
                        setTimeout(() => {
                            this.init();
                        }, 2000);
                        //跳转到列表
                    } else {
                        this.$message.error(res.description);
                    }
                });
                //提交后将窗口关闭
                this.controlDialog = false;
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
                console.log(this.checkPermissions)
            },
            //批量删除
            delAll(rowKey) {
                //是字符串类型则就是 rowKey
                if(typeof(rowKey) =='string'){
                    this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        // console.log("saasdasd");
                        roleDelete(rowKey).then(res => {
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
                        })
                        .catch(() => {
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
            nodeCollapse(data) {
                this.curUserPermissions =[];
            },
            //全选树
            checkAllTree() {
                this.$refs.tree.setCheckedNodes(this.permissionList)
            },
            cancelAllTree() {
                this.$refs.tree.setCheckedNodes([])
            },
            /*打开资源编辑弹出层*/
            openAdd(){
                this.openAddPage = true;
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

</style>
