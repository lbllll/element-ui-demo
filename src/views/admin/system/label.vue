<template>
  <div class="bodyBox">

    <el-form :model="data" ref="searchs" class="searchBox">
      <div class="radio">
        <el-radio-group
          v-model="data.labelBusinessType"
          @change="init"
          size="small"
        >
          <el-radio label="1" border>资源标签</el-radio>
          <el-radio label="2" border>用户标签</el-radio>
        </el-radio-group>
      </div>
    </el-form>

<!--  树形标签结构  -->

    <div class="treeStyle">
      <h3 class="header"><div class="moveOn" v-if="data.labelBusinessType==='1'" @click="getFirstLabel('1')">资源标签</div><div class="moveOn" v-if="data.labelBusinessType==='2'"  @click="getFirstLabel('2')">用户标签</div></h3>
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
      <div class="header">
        <el-button type="primary" size="small" @click="openAdd()">新增标签</el-button>
      </div>

      <el-table
        :data="childLabelList"
        border
        style="width: 100%"
        :header-cell-style="{background:'#afafaf',color:'#606266'}"
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
            <el-switch
              v-model="scope.row.labelStatus"
              active-value="GROUNDED"
              inactive-value="UNGROUNDED"
              @change="setStatus(scope.$index,scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="left">
          <template slot-scope="scope">
<!--            <router-link  type="primary" round  :to="{name: 'LABEL_ADD', query: {labelInfo: scope.row}}">
              <el-button type="text" size="small">编辑</el-button>
            </router-link>-->
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
<!--            <el-button @click="delAll(scope.row.labelId)" type="text" size="small">删除</el-button>-->
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
      <labelAdd :message="this.labelInfo" @func="getMsgFormSon"></labelAdd>
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
          <!--          <el-button type="primary" @click="previewData()">预览</el-button>-->
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
        labelListByBusinessType
    } from "@/api/table";
    import labelAdd from "./labelAdd";
    export default {
        name: "LABEL_LIST",
        components: {labelAdd},
        data() {
            return {
                data:{
                    labelBusinessType:'1',
                    parentTreeCode:'',
                    page:1,
                },
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
                    "1":"资源类型",
                    "2":"用户类型",
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
            }

        },
        props: {
            checkItem: Boolean,
            selectArr: Array
        },
        created() {
            //初始化加载当前业务类型标签树
            this.init();
            //点击checkbox过后回到一级标签列表，清空labelInfo
            this.labelInfo = {
                parentInfo: {},
                labelBusinessType:this.data.labelBusinessType
            };
        },
        methods: {
            init(){
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
                        //组装数据
                        //初始化当前业务类型的一级标签到数据表格
                        let data = JSON.parse(JSON.stringify(this.data));
                        data.page --;
                        data.parentTreeCode= "-1";
                        //点击checkbox过后回到一级标签列表，清空labelInfo
                        this.labelInfo = {
                            parentInfo: {},
                            labelBusinessType:this.data.labelBusinessType
                        };
                        this.getChildList(data);
                    }
                }).catch(err => {});
            },
            //根据当前业务类型，获取子标签数据填充数据表格
            getChildList(data){
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
                    console.log(rowKey);
                }else {
                    //不是字符串类型是对象类型
                    console.log(this.multipleSelection);

                }
                //todo 组装keys，调用删除接口
            },
            //选择树形节点，在表格中显示相应信息
            handleNodeClick(v,e) {
                //初始化当前业务类型的所选标签的子标签到数据表格
                let data = JSON.parse(JSON.stringify(this.data));
                data.page = 0;
                //切换了设置当前选中parentTreeCode
                data.parentTreeCode= v.labelTreeCode;
                this.getChildList(data);
                //将当前选中改的信息记录，将要传入到新增标签中做部分添加参数
                this.labelInfo = {
                    parentInfo:v,
                    labelBusinessType:this.data.labelBusinessType
                };
            },
            //启用禁用：
            setStatus(index,row) {
                //手动切换值
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
                    });
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
  .treeStyle{
    margin-top: 100px;
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
</style>
