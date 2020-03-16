<template>
    <div>
      <!--  筛选提交表单 -->
      <el-form :model="data" ref="searchs" class="searchBox">
        <div class="row-one">
          <!--   活动类型   -->
          <div>
            <el-select
              class="selectStyle"
              v-model="data.campaignType"
              prop="campaignType"
              placeholder="活动类型"
              size="small"
              @change="checkCampaignType"
            >
              <el-option value="">全部</el-option>
              <el-option
                v-for="item in campaignTypeList"
                :key="item.campaignType"
                :label="item.name"
                :value="item.campaignType"
              ></el-option>
            </el-select>
          </div>
          <!--   活动状态   -->
          <div>
            <el-select
              class="selectStyle"
              v-model="data.campaignState"
              prop="campaignState"
              placeholder="活动状态"
              size="small"
              @change="checkCampaignState"
            >
              <el-option value="">全部</el-option>
              <el-option
                v-for="item in campaignStateList"
                :key="item.campaignState"
                :label="item.name"
                :value="item.campaignState"
              ></el-option>
            </el-select>
          </div>
        </div>
        <br>
        <div class="row-two">
          <!--活动时间-->
          <div class="searchStyle" style="margin-top: 5px">
            <el-date-picker
              v-model="data.times"
              type="daterange"
              size="mini"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="checkTimeChange"
            ></el-date-picker>
          </div>
          <!--   活动主题   -->
          <div class="inputStyle">
            <el-form-item prop="campaignSubject"  can-be-empty>
              <el-input class="inputs" placeholder="活动主题" size="mini" v-model="data.campaignSubject"></el-input>
            </el-form-item>
          </div>
          <div class="searchStyle">
            <el-button type="primary"  size="small" @click="search()">搜 索</el-button>
          </div>
          <div class="searchStyle">
            <el-button type="primary" size="small" @click="addCampaignPageOpen">新增活动</el-button>
          </div>
          <div class="searchStyle">
            <el-button size="small" @click="resetQuery()">重 置</el-button>
          </div>
        </div>
      </el-form>
      <!--  表格数据  -->
      <el-table
        :data="campaignList"
        border
        :row-key="getRowKeys"
        :header-cell-style="{background:'#afafaf',color:'#606266'}"
        ref="multipleTable"
        @selection-change="handleSelectionChange">
        <el-table-column align="left" type="selection" reserve-selection width="40"></el-table-column>
        <el-table-column prop="sourceInfo" align="left" width="150" label="活动信息">
          <template slot-scope="scope">
            <span style="font-weight: bolder">主题：{{scope.row.campaignSubject}}</span>
            <br>
            <span>类型：{{campaignTypes[scope.row.campaignType]}}</span>
            <br>
            <span><el-button type="text" @click="addCampaignPageOpen(scope.row)" size="small">编辑活动基本信息</el-button></span>
            <span><el-button type="text" @click="setCampaignRulePageOpen(scope.row)" size="small">配置活动规则</el-button></span>
            <span><el-button type="text" @click="campaignDelete(scope.row.campaignUid)" size="small">删除活动</el-button></span>
          </template>
        </el-table-column>
        <el-table-column prop="sourceInfo" align="left" width="140" label="参与者">
          <template slot-scope="scope">
            <span>参与者：{{campaignParticipantsTypes[scope.row.campaignParticipantsType]}}</span>
            <br>
            <span>参与用户：{{scope.row.campaignInvolveUsersCount}}</span>
            <br>
            <span>新增用户：{{scope.row.campaignAddedUsersCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sourceInfo" align="left" width="140" label="活动资源">
          <template slot-scope="scope">
            <span>总发送数：{{scope.row.campaignSentCount}}</span>
            <br>
            <span>总接收数：{{scope.row.campaignReceivedCount}}</span>
            <br>
            <span>有效发送：{{scope.row.campaignAvailableSentCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sourceInfo" align="left" width="200" label="活动资金">
          <template slot-scope="scope">
            <span>计划投入：{{$util.prices(scope.row.campaignPlanedTotalAmount)}} 元</span>
            <br>
            <span>已投入：{{$util.prices(scope.row.campaignTotalAmountOfRedPacket+scope.row.campaignTotalAmountOfSupplies)}} 元</span>
            <br>
            <span>已消耗：{{$util.prices(scope.row.campaignDrawAmountOfSupplies+scope.row.campaignDrawAmountOfRedPacket)}} 元</span>
            <br>
            <span>还剩余：{{$util.prices(scope.row.campaignTotalAmountOfRedPacket+scope.row.campaignTotalAmountOfSupplies - (scope.row.campaignDrawAmountOfSupplies+scope.row.campaignDrawAmountOfRedPacket))}} 元</span>
            <br>
            (PS:当前统计仅针对已投入物资和定量定额红包)
          </template>
        </el-table-column>
        <el-table-column prop="materialPutOn" align="left" width="320" label="活动物资" >
          <template slot-scope="scope">
            <div class="labelStyle"  v-for="(item,index) in scope.row.materialPutOnList">
              <span style="font-weight: bolder">{{item.materialName}}</span>:（{{item.materialDesc}}）
              <br>
              <span>已投放：{{item.materialAppendedQuantity}}/{{item.materialMeasurementUnits}}</span>；
              <span>冻结：{{item.materialFreezingQuantity}}/{{item.materialMeasurementUnits}}</span>；
              <span v-if="item.materialTotalQuantity == -1">余量：不限量</span>
              <span v-if="item.materialTotalQuantity != -1">余量：{{item.materialAppendedQuantity-item.materialDrawnQuantity-item.materialFreezingQuantity}}/{{item.materialMeasurementUnits}}</span>
            </div>
            <br>





            <span><el-button type="text" @click="setMaterialsPage(scope.row)" size="small">管理活动物资</el-button></span>
          </template>
        </el-table-column>

        <el-table-column prop="redPacketPutOn" align="left" width="320" label="活动红包" >
          <template slot-scope="scope">
            <div class="labelStyle"  v-for="(item,index) in scope.row.redPacketPutOnList" :key="index">
              <div v-if="item.packetType == 1">
                <span style="font-weight: bolder">{{item.packetName}}</span>：({{item.packetDesc}})
                <br>
                <span>领取数量：{{item.packetDrawnQuantity}}个</span>，金额：<span>{{$util.prices(item.packetDrawnAmount)}} 元；</span>
                <span v-if="item.packetTotalQuantity == -1">不限量</span>
                <span v-if="item.packetTotalQuantity != -1">余量：{{item.packetTotalQuantity - item.packetDrawnQuantity }} 个</span>
                <br>
              </div>
              <div v-if="item.packetType == 2">
                <span style="font-weight: bolder">{{item.packetName}}</span>：({{item.packetDesc}})
                <br>
                <span>领取数量：{{item.packetDrawnQuantity}}个</span>，金额：<span>{{$util.prices(item.packetDrawnAmount)}} 元；</span>
                <span v-if="item.packetTotalQuantity == -1">不限量</span>
                <span v-if="item.packetTotalQuantity != -1">余量：{{item.packetTotalQuantity - item.packetDrawnQuantity }}个</span>
                <br>
              </div>
            </div>
            <br>





            <span><el-button type="text" @click="setPacketPage(scope.row)" size="small">管理活动红包</el-button></span>
          </template>
        </el-table-column>
        <el-table-column prop="sourceInfo" align="left" width="180" label="指标">
          <template slot-scope="scope">
            <span>拉新数：{{scope.row.campaignAddedUsersCount}}</span>
            <br>
            <span>单拉新成本：{{scope.row.campaignAddedUsersCount == 0?0:$util.prices((scope.row.campaignTotalAmountOfRedPacket+scope.row.campaignTotalAmountOfSupplies)/(scope.row.campaignAddedUsersCount))}} 元</span>
          </template>
        </el-table-column>
        <el-table-column prop="sourceInfo" align="left" width="200" label="状态">
          <template slot-scope="scope">
            <span>活动状态：{{campaignStates[scope.row.campaignState]}}</span>
            <br>
            <span>开始：{{scope.row.campaignStartTime}}</span>
            <br>
            <span>结束：{{scope.row.campaignStopTime}}</span>
            <br>
                  <!--1:'策划中',2:'公示中',3:'进行中',4:'已暂停',5:'已停止',-->
            <span><el-button v-if="scope.row.campaignState == 1" type="text" @click="campaignOnline(scope.row.campaignUid)" size="small">上线</el-button></span>
            <span><el-button v-if="scope.row.campaignState == 3" type="text" @click="campaignsStateSet(scope.row.campaignUid,4)" size="small">活动暂停</el-button></span>
            <span><el-button v-if="scope.row.campaignState == 4" type="text" @click="campaignsStateSet(scope.row.campaignUid,3)" size="small">活动继续</el-button></span>
            <span><el-button v-if="scope.row.campaignState != 5" type="text" @click="campaignsStateSet(scope.row.campaignUid,5)" size="small">停止活动</el-button></span>
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


      <!--打开新增/编辑活动页面-->
      <el-dialog
        :title="campaignUid != null?'编辑活动基本信息':'新建活动'"
        :visible.sync="setCampaignPageOpen"
        width="50%"
        :destroy-on-close="true"
        @close="nodeCollapse"
      >
        <el-form ref="campaignForm" :model="campaignData" class="formBox" label-width="80px">
          <el-form-item label="活动主题" prop="campaignSubject" verify>
            <el-input
              class="formItem"
              v-model="campaignData.campaignSubject"
              maxlength="20"
              placeholder="请输入活动主题，20字内"
            ></el-input>
            <span class="describe">长度不超过20</span>
          </el-form-item>
          <el-form-item label="活动内容" prop="campaignContent" verify>
            <el-input
              class="formItem"
              placeholder="请输入活动内容"
              type="textarea"
              :rows="4"
              v-model="campaignData.campaignContent">
            </el-input>
            <span class="describe">活动内容</span>
          </el-form-item>
          <!--todo 开始时间campaignStartTime/结束时间开始时间campaignStopTime-->
          <el-form-item label="活动类型" prop="campaignType" verify>
            <el-select
              class="formItem"
              v-model="campaignData.campaignType"
              prop="campaignType"
              placeholder="活动类型"
              size="small"
              @change="checkCampaignTypeForAdd"
            >
              <el-option
                v-for="item in campaignTypeList"
                :key="item.campaignType"
                :label="item.name"
                :value="item.campaignType"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参与者" prop="campaignParticipantsType" verify>
            <el-select
              class="formItem"
              v-model="campaignData.campaignParticipantsType"
              prop="campaignParticipantsType"
              placeholder="活动参与者类型"
              size="small"
              @change="checkCampaignParticipantsType"
            >
              <el-option
                v-for="item in campaignParticipantsTypeList"
                :key="item.campaignParticipantsType"
                :label="item.name"
                :value="item.campaignParticipantsType"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="投入资金" prop="campaignPlanedTotalAmount" verify>
            <el-input
              class="formItem"
              min="0"
              type="number"
              v-model="campaignData.campaignPlanedTotalAmount"
              maxlength="20"
              placeholder="请输入计划投入资金(单位：元)"
            ></el-input>
            <span class="describe">单位：元</span>
          </el-form-item>
          <el-form-item label="活动时间" prop="campaignParticipantsType" verify>
            <div class="block">
              <el-date-picker
                v-model="campaignData.times"
                type="daterange"
                size="mini"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </div>
          </el-form-item>


        </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="setCampaignPageOpen = false">取 消</el-button>
        <el-button type="primary" @click="addCampaign">确 定</el-button>
      </span>
      </el-dialog>

      <!--配置活动规则-->
      <el-dialog
        title="配置活动规则"
        :visible.sync="setCampaignRulePage"
        width="50%"
        :destroy-on-close="true"
        @close="nodeCollapse"
      >
        <el-form ref="ruleForm" :model="rulesData" class="formBox" label-width="80px">
          <div>
            <p class="title">积分规则</p>
            <el-form-item label="是否有效" prop="pointEffective" verify>
              <el-switch
                v-model="rulesData.pointEffective"
                @change="changeEffective"
                active-value='true'
                inactive-value='false'
              ></el-switch>
              <!--              active-value='true'
                            inactive-value='false'-->
              <span class="describe">同一个发送者，发送给同一个接收者，是否只算一次有效发送(单值, bool)</span>
            </el-form-item>
            <el-form-item label="积分数量" prop="pointsCounts" verify>
              <el-input
                class="formItem"
                type="number" min="0"
                v-model="rulesData.pointsCounts"
                maxlength="20"
                placeholder="所需积分兑换数目"
              ></el-input>
              <span class="describe">每成功发送一个有效祝福，积多少分(一个值, int)</span>
            </el-form-item>
          </div>
          <div>
            <p class="title">红包/物资领取数量规则</p>
            <el-form-item label="兑换个数" prop="pointExchangeMaterialOrPacketCounts" verify>
              <el-input
                class="formItem"
                type="number" min="0"
                v-model="rulesData.pointExchangeMaterialOrPacketCounts"
                maxlength="10"
                placeholder="每日可兑换个数"
              ></el-input>
              <span class="describe">每个用户，一天内可以兑换多少红包或物资(单值， int)</span>
            </el-form-item>
          </div>
          <div>
            <p class="title">红包兑换规则</p>
            <el-form-item label="兑奖明细" prop="pointExchangePacket"  verify>
              <div v-for="(info,index) in this.rulesData.pointExchangePacket" style="margin: 10px">
                <div>
                  需消耗：
                  <span><el-input style="width: 120px" type="number" min="0" v-model="info.pointCounts"  maxlength="10" placeholder="消耗积分"></el-input></span>
                  个积分兑换一个：
                  <span>
                    <el-select
                      style="width: 200px"
                      v-model="info.packetUid"
                      prop="campaignType"
                      placeholder="选择红包种类"
                      size="small"
                      @change="checkCampaignType"
                    >
                    <el-option
                      v-for="item in redPacketPutOnList"
                      :key="item.packetUid"
                      :label="item.packetName"
                      :value="item.packetUid"
                    ></el-option>
                  </el-select>
                  </span>
                  <span><el-button type="text" size="mini" @click="deleteThisPacket(index)">删除此项</el-button></span>
                </div>
              </div>
              <el-button type="primary" size="mini" @click="addPacketExchange">添加红包兑换规则</el-button>
            </el-form-item>
          </div>
          <div>
            <p class="title">物资兑换规则</p>
            <el-form-item label="兑奖明细" prop="pointExchangeMaterial" verify>
              <div v-for="(info,index) in this.rulesData.pointExchangeMaterial" style="margin: 10px">
                <div>
                  需消耗：
                  <span><el-input style="width: 120px" type="number" min="0" v-model="info.pointCounts"  maxlength="10" placeholder="消耗积分"></el-input></span>
                  个积分兑换一个：
                  <span>
                    <el-select
                      style="width: 200px"
                      v-model="info.materialUid"
                      prop="materialUid"
                      placeholder="选择物资"
                      size="small"
                      @change="checkCampaignType"
                    >
                    <el-option
                      v-for="item in materialPutOnList"
                      :key="item.materialUid"
                      :label="item.materialName+'/'+item.materialMeasurementUnits"
                      :value="item.materialUid"
                    ></el-option>
                  </el-select>
                  </span>
                  <span><el-button type="text" size="mini" @click="deleteThisMaterial(index)">删除此项</el-button></span>
                </div>
              </div>
              <el-button type="primary" size="mini" @click="addMaterialExchange">添加物资兑换规则</el-button>
            </el-form-item>
          </div>
          <div>
            <p class="title">接收者领取红包规则</p>
            <el-form-item label="领取红包" prop="getPacketReceiveBlessing" verify>
              接收者在收到新的祝福时可以领取：
              <span  v-for="(info,index) in this.rulesData.getPacketReceiveBlessing" style="margin: 10px" >
                    <el-select
                      style="width: 200px"
                      v-model="info.packetUid"
                      prop="campaignType"
                      placeholder="选择红包"
                      size="small"
                      @change="checkCampaignType"
                    >
                    <el-option
                      v-for="item in redPacketPutOnList"
                      :key="item.packetUid"
                      :label="item.packetName"
                      :value="item.packetUid"
                    ></el-option>
                  </el-select>
              </span>
                <!-- <span><el-button type="text" size="mini" @click="deleteThisPacket(index)">删除此项</el-button></span>-->
<!--              <el-button type="primary" size="mini" @click="addReceivePacket">添加接收祝福领取红包种类</el-button>-->
            </el-form-item>
            <el-form-item label="领取个数" prop="receivePacketCounts" verify>
              <el-input
                class="formItem"
                type="number" min="0"
                v-model="rulesData.receivePacketCounts"
                maxlength="10"
                placeholder="每日可领取个数"
              ></el-input>
              <span class="describe">接收者，在同一天内，最多可以领取多少个红包(单值, int)；</span>
            </el-form-item>
          </div>
          <div>
            <p class="title">参加活动排名奖品规则</p>
            <el-form-item label="奖品规则" prop="blessingRewards" verify>
              <div v-for="(info,index) in rulesData.blessingRewards" :key="index" style="margin: 10px">
                <span>第  <el-input style="width: 120px" type="number" min="0" v-model="info.rank"  maxlength="10" placeholder="送祝福排名"></el-input>  名可获得爱心物资：</span>
                <el-select
                  style="width: 200px"
                  v-model="info.materialUid"
                  prop="campaignType"
                  placeholder="选择爱心物资"
                  size="small"
                  @change="checkCampaignType"
                >
                  <el-option
                    v-for="item in materialPutOnList"
                    :key="item.materialUid"
                    :label="item.materialName+'/'+item.materialMeasurementUnits"
                    :value="item.materialUid"
                  ></el-option>
                </el-select>
                <span><el-input style="width: 120px" type="number" min="0" v-model="info.materialCounts"  maxlength="10" placeholder="获得数量"></el-input></span>
                <span><el-button type="text" size="mini" @click="deleteThis(index)">删除此项</el-button></span>
              </div>
              <el-button type="primary" size="mini" @click="addBlessingReward">添加名次奖励</el-button>
            </el-form-item>
          </div>
          <div>
            <p class="title">提现规则</p>
            <el-form-item label="提现次数" prop="withdrawalTimes" verify>
              <el-input
                class="formItem"
                type="number"
                v-model="rulesData.withdrawalTimes"
                maxlength="10"
                min="0"
                placeholder="每日可提现次数"
              ></el-input>
              <span class="describe">活动期间，每用户每天只能提现的次数(单值, int)</span>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="setCampaignRulePage = false">取 消</el-button>
        <el-button type="primary" @click="setCampaignRule">确 定</el-button>
        </span>
      </el-dialog>


      <!--打开活动物资管理页面-->
      <el-dialog
        title="活动物资管理"
        :visible.sync="setMaterialsPageOpen"
        width="70%"
        :destroy-on-close="true"
        @close="nodeCollapse"
      >
        <!--物资列表-->
        <el-table
          :data="curCampaignInfo.materialPutOnList"
          border
          :row-key="getRowKeysForMaterial"
          :header-cell-style="{background:'#afafaf',color:'#606266'}"
          ref="multipleTable"
        >
          <el-table-column prop="sourceInfo" align="left"  label="物资信息">
            <template slot-scope="scope">
              <span>物资名：{{scope.row.materialName}}</span>
              <br>
              <span>物资说明：{{scope.row.materialDesc}}</span>
              <br>
              <span>规格：{{scope.row.materialSpecifications}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sourceInfo" align="left"  label="物资价格">
            <template slot-scope="scope">
              <span>计量单位：{{scope.row.materialMeasurementUnits}} </span>
              <br>
              <span>成本价：{{$util.prices(scope.row.materialCostPrice)}} 元</span>
              <br>
              <span>销售价：{{$util.prices(scope.row.materialSellPrice)}} 元</span>
              <br>
            </template>
          </el-table-column>
          <el-table-column prop="sourceInfo" align="left"  label="投放计划">
            <template slot-scope="scope">
              <span v-if="scope.row.materialTotalQuantity == -1">计划投放量：不限量(未知)</span>
              <span v-if="scope.row.materialTotalQuantity != -1">计划投放量：{{scope.row.materialTotalQuantity}}</span>
              <br>
            </template>
          </el-table-column>

          <el-table-column prop="sourceInfo" align="left"  label="投放情况">
            <template slot-scope="scope">
              <span>已投放：{{scope.row.materialAppendedQuantity}}</span>
              <br>
              <span>已领取：{{scope.row.materialDrawnQuantity}}</span>
              <br>
              <span>冻结中：{{scope.row.materialFreezingQuantity}}</span>
              <br>
            </template>
          </el-table-column>

          <el-table-column prop="sourceInfo" align="left"  label="操作">
            <template slot-scope="scope">
              <span>最近添加日期：{{scope.row.materialLastAppenedTime}}</span>
              <br>
                <span v-if=""><el-button type="text" @click="setMaterialsInfo(scope.row)" size="small">编辑</el-button></span>
                <span v-if=""><el-button type="text" @click="delMaterial(scope.row)" size="small">删除</el-button></span>
<!--                <span v-if="scope.row.materialTotalQuantity != -1"><el-button type="text" @click="setMaterialNoLimit(scope.row)" size="small">设为不限量</el-button></span>-->
              <br>
              <span v-if="scope.row.materialTotalQuantity != -1 && curCampaignInfo.campaignState == 1" ><el-button type="text" @click="addMaterialPageOpen(scope.row)" size="small">添加物资</el-button></span>
              <span v-if="scope.row.materialTotalQuantity != -1 && curCampaignInfo.campaignState != 1"><el-button type="text" @click="addMaterialPageOpen(scope.row)" size="small">追加物资</el-button></span>
<!--              <span v-if=""><el-button type="text" @click="setMaterialUseRulePageOpen(scope.row)" size="small">设置物资使用明细</el-button></span>-->
            </template>
          </el-table-column>


        </el-table>
        <span slot="footer" class="dialog-footer">
          <!-- todo  选择物资，输入数量，上线前可以编辑，删除，上线后不能动-->
          <el-button type="primary"  size="small" @click="setMaterialsInfo">物资建档</el-button>
          <el-button size="small" @click="setMaterialsPageOpen = false">取 消</el-button>
        </span>
      </el-dialog>

      <!--物资建档-->
      <el-dialog
        title="物资建档"
        :visible.sync="addMaterialsPageOpen"
        width="50%"
        :destroy-on-close="true"
        @close="nodeCollapse"
      >
        <el-form ref="materialForm" :model="materialData" class="formBox" label-width="80px">
          <el-form-item label="物资名" prop="materialName" verify>
            <el-input
              class="formItem"
              v-model="materialData.materialName"
              maxlength="20"
              placeholder="请输入物资名，20字内"
            ></el-input>
            <span class="describe">长度不超过20</span>
          </el-form-item>
          <el-form-item label="物资说明" prop="materialDesc" verify>
            <el-input
              class="formItem"
              v-model="materialData.materialDesc"
              maxlength="50"
              placeholder="请输入活动内容，50字内"
            ></el-input>
            <span class="describe">长度不超过50</span>
          </el-form-item>

          <el-form-item verify label="物资图片" prop="materialImageUrl">
            <p class="describe">提示：本地上传图片大小不能超过1M</p>
            <el-upload
              :action="upImgUrl"
              :data="access_token"
              :show-file-list="false"
              :on-change="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-success="uploadSuccessMaterial"
            >
              <img v-if="materialImageUrl" :src="materialImageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-input class="inputs none imgArea" v-model="materialData.materialImageUrl"></el-input>
            </el-upload>
          </el-form-item>

          <el-form-item label="规格" prop="materialSpecifications" verify>
            <el-input
              class="formItem"
              v-model="materialData.materialSpecifications"
              maxlength="30"
              placeholder="请输入物资规格，30字内"
            ></el-input>
            <span class="describe">长度不超过50</span>
          </el-form-item>
          <el-form-item label="计量单位" prop="materialMeasurementUnits" verify>
            <el-input
              class="formItem"
              v-model="materialData.materialMeasurementUnits"
              maxlength="10"
              placeholder="请输入物资计量单位，10字内"
            ></el-input>
            <span class="describe">长度不超过50</span>
          </el-form-item>
          <el-form-item label="成本价" prop="materialCostPrice" verify>
            <el-input
              class="formItem"
              type="number" min="0"
              v-model="materialData.materialCostPrice"
              maxlength="10"
              placeholder="请输入物资成本"
            ></el-input>
            <span class="describe">输入数字，单位：元</span>
          </el-form-item>
          <el-form-item label="销售价" prop="materialSellPrice" verify>
            <el-input
              class="formItem"
              type="number" min="0"
              v-model="materialData.materialSellPrice"
              maxlength="10"
              placeholder="请输入物资销售价"
            ></el-input>
            <span class="describe">输入数字，单位：元</span>
          </el-form-item>
          <el-form-item label="计划投放" prop="materialTotalQuantity" verify>
            <el-input
              v-if="materialData.materialTotalQuantity != -1"
              class="formItem"
              type="number" min="0"
              v-model="materialData.materialTotalQuantity"
              maxlength="10"
              placeholder="请输入物资销售价"
            ></el-input>
            <el-input
              v-if="materialData.materialTotalQuantity==-1"
              class="formItem"
              type="number"
              v-model="materialData.materialTotalQuantity"
              maxlength="10"
              placeholder="投放不限量"
              disabled="disabled"
              @change="checkCounts"
            ></el-input>
            <span>
              <el-button type="primary" size="mini" @click="checkCountLimit">{{materialData.materialTotalQuantity!=-1?'设为不限':'设置投放'}}</el-button>
            </span>
            <span v-if="materialData.materialTotalQuantity!=-1" class="describe">输入数字，单位：元</span>
            <span v-if="materialData.materialTotalQuantity==-1" class="describe">-1 代表投放不限</span>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addMaterialsPageOpen = false">取 消</el-button>
          <el-button type="primary" size="small" @click="setMaterials">确 定</el-button>
        </span>
      </el-dialog>

      <!--追加物资-->
      <el-dialog
        title="添加物资"
        :visible.sync="addMaterialPage"
        width="50%"
        :destroy-on-close="true"
        @close="nodeCollapse"
      >
        <el-form>
          <div class="title">
            <el-form-item prop="appendQuantity"  can-be-empty>
              <el-input class="inputs" type="number" placeholder="请输入追加数目" size="mini" v-model="appendQuantity"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addMaterialPage = false">取 消</el-button>
        <el-button type="primary" @click="addMaterialCounts">确 定</el-button>
        </span>
      </el-dialog>

      <!--打开活动红包管理页面-->
      <el-dialog
        title="活动红包管理"
        :visible.sync="setPacketPageOpen"
        width="70%"
        :destroy-on-close="true"
        @close="nodeCollapse"
      >
        <!--红包列表,可以用组件-->
        <el-table
          :data="curCampaignInfo.redPacketPutOnList"
          border
          :row-key="getRowKeysForMaterial"
          :header-cell-style="{background:'#afafaf',color:'#606266'}"
          ref="multipleTable"
        >
          <el-table-column prop="sourceInfo" align="left"  label="红包信息">
            <template slot-scope="scope">
              <span>红包名：{{scope.row.packetName}}</span>
              <br>
              <span>红包说明：{{scope.row.packetDesc}}</span>
              <br>
            </template>
          </el-table-column>
          <el-table-column prop="sourceInfo" align="left"  label="红包金额">
            <template slot-scope="scope">
              <span>红包类型：{{packetTypes[scope.row.packetType]}}</span>
              <br>
              <span v-if="scope.row.packetType==1">单个金额：{{$util.prices(scope.row.packetAmountLow)}} 元</span>
              <span v-if="scope.row.packetType==2">随机红包下限：{{$util.prices(scope.row.packetAmountLow)}} 元</span>
              <br>
              <span v-if="scope.row.packetType==2">随机红包上限：{{$util.prices(scope.row.packetAmountHigh)}} 元</span>
              <br>
            </template>
          </el-table-column>
          <el-table-column prop="sourceInfo" align="left"  label="投放计划">
            <template slot-scope="scope">
              <span v-if="scope.row.packetTotalQuantity == -1">红包投放总数：不限量</span>
              <span v-if="scope.row.packetTotalQuantity != -1">红包投放总数：{{scope.row.packetTotalQuantity}}</span>
              <br>
              <span v-if="scope.row.packetTotalQuantity != -1">红包总金额：{{$util.prices(scope.row.packetTotalAmount)}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="sourceInfo" align="left"  label="红包领取情况">
            <template slot-scope="scope">
              <span>已领取个数：{{scope.row.packetDrawnQuantity}} 个</span>
              <br>
              <span>已领取红包金额：{{$util.prices(scope.row.packetDrawnAmount)}}</span>
              <br>
            </template>
          </el-table-column>

<!--          <el-table-column prop="sourceInfo" align="left"  label="操作">
            <template slot-scope="scope">
              <span>最近添加日期：{{scope.row.materialLastAppenedTime}}</span>
              <br>
              <span v-if=""><el-button type="text" @click="setPacketInfo(scope.row)" size="small">编辑</el-button></span>
              <span v-if=""><el-button type="text" @click="delRedPacket(scope.row)" size="small">删除</el-button></span>
&lt;!&ndash;              <span v-if="scope.row.packetTotalQuantity != -1"><el-button type="text" @click="setPacketNoLimit(scope.row)" size="small">设为不限量</el-button></span>&ndash;&gt;
              <br>
              <span v-if="scope.row.packetTotalQuantity != -1"><el-button type="text" @click="addPacketInfo(scope.row)" size="small">添加/追加红包</el-button></span>
              &lt;!&ndash;              <span v-if=""><el-button type="text" @click="setMaterialUseRulePageOpen(scope.row)" size="small">设置物资使用明细</el-button></span>&ndash;&gt;
            </template>
          </el-table-column>-->


        </el-table>

        <span slot="footer" class="dialog-footer">
          <!-- todo  选择物资，输入数量，上线前可以编辑，删除，上线后不能动-->
          <el-button type="primary"  size="small" @click="setPacketInfo">新建红包</el-button>
          <el-button size="small" @click="setPacketPageOpen = false">取 消</el-button>
        </span>
      </el-dialog>

      <!--新增编辑红包-->
      <el-dialog
        title="设置红包"
        :visible.sync="addPacketInfoPageOpen"
        width="50%"
        :destroy-on-close="true"
        @close="nodeCollapse"
      >
        <el-form ref="redPacketForm" :model="packetData" class="formBox" label-width="80px">
          <el-form-item label='红包名' prop="packetName" verify>
            <el-input
              class="formItem"
              v-model="packetData.packetName"
              maxlength="20"
              placeholder="请输入红包名，20字内"
            ></el-input>
            <span class="describe">长度不超过20</span>
          </el-form-item>
          <el-form-item label="红包说明" prop="packetDesc" verify>
            <el-input
              class="formItem"
              v-model="packetData.packetDesc"
              maxlength="50"
              placeholder="请输入红包说明，50字内"
            ></el-input>
            <span class="describe">长度不超过50</span>
          </el-form-item>
          <el-form-item label="红包用途" prop="redPacketSource" verify>
            <el-select
              class="formItem"
              v-model="packetData.redPacketSource"
              prop="campaignType"
              placeholder="选择红包用途"
              size="small"
              @change="checkRedPacketSource"
            >
              <el-option
                v-for="item in redPacketSourceList"
                :key="item.redPacketSource"
                :label="item.name"
                :value="item.redPacketSource"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item verify label="红包图片" prop="packetImageUrl">
            <p class="describe">提示：本地上传图片大小不能超过1M</p>
            <el-upload
              :action="upImgUrl"
              :data="access_token"
              :show-file-list="false"
              :on-change="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-success="uploadSuccessRedPacket"
            >
              <img v-if="packetImageUrl" :src="packetImageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-input class="inputs none imgArea" v-model="packetData.packetImageUrl"></el-input>
            </el-upload>
          </el-form-item>
          <el-form-item label="红包类型" prop="packetType" verify>
            <el-select
              class="formItem"
              v-model="packetData.packetType"
              prop="packetType"
              placeholder="选择红包类型"
              size="small"
              @change="checkPacketType"
            >
              <el-option
                v-for="item in packetTypeList"
                :key="item.packetType"
                :label="item.name"
                :value="item.packetType"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="packetData.packetType==1?'单个金额':'最低随机'" prop="packetAmountLow" verify>
            <el-input
              class="formItem"
              v-model="packetData.packetAmountLow"
              type="number" min="0"
              maxlength="10"
              placeholder="请输入金额，单位：元"
            ></el-input>
            <span class="describe">单位：元</span>
          </el-form-item>
          <el-form-item label="最高随机'" v-if="packetData.packetType==2" prop="packetAmountHigh">
            <el-input
              class="formItem"
              v-model="packetData.packetAmountHigh"
              type="number" min="0"
              maxlength="10"
              placeholder="请输入最高随机金额，单位：元"
            ></el-input>
            <span class="describe">单位：元</span>
          </el-form-item>
          <el-form-item label="计划投放" prop="packetTotalQuantity" verify>
            <el-input
              v-if="packetData.packetTotalQuantity != -1"
              class="formItem"
              type="number" min="0"
              v-model="packetData.packetTotalQuantity"
              maxlength="10"
              placeholder="请输入计划投放数量"
            ></el-input>
            <el-input
              v-if="packetData.packetTotalQuantity==-1"
              class="formItem"
              type="number"
              v-model="packetData.packetTotalQuantity"
              maxlength="10"
              placeholder="投放不限量"
              disabled="disabled"
              @change="checkPacketCounts"
            ></el-input>
            <span>
              <el-button type="primary" size="mini" @click="checkPacketCountLimit">{{packetData.packetTotalQuantity!=-1?'设为不限':'设置投放'}}</el-button>
            </span>
            <span v-if="packetData.packetTotalQuantity!=-1" class="describe">输入数字，不超过10位</span>
            <span v-if="packetData.packetTotalQuantity==-1" class="describe">-1 代表投放不限</span>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addPacketInfoPageOpen = false">取 消</el-button>
          <el-button type="primary" size="small" @click="setPacket">确 定</el-button>
        </span>
      </el-dialog>

      <!--追加红包-->
      <el-dialog
        title="添加红包"
        :visible.sync="addPacketCountPage"
        width="50%"
        :destroy-on-close="true"
        @close="nodeCollapse"
      >
        <el-form>
          <div class="title">
            <el-form-item prop="addPacketCount"  can-be-empty>
              <el-input class="inputs" type="number" placeholder="请输入追加数目,减少则输入负数"  size="mini" v-model="addPacketCounts"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addPacketCountPage = false">取 消</el-button>
        <el-button type="primary" @click="addPacketCountsSub">确 定</el-button>
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
        campaignsSetRules,
    } from "@/api/table";
    export default {
        name: "CAMPAIGN_LIST",
        components: {},
        data() {
            return {
                //列表查询条件
                data:{
                    campaignType:'',//活动类型[见UML图备注]
                    campaignState:'',//活动状态[1-策划中, 2-公示中, 3-进行中,4-已暂停,  5-已停止]
                    campaignSubject:'',//活动主题
                    campaignStartTime:'',//活动开始时间
                    campaignStopTime:'',//活动结束时间
                    page:1,
                    times:"",
                },
                listLoading:false,
                //编辑活动基本信息
                campaignData:{
                    campaignUid:'',
                    campaignSubject :'',//活动主题
                    campaignContent:'',//活动内容
                    campaignType :'',//活动类型
                    campaignParticipantsType  :'',//参与者
                    times:"",//时间选择器选中
                    campaignStartTime :'',//开始时间
                    campaignStopTime :'',//结束时间
                    campaignPlanedTotalAmount :'',//计划投入资金
                },
                //物资基本信息管理
                materialData:{
                    materialUid:'',
                    campaignUid:'',//活动id
                    materialName:'',//物资名
                    materialDesc:'',//物资说明
                    materialSpecifications:'',//物资规格
                    materialMeasurementUnits:'',//物资计量单位(默认"件")
                    materialCostPrice:'',//物资成本价(分)
                    materialSellPrice:'',//物资销售价(分)
                    materialTotalQuantity:'',//计划投放总量(-1代表不限量)
                    materialImageUrl:'',

/*                    materialAppendedQuantity:'',//已投放总量
                    materialDrawnQuantity:'',//已领取数量
                    materialFreezingQuantity:'',//冻结中的物资数量
                    materialLastAppenedTime:'',//物资最后添加日期*/
                },
                //物资建档
                //时间选择钩子
                pickerOptions: {
                    shortcuts: [
                        {
                            text: "最近一周",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近一个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近三个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit("pick", [start, end]);
                            }
                        }
                    ]
                },
                //分页
                isIndeterminate: false,
                checkAll: false,
                count: 0,
                multipleSelection: [],
                //活动列表：
                campaignList:[
                ],
                //活动创建时间
                createTime:'createTime',
                materialPutOnList:[],
                redPacketPutOnList:[],
                materialList:[],
                redPacketList:[],
                //活动类型
                campaignTypes:{
                    1:"积分换红包活动",
                    2:"送祝福拉新活动",
                },
                campaignTypeList:[
                    {
                        campaignType:1,
                        name:'积分换红包活动',
                    },
                    {
                        campaignType:2,
                        name:'送祝福拉新活动',
                    }
                ],
                //参与者类型
                campaignParticipantsTypes:{
                    1:"所有用户",
                    2:"所有创作者",
                    3:"其他",
                },
                campaignParticipantsTypeList:[
                    {
                        campaignParticipantsType:1,
                        name:'所有用户',
                    },
                    {
                        campaignParticipantsType:2,
                        name:'所有创作者',
                    },
                    {
                        campaignParticipantsType:3,
                        name:'其他',
                    },
                ],
                //活动状态[1-策划中, 2-公示中, 3-进行中,4-已暂停,  5-已停止]
                campaignStates:{
                    1:'策划中',
                    2:'公示中',
                    3:'进行中',
                    4:'已暂停',
                    5:'已停止',
                },
                campaignStateList:[
                    {
                        campaignState:1,
                        name:'策划中',
                    },
                    {
                        campaignState:2,
                        name:'公示中',
                    },
                    {
                        campaignState:3,
                        name:'进行中',
                    },
                    {
                        campaignState:4,
                        name:'已暂停',
                    },
                    {
                        campaignState:5,
                        name:'已停止',
                    }
                ],
                //打开活动增加和编辑页面
                setCampaignPageOpen:false,
                campaignUid:'',
                campaignInfo:{},
                campaignRules:[],
                curCampaignInfo:[],
                //活动规则uid
                pointEffectiveRuleUid:'',//积分是否有效
                pointsCountsRuleUid:'',//每成功发送一个有效祝福，积多少分(一个值, int)；
                pointExchangePacketRuleUid:'',//每多少积分，可以兑换什么红包(json数组，每个数组值，两个值, int, 红包投放UID)
                pointExchangeMaterialRuleUid:'',//每多少积分，可以兑换什么物资(json数组，每个数组值，有两个值，int, 物资UID)
                pointExchangeMaterialOrPacketCountsRuleUid:'',//每个用户，一天内可以兑换多少物资和红包(单值， int)
                getPacketReceiveBlessingRuleUid:'',//接收者，在收到新的祝福时，可以领取什么红包(两个值, int, 红包投放UID)；
                receivePacketCountsRuleUid:'',//接收者，在同一天内，最多可以领取多少个红包(单值, int)；
                blessingRewardsRuleUid:'',//发送祝福最多的第几名，领什么物资(json数组，每个数组值，有3个值，int, 物资UID，物资数量)
                withdrawalTimesRuleUid:'',// 活动期间，每用户每天只能提现的次数(单值, int)
                //物资管理打开得界面，弹出物资管理/建档/添加物资/设置物资使用规则 等页面
                setMaterialsPageOpen:false,
                addMaterialsPageOpen:false,
                addMaterialPage:false,
                appendQuantity :'',//追加物资数目
                appendUserNickName :'',//操作人
                materialInfo:{},//预存物资对象
                setMaterialUseRule:false,
                controlSetCountLimit:false,//控制物资管理投放是否为无限，true为不限量，false为有限
                materialCount:'',//物资管理列表数目
                materialImageUrl:'',//物资图片
                //红包管理得打开界面，弹出红包管理/添加红包/追加红包/设置红包使用规则 等页面
                redPacketCount:'',//红包管理列表数目
                packetTypes:{
                    1:'定额红包',
                    2:'随机红包',
                },
                packetTypeList:[
                    {
                        packetType:'1',
                        name:'定额红包',
                    },
                    {
                        packetType:'2',
                        name:'随机红包',
                    }
                ],
                setPacketPageOpen:false,
                addPacketInfoPageOpen:false,
                addPacketCountPage:false,
                setPacketUsePageRule:false,
                addPacketCounts:'',//追加红包数目
                packetImageUrl:'',
                redPacketImageUid:'',
                upImgUrl: process.env[this.$base] + "/medias/image/upload",
                access_token: {
                    access_token: this.$store.getters.token
                },
                packetData:{
                    packetUid:'',//红包UID
                    campaignUid:'',//活动UID
                    packetName:'',//红包名称
                    packetDesc:'',//红包说明
                    packetType:'',//红包类型[1-定额红包, 2-随机红包]
                    packetTotalQuantity:'',//红包投放总数[-1表示无总数限制]
                    packetAmountLow:'',//单个定额红包金额(或随机红包的下限金额)(分)
                    packetAmountHigh:'',//随机红包的上限金额(分)
                    packetImageUrl:'',
                    redPacketSource:'',
                },
                //红包用途
                redPacketSourceList:[
                    {
                        redPacketSource:1,
                        name:'活动收礼获得'
                    },
                    {
                        redPacketSource:2,
                        name:'活动奖品兑换'
                    },
                ],
                //ruleData,规则设置
                setCampaignRulePage:false,
                integralEffective:true,//积分是否有效
                ruleData:{
                    ruleUid:'',//规则id
                    campaignUid:'',//活动id
                    ruleTitle:'',//规则标题
                    ruleDesc:'',//规则描述详细说明
                    ruleSearchKey:'',//规则的查找键名(用于源代码中查找)
                    ruleValue1:'',//规则值1(必填，规则至少有一个值)
                    ruleValue2:'',//规则值2(可选，有些规则会有一个以上的值)
                },
                rulesData:{
                    pointEffective:'',//积分是否有效
                    pointsCounts:'',//每成功发送一个有效祝福，积多少分(一个值, int)；
                    pointExchangePacket:[],// 每多少积分，可以兑换什么红包(json数组，每个数组值，两个值, int, 红包投放UID)；
                    pointExchangeMaterial:[],// 每多少积分，可以兑换什么物资(json数组，每个数组值，有两个值，int, 物资UID)；
                    pointExchangeMaterialOrPacketCounts:'',//每个用户，一天内可以兑换多少物资和红包(单值， int)；
                    getPacketReceiveBlessing:[],//接收者，在收到新的祝福时，可以领取什么红包(两个值, int, 红包投放UID)；
                    receivePacketCounts:'',//接收者，在同一天内，最多可以领取多少个红包(单值, int)；
                    blessingRewards:[],//发送祝福最多的第几名，领什么物资(json数组，每个数组值，有3个值，int, 物资UID，物资数量)
                    withdrawalTimes:'',// 活动期间，每用户每天只能提现的次数(单值, int)
                },//临时存，用于赋值
                pointExchangePacket:[],// 每多少积分，可以兑换什么红包(json数组，每个数组值，两个值, int, 红包投放UID)；
                pointExchangeMaterial:[],// 每多少积分，可以兑换什么物资(json数组，每个数组值，有两个值，int, 物资UID)；
                getPacketReceiveBlessing:[],//接收者，在收到新的祝福时，可以领取什么红包(两个值, int, 红包投放UID)；
                blessingRewards:[],//发送祝福最多的第几名，领什么物资(json数组，每个数组值，有3个值，int, 物资UID，物资数量)
            }
        },
        created() {
            //获取当前操作人员
           this.appendUserNickName  = window.sessionStorage.getItem('userName');
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                // this.listLoading = true;
                //获取用户信息，加载表格数据
                let data = JSON.parse(JSON.stringify(this.data));
                data.page --;
                data.campaignStartTime = data.times[0] || "";
                data.campaignStopTime = data.times[1] || "";
                delete  data.times;
                console.log(data);
                // return false;
                campaignsList(data).then(result => {
                    if(result.data.isSuccessful === "Y"){
                        //this.campaignList 好像只能赋值一次。
                        // this.campaignList = result.data.data.campaignsList;
                        this.count = result.data.data.count;
                        for(let  i=0;i<result.data.data.campaignsList.length;i++){
                            result.data.data.campaignsList[i].materialPutOnList =[];
                            result.data.data.campaignsList[i].redPacketPutOnList =[];
                            //分别赋值，物资列表和红包列表,物资列表
                            campaignsMaterialList({campaignUid:result.data.data.campaignsList[i].campaignUid}).then(res => {
                                if(res.data.isSuccessful === "Y"){
                                    //当前活动红包列表
                                    campaignsRedPacketList({campaignUid:result.data.data.campaignsList[i].campaignUid}).then(re => {
                                        if(re.data.isSuccessful === "Y"){
                                            //赋值
                                            result.data.data.campaignsList[i].materialPutOnList = res.data.data;
                                            result.data.data.campaignsList[i].redPacketPutOnList = re.data.data;
                                        }
                                    }).catch(err => {});
                                }
                            }).catch(err => {});
                        }
                        console.log( result.data.data.campaignsList);
                        this.campaignList  = result.data.data.campaignsList;
                        // this.listLoading = false
                    }
                }).catch(err => {});
            },
            //上传图片
            handleAvatarSuccess(file, fileList) {},
            beforeAvatarUpload(file) {
                var type = "image/jpg,image/jpeg,image/png,image/gif";
                const isJPG = type.indexOf(file.type) != -1;
                const isLt1M = file.size / 1024 / 1024 < 1;

                if (!isJPG) {
                    this.$message.error("上传图片只能是 JPG,JPEG,PNG,GIF 格式!");
                }
                if (!isLt1M) {
                    this.$message.error("上传图片大小不能超过 1MB!");
                }
                return isJPG && isLt1M;
            },
            //物资图片上传成功
            uploadSuccessMaterial(response, file, fileList) {
                if (response.code == "200") {
                    this.materialData.materialImageUrl = response.data.fileUrl;
                    this.materialImageUrl = response.data.fileUrl;
                }
            },
            //红包图片上传成功
            uploadSuccessRedPacket(response, file, fileList) {
                if (response.code == "200") {
                    this.packetData.packetImageUrl = response.data.fileUrl;
                    this.packetImageUrl = response.data.fileUrl;
                }
            },

            //查询当前资源信息
            findMaterialByCampaignUid(campaignUid){
                //分别赋值，物资列表和红包列表,物资列表
                campaignsMaterialList({campaignUid:campaignUid}).then(res => {
                    if(res.data.isSuccessful === "Y"){
                        //当前物资列表
                        this.materialPutOnList = res.data.data;
                    }
                }).catch(err => {});
            },
            //查询当前红包信息
            findRedPacketCampaignUid(campaignUid){
                campaignsRedPacketList({campaignUid:campaignUid}).then(re => {
                    if(re.data.isSuccessful === "Y"){
                        //赋值
                        this.redPacketPutOnList = re.data.data;
                    }
                }).catch(err => {});
            },
            //搜索
            search(){
                this.init();
            },
            resetQuery(){
                this.data={
                    campaignType:'',//活动类型[见UML图备注]
                    campaignState:'',//活动状态[1-策划中, 2-公示中, 3-进行中,4-已暂停,  5-已停止]
                    campaignSubject:'',//活动主题
                    campaignStartTime:'',//活动开始时间
                    campaignStopTime:'',//活动结束时间
                    page:1,
                    times:"",
                };
                this.init();
            },
            //选择活动类型
            checkCampaignType(){this.init();},
            checkCampaignTypeForAdd(){},
            //切换活动状态
            checkCampaignState(){this.init();},
            //选择活动参与者类型
            checkCampaignParticipantsType(){},
            checkTimeChange(){this.init()},
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
            //数组排序
            compare  (prop) {
                return function (obj1, obj2) {
                    var val1 = obj1[prop];
                    var val2 = obj2[prop];
                    if (val1 > val2) {
                        return -1;
                    } else if (val1 < val2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            //监听选择的内容
            handleSelectionChange(val) {
                //val 为选中数据的集合
                this.multipleSelection = val;
                // console.log(this.multipleSelection)
            },
            // 给表格每行增加一个唯一 标识，用作切换分页后保留被选中行的信息
            getRowKeys(row) {
                return row.campaignUid;
            },
            getRowKeysForMaterial(row){
                return row.materialUid;
            },
            //选择活动
            checkCampaign(){
                console.log("选择活动");
                this.init();
            },
            //打开新增或者编辑活动页面
            addCampaignPageOpen(campaignInfo){
                if(campaignInfo.campaignUid != null){
                    this.campaignData = {
                        campaignUid:campaignInfo.campaignUid,
                        campaignSubject:campaignInfo.campaignSubject,//活动主题
                        campaignContent:campaignInfo.campaignContent,//活动内容
                        campaignType:campaignInfo.campaignType,//活动类型
                        campaignPlanedTotalAmount:campaignInfo.campaignPlanedTotalAmount/100,//计划投入资金
                        campaignParticipantsType :campaignInfo.campaignParticipantsType ,//参与者
                        campaignStartTime:campaignInfo.campaignStartTime,//开始时间
                        campaignStopTime:campaignInfo.campaignStopTime,//结束时间
                        times:[campaignInfo.campaignStartTime,campaignInfo.campaignStopTime],//渲染时间选择
                    }
                }else {
                    this.campaignData={
                        campaignUid:'',
                        campaignSubject :'',//活动主题
                        campaignContent:'',//活动内容
                        campaignType :'',//活动类型
                        campaignParticipantsType  :'',//参与者
                        times:"",//时间选择器选中
                        campaignStartTime :'',//开始时间
                        campaignStopTime :'',//结束时间
                        campaignPlanedTotalAmount :'',//计划投入资金
                    }
                }
                this.setCampaignPageOpen = true;
            },
            //设置活动规则
            setCampaignRulePageOpen(campaignInfo){
                this.curCampaignInfo = campaignInfo;
                //查询相应物资列表和红包列表
                this.findMaterialByCampaignUid(this.curCampaignInfo.campaignUid);
                this.findRedPacketCampaignUid(this.curCampaignInfo.campaignUid);
                //查出规则列表
                this.campaignRules = [];
                let campaignUid =  this.curCampaignInfo.campaignUid;
                campaignsRulesList({campaignUid:campaignUid}).then(res => {
                    if (res.data.isSuccessful === "Y") {
                        //渲染表单
                        this.rulesData={
                            pointEffective:'',//积分是否有效
                            pointsCounts:'',//每成功发送一个有效祝福，积多少分(一个值, int)；
                            pointExchangePacket:[],// 每多少积分，可以兑换什么红包(json数组，每个数组值，两个值, int, 红包投放UID)；
                            pointExchangeMaterial:[],// 每多少积分，可以兑换什么物资(json数组，每个数组值，有两个值，int, 物资UID)；
                            pointExchangeMaterialOrPacketCounts:'',//每个用户，一天内可以兑换多少物资和红包(单值， int)；
                            getPacketReceiveBlessing:[],//接收者，在收到新的祝福时，可以领取什么红包(两个值, int, 红包投放UID)；//赋值是为了无活动规则也显示下拉
                            receivePacketCounts:'',//接收者，在同一天内，最多可以领取多少个红包(单值, int)；
                            blessingRewards:[],//发送祝福最多的第几名，领什么物资(json数组，每个数组值，有3个值，int, 物资UID，物资数量)
                            withdrawalTimes:'',// 活动期间，每用户每天只能提现的次数(单值, int)
                        };
                        //赋值活动规则
                        this.campaignRules =res.data.data;
                        //无活动规则.为了显示接收者，在收到新的祝福时，可以领取什么红包 的下拉框；
                        if(this.campaignRules.length == 0){
                            this.rulesData.getPacketReceiveBlessing = [{packetUid:''}]
                        };
                        //活动规则有值
                        res.data.data.forEach( (e ,index)=> {
                            //积分是否有效
                            if(e.ruleSearchKey == 'ONE_SEND_VALID'){
                                let bool = e.ruleValue1;
                                this.rulesData.pointEffective = bool;
                                this.pointEffectiveRuleUid = e.ruleUid;
                            }//每成功发送一个有效祝福，积多少分(一个值, int)；
                            if(e.ruleSearchKey == 'ONE_SEND_POINT'){
                                this.rulesData.pointsCounts = e.ruleValue1;
                                this.pointsCountsRuleUid = e.ruleUid
                            }//每多少积分，可以兑换什么红包(json数组，每个数组值，两个值, int, 红包投放UID)
                            if(e.ruleSearchKey == 'RED_PACKET_RECEIVE_RULE'){
                                let arr = JSON.parse(e.ruleValue1);
                                this.pointExchangePacket = arr;
                                arr.forEach((item,idea) => {
                                    let info = {
                                        packetUid:'',//红包id
                                        pointCounts:'',//积分数
                                    };
                                    info.pointCounts = arr[idea].pointCounts;
                                    info.packetUid = arr[idea].packetUid;
                                    this.rulesData.pointExchangePacket.push(info);
                                });
                                this.pointExchangePacketRuleUid =  e.ruleUid;
                            }//每多少积分，可以兑换什么物资(json数组，每个数组值，有两个值，int, 物资UID)
                            if(e.ruleSearchKey == 'MATERIAL_RECEIVE_RULE'){
                                let arr = JSON.parse(e.ruleValue1);
                                this.pointExchangeMaterial = arr;
                                arr.forEach((item,idea)  => {
                                    let info = {
                                        materialUid:'',//物资id
                                        pointCounts:'',//积分数
                                    };
                                    info.pointCounts = arr[idea].pointCounts;
                                    info.materialUid = arr[idea].materialUid;
                                    this.rulesData.pointExchangeMaterial.push(info);

                                });
                                this.pointExchangeMaterialRuleUid = e.ruleUid;
                            }//每个用户，一天内可以兑换多少物资和红包(单值， int)
                            if(e.ruleSearchKey == 'USER_RECEIVE_COUNT_RULE'){
                                let int = e.ruleValue1;
                                this.rulesData.pointExchangeMaterialOrPacketCounts = int;
                                this.pointExchangeMaterialOrPacketCountsRuleUid = e.ruleUid;
                            }//接收者，在收到新的祝福时，可以领取什么红包(两个值, int, 红包投放UID)；
                            if(e.ruleSearchKey == 'RECEIVE_MEMBER_RED_PACKET_RULE'){

                                let arr = JSON.parse(e.ruleValue1);
                                this.getPacketReceiveBlessing = arr;
                                arr.forEach((item,idea)  => {
                                    let info = {
                                        packetUid:'',//红包id
                                    };
                                    info.packetUid = arr[idea].packetUid;
                                    this.rulesData.getPacketReceiveBlessing.push(info);
                                });
                                this.getPacketReceiveBlessingRuleUid = e.ruleUid;
                            }//接收者，在同一天内，最多可以领取多少个红包(单值, int)；
                            if(e.ruleSearchKey == 'RECEIVE_MEMBER_RED_PACKET_COUNT_RULE'){
                                this.rulesData.receivePacketCounts = e.ruleValue1;
                                this.receivePacketCountsRuleUid = e.ruleUid;
                            }//发送祝福最多的第几名，领什么物资(json数组，每个数组值，有3个值，int, 物资UID，物资数量)
                            if(e.ruleSearchKey == 'CAMPAIGNS_TOP_AWARD_RULE'){
                                let arr = JSON.parse(e.ruleValue1);
                                this.blessingRewards = arr;
                                arr.forEach((item,idea)  => {
                                    let info = {
                                        rank:'',
                                        materialUid:'',
                                        materialCounts:'',
                                    };
                                    info.rank = arr[idea].rank;
                                    info.materialUid = arr[idea].materialUid;
                                    info.materialCounts = arr[idea].materialCounts;
                                    this.rulesData.blessingRewards.push(info);
                                });
                                this.blessingRewardsRuleUid = e.ruleUid;
                            }// 活动期间，每用户每天只能提现的次数(单值, int)
                            if(e.ruleSearchKey == 'MEMBER_WITHDRAW_RULE'){
                                this.rulesData.withdrawalTimes = e.ruleValue1;
                                this.withdrawalTimesRuleUid = e.ruleUid;
                            }
                        });
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {console.log("错误了")});
                this.setCampaignRulePage = true;
            },
            campaignDelete(campaignUid){
                this.$confirm("此操作将删除该活动, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then( () => {
                    campaignsDelete({campaignUid:campaignUid}).then(res => {
                        if (res.data.isSuccessful === "Y") {
                            this.$message({
                                message: "删除成功",
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
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
            },
            //提交设置活动规则
            setCampaignRule(){
                // console.log(this.rulesData);
                //红包兑换规则：需要选中红包，没有则需新建红包，
                if(this.rulesData.pointExchangePacket.length ===0){
                    this.$message.error({
                        message: "未设置红包兑换规则",
                        type: "success"
                    });
                    return false
                }else  {
                    for(let i=0;i<this.rulesData.pointExchangePacket.length;i++){
                        if(this.rulesData.pointExchangePacket[i].packetUid === ''){
                            this.$message.error({
                                message: "红包兑换规则：未选择兑换红包,没有则需新建",
                                type: "success"
                            });
                            return false;
                        }
                    }
                }
                //物资兑换规则：需要选中物资，没有则需新建物资，
                if(this.rulesData.pointExchangeMaterial.length === 0){
                    this.$message.error({
                        message: "未设置物资兑换规则",
                        type: "success"
                    });
                    return false
                }else {
                    for(let i=0;i<this.rulesData.pointExchangeMaterial.length;i++){
                        if(this.rulesData.pointExchangeMaterial[i].materialUid === ''){
                            this.$message.error({
                                message: "物资兑换规则,未选择兑换物资物资,没有则需新建",
                                type: "success"
                            });
                            return false;
                        }
                    }
                }
                //收到红包领取规则。需要选中红包，没有则需新建红包
                if(this.rulesData.getPacketReceiveBlessing.length === 0){
                    this.$message.error({
                        message: "收到红包领取规则错误，未选择领取红包",
                        type: "success"
                    });
                    return false
                }
                //排名规则,需要选中物资，没有物资则先新建物资
                if(this.rulesData.blessingRewards.length ===0){
                    this.$message.error({
                        message: "未设置排名规则",
                        type: "success"
                    });
                    return false
                }
                else {
                    for(let i =0 ;i<this.rulesData.blessingRewards.length;i++){
                        if(this.rulesData.blessingRewards[i].materialUid ===''){
                            this.$message.error({
                                message: "排名规则,未选择排名奖励物资,没有则需新建",
                                type: "success"
                            });
                            return false
                        }
                    }
                }
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        if(this.campaignRules.length == 0){
                            console.log(this.campaignRules);
                            //组装新增规则
                            /*组装规则*/
                            let rulesList = [
                                //是否有效祝福规则
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleValue:this.rulesData.pointEffective,
                                    ruleSearchKey:'ONE_SEND_VALID',
                                },
                                //送祝福积分规则
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleValue:this.rulesData.pointsCounts,
                                    ruleSearchKey:'ONE_SEND_POINT',
                                },
                                // 每多少积分，可以兑换什么红包(json数组，每个数组值，两个值, int, 红包投放UID)；
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleValue:JSON.stringify(this.rulesData.pointExchangePacket),
                                    ruleSearchKey:'RED_PACKET_RECEIVE_RULE',
                                },
                                //每多少积分，可以兑换什么物资(json数组，每个数组值，有两个值，int, 物资UID)；
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleValue:JSON.stringify(this.rulesData.pointExchangeMaterial),
                                    ruleSearchKey:'MATERIAL_RECEIVE_RULE',
                                },
                                //每个用户，一天内可以兑换多少物资和红包数量(单值， int)；
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleValue:this.rulesData.pointExchangeMaterialOrPacketCounts,
                                    ruleSearchKey:'USER_RECEIVE_COUNT_RULE',
                                },
                                //红包领取规则；接收者，在收到新的祝福时，可以领取什么红包(两个值, int, 红包投放UID)；json
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleValue:JSON.stringify(this.rulesData.getPacketReceiveBlessing),
                                    ruleSearchKey:'RECEIVE_MEMBER_RED_PACKET_RULE',
                                },
                                //接收者一天最多可以领取红包数量规则
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleValue:this.rulesData.receivePacketCounts,
                                    ruleSearchKey:'RECEIVE_MEMBER_RED_PACKET_COUNT_RULE',
                                },
                                //排名规则
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleValue:JSON.stringify(this.rulesData.blessingRewards),
                                    ruleSearchKey:'CAMPAIGNS_TOP_AWARD_RULE',
                                },
                                //提现规则
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleValue:this.rulesData.withdrawalTimes,
                                    ruleSearchKey:'MEMBER_WITHDRAW_RULE',
                                },
                            ];
                            // console.log(rulesList);
                            // return  false;
                            rulesList.forEach(e => {
                                campaignsSetRules(e).then(res => {
                                    if (res.data.isSuccessful === "Y") {
                                    } else {
                                        this.$message.error(res.data.message);
                                    }
                                }).catch(err => {console.log("错误了")});
                            });
                            this.$message({
                                message: "设置成功",
                                type: "success"
                            });
                            this.setCampaignRulePage = false;
                        }
                        //修改规则
                        else {
                            /*组装规则*/
                            let rulesList = [
                                //是否有效祝福规则
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleUid:this.pointEffectiveRuleUid,
                                    ruleValue:this.rulesData.pointEffective,
                                },
                                //送祝福积分规则
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleUid:this.pointsCountsRuleUid,
                                    ruleValue:this.rulesData.pointsCounts,
                                },
                                // 每多少积分，可以兑换什么红包(json数组，每个数组值，两个值, int, 红包投放UID)；
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleUid:this.pointExchangePacketRuleUid,
                                    ruleValue:JSON.stringify(this.rulesData.pointExchangePacket),
                                },
                                //每多少积分，可以兑换什么物资(json数组，每个数组值，有两个值，int, 物资UID)；
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleUid:this.pointExchangeMaterialRuleUid,
                                    ruleValue:JSON.stringify(this.rulesData.pointExchangeMaterial),
                                },
                                //每个用户，一天内可以兑换多少物资和红包数量(单值， int)；
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleUid:this.pointExchangeMaterialOrPacketCountsRuleUid,
                                    ruleValue:this.rulesData.pointExchangeMaterialOrPacketCounts,
                                },
                                //红包领取规则；接收者，在收到新的祝福时，可以领取什么红包(两个值, int, 红包投放UID)；json
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleUid:this.getPacketReceiveBlessingRuleUid,
                                    ruleValue:JSON.stringify(this.rulesData.getPacketReceiveBlessing),
                                },
                                //接收者一天最多可以领取红包数量规则
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleUid:this.receivePacketCountsRuleUid,
                                    ruleValue:this.rulesData.receivePacketCounts,
                                },
                                //排名规则
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleUid:this.blessingRewardsRuleUid,
                                    ruleValue:JSON.stringify(this.rulesData.blessingRewards),
                                },
                                //提现规则
                                {
                                    campaignUid:this.curCampaignInfo.campaignUid,
                                    ruleUid:this.withdrawalTimesRuleUid,
                                    ruleValue:this.rulesData.withdrawalTimes,
                                },
                            ];
                            rulesList.forEach(e => {
                                console.log(e);
                                campaignsRules(e).then(res => {
                                    if (res.data.isSuccessful === "Y") {
                                        /*                            this.$message({
                                                                        message: "设置成功",
                                                                        type: "success"
                                                                    });
                                                                    setTimeout(() => {
                                                                        this.init();
                                                                    }, 2000);*/
                                        //跳转到列表
                                    } else {
                                        this.$message.error(res.data.message);
                                    }
                                }).catch(err => {console.log("错误了")});
                            });
                            this.$message({
                                message: "设置成功",
                                type: "success"
                            });
                            this.setCampaignRulePage = false;
                        }
                    }});
                //加上这个就进验证了不知到为毛！可能是执行顺序问题
                return false;
            },
            //设置是否一天发一次有效
            changeEffective(){
                console.log(this.integralEffective)
            },
            //添加送祝福名次奖励
            addBlessingReward(){
                let info = {
                    rank:'',
                    materialUid:'',
                    materialCounts:'',
                };
                this.rulesData.blessingRewards.push(info);
            },
            //删除祝福排名名词奖励此项
            deleteThis(index){
                console.log(index);
                this.rulesData.blessingRewards.splice(index,1);
            },
            //删除/添加红包兑换规则，
            deleteThisPacket(index){
                this.rulesData.pointExchangePacket.splice(index,1);
            },
            addPacketExchange(){
                let info = {
                    packetUid:'',//红包id
                    pointCounts:'',//积分数
                };
                this.rulesData.pointExchangePacket.push(info);
            },
            addReceivePacket(){
                let info = {
                    packetUid:'',//红包id
                };
                this.rulesData.getPacketReceiveBlessing[0] = info;
            },
            //删除添加物资兑换规则
            //删除/添加红包兑换规则，
            deleteThisMaterial(index){
                this.rulesData.pointExchangeMaterial.splice(index,1);
            },
            addMaterialExchange(){
                let info = {
                    materialUid:'',//物资id
                    pointCounts:'',//积分数
                };
                this.rulesData.pointExchangeMaterial.push(info);
            },
            //新增/编辑活动
            addCampaign(){
                //如果campaignUid不为空，那么则是修改
                if(this.campaignData.campaignUid != ''){
                    console.log("修改");
                    this.$refs['campaignForm'].validate((valid) => {
                        if (valid) {
                            this.campaignData.campaignStartTime = this.campaignData.times[0];
                            this.campaignData.campaignStopTime = this.campaignData.times[1];
                            delete  this.campaignData.times;
                            console.log(this.campaignData);
                            let data = {
                                campaignUid:this.campaignData.campaignUid,
                                campaignSubject :this.campaignData.campaignSubject,//活动主题
                                campaignContent:this.campaignData.campaignContent,//活动内容
                                campaignType :this.campaignData.campaignType,//活动类型
                                campaignParticipantsType  :this.campaignData.campaignParticipantsType,//参与者
                                campaignStartTime :this.campaignData.campaignStartTime,//开始时间
                                campaignStopTime :this.campaignData.campaignStopTime,//结束时间
                                campaignPlanedTotalAmount :this.campaignData.campaignPlanedTotalAmount * 100,//计划投入资金
                            };
                            //todo 修改活动
                            campaignsUpdate(data).then(res => {
                                if (res.data.isSuccessful === "Y") {
                                    this.$message({
                                        message: "修改成功！",
                                        type: "success"
                                    });
                                    setTimeout(() => {
                                        this.$router.go(0);
                                    }, 2000);
                                    //跳转到列表
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            });
                        }});
                }
                else {
                    console.log("新增");
                    this.$refs['campaignForm'].validate((valid) => {
                        if (valid) {
                            this.campaignData.campaignStartTime = this.campaignData.times[0] || '';
                            this.campaignData.campaignStopTime = this.campaignData.times[1] || '';
                            delete this.campaignData.campaignUid;
                            delete this.campaignData.times;
                            console.log(JSON.stringify(this.campaignData));
                            //增加
                            let data = {
                                campaignSubject :this.campaignData.campaignSubject,//活动主题
                                campaignContent:this.campaignData.campaignContent,//活动内容
                                campaignType :this.campaignData.campaignType,//活动类型
                                campaignParticipantsType  :this.campaignData.campaignParticipantsType,//参与者
                                campaignStartTime :this.campaignData.campaignStartTime,//开始时间
                                campaignStopTime :this.campaignData.campaignStopTime,//结束时间
                                campaignPlanedTotalAmount :this.campaignData.campaignPlanedTotalAmount * 100,//计划投入资金
                            };
                            //  return false;
                            campaignsAdd(data).then(res => {
                                if (res.data.isSuccessful === "Y") {
                                    this.$message({
                                        message: "新增成功！",
                                        type: "success"
                                    });
                                    setTimeout(() => {
                                        this.$router.go(0);
                                    }, 2000);
                                    //跳转到列表
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            });
                        }});
                }
            },
            //活动上线
            campaignOnline(campaignUid){
                campaignsOnline({campaignUid:campaignUid}).then(res => {
                    if (res.data.isSuccessful === "Y") {
                        this.$message({
                            message: "上线成功",
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
            //设置活动状态 活动暂停\继续\停止
            campaignsStateSet(campaignUid,campaignState ){
                let data={
                    campaignUid:campaignUid,
                    campaignState :campaignState
                };
                campaignsState(data).then(res => {
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
            },
            //活动物资管理
            setMaterialsPage(campaignInfo){
                this.curCampaignInfo = campaignInfo;
                //查询相应物资列表
                this.findMaterialByCampaignUid(this.curCampaignInfo.campaignUid);
                console.log(this.materialPutOnList);
                this.setMaterialsPageOpen  = true;
            },
            //打开物资建档页面
            setMaterialsInfo(materialInfo){
                if(materialInfo.materialUid != null) {
                    // console.log("编辑");
                    this.materialData = {
                        materialUid: materialInfo.materialUid,
                        campaignUid: materialInfo.campaignUid,//活动id
                        materialName: materialInfo.materialName,//物资名
                        materialDesc: materialInfo.materialDesc,//物资说明
                        materialSpecifications: materialInfo.materialSpecifications,//物资规格
                        materialMeasurementUnits: materialInfo.materialMeasurementUnits,//物资计量单位(默认"件")
                        materialCostPrice: materialInfo.materialCostPrice/100,//物资成本价(分)
                        materialSellPrice: materialInfo.materialSellPrice/100,//物资销售价(分)
                        materialTotalQuantity: materialInfo.materialTotalQuantity,//计划投放总量(-1代表不限量)
                        materialImageUrl:materialInfo.materialImageUrl,
                    };
                    this.materialImageUrl = materialInfo.materialImageUrl;
                    console.log(materialInfo);
                    //判断投放量展示效果
                    if(this.materialData.materialTotalQuantity == -1){
                        this.controlSetCountLimit = true;
                    }
                }else {
                    this.materialData={
                        campaignUid:this.curCampaignInfo.campaignUid,//活动id
                        materialName:'',//物资名
                        materialDesc:'',//物资说明
                        materialSpecifications:'',//物资规格
                        materialMeasurementUnits:'',//物资计量单位(默认"件")
                        materialCostPrice:'',//物资成本价(分)
                        materialSellPrice:'',//物资销售价(分)
                        materialTotalQuantity:'',//计划投放总量(-1代表不限量)
                        materialImageUrl:'',
                    };
                   this.materialData.materialTotalQuantity = 0;
                    this.materialImageUrl = "";
                }

                this.addMaterialsPageOpen = true;
            },
            //物资建档
            setMaterials(){
                if(this.materialData.materialUid != null){
                    this.$refs['materialForm'].validate((valid) => {
                        if (valid) {
                            let data = {
                                materialUid:this.materialData.materialUid,
                                campaignUid:this.materialData.campaignUid,//活动id
                                materialName:this.materialData.materialName,//物资名
                                materialDesc:this.materialData.materialDesc,//物资说明
                                materialSpecifications:this.materialData.materialSpecifications,//物资规格
                                materialMeasurementUnits:this.materialData.materialMeasurementUnits,//物资计量单位(默认"件")
                                materialCostPrice:this.materialData.materialCostPrice *100,//物资成本价(分)
                                materialSellPrice:this.materialData.materialSellPrice *100,//物资销售价(分)
                                materialTotalQuantity:this.materialData.materialTotalQuantity,//计划投放总量(-1代表不限量)
                                materialImageUrl:this.materialData.materialImageUrl,
                            };
                            // return false;
                            campaignsMaterialUpdate(data).then(res => {
                                if (res.data.isSuccessful === "Y") {
                                    this.$message({
                                        message: "修改成功！",
                                        type: "success"
                                    });
                                    this.init();
                                    this.addMaterialsPageOpen  = false;
                                    this.setMaterialsPageOpen  = false;
                                    //跳转到列表
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            });
                        }});
                }else {
                    // console.log(this.materialData.materialTotalQuantity);
                    this.$refs['materialForm'].validate((valid) => {
                        if (valid) {
                            console.log(this.materialData);
                            let data = {
                                campaignUid:this.materialData.campaignUid,//活动id
                                materialName:this.materialData.materialName,//物资名
                                materialDesc:this.materialData.materialDesc,//物资说明
                                materialSpecifications:this.materialData.materialSpecifications,//物资规格
                                materialMeasurementUnits:this.materialData.materialMeasurementUnits,//物资计量单位(默认"件")
                                materialCostPrice:this.materialData.materialCostPrice *100,//物资成本价(分)
                                materialSellPrice:this.materialData.materialSellPrice *100,//物资销售价(分)
                                materialTotalQuantity:this.materialData.materialTotalQuantity,//计划投放总量(-1代表不限量)
                                materialImageUrl:this.materialData.materialImageUrl,
                            };
                             // return false;
                            campaignsMaterialCreate(data).then(res => {
                                if (res.data.isSuccessful === "Y") {
                                    this.$message({
                                        message: "新增成功！",
                                        type: "success"
                                    });
                                    this.init();
                                    this.addMaterialsPageOpen  = false;
                                    this.setMaterialsPageOpen  = false;
                                    //跳转到列表
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            });
                        }});
                }
            },
            //选择是否限制投放，
            checkCountLimit(){
                if(this.materialData.materialTotalQuantity != -1){
                    this.materialData.materialTotalQuantity = -1
                }
                else if(this.materialData.materialTotalQuantity == -1){
                    this.materialData.materialTotalQuantity = 0
                }
                console.log(this.materialData.materialTotalQuantity)
            },//监听投放数量改变
            checkCounts(){

            },
            //删除物资
            delMaterial(materialInfo){
                this.$confirm("此操作将删除该物资, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then( () => {
                    campaignsMaterialDelete({campaignUid:materialInfo.campaignUid,materialUid:materialInfo.materialUid}).then(res => {
                        if (res.data.isSuccessful === "Y") {
                            this.$message({
                                message: "删除成功",
                                type: "success"
                            });
                            //关闭弹窗
                            setTimeout(() => {
                                this.init();
                            }, 2000);
                            //跳转到列表
                            this.init();
                            this.addMaterialsPageOpen  = false;
                        } else {
                            this.$message.error(res.data.message);
                        }
                    }).catch(err => {console.log("错误了")});
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
            },
            delRedPacket(){},
            //物资添加/追加页面
            addMaterialPageOpen(materialInfo){
                this.materialInfo = materialInfo;
                this.addMaterialPage = true;
            },
            //物资添加/追加
            addMaterialCounts(){
                let data = {
                    materialUid:this.materialInfo.materialUid,//物资id
                    campaignUid:this.materialInfo.campaignUid,//活动id
                    appendQuantity :this.appendQuantity ,//追加数目
                    appendUserNickName:this.appendUserNickName,//操作人
                };
                campaignsMaterialAdd(data).then(res => {
                    if (res.data.isSuccessful === "Y") {
                        this.$message({
                            message: "添加成功",
                            type: "success"
                        });
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {console.log("错误了")});

                console.log(data);
                this.init();
                this.addMaterialPage = false;
                this.setMaterialsPageOpen  = false;
            },
            //设为不限量
            setMaterialNoLimit(materialInfo){},
            //物资分配使用明细页面
            setMaterialUseRulePageOpen(materialInfo){
                this.setMaterialUseRule = true;
            },
            //物资分配使用
            setMaterialUse(){
                this.setMaterialUseRule = false;
            },

            //红包管理
            setPacketPage(campaignInfo){
                console.log(campaignInfo)
                this.curCampaignInfo = campaignInfo;
                this.setPacketPageOpen = true;
            },
            //新建红包
            setPacketInfo(packetInfo){
                if(packetInfo.packetUid != null){
                    this.packetData = {
                        campaignUid:packetInfo.campaignUid,//活动UID
                        packetUid:packetInfo.packetUid,//红包UID
                        packetName:packetInfo.packetName,//红包名称
                        packetDesc:packetInfo.packetDesc,//红包说明
                        packetType:packetInfo.packetType,//红包类型[1-定额红包, 2-随机红包]
                        packetTotalQuantity:packetInfo.packetTotalQuantity,//红包投放总数[-1表示无总数限制]
                        packetAmountLow:packetInfo.packetAmountLow,//单个定额红包金额(或随机红包的下限金额)(分)
                        packetAmountHigh:packetInfo.packetAmountHigh,//随机红包的上限金额(分)
                        packetImageUrl: packetInfo.packetImageUrl,
                        redPacketSource: packetInfo.redPacketSource
                    };
                    this.packetImageUrl = packetInfo.packetImageUrl;
                }else{
                    this.packetData = {
                        campaignUid:this.curCampaignInfo.campaignUid,//活动UID
                        packetName:'',//红包名称
                        packetDesc:'',//红包说明
                        packetType:'',//红包类型[1-定额红包, 2-随机红包]
                        packetTotalQuantity:'',//红包投放总数[-1表示无总数限制]
                        packetAmountLow:'',//单个定额红包金额(或随机红包的下限金额)(分)
                        packetAmountHigh:'',//随机红包的上限金额(分)
                        packetImageUrl:'',
                        redPacketSource:'',
                    };
                    this.packetData.packetTotalQuantity = 0;
                    this.packetImageUrl='';
                }
                this.addPacketInfoPageOpen = true;
            },
            //选择红包类型
            checkPacketType(){},
            checkPacketCounts(){},
            //选择是否限制投放，
            checkPacketCountLimit(){
                if(this.packetData.packetTotalQuantity != -1){
                    this.packetData.packetTotalQuantity = -1
                }
                else if(this.packetData.packetTotalQuantity == -1){
                    this.packetData.packetTotalQuantity = 0
                }
                console.log(this.packetData.packetTotalQuantity)
            },
            checkRedPacketSource(){},
            setPacket(){
                if(this.packetData.packetUid != null){
                    console.log("编辑");
                    this.$refs['redPacketForm'].validate((valid) => {
                        if (valid) {
                            // 编辑
                            let data ={
                                packetUid:this.packetData.packetUid,
                                campaignUid:this.packetData.campaignUid,//活动UID
                                packetName:this.packetData.packetName,//红包名称
                                packetDesc:this.packetData.packetDesc,//红包说明
                                packetType:this.packetData.packetType,//红包类型[1-定额红包, 2-随机红包]
                                packetTotalQuantity:this.packetData.packetTotalQuantity,//红包投放总数[-1表示无总数限制]
                                packetAmountLow:this.packetData.packetAmountLow*100,//单个定额红包金额(或随机红包的下限金额)(分)
                                packetAmountHigh:this.packetData.packetAmountHigh*100,//随机红包的上限金额(分)
                                packetImageUrl:this.packetData.packetImageUrl,
                                redPacketSource:this.packetData.redPacketSource
                            };
                            console.log(data)
                        }});
                }else {
                    console.log("添加");
                    // 新增
                    this.$refs['redPacketForm'].validate((valid) => {
                            if (valid) {
                                console.log("不知道为毛进来不到！！");
                                let data ={
                                    campaignUid:this.packetData.campaignUid,//活动UID
                                    packetName:this.packetData.packetName,//红包名称
                                    packetDesc:this.packetData.packetDesc,//红包说明
                                    packetType:this.packetData.packetType,//红包类型[1-定额红包, 2-随机红包]
                                    packetTotalQuantity:this.packetData.packetTotalQuantity,//红包投放总数[-1表示无总数限制]
                                    packetAmountLow:this.packetData.packetAmountLow*100,//单个定额红包金额(或随机红包的下限金额)(分)
                                    packetAmountHigh:this.packetData.packetAmountHigh*100,//随机红包的上限金额(分)
                                    packetImageUrl:this.packetData.packetImageUrl,
                                    redPacketSource:this.packetData.redPacketSource
                                };
                                console.log(data);
                                // return false;
                                campaignsRedPacketAdd(data).then(res => {
                                    if (res.data.isSuccessful === "Y") {
                                        this.$message({
                                            message: "新增成功！",
                                            type: "success"
                                        });
                                        setTimeout(() => {
                                            this.$router.go(0);
                                        }, 2000);
                                        //跳转到列表
                                    } else {
                                        this.$message.error(res.data.message);
                                    }
                                });
                            }});
                }
                return false;
                this.addPacketInfoPageOpen  = false;
            },
            //设为不限量；
            setPacketNoLimit(){},
            //物资添加/追加
            addPacketInfo(){
                this.addPacketCountPage = true;
                console.log(this.addPacketCounts)
            },
            addPacketCountsSub(){
                console.log(this.addPacketCounts)
                this.addPacketCountPage = false;
            },
            //在关闭弹出框，时清楚一些数据
            nodeCollapse(){
                this.materialData={};
                this.materialData.materialTotalQuantity = 0;
                this.controlSetCountLimit = false;
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
