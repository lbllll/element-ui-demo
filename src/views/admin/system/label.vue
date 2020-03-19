<template>
  <div class="bodyBox">

    <div>
<!--      <el-form :model="data" ref="searchs" class="searchBox">
        <div class="radio">
          <el-radio-group
            v-model="data.labelBusinessType"
            @change="init"
            size="small"
          >
            <el-radio label="1" border>分类标签</el-radio>
            <el-radio label="2" border>作品标签</el-radio>
            <el-radio label="3" border>用户标签</el-radio>
          </el-radio-group>
        </div>
      </el-form>-->
      <div class="header">
        <ul class="headUlStyle">
<!--          <li class="boxPosition" :class="{'checkResourceTypeBox':data.labelBusinessType=='1'}"><el-button class="checkItem"  type="primary" size="small" @click="checkResourceType('1')">分类标签</el-button></li>-->
          <li class="boxPosition" :class="{'checkResourceTypeBox':data.labelBusinessType=='2'}"><el-button class="checkItem" type="primary" size="small" @click="checkResourceType('2')">作品标签</el-button></li>
          <li class="boxPosition" :class="{'checkResourceTypeBox':data.labelBusinessType=='3'}"><el-button class="checkItem"  type="primary" size="small" @click="checkResourceType('3')">用户标签</el-button></li>
          <li class="boxPosition" ><el-button  class="checkItem" size="small" @click="openAdd()">新增标签</el-button></li>
        </ul>
      </div>
    </div>


<!--  树形标签结构  -->

    <div class="treeStyle">
