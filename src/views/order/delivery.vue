



<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.searchBox {
  width: 100%;
  height: 60px;
  margin-top: 20px;
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

.logistics {
  div {
    margin: 10px 0;
    border-bottom: 1px solid #ccc;
    span {
      display: inline-block;
      margin: 0 8px;
      height: 24px;
      line-height: 24px;
    }
  }
}
</style>


<template>
  <div class="bodyBox" id="PRODUCT_DELIVERY">
    <div class="status">
      <el-radio-group v-model="data.status" @change="getList">
        <el-radio label border>全部提货（{{counters.totalCount}}）</el-radio>
        <el-radio label="WATTING" border>待发货（{{counters.wattingCount}}）</el-radio>
        <el-radio label="DELIVERYING" border>已发货（{{counters.deliveryingCount}}）</el-radio>
        <el-radio label="DELIVERED" border>已收货（{{counters.deliveredCount}}）</el-radio>
      </el-radio-group>
    </div>

    <div class="searchBox">
      <el-input class="inputs" placeholder="请输入内容" size="mini" v-model.number="data.mobile">
        <template slot="prepend">收货人手机号</template>
      </el-input>
      <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.nickName">
        <template slot="prepend">收货人</template>
      </el-input>
      <el-date-picker
        v-model="data.times"
        type="daterange"
        align="right"
        size="mini"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-button type="primary" size="mini" style="margin-left:15px" @click="getList">搜索</el-button>
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
      <el-table-column align="center" type="index" width="40"></el-table-column>
      <el-table-column align="center" prop="createTime" label="申请时间" width="160"></el-table-column>
      <el-table-column align="center" prop="nickName" label="用户" width="100"></el-table-column>
      <el-table-column align="center" prop="nickName" label="收货人" width="100"></el-table-column>
      <el-table-column align="center" prop="giftsName" label="礼品名称"></el-table-column>
      <el-table-column align="center" prop="mobile" label="收货人手机号" width="110"></el-table-column>
      <el-table-column align="center" prop="status" label="发货状态" width="80">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column align="center" prop="postTime" label="发货时间" width="160"></el-table-column>
      <el-table-column align="center" prop="name" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="getDetail(scope.row.deliveryId)">查看处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer flex-between">
      <div>
        <el-button type="primary" size="mini" @click="getList('downLoad')">导出订单</el-button>
        <!-- <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <el-button type="primary" size="mini">置顶</el-button>
        <el-button type="primary" size="mini">下架</el-button>
        <el-button type="primary" size="mini">转移分类</el-button>-->
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
        <div class="tableDetail" v-if="Object.keys(details.giftsDelivery).length > 0">
          <div class="flex-center">
            <div class="tableItem">申请时间：</div>
            <div class="tableItem">{{details.giftsDelivery.createTime}}</div>
            <div class="tableItem">提货用户：</div>
            <div class="tableItem">{{details.giftsDelivery.nickName}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">用户商品来源：</div>
            <div
              class="tableItem"
            >{{details.giftsDeliveryItemDetails[0].sourceType=='BUY'?'自购':'收礼'}}</div>
            <div class="tableItem">发货时间：</div>
            <div class="tableItem">{{details.giftsDeliveryItemDetails[0].postTime||''}}</div>
          </div>
        </div>
        <p>收货人信息</p>
        <div class="tableDetail" v-if="Object.keys(details.giftsDelivery).length > 0">
          <div class="flex-center">
            <div class="tableItem">收货人：</div>
            <div class="tableItem">{{details.giftsDelivery.nickName}}</div>
            <div class="tableItem">手机号：</div>
            <div class="tableItem">{{details.giftsDelivery.mobile}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">收货地址：</div>
            <div class="tableItem">{{details.giftsDelivery.address}}</div>
            <div class="tableItem"></div>
            <div class="tableItem"></div>
          </div>
        </div>
        <p>商品信息清单</p>
        <el-table
          :data="details.giftsDeliveryItemDetails"
          border
          style="width: 100%;margin-top:20px"
        >
          <el-table-column align="center" prop="name" label="商品名称"></el-table-column>
          <el-table-column align="center" prop="number" label="商品货号" width="80"></el-table-column>
          <el-table-column align="center" label="商品价格" width="80">
            <template slot-scope="scope">￥{{$util.prices(scope.row.unitPrice)}} 元</template>
          </el-table-column>
          <el-table-column align="center" prop="count" label="数量" width="80"></el-table-column>
          <el-table-column align="center" label="小计" width="80">
            <template
              slot-scope="scope"
            >￥{{$util.prices(((+scope.row.unitPrice)*(+scope.row.count)))}} 元</template>
          </el-table-column>
          <el-table-column align="center" prop label="供货商" width="80"></el-table-column>
          <el-table-column align="center" label="发货状态" width="80">
            <template slot-scope="scope">
              <div
                class="detailStatus"
                :class="status[scope.row.status]"
              >{{status[scope.row.status]}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <div class="detailStatus flex-center" :class="status[scope.row.status]">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showDeliver(scope.row.itemId,scope.row.deliveryId)"
                  v-if="scope.row.status=='WATTING'"
                >发货</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="getDeliveryQuery(scope.row.postId,scope.row.postNo)"
                  v-else
                >查看</el-button>
                <el-button
                  type="warning"
                  size="mini"
                  @click="showDeliver(scope.row.itemId,scope.row.deliveryId)"
                  v-if="scope.row.status=='DELIVERYING'"
                >修改单号</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="订单信息" :visible.sync="deliveryCode" :width="queryCode?'70%':'360px'">
      <el-form :model="deliveryData" ref="deliveryData" label-width="100px">
        <el-form-item label="快递公司" verify prop="postId">
          <el-select v-model="deliveryData.postId" placeholder="请选择">
            <el-option
              v-for="(item, index) in channelList"
              :key="index"
              :label="item.name"
              :value="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" verify prop="postNo">
          <el-input v-model="deliveryData.postNo" style="width:200px"></el-input>
        </el-form-item>
        <el-button
          type="primary"
          v-if="!queryCode"
          style="margin:auto;display:block"
          @click="deliver"
        >确认提交</el-button>
        <div v-else class="logistics">
          <div v-for="(item, index) in query.Traces" :key="index">
            <span>{{item.AcceptTime}}</span>
            <span>{{item.AcceptStation}}</span>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
import {
  orderGifts,
  orderGiftsDetail,
  orderGiftsCounter,
  channelList,
  postDelivery,
  deliveryQuery
} from "@/api/table";

export default {
  name: "PRODUCT_DELIVERY",
  data() {
    return {
      data: {
        status: "", // 顶部4按钮
        mobile: "", // 手机号
        nickName: "", // 收货人
        times: "",
        page: 1
      },
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
      details: {
        giftsDelivery: {},
        giftsDeliveryItemDetails: []
      },
      countNum: 0,
      tableData: [],
      checkAll: false,
      detailCode: false,
      status: {
        WATTING: "待发货",
        DELIVERYING: "配送中",
        DELIVERED: "已收货"
      },
      buyType: {
        PURCHASE: "自己购买",
        PRESENT_ONE: "打包送一人",
        PRESENT_MANY: "群发多人抢",
        INIT: "初始化类型"
      },
      isIndeterminate: false,
      counters: {},
      channelList: [],
      deliveryCode: false,
      deliveryData: {
        deliveryId: "",
        itemId: "",
        postId: "",
        postNo: ""
      },
      upCode: false,
      query: {},
      queryCode: false
    };
  },
  created() {
    if(this.$route.query.status){
      this.data.status = this.$route.query.status
    }
    orderGiftsCounter()
      .then(res => {
        if (res.code == 200) {
          this.counters = res.data;
        }
      })
      .catch(err => {});
    channelList()
      .then(res => {
        if (res.code == 200) {
          this.channelList = res.data;
        }
      })
      .catch(err => {});
    this.getList();
  },
  methods: {
    getList(type) {
      if (this.upCode) {
        return;
      }
      this.upCode = true;
      var data = JSON.parse(JSON.stringify(this.data));
      data.page--;
      data.beginDate = data.times[0] || "";
      data.endDate = data.times[1] || "";
      delete data.times;
      if (type == "downLoad") {
        // 触发下载
        var str =
          process.env[this.$base] +
          "/gifts/delivery/item/table?access_token=";
        str += this.$store.getters.token;
        for (const k in data) {
          str += "&" + k + "=" + data[k];
        }
        this.upCode = false;
        window.open(str);
        return;
      }
      orderGifts(data)
        .then(res => {
          this.upCode = false;
          if (res.code == 200) {
            this.countNum = res.data.count;
            this.tableData = res.data.list;
          }
        })
        .catch(err => {
          this.upCode = false;
        });
    },
    getDetail(id) {
      if (this.upCode) {
        return;
      }
      this.upCode = true;
      orderGiftsDetail({ deliveryId: id })
        .then(res => {
          this.upCode = false;
          if (res.code == 200) {
            this.detailCode = true;
            this.details = res.data;
          }
        })
        .catch(err => {
          this.upCode = false;
        });
    },
    showDeliver(id, deliveryId) {
      if (this.queryCode) {
        this.queryCode = false;
        this.deliveryData = {
          deliveryId: "",
          itemId: "",
          postId: "",
          postNo: ""
        };
      }
      this.deliveryData.itemId = id;
      this.deliveryData.deliveryId = deliveryId;
      this.deliveryCode = true;
    },
    deliver() {
      this.$refs.deliveryData.validate(valid => {
        if (valid) {
          if (this.upCode) {
            return;
          }
          this.upCode = true;
          var data = JSON.parse(JSON.stringify(this.deliveryData));
          delete data.deliveryId;
          postDelivery(data)
            .then(res => {
              this.upCode = false;
              if (res.code == 200) {
                this.getDetail(this.deliveryData.deliveryId);
                this.$message({
                  type: "success",
                  message: "发货成功"
                });
                this.deliveryCode = false;
                this.$refs.deliveryData.resetFields();
              }
            })
            .catch(err => {
              this.upCode = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getDeliveryQuery(id, no) {
      if (this.upCode) {
        return;
      }
      this.upCode = true;
      deliveryQuery({ postId: id, postNo: no })
        .then(res => {
          if (res.code == 200) {
            var data = JSON.parse(res.data);
            this.deliveryData.postId = data.ShipperCode;
            this.deliveryData.postNo = data.LogisticCode;
            this.query = data;
            console.log(this.query);
            this.queryCode = true;
            this.deliveryCode = true;
            this.upCode = false;
          }
        })
        .catch(err => {
          this.upCode = false;
        });
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








