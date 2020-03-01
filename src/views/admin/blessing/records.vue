<style lang="scss" scoped>
  /*查询框*/
  .selectStyle,.inputStyle,.searchStyle,.radioStyle{
    float: left;
    margin-left: 20px;
  }
  .selectStyle,.inputStyle{
    width: 200px;
  }
  /*表格*/
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
      top: 20px;
      margin-left: 75px;
    }
    .userOpenId{
      height: 20px;
      left: 20px;
      bottom: 10px;
    }
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
<!--      &lt;!&ndash;是否删除&ndash;&gt;
      <div>
        <el-select
          class="selectStyle"
          v-model="formData.isDeleted"
          prop="isDeleted"
          placeholder="是否删除"
          size="small"
          @change="checkIsDel"
        >
          <el-option value="">全部</el-option>
          <el-option
            v-for="item in delStatusList "
            :key="item.isDeleted"
            :label="item.name"
            :value="item.isDeleted"
          ></el-option>
        </el-select>
      </div>-->
      <!--   作品名   -->
      <div class="inputStyle">
        <el-form-item prop="resourceName"  can-be-empty>
          <el-input class="inputs" placeholder="请输入资源名" size="mini" v-model="formData.resourceName"></el-input>
        </el-form-item>
      </div>
      <!--   作者名   -->
      <div class="inputStyle">
        <el-form-item prop="userNickName"  can-be-empty>
          <el-input class="nickName" placeholder="请输入用户昵称" size="mini" v-model="formData.userNickName"></el-input>
        </el-form-item>
      </div>
      <div class="searchStyle">
        <el-button type="primary"  size="small" @click="search()">搜索</el-button>
      </div>
    </el-form>

    <!--  表格数据  -->
    <el-table
      class="tableStyle"
      :data="sendRecordList"
      border
      :row-key="getRowKeys"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      :row-style="{height:'120px'}"
      :cell-style="{}"
    >
      <el-table-column align="left" type="selection" reserve-selection width="40"></el-table-column>
      <el-table-column prop="memberInfo" align="left" label="用户信息" width="170">
        <template slot-scope="scope">
          <div>
            <img class="userHeadImg" v-image-preview :src="scope.row.memberHeadImageUrl" width="50" height="50" />
            <div class="userNameAndSex">
              <span class="nickName">{{scope.row.memberNickName}}</span><br>
              <span class="sex">性别：{{scope.row.wechatSex==null?"保密":sexGroup[scope.row.wechatSex]}}</span>
            </div>
          </div>
          <div class="userOpenId">
            <el-tooltip :content="scope.row.weChatOpenId">
              <span>微信号：{{scope.row.weChatOpenId | controlLengthOpenId}}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="country" align="left" label="城市">
        <template slot-scope="scope">
          <span>{{scope.row.weChatCountry===null?'未获取':scope.row.weChatCountry}}</span>
          <span>{{scope.row.weChatProvince===null?'未获取':scope.row.weChatProvince}}</span>
          <span>{{scope.row.weChatCity===null?'未获取':scope.row.weChatCity}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="wechatMobile" align="left" label="联系方式">
        <template slot-scope="scope">
          <span>{{scope.row.wechatMobile==null?"用户暂未授权":scope.row.wechatMobile}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="country" align="left" label="用户简介">
        <template slot-scope="scope">
          <span>类型：{{userTypes[scope.row.userType]}}</span>
          <br>
          <el-tooltip :content="scope.row.userIntroduction">
            <span>简介：{{scope.row.userIntroduction == null?'用户懒，暂无简介':scope.row.userIntroduction | controlLength}}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="sourceInfo" align="left" width="200" label="资源信息">
        <template slot-scope="scope">
          <span>名字：{{scope.row.resourceName}}</span>
          <br>
<!--          <div v-for="(item,index) in scope.row.labelsModelList">{{item.labelText}}</div>-->

        </template>
      </el-table-column>

      <el-table-column prop="receivedInfo" align="left" width="200" label="接收情况">
        <template slot-scope="scope">
          <span>接收数目：{{scope.row.receivedCount}}</span>
          <br>
<!--          <span><el-button type="text" @click="checkReceivedDetails(scope.row.resourceUid)" size="small">查看明细</el-button></span>-->
        </template>
      </el-table-column>
      <el-table-column prop="sendTime" align="left" width="200" label="发送时间">
        <template slot-scope="scope">
          <span>{{$timeUtil.getFormatTime(scope.row.sendTime)}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="remark" align="left" label="备注">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.remark">
            <span>{{scope.row.remark | controlLength}}</span>
          </el-tooltip>
<!--          <span class="editRemark"><el-button type="text" @click="setRemark(scope.row.memberUid,scope.row.remark)" size="small">编辑</el-button></span>-->
        </template>
      </el-table-column>

      <!--操作列处理-->
<!--      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          &lt;!&ndash;          <router-link  type="primary" round icon="el-icon-edit" :to="{name: 'cardRelease', query: {id: scope.row.cardId}}">
                      <el-button type="text" size="small">编辑</el-button>
                    </router-link>&ndash;&gt;
          <el-button @click="delAll(scope.row.cardId)" type="text" size="small">删除</el-button>
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


    <!--弹出层查看送出详情-->
    <el-dialog
      title="接收明细"
      :visible.sync="controlOpenReceivedDetail"
      width="30%"
    >
      <el-table
        :data="receivedDetailList"
        border
        style="width: 100%"
        :header-cell-style="{background:'#afafaf',color:'#606266'}"
      >

        <el-table-column prop="receivedNickName" align="left" label="接收用户">
          <template slot-scope="scope">
            <span>{{scope.row.receivedNickName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="receivedTime" align="left" label="接收时间">
          <template slot-scope="scope">
            <span>{{scope.row.receivedTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="thankWords" align="left" label="感谢回复">
          <template slot-scope="scope">
            <span>{{scope.row.thankWords}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--弹出层编辑用户备注-->
    <el-dialog
      title="设置备注"
      :visible.sync="controlOpenUserRemark"
      width="30%"
    >
      <el-form>
        <div class="title">
          <el-form-item prop="curRemark"  can-be-empty>
            <el-input class="inputs" placeholder="请输入备注" size="mini" v-model="curRemark"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="controlOpenUserRemark = false">取 消</el-button>
        <el-button type="primary" @click="setRemarkSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {
        labelListAll,
        sendRecords,
    } from "@/api/table";
    export default {
        name: 'RECORDS_LIST',
        components: {},
        data() {
            return {
                formData:{
                    userNickName:"",//用户昵称
                    resourceName:"",//资源名
                    userLabelCode:"",//用户标签
                    userType:"",//用户类型
                    isDeleted:"N",//是否删除
                    page: 1
                },
                cardList:[],
                labelList:[],
                markerList:[
                    {
                        markerId:"1",
                        markerName:"无标记",
                    },
                    {
                        markerId:"2",
                        markerName:"推荐",
                    },
                    {
                        markerId:"3",
                        markerName:"火热",
                    },
                    {
                        markerId:"4",
                        markerName:"人气",
                    },

                ],
                fontList:[],
                sendRecordList:[],
                //分页
                isIndeterminate: false,
                checkAll: false,
                count: 6,
                multipleSelection: [],
                //控制打开设置标签界面
                controlOpenSetLabels:false,
                curLabelsList:[],
                //预存选择的标签
                checkedLabels:[],
                //树形所需
                defaultProps: {
                    children: "child",
                    label: "name"
                },
                //列表出来过后将所有标签组装成一个数组，便于遍历和展示
                allLabelsNotTree:{},
                //每次点击操作用户，临时存储主键，每次点击都会重置为当前的值
                cardId:'',
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
                //是否删除
                delStatusList:[
                    {
                        isDeleted:"Y",
                        name:"已删除",
                    },
                    {
                        isDeleted:"N",
                        name:"未删除",
                    }
                ],
                controlOpenUserRemark:false,
                //修改备注预存数据
                curMemberUid:"",
                curRemark:"",
                //控制打开接收详情列表
                controlOpenReceivedDetail:false,
                //性别类型
                //性别类型
                sexGroup:{
                    'MAN':"男",
                    'WOMAN':"女",
                    'NONE':"保密",
                    'MAN_WOMAN':"不男不女",
                },
                //接收详情列表
                receivedDetailList:[
                    {
                        packageId:'',
                        sendMemberId:"",
                        receivedMemberId:"",
                        receivedNickName:"张三",
                        receivedOpenId:"微信id",
                        receivedTime:"2020-02-16 23:59:59",
                        receivedSex:"",
                        thankWords:"nice哦",
                    },
                    {
                        packageId:'',
                        sendMemberId:"",
                        receivedMemberId:"",
                        receivedNickName:"李四",
                        receivedOpenId:"weixinId",
                        receivedTime:"2020-02-16 23:59:59",
                        receivedSex:"",
                        thankWords:"谢谢你，我收到了",
                    },
                ],
            }
        },
        //多选配置
        props: {
            checkItem: Boolean,
            selectArr: Array
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
                    return curStr.slice(0,8)+"..."
                }
                return curStr;
            },
        },
        created() {
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
                }
            }).catch(err => {});
            this.init()
        },
        methods: {
            getRowKeys(row) {
                // 给表格每行增加一个唯一 标识，用作切换分页后保留被选中行的信息
                return row.cardId;
            },
            //初始化列表数据
            init(){
                //获取用户信息，加载表格数据
                let data = JSON.parse(JSON.stringify(this.formData));
                data.page --;
                console.log(data)
                sendRecords(data).then(result => {
                    if(result.code == 200){
                        this.sendRecordList = result.data.data.data;
                        //分页的话还需初始化count
                        this.count = result.data.data.count;
                        // console.log(JSON.stringify( this.blessingList))
                    }
                }).catch(err => {});
            },
            search() {
                //todo 验证参数
                this.$refs.searchs.validate(valid => {
                    if (valid) {
                        this.init();
                    } else {
                        console.log("error submit!!");

                    }
                });
            },
            //目前选中用户类型
            checkUserType() {
                this.init();
            },
            checkIsDel(){
                console.log(this.formData.isDeleted)
            },
            //删除作品
            del(cardId){
                this.$confirm("此操作将删除当前作品, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        console.log(cardId)
                        //todo 删除用户调用
                        /*        articleDel({ articleId: articleId })
                                .then(res => {
                                this.$message({
                                type: "success",
                                message: "操作成功"
                              });
                                //todo 初始化数据
                              this.init();
                            })
                            .catch(err => {});*/
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
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
                    this.$confirm("此操作将删除当前作品, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            console.log(rowKey)
                            //todo 删除用户调用
                            /*        articleDel({ articleId: articleId })
                                    .then(res => {
                                    this.$message({
                                    type: "success",
                                    message: "操作成功"
                                  });
                                    //todo 初始化数据
                                  this.init();
                                })
                                .catch(err => {});*/
                        })
                        .catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        });
                }else {
                    //不是字符串类型是对象类型
                    console.log(this.multipleSelection);
                    //todo 组装keys，调用删除接口
                }
            },
            checkLabels(cardId) {
                console.log(cardId)
                //当前角色id临时存储
                this.cardId = cardId;
                //todo 查询相应标签，并赋值当前便于渲染
                this.curLabelsList = ['100','100100','101100'];
                //给当前角色权限赋值
                this.checkedLabels = this.curLabelsList;
                console.log(cardId);
                //弹出
                this.controlOpenSetLabels = true;
            },
            //提交标签设置
            checkLabelsSubmit(){
                console.log(this.checkedLabels.join(","));
                console.log(this.cardId);
                //todo 设置标签
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
            //查看状态明细
            checkStatus(cardId) {
                console.log(cardId);
            },
            //选择标记
            checkMarker() {
                console.log(this.formData.markerId)
            },
            //修改状态
            setStatus(cardInfo) {
                console.log(cardInfo);
                //todo 修改状态
                /*          userSetStatus({ cardId: cardInfo.cardId, status: cardInfo.status })
                              .then(res => {
                                  if (res.code === 200) {
                                      this.$message({
                                          message: "操作成功",
                                          type: "success"
                                      });
                                  } else {
                                      this.$message.error(res.description);
                                  }
                              })
                              .catch(err => {
                                  this.$message.error(err);
                              });*/
            },
            //全选树
            checkAllTree() {
                this.$refs.tree.setCheckedNodes(this.labelList)
            },
            cancelAllTree() {
                this.$refs.tree.setCheckedNodes([])
            },
            //设置备注弹出
            setRemark(memberUid,remark) {
                //todo
                this.curMemberUid = memberUid;
                this.curRemark = remark;
                console.log(memberUid)
                console.log(remark)
                this.controlOpenUserRemark = true;
            },
            //提交备注修改
            setRemarkSubmit(){
                //todo 修改备注
                console.log(this.curMemberUid);
                console.log(this.curRemark);
                this.controlOpenUserRemark = false;
            },
            //查看接收明细
            checkReceivedDetails(giftId) {
                //打开弹出层
                this.controlOpenReceivedDetail = true;
                console.log(giftId)
                //todo
            }
        }
    }
</script>
