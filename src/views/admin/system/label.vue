<template>
  <div class="bodyBox">

<!--  树形标签结构  -->

    <div class="treeStyle">
      <div class="header">选择父级标签</div>
      <el-tree
        class="el-tree--highlight-current "
        ref="tree"
        :data="labelList"
        node-key="labelId"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :accordion="true"
      >
      </el-tree>
    </div>
    <!--  数据表格  -->
    <div class="tableStyle">
      <div class="header">
        <el-button type="primary" size="small" @click="$router.push({name:'LABEL_ADD'})">新增标签</el-button>
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
          align="center">
        </el-table-column>
        <el-table-column prop="labelText" align="center" label="标签名"></el-table-column>
        <el-table-column prop="labelPathText" align="center" label="标签描述"></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{$timeUtil.getFormatTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" align="center" label="修改时间">
          <template slot-scope="scope">
            <span>{{$timeUtil.getFormatTime(scope.row.updateTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="labelTreeCode" align="center" label="标签树形码"></el-table-column>
        <el-table-column prop="labelParentTreeCode" align="center" label="父级标签树形码"></el-table-column>
        <el-table-column prop="labelBusinessType" align="center" label="标签业务类型">
          <template slot-scope="scope">{{labelBusinessTypes[scope.row.labelBusinessType]}}</template>
        </el-table-column>
        <el-table-column prop="labelDisplayIndex" align="center" label="标签排序"></el-table-column>
        <el-table-column prop="labelStatus" align="center" label="标签状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.labelStatus"
              active-value="GROUNDED"
              inactive-value="UNGROUNDED"
              @change="setStatus(scope.$index,scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

<!--        <el-table-column prop="markerId" align="center" label="标签图标">
          <template slot-scope="scope">
          <span>
            <img :src="scope.row.icon" width="50" height="50" />
          </span>
          </template>
        </el-table-column>
        &lt;!&ndash;      <el-table-column align="center" label="标签排序">
                <template slot-scope="scope">
                  <input class="sorts" type="number" v-model.number="scope.row.sort" />
                </template>
              </el-table-column>&ndash;&gt;
        <el-table-column prop="labelType" align="center" label="标签类型">
          <template slot-scope="scope">{{labelTypes[scope.row.labelType]}}</template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              active-value="1"
              inactive-value="2"
              @change="setStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <router-link  type="primary" round  :to="{name: 'LABEL_ADD', query: {labelInfo: scope.row}}">
              <el-button type="text" size="small">编辑</el-button>
            </router-link>
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
          :current-page="formData.page"
          :page-size="10"
          background
          layout="total, prev, pager, next, jumper"
          :total="count"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
    import {
        labelListByParent,
        labelListAll,
        setLabelState,
        changeSort
    } from "@/api/table";

    export default {
        name: "LABEL_LIST",
        components: {},
        data() {
            return {
                formData:{
                    labelId:"",
                    parentTreeCode:"",
                    labelType:"",
                    name:"",
                    description:"",
                    icon:"",
                    sort:"",
                    createTime:"",
                    updateTime:"",
                    isDeleted:"",
                    page:1,
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
                count: 6,
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
                    "1":"作品",
                    "2":"用户",
                },
                //标签状态
                labelStatus:{
                    "GROUNDED":"启用",
                    "UNGROUNDED":"停用",
                },
            }

        },
        props: {
            checkItem: Boolean,
            selectArr: Array
        },
        created() {
            this.init();
            console.log(this.childLabelList)
        },
        methods: {
            init(){
                // 加载表格数据
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
                        this.childLabelList = this.labelList;
                        //分页
                        this.count = this.childLabelList.length;
                        // console.log(JSON.stringify(this.labelList))
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
                //当前节点数据
                //console.log(v);
                //当前节点所有相关数据，包括父 子节点的关系和内容
                //console.log(e);
                //如果当前选中的是第一级即最顶层节点没有父节点,则显示最顶层节点列表
                if(v.labelParentTreeCode === "-1"){
                    this.childLabelList = this.labelList;
                }else {
                    //获取父节点;并展示其兄弟节点
                    this.childLabelList = e.parent.data.child;
                }
                //分页
                this.count = this.childLabelList.length;

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
  .treeStyle{
    margin-top: 100px;
    width: 15%;
    float: left;
  }
  .tableStyle{
    width: 85%;
    float: right;
  }
</style>
