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
<template>
  <div>
    <!--  筛选提交表单 -->
    <el-form :model="formData" ref="searchs" class="searchBox">
      <!--   用户类型   -->
      <div class="selectStyle">
        <el-select
          class="data"
          v-model="formData.userType"
          prop="userType"
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
      <!--   用户昵称   -->
      <div class="inputStyle">
        <el-form-item prop="wechatNickName"  can-be-empty>
          <el-input class="inputs" placeholder="请输入用户昵称" size="mini" v-model="formData.wechatNickName"></el-input>
        </el-form-item>
      </div>
      <!--   联系方式   -->
      <div class="inputStyle">
        <el-form-item prop="wechatMobile"  can-be-empty>
          <el-input class="inputs" placeholder="请输入用户联系方式" size="mini" v-model="formData.wechatMobile"></el-input>
        </el-form-item>
      </div>
      <!--标签筛选-->
      <div class="inputStyle">
        <el-form-item prop="labelIds"  can-be-empty>
          <el-popover
            placement="bottom"
            title="标签"
            width="300"
            trigger="click">
            <el-tree
              ref="filterTree"
              :data="labelList"
              show-checkbox
              node-key="labelTreeCode"
              check-strictly
              :props="defaultProps"
              :default-checked-keys="filterLabelsList"
              :default-expanded-keys="filterLabelsList"
              @check-change="checkOnlyOneLabel"
              @node-click-="checkOnlyOneLabel"
            >
            </el-tree>
            <div style="margin-top: 20px">
              <el-button size="mini" @click="resetFilterQuery()">重 置</el-button>
              <el-button size="mini" type="primary" @click="filterByLabels">筛 选</el-button>
<!--              <el-button type="primary" @click="checkAllTree" size="mini">全选</el-button>
              <el-button @click="cancelAllTree" size="mini">取消全选</el-button>-->
            </div>
            <el-button size="small" slot="reference">选择标签</el-button>
          </el-popover>
        </el-form-item>
      </div>
<!--
      &lt;!&ndash;   备注   &ndash;&gt;
      <div class="inputStyle">
        <el-form-item prop="remarks"  can-be-empty>
          <el-input class="inputs" placeholder="请输入用户备注" size="mini" v-model="formData.remarks"></el-input>
        </el-form-item>
      </div>
-->

      <div class="searchStyle">
        <el-button type="primary"  size="small" @click="search()">搜索</el-button>
        <el-button size="small" @click="resetQuery()">重置</el-button>
      </div>
    </el-form>

    <!--  表格数据  -->
    <el-table
      class="tableStyle"
      :data="memberList"
      border
      :row-key="getRowKeys"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="left" type="selection" reserve-selection width="40"></el-table-column>

      <el-table-column prop="memberInfo" width="200" align="left" label="用户信息" >
        <template slot-scope="scope">
          <div>
            <img class="userHeadImg" v-image-preview :src="scope.row.wechatHeadPath" width="50" height="50" />
            <div class="userNameAndSex">
              <span class="nickName">{{deCodes(scope.row.wechatNickName)}}</span><br>
              <span class="sex">性别：{{scope.row.wechatSex==null?"保密":sexGroup[scope.row.wechatSex]}}</span>
            </div>
          </div>
          <div class="userOpenId">
            <el-tooltip :content="scope.row.wechatOpenid">
