<template>
  <div>
    <!--  筛选提交表单 -->
    <el-form :model="data" ref="searchs" class="searchBox">
      <!--   请输入用户昵称   -->
      <div class="inputStyle">
        <el-form-item prop="memberNickName"  can-be-empty>
          <el-input class="inputs" placeholder="请输入用户昵称" size="mini" v-model="data.memberNickName"></el-input>
        </el-form-item>
      </div>
      <div class="searchStyle">
        <el-button type="primary"  size="small" @click="search()">搜索</el-button>
        <el-button size="small" @click="resetQuery()">重置</el-button>
      </div>
    </el-form>
    <el-table
      class="tableStyle"
      :data="sysOpinionsList"
      border
      :row-key="getRowKeys"
      :cell-style="tableCellStyle"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
      ref="multipleTable"
      @selection-change="handleSelectionChange">
      <el-table-column prop="createTime" width="230" align="left" label="反馈时间" >
        <template slot-scope="scope">
          <span>{{$timeUtil.getFormatTime(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="wechatNickName" width="230" align="left" label="用户昵称" >
        <template slot-scope="scope">
          <span>{{deCodes(scope.row.wechatNickName)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="opinionContent" width="200" align="left" label="反馈内容" >
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.opinionContent">
            <span>{{scope.row.opinionContent | controlLength}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="clickParams" width="230" align="left" label="处理记录" >
        <template slot-scope="scope">
          <div v-if="scope.row.opinionIsRead == '2'">
            <span>{{scope.row.opinionReadByUserNickName}}</span><br>
            <span>在：{{$timeUtil.getFormatTime(scope.row.opinionReadTime)}} 阅读了</span>
          </div>
          <div v-if="scope.row.opinionIsRead == '1'">
            <span>未处理</span>
            <span><el-button type="text" @click="read(scope.row)" size="normal">阅读</el-button></span>
          </div>
        </template>
      </el-table-column>
<!--      <el-table-column prop="memberInfo" width="200" align="left" label="操作" >
        <template slot-scope="scope">
          &lt;!&ndash;            <span><el-button type="text" @click="checkGroupAndSetOpen(scope.row)" size="small">配置分组</el-button></span>&ndash;&gt;
          <span><el-button type="text" @click="setConfigParamPage(scope.row)" size="small">设置配置参数</el-button></span>
        </template>
      </el-table-column>-->
    </el-table>
    <!--  底部操作工具栏  -->
    <div class="footer flex-between">
      <!--        <div>
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  @change="handleCheckAllChange"
                >全选</el-checkbox>
                &lt;!&ndash;        <el-button type="primary" v-if="!checkItem" size="mini" @click="delAll">删除</el-button>&ndash;&gt;
              </div>-->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="data.page"
        :page-size="10"
        background
        layout="total, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>

    <!--打开配置分组弹出层-->

    <!--打开修改配置参数页面-->

  </div>
</template>

<script>
    import {
        systemConfigList,
        systemConfigUpdate,
        opinionsList,
        opinionsIsRead
    } from "@/api/table";
    export default {
        name: "FEEDBACK",
        components: {},
        filters: {
            //控制字符串长度，过长显示...
            controlLength(curStr) {
                if (!curStr) {
                    return "";
                }
                if (curStr.length > 10) {
                    return curStr.slice(0, 10 + "...")
                }
                return curStr;
            },
        },
        data() {
            return {
                data: {
                    memberNickName:'',//分组id
                    page:1//页码
                },
                count:0,
                sysOpinionsList:[],
                //当前操作用户昵称
                opinionReadByUserNickName:'',
            }
        },
        created (){
            //获取当前操作用户账户名
            this.opinionReadByUserNickName = window.sessionStorage.getItem('userName');
            this.init();
        },
        methods: {
            init(){
                let data = JSON.parse(JSON.stringify(this.data));
                data.memberNickName = this.$util.encode(data.memberNickName);
                data.page --;
                opinionsList(data).then(result => {
                    if(result.data.isSuccessful === 'Y'){
                        this.sysOpinionsList = result.data.data.list;
                        //分页的话还需初始化count
                        this.count = result.data.data.count;
                    }
                }).catch(err => {});
            },
            //用户编码
            deCodes(str) {
                return this.$util.decode(str);
            },
            //选择配置分组
            search(){
                this.init();
            },
            resetQuery(){
                this.data = {
                    memberNickName:'',//用户昵称
                    page:1//页码
                };
                this.init();
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
            getRowKeys(row) {
                // 给表格每行增加一个唯一 标识，用作切换分页后保留被选中行的信息
                return row.opinionUid;
            },
            tableCellStyle({row, rowIndex}){
                if(row.opinionIsRead == '1'){
                    return `font-weight:bolder`
                }
            },
            read(opinionsInfo){
                let data = {
                    opinionUid:opinionsInfo.opinionUid,
                    optionIsRead:2,
                    opinionReadByUserNickName:this.opinionReadByUserNickName,
                };
                console.log(data);
                // return false;
                opinionsIsRead(data).then(result => {
                    if(result.data.isSuccessful === 'Y'){
                        console.log(result);
                        this.$message({
                            message: "已阅读！",
                            type: "success"
                        });
                        this.init();
                    }
                    else {
                        this.$message.error(result.data.message);
                    }
                }).catch(err => {});
            },
        },
    }

</script>

<style lang="scss" scoped>
  /*查询框*/
  .selectStyle,.inputStyle,.searchStyle{
    width: 200px;
    float: left;
    margin-left: 20px;
  }
  /*用户档案表格*/
  .tableStyle{
    .userNameAndSex,.userHeadImg,.userOpenId{
      position: absolute;
    }
    .userHeadImg{
      top: 20px;
      left: 20px;
    }
    .userNameAndSex{
      margin-left: 75px;
      top: 20px;
    }
    .userOpenId{
      left: 20px;
      bottom: 15px;
    }
  }
  .label-max-height{
    height: 70px;
    overflow: auto;
  }
  .labelStyle{
    margin: 3px 3px;
  }
  /*流水表格*/
  .red{
    color: red;
  }
  .green{
    color: green;
  }
  .black{
    color: black;
  }
  .editRemark{
    position: absolute;
    bottom: 15px;
    right: 20px;
  }

</style>
