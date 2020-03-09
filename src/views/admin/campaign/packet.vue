<template>
  <div>
    <!--  筛选提交表单 -->
    <el-form :model="data" ref="searchs" class="searchBox">
      <div class="row-one">
        <!--   活动列表   -->
        <div>
          <el-select
            class="selectStyle"
            v-model="data.campaignUid"
            prop="resourceState"
            placeholder="选择活动"
            size="small"
            @change="checkCampaign"
          >
            <el-option
              v-for="item in campaignList"
              :key="item.campaignUid"
              :label="item.campaignSubject"
              :value="item.campaignUid"
            ></el-option>
          </el-select>
        </div>

        <div>
          <el-select
            class="selectStyle"
            v-model="data.userType"
            prop="resourceState"
            placeholder="选择用户类型"
            size="small"
            @change="checkUserType"
          >
            <el-option
              v-for="item in userTypeList"
              :key="item.userType"
              :label="item.name"
              :value="item.userType"
            ></el-option>
          </el-select>
        </div>
      </div>
      <br>
      <div class="row-two">
        <!--   用户昵称   -->
        <div class="inputStyle">
          <el-form-item prop="resourceAuthorNickName"  can-be-empty>
            <el-input class="inputs" placeholder="用户昵称" size="mini" v-model="data.memberNickName"></el-input>
          </el-form-item>
        </div>
        <div class="searchStyle">
          <el-button type="primary"  size="small" @click="search()">搜 索</el-button>
        </div>
        <div class="searchStyle">
          <el-button size="small" @click="resetQuery()">重 置</el-button>
        </div>
      </div>
    </el-form>
    <!--  表格数据  -->
    <el-table
      class="tableStyle"
      :data="packetRecordList"
      border
      :row-key="getRowKeys"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
      ref="multipleTable"
      @selection-change="handleSelectionChange">
      <el-table-column align="left" type="selection" reserve-selection width="40"></el-table-column>
      <el-table-column prop="memberInfo" align="left" width="220" label="用户信息"  >
        <template slot-scope="scope">
          <div>
            <img class="userHeadImg" v-image-preview  :src="scope.row.memberHeadPicUrl==''?' ':scope.row.memberHeadPicUrl"  width="50" height="50" />
            <div class="userNameAndSex">
              <span class="nickName">昵称：{{scope.row.memberNickName}}</span><br>
              <span class="sex">性别：{{scope.row.memberSex==null?"保密":sexGroup[scope.row.memberSex]}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="redPacketAmount" align="left" width="200"  label="红包信息">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">红包个数：</span>{{scope.row.packetCounts}}</span>
          <br>
          <span><span style="font-weight: bolder">红包金额：</span>{{scope.row.redPacketAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sourceInfo" align="left"  width="300" label="祝福发送情况">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">已发送祝福：</span>{{scope.row.sendBlessingCounts}}</span>
          <br>
          <span><span style="font-weight: bolder">有效发送祝福：</span>{{scope.row.sendBlessingCountsEffective}}</span>
          <br>
          <span><span style="font-weight: bolder">有效接收祝福：</span>{{scope.row.receivedCount}}</span>
          <br>
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
        :current-page="data.page"
        :page-size="10"
        background
        layout="total, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
    export default {
        name: "PACKET",
        components: {},
        data() {
            return {
                data:{
                    campaignUid:'',
                    memberNickName:'',
                    userType:'',
                    page:1,
                },
                //用户类型
                userTypeList:[
                    {
                        userType:"3",
                        name:"平台签约作者",
                    },
                    {
                        userType:"2",
                        name:"作者",
                    },{
                        userType:"1",
                        name:"普通用户",
                    },

                ],
                userTypes:{
                    "3":"平台签约作者",
                    "2":"作者",
                    "1":"普通用户",
                },
                //性别
                //性别类型
                sexGroup:{
                    'MAN':"男",
                    'WOMAN':"女",
                    'NONE':"保密",
                    'MAN_WOMAN':"不男不女",
                },
                //分页
                isIndeterminate: false,
                checkAll: false,
                count: 0,
                multipleSelection: [],
                //活动列表：
                campaignList:[],
                packetRecordList:[
                    {
                        campaignUid:'1',//活动id
                        packetUid:'2',//红包id
                        memberUid:'3',//用户id
                        memberNickName:'sss',//用户昵称
                        memberSex:'MAN',
                        memberHeadPicUrl: '',//用户头像
                        redPacketAmount:'10',//红包金额
                        drawTime: '20202022',//领取时间
                        //可能会加：
                        sendBlessingCounts:'21',//已发送祝福
                        sendBlessingCountsEffective:'21',//有效发送祝福
                        receivedCount:'2',//祝福接收总数
                        packetCounts:'1',//红包个数
                    },
                    {
                        campaignUid:'1',//活动id
                        packetUid:'3',//红包id
                        memberUid:'3',//用户id
                        memberNickName:'昵称qq',//用户昵称
                        memberSex:'NONE',
                        memberHeadPicUrl: '',//用户头像
                        redPacketAmount:'123',//红包金额
                        drawTime: '20200406',//领取时间
                        //可能会加：
                        sendBlessingCounts:'12',//已发送祝福
                        sendBlessingCountsEffective:'10',//有效发送祝福
                        receivedCount:'2',//祝福接收总数
                        packetCounts:'1',//红包个数
                    },
                ],
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                console.log("init")
            },
            //搜索
            search(){},
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
            //监听选择的内容
            handleSelectionChange(val) {
                //val 为选中数据的集合
                this.multipleSelection = val;
                // console.log(this.multipleSelection)
            },
            // 给表格每行增加一个唯一 标识，用作切换分页后保留被选中行的信息
            getRowKeys(row) {
                return row.cardId;
            },
            //选择活动
            checkCampaign(){
                console.log("选择活动");
                this.init();
            },
            //目前选中用户类型
            checkUserType() {
                console.log(this.formData.userType)
                this.init();
            },
            //重置搜索框
            resetQuery(){
                this.data ={
                    campaignUid:'',
                    memberNickName:'',
                    userType:'',
                    page:1,
                };
                this.init();
            },
        }
    }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  /*查询框*/
  .searchBox{
  }
  .selectStyle,.inputStyle,.searchStyle,.radioStyle{
    float: left;
    margin-left: 20px;
  }
  .selectStyle,.inputStyle{
    width: 200px;
  }
  .row-one{
  }
  .row-two{
    margin-top: 30px;
  }
  audio {
    margin-top: 8px;
    width: 150px;
    height: 30px;
  }
  .label-max-height{
    height: 70px;
    overflow: auto;
  }
  .labelStyle{
    margin: 3px 3px;
  }
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
</style>
