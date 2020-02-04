



<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.header {
  width: 100%;
  position: relative;
  margin-top: 10px;
  .back {
    position: absolute;
    top: 0;
    right: 20px;
  }
}

.title {
  width: 100%;
  height: 30px;
  margin-top: 20px;
  @include flex-center;
  background: #f2f2f2;
}
.info_table {
  width: 100%;
  border-top: 1px solid #e6e6e6;
  border-left: 1px solid #e6e6e6;
  display: flex;
  flex-wrap: wrap;
  .table_item {
    width: 50%;
    display: flex;
    div {
      border-right: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
      height: 36px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      font-size: 16px;
    }
    .teble_l {
      width: 35%;
      justify-content: flex-end;
      font-weight: bold;
      color: #333;
    }
    .teble_r {
      width: 65%;
      justify-content: flex-start;
      color: #666;
    }
  }
}
</style>


<template>
  <div class="bodyBox" id="PRODUCT_ORDER_LIST">
    <div class="header flex-center">
      <el-button type="primary" size="mini">上一个订单</el-button>
      <el-button type="primary" size="mini">后一个订单</el-button>
      <el-button type="primary" size="mini">打印</el-button>
      <el-button type="primary" size="mini" class="back">返回列表</el-button>
    </div>
    <div class="order_info">
      <p class="title">订单基本信息</p>
      <div class="info_table">
        <div class="table_item">
          <div class="teble_l">订单号：</div>
          <div class="teble_r">订单基本信订单基本信息息</div>
        </div>
        <div class="table_item">
          <div class="teble_l">商品数量：</div>
          <div class="teble_r">订单基本信订单基本信息息</div>
        </div>
      </div>
    </div>
    <div class="order_item">
      <p class="title">商品信息清单</p>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="商品名称 " align="center" width="180"></el-table-column>
        <el-table-column prop="name" label="商品货号" align="center" width="180"></el-table-column>
        <el-table-column prop="name" label="商品价格" align="center"></el-table-column>
        <el-table-column prop="name" label="发货状态" align="center"></el-table-column>
        <el-table-column prop="name" label="数量" align="center"></el-table-column>
        <el-table-column prop="name" label="小计" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>


<script>
export default {
  name: "PRODUCT_ORDER_DETAIL",
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
        }
      ]
    };
  },
  methods: {},
  created() {}
};
</script>








