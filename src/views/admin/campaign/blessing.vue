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
              v-for="item in curCampaignList"
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
      :data="sendBlessingList"
      border
      :row-key="getRowKeys"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
      ref="multipleTable"
      @selection-change="handleSelectionChange">
      <el-table-column align="left" type="selection" reserve-selection width="40"></el-table-column>
      <el-table-column prop="memberInfo" align="left" width="240" label="用户信息"  >
        <template slot-scope="scope">
          <div>
            <img class="userHeadImg" v-image-preview  :src="scope.row.memberHeadImageUrl==''?' ':scope.row.memberHeadImageUrl"  width="50" height="50" />
            <div class="userNameAndSex">
              <span class="nickName">昵称：{{deCodes(scope.row.memberNickName)}}</span><br>
              <span class="sex">性别：{{scope.row.memberSex==null?"保密":sexGroup[scope.row.memberSex]}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="redPacketAmount" align="left" width="220"  label="发送祝福信息">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">已发送祝福总数：</span>{{scope.row.sendBlessingCounts}} 次</span>
          <br>
          <span><span style="font-weight: bolder">有效发送总数：</span>{{scope.row.effectiveSendBlessingCounts}} 次</span>
          <br>
          <span><span style="font-weight: bolder">接收总数：</span>{{scope.row.receiveBlessingCounts}} 次</span>
        </template>
      </el-table-column>

      <el-table-column prop="redPacketAmount" align="left" width="220"  label="获得红包信息">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">获得红包总个数：</span>{{scope.row.getPacketCounts}} 个</span>
          <br>
          <span><span style="font-weight: bolder">红包金额：</span>{{$util.prices(scope.row.getPacketAmount)}} 元</span>
          <br>
        </template>
      </el-table-column>

      <el-table-column prop="redPacketAmount" align="left" width="220"  label="获得物资信息">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">获得物资总个数：</span>{{scope.row.getMaterialCount}} 件</span>
          <br>
          <span><span style="font-weight: bolder">物资金额：</span>{{$util.prices(scope.row.getMaterialAmount)}} 元</span>
          <br>
        </template>
      </el-table-column>
      <el-table-column prop="redPacketAmount" align="left" width="220"  label="拉新情况">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">拉新数：</span>{{scope.row.campaignAddedUsersCount}}</span>
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
    import {
        campaignsList,
        campaignsAdd,
        campaignsUpdate,
        campaignsDelete,
        campaignsState,
        campaignsRules,
        campaignsMaterialAdd,
        campaignsMaterialCreate,
        campaignsMaterialUpdate,
        campaignsMaterialDetailList,
        campaignsMaterialDelete,
        campaignsMaterialList,
        campaignsRedPacketAdd,
        campaignsRedPacketList,
        campaignsRedPacketMemberDetail,
        campaignsRedPacketMemberTotal,
        campaignsRulesList,
        campaignsOnline,

        sendBlessingRecordList,
    } from "@/api/table";
    export default {
        name: "BLESSING",
        components: {},
        data() {
            return {
                data:{
                    campaignUid:'',
                    memberNickName:'',
                    userType:'',
                    memberLabelTreeCode:'',
                    page:1,
                },
                //当前选择
                curCampaignInfo:[],
                curCampaignList:[],
                //分页
                isIndeterminate: false,
                checkAll: false,
                count: 0,
                multipleSelection: [],
                //活动列表：
                campaignList:[],
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
                //性别类型
                sexGroup:{
                    'MAN':"男",
                    'WOMAN':"女",
                    'NONE':"保密",
                    'MAN_WOMAN':"不男不女",
                },
                //领取祝福列表
                sendBlessingList:[
                ],
            }
        },
        created() {
            //加载活动列表
            let data = {
                campaignType:'',//活动类型[见UML图备注]
                campaignState:'',//活动状态[1-策划中, 2-公示中, 3-进行中,4-已暂停,  5-已停止]
                campaignSubject:'',//活动主题
                campaignStartTime:'',//活动开始时间
                campaignStopTime:'',//活动结束时间
                page:0,
            };
            //初始加载活动列表，并将最近的，进行中的活动赋值
            campaignsList(data).then(res => {
                if (res.data.isSuccessful === "Y") {
                    this.curCampaignList = res.data.data.campaignsList;
                    this.data.campaignUid = this.curCampaignList.length>0?this.curCampaignList[0].campaignUid:'';
                    this.init();
                } else {
                    this.$message.error(res.data.message);
                }
            }).catch(err => {console.log("错误了")});
        },
        methods: {
            init(){
                //获取用户信息，加载表格数据
                let data = JSON.parse(JSON.stringify(this.data));
                data.memberNickName = this.$util.encode(data.memberNickName);
                data.page --;
                sendBlessingRecordList(data).then(result => {
                    if(result.data.isSuccessful === 'Y'){
                        console.log(result);
                        this.sendBlessingList = result.data.data.data;
                        //分页的话还需初始化count
                        this.count = result.data.data.count;
                        // console.log(JSON.stringify( this.sendBlessingList))
                    }
                    else {
                        this.sendBlessingList = [];
                        this.$message.error(result.data.message);
                    }
                }).catch(err => {});
            },
            //用户编码
            deCodes(str) {
                return this.$util.decode(str);
            },
            //搜索
            search(){
                this.init();
            },
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
            checkUserType(){
                this.init();
            },
            resetQuery(){
                this.data = {
                    campaignUid:'',
                    memberNickName:'',
                    userType:'',
                    memberLabelTreeCode:'',
                    page:1,
                };
                this.data.campaignUid = this.curCampaignList.length>0?this.curCampaignList[0].campaignUid:'';
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
  /*表格*/
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
