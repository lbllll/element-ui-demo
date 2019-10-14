



<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.searchBox {
  width: 100%;
  height: 60px;
  margin-top: 5px;
  padding: 0 20px;
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
.editBtn {
  color: #409eff;
}
.footer {
  height: 50px;
}
.userInfo {
  img {
    width: 36px;
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
  <div class="bodyBox" id="PRODUCT_ORDER_LIST">
    <div class="searchBox">
      <el-select class="select" size="mini" v-model="data.buyType" placeholder="请选择">
        <el-option
          v-for="item in buyTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <div class="flex-center">
        <!-- <p>订单状态：</p> -->
        <el-select class="select" size="mini" v-model="data.status" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="flex-center">
        <!-- <p>订单来源：</p> -->
        <el-select class="select" size="mini" v-model="data.payType" placeholder="请选择">
          <el-option
            v-for="item in payTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.tradeNo">
        <template slot="prepend">订单号</template>
      </el-input>
      <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.nickName">
        <template slot="prepend">用户名</template>
      </el-input>
      <el-button type="primary" size="mini" @click="getList">搜索</el-button>
      <!-- <el-button type="primary" size="mini">高级查询</el-button> -->
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
      <el-table-column align="center" type="selection" width="40"></el-table-column>
      <el-table-column align="center" prop="tradeNo" label="订单号" width="100"></el-table-column>
      <el-table-column align="center" prop="createTime" label="下单时间"></el-table-column>
      <el-table-column align="center" label="用户">
        <template slot-scope="scope">
          <div class="userInfo">
            <img :src="scope.row.headPath" alt />
            {{deCodes(scope.row.nickName)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="buyCount" label="数量" width="80"></el-table-column>
      <el-table-column align="center" label="总金额" width="80">
        <template slot-scope="scope">￥{{$util.prices(scope.row.totalPrice)}}元</template>
      </el-table-column>
      <el-table-column align="center" label="消费类型" width="100">
        <template slot-scope="scope">{{buyType[scope.row.buyType]}}</template>
      </el-table-column>
      <el-table-column align="center" label="支付状态" width="80">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" width="80">
        <template slot-scope="scope">{{payType[scope.row.payType]}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" @click="getDetail(scope.row.orderId)" size="mini">查看订单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer flex-between">
      <div>
        <!-- <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <el-button type="primary" size="mini">取消订单</el-button>
        <el-button type="primary" size="mini">失效</el-button>
        <el-button type="primary" size="mini">打印</el-button>-->
      </div>
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
        <div class="tableDetail" v-if="Object.keys(details.orderInfo).length > 0">
          <div class="flex-center">
            <div class="tableItem">订单号：</div>
            <div class="tableItem">{{details.orderInfo.orderId}}</div>
            <div class="tableItem">商品数量：</div>
            <div class="tableItem">{{details.orderItemList.length}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">下单用户：</div>
            <div class="tableItem">{{deCodes(details.memberInfo.nickName)}}</div>
            <div class="tableItem">下单时间：</div>
            <div class="tableItem">{{details.orderInfo.updateTime}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">购买方式：</div>
            <div class="tableItem">{{buyType[details.orderInfo.buyType]}}</div>
            <div class="tableItem">付款时间：</div>
            <div class="tableItem">{{details.orderInfo.payTime}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">绑定手机：</div>
            <div class="tableItem">{{details.memberInfo.mobile}}</div>
            <div class="tableItem">支付方式：</div>
            <div class="tableItem">{{payType[details.orderInfo.payType]}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">现金金额：</div>
            <div class="tableItem">￥{{$util.prices(details.orderInfo.realAmount)}} 元</div>
            <div class="tableItem">订单总金额：</div>
            <div class="tableItem">￥{{$util.prices(details.orderInfo.totalAmount)}} 元</div>
          </div>
        </div>
        <p>商品信息清单</p>
        <el-table :data="details.orderItemList" border style="width: 100%;margin-top:20px">
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
  </div>
</template>


<script>
import { orderList, orderDetails } from "@/api/table";

export default {
  name: "PRODUCT_ORDER_LIST",
  data() {
    return {
      data: {
        buyType: "", // 购买类型
        status: "", // 付款状态
        payType: "", // 支付方式
        tradeNo: "", // 订单号
        nickName: "", // 用户名
        page: 1
      },
      buyTypeList: [
        {
          value: "",
          label: "所有购买方式"
        },
        {
          value: "PRESENT_MANY",
          label: "群发多人抢"
        },
        {
          value: "PRESENT_ONE",
          label: "打包送一人"
        },
        {
          value: "PURCHASE",
          label: "自己购买"
        }
      ],
      statusList: [
        {
          value: "",
          label: "所有付款方式"
        },
        {
          value: "PAID",
          label: "已付款"
        },
        {
          value: "CREATED",
          label: "未付款"
        },
        {
          value: "EXPIRED",
          label: "取消"
        }
      ],
      payTypeList: [
        {
          value: "",
          label: "所有支付方式"
        },
        {
          value: "WEXIN",
          label: "微信支付"
        },
        {
          value: "BALANCE",
          label: "余额支付"
        },
        {
          value: "MERGE",
          label: "组合支付"
        }
      ],
      tableData: [],
      checkAll: false,
      detailCode: false,
      details: {
        orderItemList: [],
        orderInfo: {},
        memberInfo: {}
      },
      isIndeterminate: false,
      countNum: 0,
      buyType: {
        PURCHASE: "自己购买",
        PRESENT_ONE: "打包送一人",
        PRESENT_MANY: "群发多人抢",
        INIT: "初始化类型"
      },
      status: {
        PAID: "已支付",
        EXPIRED: "已过期",
        PRODUCT_UNGROUNDED: "商品下架",
        BALANCE_NOT_ENOUGH: "余额不足",
        SUCCESSFUL: "支付成功",
        PAY_NOT_ENOUGH: "支付不足的",
        PAY_TYPE_ERROR: "支付类型错误"
      },
      payType: {
        INIT: "初始化",
        WEXIN: "微信支付",
        BALANCE: "余额支付",
        MERGE: "组合支付",
        CONVERT: "单品卡兑换",
        OTHER: "其他支付"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      var data = JSON.parse(JSON.stringify(this.data));
      data.minPrice = data.minPrice ? +data.minPrice * 100 : "";
      data.maxPrice = data.maxPrice ? +data.maxPrice * 100 : "";
      data.nickName = this.$util.encode(data.nickName);
      // 后端page从0开始，所以需要减一
      data.page--;
      orderList(data)
        .then(result => {
          if (result.code == 200) {
            this.countNum = result.data.count;
            this.tableData = result.data.list;
          } else {
          }
        })
        .catch(err => {});
    },
    getDetail(id) {
      orderDetails({ orderId: id })
        .then(result => {
          this.details = result.data;
          this.detailCode = true;
        })
        .catch(err => {});
    },
    deCodes(str) {
      str = str.substr(0, str.length - 1);
      str = str.substr(1, str.length - 1);
      return this.$util.decode(str);
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
    handleCheckAllChange(val) {
      // this.checkedCities = val ? cityOptions : [];
      console.log(this.checkAll);
      if (this.checkAll) {
        this.$refs.multipleTable.toggleAllSelection();
      } else {
        this.$refs.multipleTable.clearSelection();
      }
      this.isIndeterminate = false;
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