<!--              <span>微信号：{{scope.row.wechatOpenid | controlLengthOpenId}}</span>-->
              <span>微信号：{{scope.row.wechatOpenid | controlLengthOpenId}}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="country" align="left" width="180" label="城市">
        <template slot-scope="scope">
          <span>{{scope.row.wechatCountry===null?'':scope.row.wechatCountry}}</span>
          <span>{{scope.row.wechatProvince===null?'':scope.row.wechatProvince}}</span>
          <span>{{scope.row.wechatCity===null?'未获取':scope.row.wechatCity}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="wechatMobile" align="left" width="120" label="联系方式">
        <template slot-scope="scope">
          <span>{{scope.row.wechatMobile==null?"用户暂未授权":scope.row.wechatMobile}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="country" align="left" width="160" label="用户简介">
        <template slot-scope="scope">
          <span>类型：{{userTypes[scope.row.userType]}}</span>
          <br>
          <el-tooltip :content="scope.row.userIntroduction">
            <span>简介：{{scope.row.userIntroduction == null?'用户懒，暂无简介':scope.row.userIntroduction | controlLength}}</span>
          </el-tooltip>
          <br>
          <span><el-button type="text" @click="setUserType(scope.row.memberUid,scope.row.userType)" size="small">设置用户类型</el-button></span>
        </template>
      </el-table-column>
      <el-table-column prop="userBehavior" align="left"  width="110" label="用户行为">
        <template slot-scope="scope">
          <span>送出祝福：{{scope.row.userSendGiftsCount}}</span><br>
          <span>收到祝福：{{scope.row.userReceivedGiftsCount}}</span><br>
          <span>发布作品：{{scope.row.userPublishedWorksCount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userSocial" align="left" width="110" label="社交汇总">
        <template slot-scope="scope">
          <span>粉丝数：{{scope.row.userFansCount}}</span><br>
          <span>关注数：{{scope.row.userFollowCount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userCount" align="left" width="110" label="资金信息">
        <template slot-scope="scope">
          <span>收入：{{$util.prices(scope.row.grossIncome)}} 元</span><br>
          <span>冻结：{{$util.prices(scope.row.lockedBalance)}} 元</span><br>
          <span>余额：{{$util.prices(scope.row.usableBalance)}} 元</span><br>
<!--          <span><el-button type="text" @click="checkAccountDetails(scope.row.userAccountId)" size="small">查看详情</el-button></span>-->
        </template>
      </el-table-column>

      <el-table-column prop="userPlayRecord" align="left" width="160" label="操作记录">
        <template slot-scope="scope">
          <span>创建时间：{{$timeUtil.getFormatTime(scope.row.createTime)}}</span><br>
          <span>最后登录：{{$timeUtil.getFormatTime(scope.row.lastLoginTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userRemark" width="150" align="left" label="备注">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.remark">
            <span>{{scope.row.remark | controlLength}}</span>
          </el-tooltip>
          <span class="editRemark"><el-button type="text" @click="setRemark(scope.row.memberUid,scope.row.remark)" size="small">编辑</el-button></span>
        </template>
      </el-table-column>

      <el-table-column prop="labelTreeCodes" align="left" label="标签"  >
        <template slot-scope="scope">
          <div class="label-max-height">
            <el-tag class="labelStyle"  v-for="(item,index) in scope.row.curlabels">{{item.labelPathText}}</el-tag>
          </div>
          <span><el-button type="text" @click="checkLabels(scope.row)" size="small">打标签</el-button></span>
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
        :current-page="formData.page"
        :page-size="10"
        background
        layout="total, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>

    <!--弹出层查看用户账户流水-->
    <el-dialog
      title="账户流水"
      :visible.sync="controlOpenAccountDetail"
      width="50%"
    >
      <el-table
        :data="accountInfoList"
        border
        style="width: 100%"
        :header-cell-style="{background:'#afafaf',color:'#606266'}"
      >
        <el-table-column prop="transactionType" align="left" label="交易类型">
          <template slot-scope="scope">
            <span
              :class="scope.row.transactionType === '1' ? 'black' : scope.row.transactionType === '2' ? 'red' : scope.row.transactionType === '3' ? 'green':''">
              {{transactionTypes[scope.row.transactionType]}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="transactionAmount" align="left" label="交易金额"></el-table-column>
        <el-table-column prop="transactionTime" align="left" label="交易时间"></el-table-column>
        <el-table-column prop="transactionObject" align="left" label="交易对象"></el-table-column>
        <el-table-column prop="remark" align="left" label="备注">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.remark">
              <span>{{scope.row.remark | controlLength}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--弹出层编辑用户备注-->
    <el-dialog
      title="设置备注"
      :visible.sync="controlOpenUserRemark"
      width="30%"
      :destroy-on-close="true"
    >
      <el-form>
        <div class="title">
          <el-form-item prop="remarks"  can-be-empty>
            <el-input class="inputs" placeholder="请输入备注" size="mini" v-model="curRemark"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="controlOpenUserRemark = false">取 消</el-button>
        <el-button type="primary" @click="setRemarkSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--弹出层编辑用户类型-->
    <el-dialog
      title="设置类型"
      :visible.sync="controlOpenUserType"
      width="30%"
      :destroy-on-close="true"
    >
      <el-form>
        <el-select
          class="data"
          v-model="userType"
          prop="userType"
          placeholder="用户类型"
          size="small"
          @change="checkUserTypeNew"
        >
          <el-option value="">全部</el-option>
          <el-option
            v-for="item in userTypeList"
            :key="item.userType"
            :label="item.name"
            :value="item.userType"
          ></el-option>
        </el-select>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="controlOpenUserType = false">取 消</el-button>
        <el-button type="primary" @click="setUserTypeSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--  弹出层设置标签 -->
    <el-dialog
      title="请设置标签"
      :visible.sync="controlOpenSetLabels"
      width="50%"
      :destroy-on-close="true"
      @close="nodeCollapse"
    >
      <el-tree
        ref="tree"
        :data="labelList"
        show-checkbox
        node-key="labelTreeCode"
        :props="defaultProps"
        :default-checked-keys="curUserLabelsList"
        :default-expanded-keys="curUserLabelsList"
        @check-change="handleCheckChange"
      >
      </el-tree>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="checkAllTree" size="mini">全选</el-button>
        <el-button @click="cancelAllTree" size="mini">取消全选</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="controlOpenSetLabels = false">取 消</el-button>
        <el-button type="primary" @click="checkLabelsSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
    import {
        blessingList,
        moduleList,
        blessingState,
        blessingRemarkType,
        blessingLabels,
        blessingDelete,
        labelListAll,
        memberList,
        memberRemark,
        memberLabel,
        memberDelete,
        memberType,
        labelListByBusinessType
    } from "@/api/table";
    export default {
        name: 'MEMBER_LIST',
        components: {},
        data() {
            return {
                formData:{
                    userType:"",//用户类型：普通用户，平台签约作者，作者
                    wechatNickName:"",//卡片名字
                    wechatMobile:"",//卡片名字
                    labelIds:"",
                    remarks:"",
                    page: 1,
                },
                cardList:[
                ],
                labelList:[
                ],
                memberList:[],
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
                //打开账户流水查看详情
                controlOpenAccountDetail:false,
                //打开用户类型选项设置
                controlOpenUserType:false,
                //账户详情
                accountInfoList:[
                    {
                        transactionType:"1",//交易类型
                        transactionAmount :"10",//金额
                        transactionTime:"2005-11-5 13:21:25 ",//交易时间
                        transactionObject:"张三",//交易对象
                        remark:"备备注备注备注备注注",//交易对象
                    },
                    {
                        transactionType:"2",//交易类型
                        transactionAmount :"30",//金额
                        transactionTime:"2005-11-5 13:21:25 ",//交易时间
                        transactionObject:"张三",//交易对象
                        remark:"备注2222222222222222",//交易对象
                    },
                    {
                        transactionType:"3",//交易类型
                        transactionAmount :"66",//金额
                        transactionTime:"2020-2-16 13:21:25 ",//交易时间
                        transactionObject:"张三",//交易对象
                        remark:"备注33333333333333333333333333",//交易对象
                    },
                ],
                transactionTypes:{
                    "1":"收入",
                    "2":"支出",
                    "3":"提现",
                },
                controlOpenUserRemark:false,
                //修改备注预存数据
                curMemberId:"",
                curRemark:"",
                //分页
                isIndeterminate: false,
                checkAll: false,
                count: 6,
                multipleSelection: [],
                //控制打开设置标签界面
                controlOpenSetLabels:false,
                curUserLabelsList:[],
                //筛选标签列表
                filterLabelsList:[],
                checkLabelId:'',
                //预存选择的标签
                checkedLabels:[],
                //树形所需
                defaultProps: {
                    children: "child",
                    label: "labelText"
                },
                state:[
                    {
                        isDeleted:"1",
                        name:"未删除"
                    },
                    {
                        isDeleted:"2",
                        name:"已删除"
                    },
                ],
                //性别类型
                sexGroup:{
                    'MAN':"男",
                    'WOMAN':"女",
                    'NONE':"保密",
                    'MAN_WOMAN':"不男不女",
                },
                curMemberInfo:{},
                labelListNoTree:[],
            }
        },
        //多选配置
        props: {
            checkItem: Boolean,
            selectArr: Array
        },
        created() {
            //遍历所有用户标签，进行标签树组装
            labelListByBusinessType({labelBusinessType:"3"}).then(result => {
                if(result.data.isSuccessful === "Y"){
                    //附一个没有树结构的标签列表,便于遍历，展示
                   this.labelListNoTree =  result.data.data;
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
                }
            }).catch(err => {});
            this.init();
        },
        filters: {
            //控制字符串长度，过长显示...
            controlLength(curStr) {
                if(!curStr){
                    return "";
                }
                if(curStr.length > 18){
                    return curStr.slice(0,18)+"..."
                }
                return curStr;
            },
            //控制微信号长度，过长显示...
            controlLengthOpenId(curStr) {
                if(!curStr){
                    return "";
                }
                if(curStr.length > 8){
                    return curStr.slice(0,12)+"..."
                }
                return curStr;
            },
        },
        methods: {
            getRowKeys(row) {
                // 给表格每行增加一个唯一 标识，用作切换分页后保留被选中行的信息
                return row.cardId;
            },
            init() {
                //如果是标签页面过来完全跳转
                if(this.$route.params.memberLabelTreeCodes){
                    console.log("memberTreeCode==="+this.$route.params.memberLabelTreeCodes);
                    this.formData.labelIds = this.$route.params.memberLabelTreeCodes;
                }
                //获取用户信息，加载表格数据
                let data = JSON.parse(JSON.stringify(this.formData));
                data.wechatNickName = this.$util.encode(data.wechatNickName);
                data.page --;
                memberList(data).then(result => {
                    if(result.code == 200){
                        this.memberList = result.data.data;
                        //遍历加上一个存标签集合的字段
                        this.memberList.forEach(e => {
                            let curLabelsGroup = [];
                            let  curLabelsCode= e.labelTreeCodes==null?[]:e.labelTreeCodes.split(",");
                            this.labelListNoTree.forEach(item => {
                                for(let i =0;i<curLabelsCode.length;i++ ){
                                    if(item.labelTreeCode === curLabelsCode[i]){
                                        curLabelsGroup.push(item);
                                    }
                                }
                            });
                            e.curlabels = curLabelsGroup;
                        });
                        //分页的话还需初始化count
                        this.count = result.data.count;
                        // console.log(JSON.stringify( this.blessingList))
                    }
                }).catch(err => {});
            },
            search() {
                this.init();
            },
            //目前选中用户类型
            checkUserType() {
                console.log(this.formData.userType)
                this.init();
            },
/*            //表头添加一个标签按钮
            renderHeader(h,params) {
                let a = [h('el-button', {
                    props: {
                        size:'mini',
                        placement:"bottom",
                        title:"标题",
                        width:"200",
                        trigger:"click",
                        content:"这是一段内容,这是一段内容,这是一段内容,这是一段内容。",
                    },
                    on: {
                        click: () => {
                            this.openFilterLabels();
                        }
                    }
                }, '标签筛选')];
                return h('div', a);
            },*/
            //打开标签树进行标签选择，筛选过滤
            openFilterLabels(){
                console.log("ssss")
            },
            checkUserState() {
                console.log(this.formData.isDeleted)
            },
            //查看流水详情
            checkAccountDetails(accountId){
                //打开弹出层
                this.controlOpenAccountDetail = true;
                console.log(accountId)
                //todo
            },
            //用户编码
            deCodes(str) {
                return this.$util.decode(str);
            },
            //设置备注弹出
            setRemark(memberUid,remark) {
                this.curMemberId = memberUid;
                this.curRemark = remark;
                let data = {
                    memberUid:this.curMemberId,
                    remarks:this.curRemark
                };
                console.log(data);
                this.controlOpenUserRemark = true;
            },
            //提交备注修改
            setRemarkSubmit(){
                let data = {
                    memberUid:this.curMemberId,
                    remarks:this.curRemark
                };
                memberRemark(data).then(res => {
                    if(res.data.isSuccessful === "Y"){
                        this.$message({
                            message: "设置成功！",
                            type: "success"
                        });
                        setTimeout(() => {
                            this.init();
                        }, 2000);
                        //跳转到列表
                    }else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {});
                this.controlOpenUserRemark = false;
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
            checkUserTypeNew(){
              console.log(this.userType);
            },
            setUserType(memberUid,userType){
                this.curMemberId = memberUid;
                this.userType = userType;
                console.log(this.curMemberId);
                console.log(this.userType);
                //打开用户类型选项设置
                this.controlOpenUserType = true;
            },
            setUserTypeSubmit(){
                let data = {
                    memberUid:this.curMemberId,
                    memberType:this.userType
                };
                memberType(data).then(res => {
                    if(res.data.isSuccessful === "Y"){
                        this.$message({
                            message: "设置成功！",
                            type: "success"
                        });
                        setTimeout(() => {
                            this.init();
                        }, 2000);
                        //跳转到列表
                    }else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {});
                //打开用户类型选项设置
                this.controlOpenUserType = false;
            },
            nodeCollapse(data) {
                this.curUserLabelsList =[];
            },
            //批量删除
            delAll(rowKey) {
                //是字符串类型则就是 rowKey
                if(typeof(rowKey) =='string'){
/*                    memberDelete(rowKey).then(res => {
                        if(res.data.isSuccessful === "Y"){
                            this.$message({
                                message: "删除成功！",
                                type: "success"
                            });
                            setTimeout(() => {
                                this.init();
                            }, 2000);
                            //跳转到列表
                        }else {
                            this.$message.error(res.data.message);
                        }
                    }).catch(err => {});*/
                    console.log(rowKey);
                }else {
                    //不是字符串类型是对象类型
                    console.log(this.multipleSelection);

                }
                //todo 组装keys，调用删除接口
            },
            checkLabels(curMemberInfo) {
                //查询相应标签，并赋值当前便于渲染
                this.curUserLabelsList= curMemberInfo.labelTreeCodes==null?[]:curMemberInfo.labelTreeCodes.split(",");
                this.curMemberId =  curMemberInfo.memberUid;
                //给当前角色选择树赋值
                this.checkedLabels = this.curUserLabelsList;
                //弹出
                this.controlOpenSetLabels = true;
            },
            //提交标签设置
            checkLabelsSubmit(){
                let data = {
                    memberUid:this.curMemberId,
                    labelTreeCodes:this.checkedLabels===''?'':this.checkedLabels.join(",")
                };
                memberLabel(data).then(res => {
                    if(res.data.isSuccessful === "Y"){
                        this.$message({
                            message: "设置成功！",
                            type: "success"
                        });
                        setTimeout(() => {
                            this.init();
                        }, 2000);
                        //跳转到列表
                    }else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {});
                this.controlOpenSetLabels = false;
            },
            //选择标签
            handleCheckChange() {
                //需要加ref="tree"
                let arr = [];
                //全选中和半选中状态合并则是选中的所有
                let checkedKeys = this.$refs.tree.getCheckedKeys();
                let hafCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
                arr = checkedKeys.concat(hafCheckedKeys);
                this.checkedLabels = arr;
                console.log(this.checkedLabels)
            },
            //全选树
            checkAllTree() {
                this.$refs.tree.setCheckedNodes(this.labelList)
            },
            cancelAllTree() {
                this.$refs.tree.setCheckedNodes([])
            },
            resetQuery(){
              this.formData = {
                        userType:"",//用户类型：普通用户，平台签约作者，作者
                        wechatNickName:"",//卡片名字
                        wechatMobile:"",//卡片名字
                        labelIds:"",
                        remarks:"",
                        page: 1,
                };
                this.init();
            },
            /*标签筛选*/
            resetFilterQuery(){
                this.formData = {
                    userType:"",//用户类型：普通用户，平台签约作者，作者
                    wechatNickName:"",//卡片名字
                    wechatMobile:"",//卡片名字
                    labelIds:"",
                    remarks:"",
                    page: 1,
                };
                this.init();
                this.checkLabelId='';
                this.$refs.filterTree.setCheckedNodes([])
            },
            /*标签筛选*/
            filterByLabels(){
                // this.data.resourceLabelTreeCodes = this.checkedLabels===''?'':this.checkedLabels.join(",")
                this.formData.labelIds = this.checkLabelId+"";
                console.log(this.formData);
                this.init();
            },
            //将标签筛选树树做成单选
            checkOnlyOneLabel(item,node,self) {
                //共三个参数，依次为：item:data属性的数组中该节点所对应的对象、node:节点本身是否被选中、self:节点的子树中是否有被选中的节点(感觉永远为false)
                //需要两个事件同时作用，才可达到单选
                if(node){
                    this.$refs.filterTree.setCheckedKeys([item.labelTreeCode]);
                    this.checkLabelId = this.$refs.filterTree.getCheckedKeys();
                    this.checkLabelId = item.labelTreeCode;
                }
                else {
                    this.checkLabelId = this.$refs.filterTree.getCheckedKeys();
                }
            },
        }
    }
</script>
