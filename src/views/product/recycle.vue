



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
.editBtn {
  color: #409eff;
}
.footer {
  height: 50px;
}
.table_item_name {
  display: flex;
  align-items: center;
  img {
    width: 50px;
    margin-right: 6px;
  }
}
</style>


<template>
  <div class="bodyBox" id="PRODUCT_RECYCLE">
    <el-form :model="data" ref="searchs" class="searchBox">
      <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.name">
        <template slot="prepend">商品名称</template>
      </el-input>
      <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.number">
        <template slot="prepend">商品货号</template>
      </el-input>
      <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.supplyMerchant">
        <template slot="prepend">供应商</template>
      </el-input>
      <el-button type="primary" size="mini" @click="searchs()" >搜索</el-button>
    </el-form>
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
      <el-table-column align="center" prop="name" label="商品名称" >
        <template slot-scope="scope">
          <div class="table_item_name">
            <img :src="scope.row.productImg" />
            <p v-text="scope.row.name"></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="number" label="商品货号" width="100"></el-table-column>
      <el-table-column align="center" prop="deleteReason" label="删除原因" width="300"></el-table-column>
      <el-table-column align="center" prop="createTime" label="删除时间" width="200"></el-table-column>
      <el-table-column align="center" prop="supplyMerchant" label="供应商" width="200"></el-table-column>
      <el-table-column align="center" prop="name" label="操作" width="150">
        <template slot-scope="scope">
          <el-button  type="primary" size="mini" @click="recover(scope.row.productId)">还原</el-button>
          <!-- <el-button type="danger" size="mini" @click="del(scope.row.productId)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="footer flex-between">
      <div>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <el-button type="primary"  size="mini" @click="recoverAll('N')" >还原</el-button>
        <!-- <el-button type="danger"   size="mini" @click="delAll('Y')" >删除</el-button> -->
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="data.page"
        :page-size="10"
        background
        layout="total, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>


<script>
import {
  productDeleteRecordList,
  productDelete
  
} from "@/api/table";
export default {
  name: "PRODUCT_RECYCLE",
  data() {
    return {
      data: {
        name: "", // 场景
        number: "", // 分类
        supplyMerchant: "", // 货号
        page: 1
      },
      scene: [
        {
          value: "0",
          label: "所有场景"
        },
        {
          value: "1",
          label: "黄金糕"
        },
        {
          value: "2",
          label: "双皮奶"
        },
        {
          value: "3",
          label: "蚵仔煎"
        },
        {
          value: "4",
          label: "龙须面"
        },
        {
          value: "5",
          label: "北京烤鸭"
        }
      ],
      classList: [],
      state: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "上架"
        },
        {
          value: "2",
          label: "下架"
        },
        {
          value: "3",
          label: "置顶"
        }
      ],
      tableData: [],
      count: 0,
      checkAll: false,
      isIndeterminate: false
    };
  },
  props: {
    checkItem: Boolean,
    selectArr: Array
  },
  methods: {
    //获取记录列表
    getList() {
      window.sessionStorage.setItem('productDeleteRecordSearch',JSON.stringify(this.data));
      let data = JSON.parse(JSON.stringify(this.data));
      data.page --;
      productDeleteRecordList(data).then(result => {
        this.count = result.data.count;
        this.tableData = result.data.list;
    });
    },
    searchs() {
      this.$refs.searchs.validate(valid => {
        if (valid) {
          this.getList();
        } else {
          console.log("error submit!!");
      return false;
    }
    });
    },
    recover(productId){
      var data = { status: status, productIds: "" };
      data.status = "N"
      data.productIds = productId;
      this.$confirm("确认恢复数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          productDelete(data)
          .then(result => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getList();
      })
      .catch(err => {});
      }).catch(() => {
        this.$message({
        type: "info",
        message: "已取消删除"
      });
    });
      
    },
    del(productId){
      console.log(productId)
    },
    recoverAll(status){
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message({
          message: "请选择需要操作的商品",
          type: "warning"
        });
        return;
      }
      var data = { status: status, productIds: ""};
      this.$refs.multipleTable.selection.forEach(e => {
        data.productIds += e.productId + ",";
      });
      this.$confirm("此操作将恢复选中商品?确认恢复", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=> {
          console.log("产品id===="+data)
         productDelete(data)
        .then(result => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.$refs.multipleTable.selection.forEach(e => {
            e.status = status;
          });
          this.getList()
        })
        .catch(err => {});
        }).catch(() => {
        this.$message({
        type: "info",
        message: "已取消恢复"
      });
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
    edits(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
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
  },
  created() {
    if(this.selectArr&&this.selectArr.length>=0){
      this.multipleSelection=this.selectArr
    }
    if(window.sessionStorage.getItem('productDeleteRecordSearch')){
      try {
        this.data = JSON.parse(window.sessionStorage.getItem('productDeleteRecordSearch'))
      } catch (error) {
        window.sessionStorage.removeItem('productDeleteRecordSearch')
      }
    }
    this.getList();
  }
};
</script>








