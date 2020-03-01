<template>
  <div class="bodyBox">
    <div class="header">
      <el-button type="primary" size="small" @click="$router.push({name:'fontAdd'})">添加字体</el-button>
    </div>

    <el-table
      :data="fontList"
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
      <el-table-column prop="fontName" align="center" label="字体名"></el-table-column>
      <el-table-column prop="fontSize" align="center" label="字体大小"></el-table-column>
      <el-table-column prop="fontUrl" align="center" label="字体文件"></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <router-link  type="primary" round icon="el-icon-edit" :to="{name: 'fontAdd', query: {id: scope.row.fontId}}">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>
          <el-button @click="delAll(scope.row.fontId)" type="text" size="small">删除</el-button>
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
        <el-button type="primary" v-if="!checkItem" size="mini" @click="delAll">删除</el-button>
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
      >

      </el-tree>

      <div style="margin-top: 20px">
        <el-button type="primary" @click="" size="mini">全选</el-button>
        <el-button @click="" size="mini">取消全选</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="controlDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitBtn">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
    export default {
        name: "rolesList",
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
                    {
                        fontId:"2",
                        fontName:"第二个字体名字",
                        fontSize:"第二个字体大小",
                        fontUrl:"第二个字体地址",
                    },{
                        fontId:"3",
                        fontName:"第三个字体名字",
                        fontSize:"第三个字体大小",
                        fontUrl:"第三个字体地址",
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
                curUserPermissions:['111','21','121'],
                //树形所需
                defaultProps: {
                    children: "child",
                    label: "moduleName"
                }
            }
        },
        props: {
            checkItem: Boolean,
            selectArr: Array
        },
        created() {},
        methods: {
            //todo 加载表格数据
            init(){
                //todo 初始化count
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
            //弹出分配权限界面
            openDialog(roleId) {
                //弹出
                this.controlDialog = true;
                console.log(roleId)
            },
            //弹出层的一些方法
            submitBtn() {
                //提交后将窗口关闭
                this.controlDialog = false;
            },
            //权限选择
            handleCheckChange() {
                //需要加ref="tree"
                let res = this.$refs.tree.getCheckedNodes();
                let arr = [];
                res.forEach(item => {
                    arr.push(item.id);
                });
                this.checkPermissions = arr;
                console.log(this.checkPermissions)
            },
            //批量删除
            delAll(rowKey) {
                //是字符串类型则就是 rowKey
                if(typeof(rowKey) =='string'){
                    console.log(rowKey);
                }else {
                    //不是字符串类型是对象类型
                    console.log(this.multipleSelection);

                }
                //todo 组装keys，调用删除接口
            }
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
