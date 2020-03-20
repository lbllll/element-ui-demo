<template>
    <div>
      <!--  筛选提交表单 -->
      <el-form :model="data" ref="searchs" class="searchBox">
        <!--   配置分组   -->
        <div class="selectStyle">
          <el-select
            class="data"
            v-model="data.groupId"
            prop="groupId"
            placeholder="配置分组"
            size="small"
            @change="checkGroupId"
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="item in groupList"
              :key="item.groupId"
              :label="item.name"
              :value="item.groupId"
            ></el-option>
          </el-select>
        </div>
        <!--   请输入配置属性的key值   -->
        <div class="inputStyle">
          <el-form-item prop="name"  can-be-empty>
            <el-input class="inputs" placeholder="请输入配置属性的key值" size="mini" v-model="data.name"></el-input>
          </el-form-item>
        </div>
        <div class="searchStyle">
          <el-button type="primary"  size="small" @click="search()">搜索</el-button>
          <el-button size="small" @click="resetQuery()">重置</el-button>
        </div>
      </el-form>
      <el-table
        class="tableStyle"
        :data="configList"
        border
        :row-key="getRowKeys"
        :header-cell-style="{background:'#afafaf',color:'#606266'}"
        ref="multipleTable"
        @selection-change="handleSelectionChange">
        <el-table-column prop="memberInfo" width="230" align="left" label="属性key" >
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memberInfo" width="230" align="left" label="属性值" >
          <template slot-scope="scope">
            <span>{{scope.row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memberInfo" width="200" align="left" label="备注" >
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="clickParams" width="230" align="left" label="参数" >
          <template slot-scope="scope">
            <span>{{scope.row.clickParams}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memberInfo" width="200" align="left" label="创建时间" >
          <template slot-scope="scope">
            <span>{{$timeUtil.getFormatTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memberInfo" width="200" align="left" label="修改时间" >
          <template slot-scope="scope">
            <span>{{$timeUtil.getFormatTime(scope.row.updateTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memberInfo" width="200" align="left" label="操作" >
          <template slot-scope="scope">
<!--            <span><el-button type="text" @click="checkGroupAndSetOpen(scope.row)" size="small">配置分组</el-button></span>-->
            <span><el-button type="text" @click="setConfigParamPage(scope.row)" size="small">设置配置参数</el-button></span>
          </template>
        </el-table-column>
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
      <el-dialog
        title="设置配置分组"
        :visible.sync="openSetGroupPage"
        width="30%"
        :destroy-on-close="true"
      >
        <el-form>
          <el-select
            class="data"
            v-model="curGroupId"
            prop="groupId"
            placeholder="选择配置分组"
            size="small"
            @change="checkGroupId"
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="item in groupList"
              :key="item.groupId"
              :label="item.name"
              :value="item.groupId"
            ></el-option>
          </el-select>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="openSetGroupPage = false">取 消</el-button>
        <el-button type="primary" @click="checkGroupAndSet">确 定</el-button>
      </span>
      </el-dialog>

      <!--打开修改配置参数页面-->
      <el-dialog
        title="编辑配置参数"
        :visible.sync="openConfigParamPage"
        width="30%"
        :destroy-on-close="true"
      >
        <el-form ref="updateData" :data="updateData" class="formBox" label-width="80px">
          <!--   请输入配置属性的key值   -->
          <el-form-item label="key" prop="name" verify>
            <el-input
              class="formItem"
              v-model="updateData.name"
              maxlength="100"
              placeholder="配置属性的key值"
              disabled="disabled"
            ></el-input>
          </el-form-item>
          <!--   请输入配置属性的key值   -->
          <el-form-item label="属性值"  prop="newValue" >
            <el-input
              class="formItem"
              v-model="updateData.newValue"
              maxlength="100"
              placeholder="请输入属性值"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="openConfigParamPage = false">取 消</el-button>
          <el-button type="primary" @click="setConfigParam">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
  import {
      systemConfigList,
      systemConfigUpdate
  } from "@/api/table";
    export default {
        name: "SYSTEM",
        components: {},
        data() {
          return {
             data: {
                 groupId:'',//分组id
                 name:'',//配置key名
                 page:1//页码
             },
             count:0,
             configList:[],
             groupList:[
                 {
                     groupId:'CURRENT_CAMPAIGNS_UID',
                     name:'活动配置',
                 },
                 {
                     groupId:'SYSTEM_DEFAULT',
                     name:'系统默认配置',
                 },
             ],
              //打开配置分组弹窗
              openSetGroupPage:false,
              //当前配置分组id
              curGroupId:'',
              //打开修改当前配置参数页面
              openConfigParamPage:false,
              updateData:{
                  name:'',
                  newValue:''
              },
          }
        },
        created (){
            this.init();
        },
        methods: {
            init(){
                let data = JSON.parse(JSON.stringify(this.data));
                data.page --;
                systemConfigList(data).then(result => {
                    if(result.data.isSuccessful === 'Y'){
                        console.log(result);
                        this.configList = result.data.data.list;
                        //分页的话还需初始化count
                        this.count = result.data.data.count;
                    }
                }).catch(err => {});
            },
            //选择配置分组
            checkGroupId(){
                console.log(this.data.groupId);
                this.init();
            },
            search(){
              this.init();
            },
            resetQuery(){
                this.data = {
                    groupId:'',//分组id
                    name:'',//配置key名
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
                return row.name;
            },
            //打开配置分组页面
            checkGroupAndSetOpen(configInfo){
                console.log(configInfo);
                this.curGroupId = configInfo.groupId;
                this.openSetGroupPage = true;
            },
            checkGroupAndSet(){
            },
            setConfigParamPage(configInfo){
                this.updateData = {
                    name:configInfo.name,
                    newValue:configInfo.value
                };
                this.openConfigParamPage = true;
            },
            setConfigParam(){
                let data = {
                    name:this.updateData.name,
                    newValue:this.updateData.newValue,
                };
                console.log(data);
                // return false;
                systemConfigUpdate(data).then(result => {
                    if(result.data.isSuccessful === 'Y'){
                        console.log(result);
                        this.$message({
                            message: "编辑成功！",
                            type: "success"
                        });
                        this.init();
                    } else{
                        this.$message.error(result.data.message);
                    }
                }).catch(err => {});
                this.openConfigParamPage = false;
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
