



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
    height: 40px;
    margin-left: 50px
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
.convertImg{
  width: 40px;
  height: 40px;
}
</style>


<template>
  <div class="bodyBox" id="PRODUCT_ORDER_LIST">
    <div class="searchBox">
      <div class="flex-center">
        <!-- <p>订单状态：</p> -->
        <el-select class="select" size="mini" v-model="data.status" placeholder="请选择" @change="getList">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.convertCode">
        <template slot="prepend">兑奖编码</template>
      </el-input>
      <el-button type="primary" size="mini" @click="getList">搜索</el-button>
      <el-button type="primary" size="mini" @click="downloadExcel()">导出兑奖信息</el-button>
      <!-- 导入文件 -->
      <el-form :model="form">
      <el-upload
        multiple
        :ref="uploadFile"
        :action="insertExcel"
        :data="access_token"
        :before-upload="onBeforeUploadImage"
        :on-success = 'handleSuccess'>
        <el-button type="primary" size="mini" style="margin-left:10px">导入兑奖信息</el-button>
      </el-upload>
    </el-form>
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
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column align="center" prop="convertCode" width="200" label="兑奖编号"></el-table-column>
      <el-table-column align="center" prop="convertImg" width="100" label="奖品图片">
        <template slot-scope="scope">
          <span>
            <img class="convertImg" :src="scope.row.convertImg" width="100" height="100" />
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="convertContent" width="200" label="奖品内容"></el-table-column>
      <el-table-column align="center" prop="convertType" width="200" label="奖品描述"></el-table-column>
      <el-table-column align="center" label="是否兑奖" width="100">
        <template slot-scope="scope">{{status[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column align="center" prop="convertTime" width="200" label="兑奖时间"></el-table-column>
      <el-table-column align="center" label="是否发货" width="100">
        <template slot-scope="scope">{{deliveryStatus[scope.row.deliveryStatus]}}</template>
      </el-table-column>
      <el-table-column align="center" prop="postTime" width="200" label="发货时间"></el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" @click="getDetail(scope.row.convertCode)"  width="200" size="mini">查看处理</el-button>
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

        <div class="tableDetail" v-if="detailCode">
          <div class="flex-center">
            <div class="tableItem">兑换时间：</div>
            <div class="tableItem">{{details.convertTime}}</div>
            <div class="tableItem">订单号：</div>
            <div class="tableItem">{{details.deliveryId}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">兑奖用户：</div>
            <div class="tableItem">{{details.name}}</div>
            <div class="tableItem">预留手机：</div>
            <div class="tableItem">{{details.phone}}</div>
          </div>
          <div class="flex-center">
            <div class="tableItem">地区：</div>
            <div class="tableItem">{{details.address}}</div>
            <div class="tableItem">详细地址：</div>
            <div class="tableItem">{{details.addressDetail}}</div>
          </div>
        </div>
        <p>奖品信息</p>
        <div class="tableDetail" v-if="detailCode">
          <div class="flex-center">
            <div class="tableItem">奖品图片：
              <div class="orderProduct">
                <img :src="details.convertImg" alt />
              </div>
            </div>
            <div class="tableItem">奖品内容：</div>
            <div class="tableItem">{{details.convertContent}}</div>
            <div class="tableItem">奖品描述：</div>
            <div class="tableItem">{{details.convertType}}</div>
            <div class="flex-center">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showDeliver(details.deliveryId,details.convertCode)"
                  v-if="details.deliveryStatus=='WAITING'"
                >发货</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="getDeliveryQuery(details.postId,details.postNo,details.convertCode)"
                  v-if="details.deliveryStatus=='DELIVERYING'"
                >查看物流</el-button>
                <el-button
                  type="warning"
                  size="mini"
                  @click="showDeliver(details.deliveryId,details.convertCode)"
                  v-if="details.deliveryStatus=='DELIVERYING'"
                >修改单号</el-button>
            </div>
          </div>
        </div>
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
  orderList, 
  orderDetails,
  convertInfoList,
  deliveryDetail,
  deliveryQuery,
  channelList,
  convertDeliveryPost,
  insertExcel,
  downloadConvertedExcel
   } from "@/api/table";

export default {
  name: "PRODUCT_ORDER_LIST",
  data() {
    return {
      data: {
        status: "", // 兑换状态
        convertCode: "", // 兑换码
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
          label: "全部"
        },
        {
          value: "CONVERTED",
          label: "已兑换"
        },
        {
          value: "NO_CONVERT",
          label: "未兑换"
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
        },
        {
          value: "CONVERT",
          label: "单品卡兑换"
        },
      ],
      tableData: [],
      checkAll: false,
      detailCode: false,
      details: {
      },
      isIndeterminate: false,
      countNum: 0,
      status: {
        CONVERTED: "已兑奖",
        NO_CONVERT: "未兑奖",
      },
      deliveryStatus:{
        WAITING: "未发货",
        DELIVERYING: "配送中",
        DELIVERED: "已收货",
      },
      channelList: [],
      deliveryCode: false,
      deliveryData: {
        deliveryId: "",
        postId: "",
        postNo: "",
      },
      queryCode: false,
      convertCode:"",
      form:{
        file:""
      },
      access_token: {
        access_token: this.$store.getters.token
      },
      insertExcel:process.env[this.$base] + "/convert/info/insertExcel"
    };
  },
  created() {
    this.getList();
    channelList()
      .then(res => {
        if (res.code == 200) {
          this.channelList = res.data;
        }
      })
      .catch(err => {});
  },
  methods: {
    getList() {
      var data = JSON.parse(JSON.stringify(this.data));
      // 后端page从0开始，所以需要减一
      data.page--;
      convertInfoList(data)
        .then(result => {
          if (result.code == 200) {
            this.countNum = result.data.count;
            this.tableData = result.data.list;
          } else {
          }
        })
        .catch(err => {});
    },
    getDetail(convertCode) {
      deliveryDetail({ convertCode: convertCode })
        .then(result => {
          this.details = result.data;
          this.detailCode = true;
        })
        .catch(err => {});
    },
    deCodes(str) {
      console.log(str);
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
    },
    getDeliveryQuery(postId, postNo,convertCode) {
      if (this.upCode) {
        return;
      }
      this.upCode = true;
      deliveryQuery({ postId: postId, postNo: postNo })
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
            console.log(convertCode)
            this.getDetail(convertCode);
          }
        })
        .catch(err => {
          this.upCode = false;
        });
    },
    showDeliver(deliveryId,convertCode) {
      if (this.queryCode) {
        this.queryCode = false;
        this.deliveryData = {
          deliveryId: "",
          postId: "",
          postNo: "",
        };
      }
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
          convertDeliveryPost(data)
            .then(res => {
              this.upCode = false;
              if (res.code == 200) {
                this.details = res.data
                this.$message({
                  type: "success",
                  message: "操作成功"
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
    downloadExcel(){
       var data = JSON.parse(JSON.stringify(this.data));
      // 后端page从0开始，所以需要减一
      data.page--;
      delete data.page;
      var str = `${process.env[this.$base]}/convert/info/downloadConvertedExcel?access_token=${
        this.$store.getters.token
      }&status=${this.data.status}&convertCode=${this.data.convertCode}`;
      window.open(str);
    },
    // 文件状态改变时的钩子
    onBeforeUploadImage(file){
      let Xls = file.name.split('.');
 
        if(Xls[1] === 'xlsx'){
          return file
        }else {
          this.$message.error('上传文件只能是 xlsx 格式!')
          return false
        }
    },
    uploadFile(file) {
      let formData = new FormData()
      formData.append('file', this.form.file)
      formData.append('access_token', this.form.data)
      insertExcel(formData)
      .then(res => {
        console.log('res')
        console.log(res)
        if(res.code == 200){
          handleSuccess();
        }
      })
      .catch(err => { 
        this.$message({
            message: res.msg,
            type: 'error'
          })
      })
    },
    handleSuccess(){
      this.$message({
            message: '上传成功！',
            type: 'success'
          });
      this.getList()
    }
  }
};
</script>








