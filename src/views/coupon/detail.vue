



<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.searchBox {
  width: 100%;
  height: 60px;
  margin-top: 5px;
  border-radius: 4px;
  @include flex-align;
  .select {
    width: 120px;
    margin-right: 15px;
  }
  .inputs {
    width: 220px;
    margin-right: 15px;
  }
}
.tableBox {
  margin-top: 10px;
}
.footer {
  height: 50px;
}
.detailInfoBox {
  width: 80%;
  margin: auto;
  border-top: 1px solid rgb(192, 192, 192);
  border-left: 1px solid rgb(192, 192, 192);
  .detailTable {
    width: 100%;
    @include flex-center;
    div {
      @include flex-center;
      height: 36px;
      border-right: 1px solid rgb(192, 192, 192);
      border-bottom: 1px solid rgb(192, 192, 192);
    }
    .left {
      width: 15%;
    }
    .right {
      width: 35%;
    }
  }
}
.orderDetail {
  width: 100%;
  padding: 0 20px 0 50px;
}
.tableDetail {
  border-top: 1px solid rgb(194, 194, 194);
  border-left: 1px solid rgb(194, 194, 194);
  margin: 20px 0 30px;
  .tableItem {
    border-right: 1px solid rgb(194, 194, 194);
    border-bottom: 1px solid rgb(194, 194, 194);
    width: 25%;
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
}
.orderProduct {
  @include flex-center;
  img {
    width: 40px;
    margin-right: 10px;
  }
}
</style>


<template>
  <div class="bodyBox" id="COUPON_COUPON_DETAIL">
    <div class="detailInfoBox">
      <div class="detailTable">
        <div class="left">生成批号</div>
        <div class="right">{{details.batchNo}}</div>
        <div class="left">生成时间</div>
        <div class="right">{{details.createTime}}</div>
      </div>
      <div class="detailTable">
        <div class="left">生成总数量</div>
        <div class="right">{{details.totalCount}}张</div>
        <div class="left">已绑定总金额</div>
        <div class="right">￥{{$util.prices(details.bindedAmount)}}</div>
      </div>
      <div class="detailTable">
        <div class="left">已激活</div>
        <div class="right">{{details.bindedCount}}张</div>
        <div class="left">已兑换张数</div>
        <div class="right">{{details.convertedCount}}张</div>
      </div>
      <div class="detailTable">
        <div class="left">未激活</div>
        <div class="right">{{details.bindingCount}}张</div>
        <div class="left">已兑换总金额</div>
        <div class="right">￥{{$util.prices(details.convertedAmount)}}</div>
      </div>
      <div class="detailTable">
        <div class="left">卡券类型</div>
        <div class="right">{{couponType[details.couponType]}}</div>
        <div class="left"></div>
        <div class="right"></div>
      </div>
    </div>
    <div class="flex-between">
      <div class="searchBox">
        <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.sequence">
          <template slot="prepend">卡号</template>
        </el-input>
        <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.bindCustomer">
          <template slot="prepend">关联企业</template>
        </el-input>
        <el-select v-model="data.status" size="mini" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="getList" style="margin-left:15px">搜索</el-button>
      </div>
      <div class="flex-center">
        <el-button type="primary" @click="bindingCodeFun">绑定激活</el-button>
        <el-button type="primary" @click="getHistory()">绑定记录</el-button>
        <el-button type="primary" @click="downLoad()">导出表格</el-button>
      </div>
    </div>
    <el-table
      class="tableBox"
      :data="tableData"
      border
      style="width: 100%"
      ref="multipleTable"
      @select="tableSelect"
      @select-all="tableSelectAll"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
    >
      <!-- @selection-change="handleSelectionChange"
      @row-click="handleRowClick"-->
      <el-table-column align="center" type="index" width="40"></el-table-column>
      <el-table-column align="center" prop="sequence" label="卡号"></el-table-column>
      <el-table-column align="center" prop="bindCustomer" label="关联绑定客户" width="180"></el-table-column>
      <el-table-column align="center" prop="amount" label="礼卡面额" width="160">
        <template slot-scope="scope">￥{{$util.prices(scope.row.amount)}}</template>
      </el-table-column>
      <el-table-column align="center" prop="convertName" label="兑换会员" width="160"></el-table-column>
      <el-table-column align="center" prop="convertTime" label="兑换时间" width="160"></el-table-column>
      <el-table-column align="center" prop="convertProduct" label="兑换产品" width="160"></el-table-column>
      <el-table-column align="center" prop="convertProduct" label="查看订单" width="160">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.convertTime"
            type="primary"
            size="mini"
            @click="couponDetails(scope.row.sequence)"
          >查看订单</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status!='CONVERTED'&&scope.row.status!='DISABLED'&&scope.row.status!='NOT_BIND'"
            type="primary"
            size="mini"
            @click="disabledFun(scope.row.couponId)"
          >失效</el-button>
          <p v-else>--</p>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer flex-between">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="data.page"
        background
        layout="total, prev, pager, next, jumper"
        :total="countNum"
      ></el-pagination>
    </div>
    <el-dialog title="订单信息" :visible.sync="detailCode" width="70%">
      <div class="orderDetail">
        <p>订单基本信息</p>
        <div class="tableDetail" v-if="Object.keys(orderDetails.orderInfo).length > 0">
          <div class="flex-center">
            <div class="tableItem">订单号：</div>
            <div class="tableItem">{{orderDetails.orderInfo.orderId}}</div>
            <div class="tableItem">商品数量：</div>
            <div class="tableItem">{{orderDetails.orderItemList.length}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">下单用户：</div>
            <div class="tableItem">{{deCodes(orderDetails.memberInfo.nickName)}}</div>
            <div class="tableItem">下单时间：</div>
            <div class="tableItem">{{orderDetails.orderInfo.updateTime}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">购买方式：</div>
            <div class="tableItem">{{buyType[orderDetails.orderInfo.buyType]}}</div>
            <div class="tableItem">付款时间：</div>
            <div class="tableItem">{{orderDetails.orderInfo.payTime}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">绑定手机：</div>
            <div class="tableItem">{{orderDetails.memberInfo.mobile}}</div>
            <div class="tableItem">支付方式：</div>
            <div class="tableItem">{{payType[orderDetails.orderInfo.payType]}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">现金金额：</div>
            <div class="tableItem">￥{{$util.prices(orderDetails.orderInfo.realAmount)}} 元</div>
            <div class="tableItem">订单总金额：</div>
            <div class="tableItem">￥{{$util.prices(orderDetails.orderInfo.totalAmount)}} 元</div>
          </div>
        </div>
        <p>商品信息清单</p>
        <el-table :data="orderDetails.orderItemList" border style="width: 100%;margin-top:20px">
          <el-table-column align="center" label="商品名称">
            <template slot-scope="scope">
              <div class="orderProduct">
                <img :src="scope.row.headPath" alt />
                <p>{{scope.row.description}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="productId" label="商品货号" width="260"></el-table-column>
          <el-table-column align="center" label="商品价格" width="80">
            <template slot-scope="scope">￥{{$util.prices(scope.row.unitPrice)}} 元</template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="发货状态" width="80"></el-table-column>
          <el-table-column align="center" prop="buyCount" label="数量" width="80"></el-table-column>
          <el-table-column align="center" label="小计" width="80">
            <template slot-scope="scope">￥{{$util.prices(scope.row.totalPrice)}} 元</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="实卡关联企业客户" :visible.sync="bindingCode" width="70%">
      <el-form :model="forms" ref="forms" label-width="140px">
        <el-form-item label="该批次剩余礼卡数">
          <p>{{bindingInfo.usableCount}}张</p>
        </el-form-item>
        <el-form-item label="可用礼卡号段">
          <p>{{bindingInfo.usableBeginSequence}} 至 {{bindingInfo.usableEndSequence}}</p>
        </el-form-item>
        <el-form-item label="关联礼卡数量" verify prop="bindCount">
          <el-input v-model.number="forms.bindCount" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="关联礼卡名称" verify prop="recordName">
          <el-input v-model="forms.recordName" style="width:300px"></el-input>
        </el-form-item>

        <el-form-item
          v-if="details.couponType=='BALANCE_CARD'"
          label="单张礼卡面额"
          verify
          prop="unitAmount"
        >
          <el-input v-model="forms.unitAmount" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item
          v-if="details.couponType=='PRODUCT_CARD'"
          label="礼卡关联商品"
          verify
          prop="productListJson"
        >
          <el-input v-model="forms.productListJson" style="display:none"></el-input>
          <el-button
            @click="productListShow=true"
          >{{multipleSelection.length>0?('已选择'+multipleSelection.length+'件商品'):'选择礼卡商品'}}</el-button>
        </el-form-item>

        <el-form-item label="绑定企业客户" verify prop="bindCustomer">
          <el-input v-model="forms.bindCustomer" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="客户联系电话" verify prop="bindMobile">
          <el-input v-model="forms.bindMobile" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('forms')">确认绑定</el-button>
        <el-button @click="bindingCode = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="实卡关联企业客户" :visible.sync="productListShow" width="80%">
      <product-list checkItem :selectArr="multipleSelection" @selectData="selectData"></product-list>
    </el-dialog>
    <el-dialog title="实卡绑定记录" :visible.sync="historyCode" width="80%">
      <el-table
        class="tableBox"
        :data="historyList"
        border
        style="width: 100%"
        ref="multipleTable"
        :header-cell-style="{background:'#afafaf',color:'#606266'}"
      >
        <el-table-column align="center" type="index" width="40"></el-table-column>
        <el-table-column align="center" prop="createTime" label="绑定时间"></el-table-column>
        <el-table-column align="center" prop="bindCustomer" label="绑定企业" width="100"></el-table-column>
        <el-table-column align="center" prop="bindCount" label="数量" width="100"></el-table-column>
        <el-table-column align="center" label="面值" width="120">
          <template slot-scope="scope">￥{{$util.prices(scope.row.unitAmount)}}</template>
        </el-table-column>
        <el-table-column align="center" label="绑定总金额" width="120">
          <template slot-scope="scope">￥{{$util.prices(scope.row.totalAmount)}}</template>
        </el-table-column>
        <el-table-column align="center" prop="beginSequence" label="礼卡起始编号" width="120"></el-table-column>
        <el-table-column align="center" prop="endSequence" label="礼卡结束编号" width="120"></el-table-column>
        <el-table-column align="center" label="查看绑定商品" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="getHistoryDetails(scope.row.recordId)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="historyCurrentChange"
        :current-page="historyPage"
        background
        layout="total, prev, pager, next, jumper"
        :total="historyCount"
      ></el-pagination>
    </el-dialog>
    <el-dialog title="绑定商品" :visible.sync="bindingHistory" width="80%">
      <el-table
        class="tableBox"
        :data="bindingList"
        border
        style="width: 100%"
        ref="multipleTable"
        :header-cell-style="{background:'#afafaf',color:'#606266'}"
      >
        <el-table-column align="center" prop="couponName" label="礼卡名称" width="260"></el-table-column>
        <el-table-column align="center" prop="productId" label="商品ID" width="260"></el-table-column>
        <el-table-column align="center" prop="productName" label="商品名称"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>


<script>
import {
  companyBatchDetails,
  companyInfoList,
  batchBindPrepare,
  batchBind,
  getHistorys,
  getHistoryDetail,
  disabled,
  couponDetail
} from "@/api/table";
import productList from "@/views/product/list";

export default {
  name: "COUPON_COUPON_DETAIL",
  data() {
    return {
      data: {
        batchId: "", // 生成批次
        sequence: "",
        bindCustomer: "",
        status: "",
        page: 1
      },
      forms: {
        productListJson: "",
        recordName: "",
        bindMobile: "",
        bindCustomer: "",
        unitAmount: "",
        bindCount: "",
        batchId: ""
      },
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "CONVERTED",
          label: "已兑换"
        },
        {
          value: "BINDED",
          label: "未兑换"
        }
      ],
      details: {},
      bindingInfo: {},
      tableData: [],
      historyList: [],
      bindingList: [],
      checkAll: false,
      isIndeterminate: false,
      detailCode: false,
      bindingHistory: false,
      countNum: 0,
      historyCount: 0,
      historyPage: 1,
      productListShow: false,
      historyCode: false,
      bindingCode: false,
      payType: ["银行转账", "微信支付", "支付宝支付", "线下汇款", "其他方式"],
      couponType: {
        BALANCE_CARD: "通兑卡",
        PRODUCT_CARD: "单品卡"
      },
      multipleSelection: [],
      orderDetails: {
        orderItemList: [],
        orderInfo: {},
        memberInfo: {}
      },
      buyType: {
        PURCHASE: "自己购买",
        PRESENT_ONE: "打包送一人",
        PRESENT_MANY: "群发多人抢",
        INIT: "初始化类型"
      }
    };
  },
  components: {
    productList
  },
  created() {
    this.data.batchId = this.$route.query.id;
    this.forms.batchId = this.$route.query.id;

    this.getList();
  },
  methods: {
    getList() {
      var data = JSON.parse(JSON.stringify(this.data));
      // 后端page从0开始，所以需要减一
      data.page--;
      companyBatchDetails({ batchId: this.$route.query.id })
        .then(res => {
          if (res.code == 200) {
            this.details = res.data;
          }
        })
        .catch(err => {});
      companyInfoList(data)
        .then(result => {
          if (result.code == 200) {
            this.countNum = result.data.count;
            this.tableData = result.data.data;
          }
        })
        .catch(err => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.updataInfo) {
            return;
          }
          this.updataInfo = true;
          try {
            var data = JSON.parse(JSON.stringify(this.forms));
            data.unitAmount = +data.unitAmount * 100;
            batchBind(data)
              .then(res => {
                this.updataInfo = false;
                if (res.code == 200) {
                  this.getList();
                  this.bindingCode = false;
                } else {
                  this.$message.error(res.description);
                }
              })
              .catch(err => {
                this.updataInfo = false;
              });
          } catch (error) {
            this.updataInfo = false;
          }
        } else {
          this.$message.error("存在未填写项!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    deCodes(str) {
      str = str.substr(0, str.length - 1);
      str = str.substr(1, str.length - 1);
      return this.$util.decode(str);
    },
    bindingCodeFun() {
      batchBindPrepare({ batchId: this.data.batchId })
        .then(res => {
          if (res.code == 200) {
            this.bindingInfo = res.data;
            this.bindingCode = true;
          }
        })
        .catch(err => {});
    },
    selectData(arr) {
      this.multipleSelection = arr;
      this.forms.productListJson = [];
      arr.forEach(e => {
        this.forms.productListJson.push(e.productId);
      });
      // 处理好提交接口需要的数据并转化成json格式
      this.forms.productListJson = JSON.stringify(this.forms.productListJson);
      this.productListShow = false;
    },
    disabledFun(id) {
      disabled({ couponId: id })
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$message.error(res.description);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    couponDetails(id) {
      couponDetail({ sequence: id })
        .then(res => {
          if(res.data){
            this.orderDetails = res.data;
            this.detailCode = true;
          }else{
            this.$message.error('暂无订单信息')
          }
        })
        .catch(err => {});
    },
    getHistory() {
      var page = JSON.parse(JSON.stringify(this.historyPage));
      page = page - 1;
      getHistorys({ batchId: this.data.batchId, page: page })
        .then(res => {
          if (res.code == 200) {
            this.historyCount = res.data.count;
            this.historyList = res.data.data;
            this.historyCode = true;
          }
        })
        .catch(err => {});
    },
    getHistoryDetails(id) {
      getHistoryDetail({ recordId: id })
        .then(res => {
          if (res.code == 200) {
            this.bindingList = res.data;
            this.bindingHistory = true;
          }
        })
        .catch(err => {});
    },
    downLoad() {
      var str = `${process.env[this.$base]}/coupon/info/tables?access_token=${
        this.$store.getters.token
      }&batchId=${this.data.batchId}`;
      window.open(str);
    },
    //点击复选框触发，复选框样式的改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleCurrentChange(val) {
      this.data.page = val;
      this.getList();
      console.log(`当前页: ${val}`);
    },
    historyCurrentChange(val) {
      this.historyPage = val;
      this.getHistory();
    },
    // 保持表格全选按钮和底部全选按钮状态一致
    tableSelectAll(selection) {
      this.isIndeterminate = false;
      this.checkAll = !!selection.length;
    },
    tableSelect(selection, row) {
      if (selection.length && this.tableData.length > selection.length) {
        this.isIndeterminate = true;
        this.checkAll = false;
      }
      if (selection.length && this.tableData.length == selection.length) {
        this.isIndeterminate = false;
        this.checkAll = true;
      }
      if (!selection.length) {
        this.isIndeterminate = false;
        this.checkAll = false;
      }
    }
  }
};
</script>








