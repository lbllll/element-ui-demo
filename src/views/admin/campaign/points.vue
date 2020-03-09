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
      :data="pointList"
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
      <el-table-column prop="redPacketAmount" align="left" width="200"  label="积分红包信息">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">积分数：</span>{{scope.row.points}}</span>
          <br>
          <span><span style="font-weight: bolder">获得红包数：</span>{{scope.row.packetCounts}}</span>
          <br>
          <span><span style="font-weight: bolder">获得红包金额：</span>{{scope.row.redPacketAmount}}</span>
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
      <el-table-column prop="sourceInfo" align="left"  width="300" label="领取物资奖品数">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">领取物资奖品数：</span>{{scope.row.receivedCount}}</span>
          <br>
          <el-button type="text" ize="mini" @click="checkMaterialDetails(scope.row)">查看物资详情</el-button>
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
        <el-table-column prop="drawOrder" align="left" width="150" label="领取顺序号">
          <template slot-scope="scope">
            <span><span style="font-weight: bolder">领取顺序号：</span>{{scope.row.drawOrder}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memberInfo" align="left" width="220" label="用户信息"  >
          <template slot-scope="scope">
            <div>
              <img class="userHeadImg" v-image-preview :src="scope.row.memberHeadPicUrl==''?' ':scope.row.memberHeadPicUrl" width="50" height="50" />
              <div class="userNameAndSex">
                <span class="nickName">昵称：{{scope.row.memberNickName}}</span><br>
                <span class="sex">性别：{{scope.row.memberSex==null?"保密":sexGroup[scope.row.memberSex]}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sourceInfo" align="left"  label="物资信息">
          <template slot-scope="scope">
            <span><span style="font-weight: bolder">物资名称：</span>{{scope.row.campaignName}}</span>；
            <span><span style="font-weight: bolder">物资规格：</span>{{scope.row.materialSpecifications}}</span>
            <br>
            <span><span style="font-weight: bolder">成本价：</span>{{scope.row.materialCostPrice}}</span>；
            <span><span style="font-weight: bolder">销售价：</span>{{scope.row.materialSellPrice}}</span>
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
    export default {
        name: "POINTS",
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
                    {
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
                    },
                ],
                pointList:[
                    {
                        campaignUid:'1',//活动id
                        packetUid:'2',//红包id
                        memberUid:'3',//用户id
                        memberNickName:'sss',//用户昵称
                        memberSex:'MAN',
                        memberHeadPicUrl: '',//用户头像
                    },
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
                console.log(this.formData.userType);
                this.init();
            },
            nodeCollapse(){},
            //查看物资详情列表
            checkMaterialDetails(row){
                this.curPacketInfo = row;
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
