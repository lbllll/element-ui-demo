<template>
  <div class="bodyBox">
    <!--  筛选提交表单 -->
    <el-form :model="formData" ref="searchs" class="searchBox">
      <!--   状态   -->
      <div>
        <el-select
          class="selectStyle"
          v-model="formData.status"
          prop="resourceState"
          placeholder="通知状态"
          size="small"
          @change="checkState"
        >
          <el-option value="">全部</el-option>
          <el-option
            v-for="item in noticeStateList"
            :key="item.status"
            :label="item.name"
            :value="item.status"
          ></el-option>
        </el-select>
      </div>
      <!--   通知标题   -->
      <div class="inputStyle">
        <el-form-item prop="noticeTitle"  can-be-empty>
          <el-input class="noticeTitle" placeholder="通知标题" size="mini" v-model="formData.noticeTitle"></el-input>
        </el-form-item>
      </div>
      <div class="searchStyle">
        <el-button type="primary"  size="small" @click="search()">搜索</el-button>
      </div>
      <div class="searchStyle">
        <el-button type="primary" size="small" @click="$router.push({name:'NOTICE_ADD'})">发布通知</el-button>
      </div>
    </el-form>
    <!--  数据表格  -->
    <div >
      <el-table
        :data="noticeList"
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
        <el-table-column prop="noticeTitle" align="center" label="通知标题"></el-table-column>
        <el-table-column prop="iconUrl" align="center" label="通知图标">
          <template slot-scope="scope">
            <span>
              <img v-image-preview  :src="scope.row.iconUrl == null? ' ':scope.row.iconUrl" width="50" height="50" />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="detailUrl" align="center" label="通知内容图片">
          <template slot-scope="scope">
            <span>
              <img v-image-preview  :src="scope.row.detailUrl == null? ' ':scope.row.detailUrl" width="50" height="50" />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="通知状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="GROUNDED"
              inactive-value="UNGROUNDED"
              @change="setStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
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

<!--        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <router-link  type="primary" round  :to="{name: 'LABEL_ADD', query: {labelInfo: scope.row}}">
              <el-button type="text" size="small">编辑</el-button>
            </router-link>
          </template>
        </el-table-column>-->
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
        changeSort,
        noticeList,
        noticeState
    } from "@/api/table";

    export default {
        name: "NOTICE_LIST",
        components: {},
        data() {
            return {
                formData:{
                    status:"",
                    noticeTitle:'',
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
                //系统通知列表
                noticeList:[],
                noticeStateList:[
                    {
                        status:"GROUNDED",
                        name:"上架",
                    },
                    {
                        status:"UNGROUNDED",
                        name:"下架",
                    }
                ],

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
                //获取用户信息，加载表格数据
                let data = JSON.parse(JSON.stringify(this.formData));
                data.page --;
                // 加载表格数据
                //遍历所有标签，进行标签树组装
                noticeList(data).then(res => {
                    if(res.code == 200){
                        //重组标签树
                        this.noticeList = res.data;
                        //分页
                        this.count = this.noticeList.length;
                        console.log(JSON.stringify(this.noticeList))
                    }
                }).catch(err => {});
            },
            search(){
                this.init()
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
            checkState (noticeInfo){
                console.log(noticeInfo)
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
            //启用禁用：
            setStatus(row) {
                noticeState({ noticeId: row.noticeId,status:row.status })
                    .then(res => {
                        if(res.code == 200){
                            this.$message({
                                type: "success",
                                message: "操作成功"
                            });
                            this.init();
                        }
                    })
                    .catch(err => {});
            },
        },
    }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  /*查询框*/
  .selectStyle,.inputStyle,.searchStyle,.radioStyle{
    float: left;
    margin-left: 20px;
  }
  .selectStyle,.inputStyle{
    width: 200px;
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
</style>
