



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
.footer {
  height: 50px;
}
</style>


<template>
  <div class="bodyBox" id="COUPON_COUPON">
    <div class="flex-between">
      <div class="searchBox">
        <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.batchNo">
          <template slot="prepend">生成批次</template>
        </el-input>
        <el-button type="primary" size="mini" @click="getList">搜索</el-button>
      </div>
      <div class="flex-center">
        <el-button type="primary" @click="rechargeCode=true">实卡字段</el-button>
        <el-button type="primary" @click="routerTO('COUPON_COUPON_CREATE')">实卡生成</el-button>
      </div>
    </div>
    <el-dialog title="实卡字段" :visible.sync="rechargeCode" width="699px">
      <img src="../../assets/2018-09-07_165430.png" alt />
    </el-dialog>
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
      <el-table-column align="center" prop="batchNo" label="生成批次"></el-table-column>
      <el-table-column align="center" prop="createTime" label="生成时间" width="180"></el-table-column>
      <el-table-column align="center" prop="code" label="批次编码" width="100"></el-table-column>
      <el-table-column align="center" label="卡券类型" width="120">
        <template slot-scope="scope">{{couponType[scope.row.couponType]}}</template>
      </el-table-column>
      <el-table-column align="center" label="总数量" width="120">
        <template slot-scope="scope">{{scope.row.totalCount}} 张</template>
      </el-table-column>
      <el-table-column align="center" label="未激活" width="120">
        <template slot-scope="scope">{{scope.row.bindingCount}} 张</template>
      </el-table-column>
      <el-table-column align="center" label="已激活" width="120">
        <template slot-scope="scope">{{scope.row.bindedCount}} 张</template>
      </el-table-column>
      <el-table-column align="center" label="已绑定总金额" width="120">
        <template slot-scope="scope">￥ {{$util.prices(scope.row.bindedAmount)}}</template>
      </el-table-column>
      <el-table-column align="center" label="已兑换" width="120">
        <template slot-scope="scope">{{scope.row.convertedCount}} 张</template>
      </el-table-column>
      <el-table-column align="center" label="兑换总金额" width="120">
        <template slot-scope="scope">￥ {{$util.prices(scope.row.convertedAmount)}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="routerTO('COUPON_COUPON_DETAIL',scope.row.batchId)"
          >查看详情</el-button>
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
  </div>
</template>


<script>
import { companyBatchList, companyDetails, companyRecharge } from "@/api/table";

export default {
  name: "COUPON_COUPON",
  data() {
    return {
      data: {
        batchNo: "", // 生成批次
        page: 1
      },
      tableData: [],
      checkAll: false,
      isIndeterminate: false,
      countNum: 0,
      rechargeCode: false,
      payType: ["银行转账", "微信支付", "支付宝支付", "线下汇款", "其他方式"],
      couponType: {
        BALANCE_CARD: "通兑卡",
        PRODUCT_CARD: "单品卡"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      var data = JSON.parse(JSON.stringify(this.data));
      // 后端page从0开始，所以需要减一
      data.page--;
      companyBatchList(data)
        .then(result => {
          if (result.code == 200) {
            this.countNum = result.data.count;
            this.tableData = result.data.data;
          }
        })
        .catch(err => {});
    },
    routerTO(path, id) {
      try {
        var obj = { name: path };
        if (id) {
          obj.query = { id: id };
        }
        this.$router.push(obj);
      } catch (error) {}
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








