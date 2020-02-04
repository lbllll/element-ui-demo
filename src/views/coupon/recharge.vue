



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
.formTitle {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  height: 40px;
}
.imgTitle {
  width: 120px;
  text-align: right;
  margin-top: 20px;

  margin-right: 20px;
}
.avatar-uploader {
  margin-top: 20px;
}
</style>


<template>
  <div class="bodyBox" id="COUPON_RECHARGE">
    <div class="flex-between">
      <div class="searchBox">
        <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.name">
          <template slot="prepend">用户名称</template>
        </el-input>
        <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.linkMobile">
          <template slot="prepend">用户手机</template>
        </el-input>
        <el-button type="primary" size="mini" @click="getList">搜索</el-button>
      </div>
      <el-button type="primary" @click="rechargeCode=true">积分充值</el-button>
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
      <el-table-column align="center" prop="name" label="企业名称"></el-table-column>
      <el-table-column align="center" prop="companyId" label="企业编号" width="220"></el-table-column>
      <el-table-column align="center" prop="recordId" label="充值单号" width="220"></el-table-column>
      <el-table-column align="center" prop="linkMobile" label="用户手机号" width="120"></el-table-column>
      <el-table-column align="center" prop="status" label="充值金额" width="120">
        <template slot-scope="scope">{{$util.prices(scope.row.amount)}}</template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="120">
        <template slot-scope="scope">{{scope.row.amount>0?'充值成功':'充值失败'}}</template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="充值时间" width="160"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">{{scope.row.a}}</template>
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
    <el-dialog title="用户积分（豆币）充值" :visible.sync="rechargeCode" width="70%">
      <el-form :model="forms" ref="forms" label-width="100px">
        <el-form-item label="企业编号" verify prop="companyId">
          <el-input
            v-model="forms.companyId"
            @blur="getDetails(forms.companyId)"
            style="width:300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="企业名称" verify prop="name">
          <el-input v-model="forms.name" disabled style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号" verify prop="mobile">
          <el-input v-model="forms.mobile" disabled style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="充值方式">
          <p>毛豆</p>
        </el-form-item>
        <el-form-item label="支付方式" verify prop="payType">
          <el-select v-model="forms.payType" placeholder="请选择" style="width:300px">
            <el-option v-for="item in payType" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值金额" verify :maxDecimalLength="2" prop="amount">
          <el-input v-model="forms.amount" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="备注说明" verify prop="mark">
          <el-input v-model="forms.mark" type="textarea" :rows="4" style="width:300px"></el-input>
        </el-form-item>
      </el-form>

      <div class="flex" style="margin-left:120px;margin-top:20px">
        <el-button type="primary" @click="submit('forms')">确认提交</el-button>
        <el-button @click="resetForm('forms')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { companyList, companyDetails, companyRecharge } from "@/api/table";

export default {
  name: "COUPON_RECHARGE",
  data() {
    return {
      data: {
        name: "", // 用户名称
        linkMobile: "", // 手机号
        page: 1
      },
      tableData: [],
      checkAll: false,
      isIndeterminate: false,
      countNum: 0,
      rechargeCode: false,
      updataInfo: false,
      payType: ["银行转账", "微信支付", "支付宝支付", "线下汇款", "其他方式"],
      forms: {
        companyId: "",
        name: "",
        mobile: "",
        payType: "",
        amount: "",
        mark: ""
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
      companyList(data)
        .then(result => {
          if (result.code == 200) {
            this.countNum = result.data.count;
            this.tableData = result.data.data;
          }
        })
        .catch(err => {});
    },
    getDetails(id) {
      companyDetails({ companyId: id })
        .then(res => {
          if (res.code == 200) {
            if (res.data) {
              this.forms.name = res.data.companyInfo.name;
              this.forms.mobile = res.data.companyInfo.linkMobile;
            } else {
              this.$message.error("查询结果不存在，请输入正确的企业编号。");
            }
          }
        })
        .catch(err => {});
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.updataInfo) {
            return;
          }
          this.updataInfo = true;
          try {
            var data = JSON.parse(JSON.stringify(this.forms));
            delete data.name;
            delete data.mobile;
            data.amount = +data.amount * 100;
            companyRecharge(data)
              .then(res => {
                this.updataInfo = false;
                if (res.code == 200) {
                  this.$message({
                    message: "充值成功",
                    type: "success"
                  });
                  this.rechargeCode = false;
                } else {
                  this.$message.error(res.description);
                }
              })
              .catch(err => {
                this.$message.error(err.description);
                console.log(err);
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








