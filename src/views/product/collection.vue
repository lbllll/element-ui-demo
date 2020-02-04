



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
</style>


<template>
  <div class="bodyBox" id="PRODUCT_LIST">
    <div class="searchBox">
      <el-select class="select" size="mini" v-model="data.scene" placeholder="请选择">
        <el-option v-for="item in scene" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select class="select" size="mini" v-model="data.class" placeholder="请选择">
        <el-option
          v-for="item in classList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select class="select" size="mini" v-model="data.state" placeholder="请选择">
        <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.itemNum">
        <template slot="prepend">商品货号</template>
      </el-input>
      <el-button type="primary" size="mini">搜索</el-button>
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
      <el-table-column align="center" prop="date" label="编号" width="100"></el-table-column>
      <el-table-column align="center" prop="date" label="商品名称"></el-table-column>
      <el-table-column align="center" prop="itemNum" label="商品货号" width="160"></el-table-column>
      <el-table-column align="center" prop="name" label="商品价格" width="160"></el-table-column>
      <el-table-column align="center" prop="name" label="商品收藏数" width="160"></el-table-column>
      <el-table-column align="center" prop="name" label="操作" width="160">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.tj" inactive-text="设置"></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer flex-between">
      <i></i>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="data.page"
        :page-size="100"
        background
        layout="total, prev, pager, next, jumper"
        :total="400"
      ></el-pagination>
    </div>
  </div>
</template>


<script>
export default {
  name: "PRODUCT_COLLECTION",
  data() {
    return {
      data: {
        listType: "1", // 顶部4按钮
        scene: "0", // 场景
        class: "0", // 分类
        state: "0", // 上下架状态
        itemNum: "", // 货号
        supplier: "", // 供货商
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
      classList: [
        {
          value: "0",
          label: "所有分类"
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
      tableData: [
        {
          date: "2016-05-02",
          name: "1000000",
          address: "上海市普陀区金沙江路 1518 弄",
          itemNum: "ECS000060",
          company: "重庆义方人科技有限公司",
          up: true,
          zd: false,
          tj: true
        },
        {
          date: "2016-05-02",
          name: "1000000",
          address: "上海市普陀区金沙江路 1518 弄",
          itemNum: "ECS000060",
          company: "重庆义方人科技有限公司",
          up: true,
          zd: false,
          tj: true
        },
        {
          date: "2016-05-02",
          name: "1000000",
          address: "上海市普陀区金沙江路 1518 弄",
          itemNum: "ECS000060",
          company: "重庆义方人科技有限公司",
          up: true,
          zd: false,
          tj: true
        },
        {
          date: "2016-05-02",
          name: "1000000",
          address: "上海市普陀区金沙江路 1518 弄",
          itemNum: "ECS000060",
          company: "重庆义方人科技有限公司",
          up: true,
          zd: false,
          tj: true
        }
      ],
      checkAll: false,
      isIndeterminate: false
    };
  },
  methods: {
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
  created() {}
};
</script>








