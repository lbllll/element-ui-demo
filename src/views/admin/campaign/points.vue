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
      :data="pointList"
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

      <el-table-column prop="redPacketAmount" align="left" width="220"  label="祝福发送情况">
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

      <el-table-column prop="redPacketAmount" align="left" width="200"  label="积分信息">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">积分数：</span>{{scope.row.pointCounts}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="sourceInfo" align="left"  width="300" label="领取物资奖品数">
        <template slot-scope="scope">
            <span><span style="font-weight: bolder">领取物资奖品数：</span>{{scope.row.getMaterialCount}} 件</span>
            <br>
            <span><span style="font-weight: bolder">物资金额：</span>{{$util.prices(scope.row.getMaterialAmount)}} 元</span>
            <br>
          <el-button type="text" ize="mini" @click="checkMaterialDetails(scope.row)">查看领取物资详情</el-button>
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
    <!--领取物资详情-->
    <el-dialog
      title="活动物资管理"
      :visible.sync="materialDetailPage"
      width="70%"
      :destroy-on-close="true"
      @close="nodeCollapse"
    >
      <!--物资列表-->
      <el-table
        :data="materialList"
        border
        :row-key="getRowKeysForMaterial"
        :header-cell-style="{background:'#afafaf',color:'#606266'}"
        ref="multipleTable"
      >
        <el-table-column align="left" type="selection" reserve-selection width="40"></el-table-column>
        <el-table-column prop="sourceInfo" align="left"  label="物资信息">
          <template slot-scope="scope">
            <span><span style="font-weight: bolder">物资名称：</span>{{scope.row.materialName}}</span>；
            <span><span style="font-weight: bolder">物资规格：</span>{{scope.row.materialSpecifications}}</span>
            <br>
            <span><span style="font-weight: bolder">成本价：</span>{{$util.prices(scope.row.materialCostPrice)}} 元</span>；
            <span><span style="font-weight: bolder">销售价：</span>{{$util.prices(scope.row.materialSellPrice)}} 元</span>
            <br>
          </template>
        </el-table-column>
        <el-table-column prop="sourceInfo" align="left"  label="领取信息">
          <template slot-scope="scope">
            <span><span style="font-weight: bolder">领取时间：</span>{{scope.row.drawTime}}</span>
            <br>
            <span><span style="font-weight: bolder">领取数量：</span>{{scope.row.drawQuantity}}</span>
            <br>
            <span><span style="font-weight: bolder">消耗积分：</span>{{scope.row.spentPoints}}</span>
            <br>
          </template>
        </el-table-column>
        <!--      <el-table-column prop="sourceInfo" align="left" width="200" label="领取信息">
                <template slot-scope="scope">
                  &lt;!&ndash;  todo 需要后台统计好传过来，暂时没加这个字段&ndash;&gt;
                  <span>领取物资总数：{{scope.row.drawQuantity}}</span>
                  <br>
                  <span><el-button type="text" @click="setMaterialsDetailPage(scope.row.memberUid,scope.row.campaignUid)" size="small">查看详情</el-button></span>
                </template>
              </el-table-column>-->
        <!--操作列处理-->
        <el-table-column label="操作" align="left" >
          <template slot-scope="scope">
            <span><span style="font-weight: bolder">领取状态：</span>{{drawStates[scope.row.drawState]}}</span>
            <br>
<!--            <div v-if="scope.row.drawState == 1">
              <el-button @click="waitCheck(scope.row.recordUid)" type="text" size="small">客服待确认</el-button>
            </div>
            <div v-if="scope.row.drawState == 2">
              <el-button @click="deliveryPageOpen(scope.row.recordUid,scope.row.drawState)" type="text" size="small">已确认待发货</el-button>
            </div>
            <div v-if="scope.row.drawState == 3">
              <el-button @click="modifyNumberPageOpen(scope.row.recordUid,scope.row.trackingNumber,scope.row.trackingCompany,scope.row.drawState)" type="text" size="small">修改单号</el-button>
              <el-button @click="checkLogisticsPageOpen(scope.row.trackingNumber,scope.row.trackingCompany)" type="text" size="small">查看物流</el-button>
            </div>
            <div v-if="scope.row.drawState == 4">
              <el-button type="text" size="small">已收货</el-button>
            </div>-->
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
          <!-- todo  选择物资，输入数量，上线前可以编辑，删除，上线后不能动-->
          <el-button size="small" @click="materialDetailPage = false">返 回</el-button>
      </span>
    </el-dialog>



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

        userPointList,
        userGetMaterialList,
    } from "@/api/table";
    export default {
        name: "POINTS",
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
                curCampaignList:[],
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
                //分页
                isIndeterminate: false,
                checkAll: false,
                count: 0,
                multipleSelection: [],
                //活动列表：
                campaignList:[],
                //性别类型
                sexGroup:{
                    'MAN':"男",
                    'WOMAN':"女",
                    'NONE':"保密",
                    'MAN_WOMAN':"不男不女",
                },
                materialList:[
/*                    {
                        memberUid:'1',//用户
                        materialUid:'11',//物资uid
                        campaignUid:'111',//活动uid
                        recordUid:'111',//记录uid
                        memberHeadPicUrl:'123',
                        memberNickName:'123',
                        memberSex:'',
                        campaignName:'物资名字',//名称/规格/价格
                        materialSpecifications:'big',//物资规格
                        materialCostPrice:'物资成本6',//物资成本价(分)
                        materialSellPrice:'销售价格8',//物资销售价(分)
                        drawTime:'领取时间',//领取时间
                        drawQuantity:'领取数量',//领取数量
                        spentPoints:'消耗积分1',//消耗积分
                        drawState:'2',//状态[1-待确认, 2-待发货, 3-待收货, 4-已收货]
                        trackingNumber:'运单五六号',//物流运单号
                        trackingCompany:'快递公司',
                        confirmTime:'确认时间',//确认时间
                        sendOutTime:'发货时间',//发货时间
                        takeDeliveryTime:'收货时间',//收货时间
                        drawOrder:'1',//领取顺序号
                    },*/
                ],
                pointList:[
                ],
                //当前选中行红包信息
                curPacketInfo:{},
                //打开领取物资记录列表
                materialDetailPage:false,
                //物资列表
                materialDetailList:[],
                //发货状态drawState状态[1-待确认, 2-待发货, 3-待收货, 4-已收货]
                drawStates:{
                    1:'待确认',
                    2:'待发货',
                    3:'待收货',
                    4:'已收货',
                },
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
            //初始加载活动列表，并将最近的活动赋值
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
                let data = JSON.parse(JSON.stringify(this.data));
                data.memberNickName = this.$util.encode(data.memberNickName);
                data.page --;
                console.log(data);
                // return false;
                userPointList(data).then(res => {
                    if (res.data.isSuccessful === "Y") {
                        this.pointList = res.data.data.data;
                        this.count = res.data.data.count;
                    } else {
                        this.pointList = [];
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {console.log("错误了")});
            },
            //用户编码
            deCodes(str) {
                return this.$util.decode(str);
            },
            //搜索
            search(){this.init();},
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
                console.log(this.data.userType);
                this.init();
            },
            nodeCollapse(){},
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
            //查看物资详情列表
            checkMaterialDetails(row){
                let data = {
                    campaignUid:row.campaignUid,
                    memberUid:row.memberUid
                };
                userGetMaterialList(data).then(res => {
                    if (res.data.isSuccessful === "Y") {
                        this.materialList = res.data.data;
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {console.log("错误了")});
                this.materialDetailPage = true;
            },
            getRowKeysForMaterial(row){
                return row.materialUid;
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
