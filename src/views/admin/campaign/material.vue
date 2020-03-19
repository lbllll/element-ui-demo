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
        <!--用户类型-->
        <div>
          <el-select
            class="selectStyle"
            v-model="data.userType"
            prop="resourceState"
            placeholder="用户类型"
            size="small"
            @change="checkUserType"
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="item in userTypeList"
              :key="item.userType"
              :label="item.name"
              :value="item.userType"
            ></el-option>
          </el-select>
        </div>
<!--        &lt;!&ndash;   领取状态   &ndash;&gt;
        <div>
          <el-select
            class="selectStyle"
            v-model="data.drawState"
            prop="resourceState"
            placeholder="领取状态"
            size="small"
            @change="checkCampaign"
          >
            <el-option
              v-for="item in drawStateList"
              :key="item.drawState"
              :label="item.name"
              :value="item.drawState"
            ></el-option>
          </el-select>
        </div>-->
      </div>
      <br>
      <div class="row-two">
        <!--   用户昵称   -->
        <div class="inputStyle">
          <el-form-item prop="resourceAuthorNickName"  can-be-empty>
            <el-input class="inputs" placeholder="用户昵称" size="mini" v-model="data.memberNickName"></el-input>
          </el-form-item>
        </div>
        <!--   作者名   -->
        <div class="inputStyle">
          <el-form-item prop="nickName"  can-be-empty>
            <el-input class="nickName" placeholder="物资名称" size="mini" v-model="data.materialName"></el-input>
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
      :data="materialIssueList"
      border
      :row-key="getRowKeys"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
      ref="multipleTable"
      @selection-change="handleSelectionChange">
      <el-table-column align="left" type="selection" reserve-selection width="40"></el-table-column>
      <el-table-column prop="drawOrder" align="left" width="80" label="领取顺序号">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder"></span>{{scope.row.drawOrder}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="memberInfo" align="left" width="220" label="用户信息"  >
        <template slot-scope="scope">
          <div>
            <img class="userHeadImg" v-image-preview :src="scope.row.memberHeadPicUrl==''?' ':scope.row.memberHeadPicUrl" width="50" height="50" />
            <div class="userNameAndSex">
              <span class="nickName">昵称：{{deCodes(scope.row.memberNickName)}}</span><br>
              <span class="sex">性别：{{scope.row.memberSex==null?"保密":sexGroup[scope.row.memberSex]}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sourceInfo" align="left"  label="物资信息">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">物资名称：</span>{{scope.row.materialName}}</span>；
          <span><span style="font-weight: bolder">物资规格：</span>{{scope.row.materialSpecifications}}</span>
          <br>
          <span><span style="font-weight: bolder">原价：</span>{{$util.prices(scope.row.materialCostPrice)}} 元</span>；
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
      <el-table-column prop="sourceInfo" align="left"  label="客户收获信息">
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">地址：</span>{{scope.row.deliveryAddress==null?'用户还未填写':scope.row.deliveryAddress}}</span>
          <br>
          <span><span style="font-weight: bolder">详细地址：</span>{{scope.row.deliveryAddressDetail==null?'用户还未填写':scope.row.deliveryAddressDetail}}</span>
          <br>
          <span><span style="font-weight: bolder">联系客户：</span>{{scope.row.deliveryUserName==null?'用户还未填写':scope.row.deliveryUserName}}</span>
          <br>
          <span><span style="font-weight: bolder">联系电话：</span>{{scope.row.deliveryMobile==null?'用户还未填写':scope.row.deliveryMobile}}</span>
          <br>
        </template>
      </el-table-column>
      <!--操作列处理-->
      <el-table-column label="操作" align="left" >
        <template slot-scope="scope">
          <span><span style="font-weight: bolder">领取状态：</span>{{drawStates[scope.row.drawState]}}</span>
          <br>
          <div v-if="scope.row.drawState == 1">
            <el-button style="color: red" @click="waitCheck(scope.row.recordUid)" type="text" size="small">客服待确认</el-button>
          </div>
          <div v-if="scope.row.drawState == 2">
            <el-button @click="deliveryPageOpen(scope.row.recordUid,scope.row.drawState)" type="text" size="small">已确认待发货</el-button>
          </div>
          <div v-if="scope.row.drawState == 3">
            <el-button @click="modifyNumberPageOpen(scope.row.recordUid,scope.row.trackingNumber,scope.row.trackingCompany,scope.row.drawState)" type="text" size="small">修改单号</el-button>
            <el-button @click="checkLogisticsPageOpen(scope.row.recordUid)" type="text" size="small">查看物流</el-button>
          </div>
          <div v-if="scope.row.drawState == 4">
            <el-button type="text" size="small">已收货</el-button>
          </div>
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


    <!--打开发货界面-->
    <el-dialog
      :title="drawState==2?'填写单号发货':'修改单号'"
      :visible.sync="deliveryPage"
      width="50%"
      :destroy-on-close="true"
      @close="nodeCollapse"
    >
      <el-form ref="deliveryDataForm" :model="deliveryData"  label-width="100px">
        <el-form-item label="快递公司" verify prop="trackingCompany">
          <el-select v-model="deliveryData.trackingCompany " prop="trackingCompany" placeholder="请选择">
            <el-option
              v-for="(item, index) in channelList"
              :key="item.channelCode"
              :label="item.channelName"
              :value="item.channelCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号"  prop="trackingNumber" verify>
          <el-input v-model="deliveryData.trackingNumber" style="width:200px"></el-input>
        </el-form-item>
        <!--        <div v-else class="logistics">
                  <div v-for="(item, index) in query.Traces" :key="index">
                    <span>{{item.AcceptTime}}</span>
                    <span>{{item.AcceptStation}}</span>
                  </div>
                </div>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deliveryPage = false">返 回</el-button>
        <el-button v-if="this.drawState == 2" type="primary" @click="delivery">发 货</el-button>
        <el-button v-if="this.drawState == 3" type="primary" @click="delivery">修改单号</el-button>
      </span>
    </el-dialog>

    <!--查看物流信息-->
    <el-dialog
      title="查看物流信息"
      :visible.sync="checkLogisticsPage"
      width="50%"
      :destroy-on-close="true"
      @close="nodeCollapse"
    >
      <div v-if="traces.length > 0" v-for="(item, index) in traces" :key="index">
        <div style="margin:10px">
          <div style="margin:10px"><span>{{item.Location}}</span>：<span>{{item.AcceptTime}}</span></div>
          <div style="margin:10px">{{item.AcceptStation}}</div>
          <hr>
        </div>
      </div>
      <div v-if="traces.length === 0">
        <span>暂未查到物流信息，请确认物流公司和订单号！</span>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="checkLogisticsPage = false">返 回</el-button>
      </span>
    </el-dialog>

<!--    setMaterialsDetailPageOpen  用户打开用户领取物资详情-->
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
        campaignsOnline,

        campaignsMaterialConfirm,
        campaignsMaterialDelivery,
        campaignsMaterialInfoList,
        campaignsMaterialSend,
        trackingCompanyList,
    } from "@/api/table";
    export default {
        name: "MATERIAL",
        components: {},
        data() {
            return {
                data:{
                    campaignUid:'',
                    // drawState:'',//状态[1-待确认, 2-待发货, 3-待收货, 4-已收货]
                    materialName:'',
                    memberLabelTreeCode:'',
                    memberNickName:'',
                    userType:'',
                    page:1,
                },
                //分页
                isIndeterminate: false,
                checkAll: false,
                count: 0,
                multipleSelection: [],
                //物资发放列表
                materialIssueList:[
                ],
                //用户类型
                userTypeList:[
                    {
                        userType:"3",
                        name:"平台签约作者",
                    },
                    {
                        userType:"2",
                        name:"作者",
                    },
                    {
                        userType:"1",
                        name:"普通用户",
                    }

                ],
                userType:'',
                userTypes:{
                    "3":"平台签约作者",
                    "2":"作者",
                    "1":"普通用户",
                },
                //当前选择
                curCampaignInfo:[],
                curCampaignList:[],
                //性别
                //性别类型
                sexGroup:{
                    'MAN':"男",
                    'WOMAN':"女",
                    'NONE':"保密",
                    'MAN_WOMAN':"不男不女",
                },
                //发货状态drawState状态[1-待确认, 2-待发货, 3-待收货, 4-已收货]
                drawStates:{
                    1:'待确认',
                    2:'待发货',
                    3:'待收货',
                    4:'已收货',
                },
                drawStateList:[
                    {
                        drawState:'1',
                        name:'待确认',
                    },
                    {
                        drawState:'2',
                        name:'待发货',
                    },
                    {
                        drawState:'3',
                        name:'待收货',
                    },
                    {
                        drawState:'4',
                        name:'已收货',
                    },

                ],
                drawState:'',
                //打用户领取详情
                setMaterialsDetailPageOpen:false,
                //打开物流查询
                checkLogisticsPage:false,
                //打开发货或者修改单号页面
                deliveryPage:false,
                recordUid:'',
                //活动列表：
                campaignList:[],
                //快递发货信息
                deliveryData:{
                    recordUid:'',
                    trackingCompany :'',
                    trackingNumber :'',
                },
                //快递公司信息
                channelList:[
                ],
                queryCode: false,
                query:{},
                traces:[],

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
            /*查询快递公司列表*/
            trackingCompanyList().then(res => {
                if (res.data.isSuccessful === "Y") {
                    console.log(res);
                    this.channelList = res.data.data;
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
                campaignsMaterialInfoList(data).then(res => {
                    if (res.data.isSuccessful === "Y") {
                        console.log(res);
                        this.materialIssueList = res.data.data.data;
                        this.count = res.data.data.count;
                        // console.log(this.materialIssueList)
                    } else {
                        this.materialIssueList = [];
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {console.log("错误了")});
            },
            //搜索
            search(){this.init();},
            resetQuery(){
                this.data = {
                    materialName:'',
                    campaignUid:'',
                    memberNickName:'',
                    userType:'',
                    memberLabelTreeCode:'',
                    page:1,
                };
                this.data.campaignUid = this.curCampaignList.length>0?this.curCampaignList[0].campaignUid:'';
                this.init();
            },
            //用户类型
            checkUserType(){this.init()},
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
            //用户编码
            deCodes(str) {
                return this.$util.decode(str);
            },
            //打开用户领取详情页面
            setMaterialsDetailPage(memberUid,campaignUid){
                this.setMaterialsDetailPageOpen = true;
            },
            //待确认需要确认的：
            waitCheck(recordUid){
                campaignsMaterialConfirm({recordUid:recordUid}).then(res => {
                    if (res.data.isSuccessful === "Y") {
                        this.$message({
                            message: "已确认",
                            type: "success"
                        });
                        setTimeout(() => {
                            this.init();
                        }, 2000);
                        //跳转到列表
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {console.log("错误了")});
            },
            //发货页面和发货
            deliveryPageOpen(recordUid,drawState){
                this.drawState = drawState;
                this.deliveryData = {
                    recordUid:recordUid,
                    trackingCompany :'',
                    trackingNumber :'',
                };
                this.deliveryPage = true;
            },
            //填写快递公司和单号发货
            delivery(){
                this.$refs['deliveryDataForm'].validate((valid) => {
                    if (valid) {
                        console.log(this.deliveryData);
                        campaignsMaterialSend(this.deliveryData).then(res => {
                            if (res.data.isSuccessful === "Y") {
                                this.$message({
                                    message: "发货成功",
                                    type: "success"
                                });
                                setTimeout(() => {
                                    this.init();
                                }, 2000);
                                //跳转到列表
                            } else {
                                this.$message.error(res.data.message);
                            }
                        }).catch(err => {console.log("错误了")});
                        this.deliveryPage = false;
                    }
                });

            },
            //修改单号
            modifyNumberPageOpen(recordUid,trackingNumber,trackingCompany,drawState){
                this.drawState = drawState;
                this.deliveryData = {
                    recordUid:recordUid,
                    trackingCompany :trackingCompany,
                    trackingNumber :trackingNumber,
                };
                this.deliveryPage = true;
            },
            modifyNumber(){
                this.$refs['deliveryDataForm'].validate((valid) => {
                    if (valid) {
                        console.log(this.deliveryData);
                        campaignsMaterialSend({recordUid:recordUid}).then(res => {
                            if (res.data.isSuccessful === "Y") {
                                this.$message({
                                    message: "修改成功",
                                    type: "success"
                                });
                                setTimeout(() => {
                                    this.init();
                                }, 2000);
                                //跳转到列表
                            } else {
                                this.$message.error(res.data.message);
                            }
                        }).catch(err => {console.log("错误了")});
                    }
                });
                this.deliveryPage = false;
            },
            //base64解码
            deCodes(str) {
                return this.$util.decode(str);
            },
            //查看物流
            checkLogisticsPageOpen(recordUid){
                campaignsMaterialDelivery({recordUid:recordUid}).then(res => {
                    if (res.data.isSuccessful === "Y") {
                        // console.log(this.deCodes(res.data.data));
                        this.query = JSON.parse(this.deCodes(res.data.data));
                        console.log(this.query);
                        console.log(this.query.Traces);
                        this.traces = this.query.Traces.reverse();
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {console.log("错误了")});
                this.checkLogisticsPage = true
            },
            //关闭弹窗清空某些数据
            nodeCollapse() {},
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
  /*编辑页面*/
  .title {
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