<!--      <h3 class=""><div class="moveOn" v-if="data.labelBusinessType==='1'" @click="getFirstLabel('1')">分类标签</div><div class="moveOn" v-if="data.labelBusinessType==='2'"  @click="getFirstLabel('2')">作品标签</div><div class="moveOn" v-if="data.labelBusinessType==='3'"  @click="getFirstLabel('3')">用户标签</div></h3>-->
      <el-tree
        class="el-tree--highlight-current "
        ref="tree"
        :data="labelList"
        node-key="labelTreeCode "
        :props="defaultProps"
        @node-click="handleNodeClick"
        :accordion="true"
      >
      </el-tree>
    </div>
    <!--  数据表格  -->
    <div class="tableStyle">
      <el-table
        :data="childLabelList"
        border
        style="width: 100%"
        :header-cell-style="{color:'#606266'}"
        ref="multipleTable"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="50"
          align="left">
        </el-table-column>
        <el-table-column prop="labelText" align="left" label="标签名"></el-table-column>
        <el-table-column prop="labelPathText" align="left" label="标签描述"></el-table-column>
        <el-table-column prop="createTime" align="left" label="创建时间">
          <template slot-scope="scope">
            <span>{{$timeUtil.getFormatTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" align="left" label="修改时间">
          <template slot-scope="scope">
            <span>{{$timeUtil.getFormatTime(scope.row.updateTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="labelTreeCode" align="left" label="标签树形码"></el-table-column>
        <el-table-column prop="labelParentTreeCode" align="left" label="父级标签树形码"></el-table-column>
        <el-table-column prop="labelBusinessType" align="left" label="标签业务类型">
          <template slot-scope="scope">{{labelBusinessTypes[scope.row.labelBusinessType]}}</template>
        </el-table-column>
<!--        <el-table-column prop="labelDisplayIndex" align="left" label="标签排序"></el-table-column>-->
        <el-table-column prop="labelStatus" align="left" label="标签状态">
          <template slot-scope="scope">
            <div v-if="scope.row.isDeleted === 'N'">
              <span>{{labelStatus[scope.row.labelStatus]}}</span>
            </div>
            <div v-if="scope.row.isDeleted === 'Y'">
              <span>已删除</span>
            </div>
<!--            <el-switch
              v-model="scope.row.labelStatus"
              active-value="GROUNDED"
              inactive-value="UNGROUNDED"
              @change="setStatus(scope.$index,scope.row)"
            ></el-switch>-->
          </template>
        </el-table-column>
        <el-table-column prop="bindResourceCounts" align="left" label="关联数量">
          <template slot-scope="scope">
            <!--完全跳到资源列表-->
            <div v-if="scope.row.labelBusinessType == '2' && scope.row.isDeleted === 'N'">
              <span>关联数量：{{scope.row.bindResourceCounts}}</span><br>
              <el-button type="text" size="small" @click="$router.push({name:'BLESSING_LIST', params: { resourceLabelTreeCodes: scope.row.labelTreeCode}})">查看关联作品</el-button>
            </div>
            <div v-if="scope.row.labelBusinessType == '3' && scope.row.isDeleted === 'N' ">
              <span>关联数量：{{scope.row.bindResourceCounts}}</span><br>
              <el-button type="text" size="small" @click="$router.push({name:'MEMBER_LIST', params: { memberLabelTreeCodes: scope.row.labelTreeCode}})">查看关联用户</el-button>
            </div>
            <!--标签页跳子组件-->
            <!--当前页面弹窗，但是有点问题-->
<!--            <el-button type="text" size="small" @click="openBindResource(scope.row.labelTreeCode)">查看绑定详情</el-button>-->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="left">
          <template slot-scope="scope">
<!--            <router-link  type="primary" round  :to="{name: 'LABEL_ADD', query: {labelInfo: scope.row}}">
              <el-button type="text" size="small">编辑</el-button>
            </router-link>-->
            <div v-if="scope.row.isDeleted === 'N'">
              <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="delAll(scope.row.labelId)" type="text" size="small">删除</el-button>
              <span v-if="scope.row.labelStatus === 'UNGROUNDED'">
                <el-button @click="setStatus(scope.row.labelId,'GROUNDED')" type="text" size="small">启用</el-button>
              </span>
              <span v-if="scope.row.labelStatus === 'GROUNDED'">
                <el-button @click="setStatus(scope.row.labelId,'UNGROUNDED')" type="text" size="small">禁用</el-button>
              </span>
  <!--            <br>-->
              <el-button
                :disabled="scope.$index===0"
                @click="moveUp(scope.$index,scope.row)"
                type="text"
                size="small"
                style="margin: 0">上移</el-button>
              <el-button
                :disabled="scope.$index===(childLabelList.length-1)"
                @click="moveDown(scope.$index,scope.row)"
                type="text"
                size="small"
                style="margin: 0">下移</el-button>
            </div>
            <div v-if="scope.row.isDeleted === 'Y'"></div>
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
<!--          <el-button type="primary" v-if="!checkItem" size="mini" @click="delAll">删除</el-button>-->
        </div>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="data.page"
          :page-size="10"
          background
          layout="total, prev, pager, next, jumper"
          :total="count"
        ></el-pagination>
      </div>
    </div>


    <el-dialog
      title="新增标签"
      :visible.sync="openAddPage">
      <labelAdd :message="this.labelInfo" @func="getMsgFormSon" @handleFun="reloadAndCloseAddPage"></labelAdd>
    </el-dialog>

    <el-dialog
      title="标签相关作品"
      width="80%"
      :destroy-on-close="true"
      :visible.sync="openBindResourcePage"
      @open="openBindResourcePagePage"
      @close="clearCheckResource">
      <blessingList :messageLabelTreeCode = 'this.curLabelTreeCode' v-if="curLabelTreeCode"></blessingList>
      <div class="checkBindLabelFooter">
        <el-button type="primary" @click="openBindResourcePage = false ">返回</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="编辑标签信息"
      :visible.sync="openEditPage">
      <el-form ref="form" :model="formData" class="formBox" label-width="80px">

        <el-form-item label="标签名" prop="labelText" verify>
          <el-input
            class="formItem"
            v-model="formData.labelText"
            maxlength="20"
            placeholder="请设置标签名"
          ></el-input>
          <span class="describe">长度不宜太长，且不能同一级重复</span>
        </el-form-item>

        <el-form-item label="排序" prop="labelDisplayIndex"  verify>
          <el-input class="formItem" type="number" v-model="formData.labelDisplayIndex" placeholder="排序"></el-input>
          <span class="describe">越大越靠前</span>
        </el-form-item>

        <!--   发布按钮     -->
        <div class="footer">
          <el-button type="primary" @click="editSubmit()">确认修改</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
    import {
        labelListByParent,
        labelListAll,
        setLabelState,
        changeSort,
        labelUpdateText,
        labelListByBusinessType,
        labelDelete,
    } from "@/api/table";
    import labelAdd from "./labelAdd";
    import blessingList from "../blessing/list";
    export default {
        name: "LABEL_LIST",
        components: {labelAdd,blessingList},
        data() {
            return {
                data:{
                    labelBusinessType:'2',
                    parentTreeCode:'',
                    page:1,
                },
                labelBusinessType:'',
                //暂存当前选中标签的信息
                labelInfo:{},
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
                cardList:[],
                labelList:[],
                labelTypes: {
                  "1":"标签类型1" ,
                  "2":"标签类型2" ,
                  "3":"标签类型3" ,
                  "4":"标签类型3" ,
                },
                //分页
                count: 0,
                multipleSelection: [],
                //分页
                isIndeterminate: false,
                checkAll: false,
                //树形所需
                defaultProps: {
                    children: "child",
                    label: "labelText"
                },
                //所选标签的下一级子类标签
                childLabelList:[],
                //当前等级兄弟节点
                currLabelList:[],
                //标签状态
                state:{
                    "1":"启用",
                    "2":"停用",
                },
                //标签业务类型
                labelBusinessTypes:{
                    "1":"分类类型",
                    "2":"作品类型",
                    "3":"用户类型",
                },
                //标签状态
                labelStatus:{
                    "GROUNDED":"启用",
                    "UNGROUNDED":"停用",
                },
                //打开编辑页面
                openAddPage:false,
                openEditPage:false,
                curLabelInfo:{},
                //当前选中父节点
                curParentTreeCode:'',
                //弹出资源列表
                openBindResourcePage:false,
                //当前label码
                curLabelTreeCode:'',
            }

        },
        props: {
            checkItem: Boolean,
            selectArr: Array
        },
        created() {
            //初始化加载当前业务类型标签树
            this.init();
        },
        methods: {
            init(){
                this.getLabelTree();
                this.getChildList();
            },
            reloadAndCloseAddPage(){
                console.log("ssssssss");
                this.openAddPage = false;
                this.init()
            },
            //组装标签树
            getLabelTree(){
                //遍历所有标签，进行标签树组装
                let data = {
                    labelBusinessType:this.data.labelBusinessType
                };
                //初始化当前业务类型下的树
                labelListByBusinessType(data).then(result => {
                    if(result.data.isSuccessful === 'Y'){
                        //将数据转为map，以labelTreeCode为标识
                        let map = {};
                        result.data.data.forEach( item => {
                            map[item.labelTreeCode] = item
                        });
                        let labelArr = [];
                        //然后遍历，只要当前item存在父标签parent则一直找，找到就设为其子标签
                        result.data.data.forEach(item => {
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
                    }
                }).catch(err => {});
            },
            //切换标签类型
            checkResourceType(resourceType){
                this.data.labelBusinessType = resourceType;
                this.data.parentTreeCode = '-1';
                this.parentInfo = {};
                this.labelInfo = {
                    parentInfo:{},
                    labelBusinessType:this.data.labelBusinessType
                };
                this.init();
            },
            //根据当前业务类型，获取子标签数据填充数据表格
            getChildList(){
                let data = {
                    labelBusinessType:this.data.labelBusinessType,
                    parentTreeCode:this.data.parentTreeCode,
                    page:0,
                };
                labelListByParent(data).then(result => {
                    if(result.data.isSuccessful === 'Y'){
                        this.childLabelList = result.data.data.list;
                        this.count = result.data.data.count;
                    }
                }).catch(err => {});
            },
            getFirstLabel(labelBusinessType) {
                //初始化当前业务类型的一级标签到数据表格
                let data = JSON.parse(JSON.stringify(this.data));
                data.page = 0;
                data.parentTreeCode= "-1";
                //重置当前选择的父节点
                this.data.labelBusinessType = labelBusinessType;
                //回到一级标签列表，置空labelinfo
                this.labelInfo = {};
                this.getChildList(data);
            },
            //监听选择的内容
            handleSelectionChange(val) {
                //val 为选中数据的集合
                this.multipleSelection = val;
                console.log(this.multipleSelection)
            },
            //加载第几页
            handleCurrentChange(val) {
                this.data.page = val;
                //初始化当前业务类型的标签到数据表格
                let data = JSON.parse(JSON.stringify(this.data));
                data.page --;
                this.getChildList(data);
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
                    //编辑
                    labelDelete(rowKey).then(res => {
                        if (res.data.isSuccessful === "Y") {
                            this.$message({
                                message: "删除成功！",
                                type: "success"
                            });
                            this.init();
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                    console.log(rowKey);
                }else {
                    //不是字符串类型是对象类型
                    console.log(this.multipleSelection);
                }
                //todo 组装keys，调用删除接口
            },
            //选择树形节点，在表格中显示相应信息
            handleNodeClick(v,e) {
                //表单数据赋值
                // console.log(v);
                this.data = {
                    labelBusinessType:v.labelBusinessType,
                    parentTreeCode:v.labelTreeCode,
                    page:1
                };
                this.getChildList();
                //将当前选中改的信息记录，将要传入到新增标签中做部分添加参数
                this.labelInfo = {
                    parentInfo:v,
                    labelBusinessType:this.data.labelBusinessType
                };
            },
            //启用禁用：
            setStatus(labelId,labelStatus) {
                //按钮切换，状态
                setLabelState({ labelId: labelId,status:labelStatus })
                    .then(res => {
                        this.$message({
                            type: "success",
                            message: "操作成功"
                        });
                        this.init();
                    })
                    .catch(err => {});
                //raido的切换状态
               /* //手动切换值
                if(row.labelStatus === "UNGROUNDED"){
                    row.labelStatus = "GROUNDED"
                }else {
                    row.labelStatus = "UNGROUNDED"
                }
                // console.log(row);
                this.$confirm((row.labelStatus == 'GROUNDED'? "此操作将关闭该标签！是否继续?" : "此操作将开启当前标签"), "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    //再切换为想要的状态
                    if(row.labelStatus === "UNGROUNDED"){
                        row.labelStatus = "GROUNDED"
                    }else {
                        row.labelStatus = "UNGROUNDED"
                    }
                        setLabelState({ labelId: row.labelId,status:row.labelStatus })
                          .then(res => {
                          this.$message({
                          type: "success",
                          message: "操作成功"
                        });
                        this.init();
                      })
                      .catch(err => {});
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消"
                        });
                    });*/
            },
            //跳资源列表子组件
            openBindResource(labelTreeCode){
                this.openBindResourcePage = true;
                this.curLabelTreeCode = labelTreeCode;
            },
            //打开，关闭绑定资源详情
            openBindResourcePagePage(){
                // this.curLabelTreeCode = '';
            },
            clearCheckResource(){
                // this.curLabelTreeCode = '';
            },
            //上移
            moveUp(index,row){
                if (index > 0) {
                    //获取上一行的数据
                    let upDate = this.childLabelList[index - 1];
                    console.log("当前行的sort=="+this.childLabelList[index].labelDisplayIndex);
                    console.log("当前行的sort=="+this.childLabelList[index].labelId);
                    console.log("上一行sort=="+this.childLabelList[index - 1].labelDisplayIndex);
                    console.log("上一行sort=="+this.childLabelList[index - 1].labelId);
                    //上一行数据
                    let dataPre={
                        labelId:this.childLabelList[index - 1].labelId,
                        sort:this.childLabelList[index].labelDisplayIndex
                    };
                    //当前数据
                    let dataCur = {
                        labelId:this.childLabelList[index].labelId,
                        sort:this.childLabelList[index-1].labelDisplayIndex
                    };
                    changeSort(dataCur).then(res => {
                        if (res.code == 200) {
                            //修改成功再修改另一个
                            changeSort(dataPre).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        message: "修改成功！",
                                        type: "success"
                                    });
                                    setTimeout(() => {
                                        this.init();
                                    }, 2000);
                                    //跳转到列表
                                } else {
                                    this.$message.error(res.description);
                                }
                            });
                        } else {
                            this.$message.error(res.description);
                        }
                    });
                    //两者交换sort,交换sort
                    this.childLabelList.splice(index - 1, 1);
                    this.childLabelList.splice(index,0, upDate);
                } else {
                    alert('已经是第一条，不可上移');
                }
            },

            //下移
            moveDown(index,row){
                console.log('下移',index,row);
                if ((index + 1) === this.childLabelList.length){
                    alert('已经是最后一条，不可下移');
                } else {
                    console.log("当前行的sort=="+this.childLabelList[index].labelDisplayIndex);
                    console.log("当前行的sort=="+this.childLabelList[index].labelId);
                    console.log("下一行sort=="+this.childLabelList[index + 1].labelDisplayIndex);
                    console.log("下一行sort=="+this.childLabelList[index + 1].labelId);
                    // 两者交换sort
                    //下一行数据
                    let dataNext={
                        labelId:this.childLabelList[index + 1].labelId,
                        sort:this.childLabelList[index].labelDisplayIndex
                    };
                    //当前数据
                    let dataCur = {
                        labelId:this.childLabelList[index].labelId,
                        sort:this.childLabelList[index+1].labelDisplayIndex
                    };
                    changeSort(dataCur).then(res => {
                        if (res.code == 200) {
                            //修改成功再修改另一个
                            changeSort(dataNext).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        message: "修改成功！",
                                        type: "success"
                                    });
                                    setTimeout(() => {
                                        this.init();
                                    }, 2000);
                                    //跳转到列表
                                } else {
                                    this.$message.error(res.description);
                                }
                            });
                        } else {
                            this.$message.error(res.description);
                        }
                    });
                    let downDate = this.childLabelList[index + 1];
                    this.childLabelList.splice(index + 1, 1);
                    this.childLabelList.splice(index,0, downDate);
                }
            },
            /*打开资源编辑弹出层*/
            openAdd(){
                //如果labelInfo的parentInfo为false，则是没有父级标签信息，则是处于最顶层，业务区分节点，点击添加则是添加当前业务的一级标签
                if(!this.labelInfo.parentInfo){
                    this.labelInfo = {
                        parentInfo: {},
                        labelBusinessType:this.data.labelBusinessType
                    }
                }
                // console.log(JSON.stringify(this.labelInfo));
                this.openAddPage = true;
            },
            edit(labelInfo){
                this.formData = labelInfo;
                this.openEditPage =true;
            },
            getMsgFormSon(data){
                this.openAddPage = data;
            },
            editSubmit(){
                //组装数据
                let data = {
                    labelId:this.formData.labelId,
                    labelText:this.formData.labelText,
                    labelDisplayIndex:this.formData.labelDisplayIndex
                };
                //修改 labelUpdateText
                console.log(data);
                // return false;
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
            },
        },
    }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .moveOn:hover{
    cursor: pointer;
  }
  .header {
    background-color: #D7D7D7;
    .headUlStyle > li{
      display: inline-block;
      margin: 10px 10px 0 0;
    }
    .boxPosition{
      position: relative;
      width: 100px;
      height: 50px;
    }
    .checkResourceTypeBox {
      background-color: white;
    }
    .checkItem{
      position: relative;
      top: 15%;
      left: 10%;
    }
  }
  .treeStyle{
    width: 15%;
    float: left;
  }
  .tableStyle{
    width: 85%;
    float: right;
  }

  /*编辑弹出层*/
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
  .checkBindLabelFooter{
    right: 20px;
    top: 20px;
  }
</style>
