



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
  .inputs.number {
    width: 140px;
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
.el-form-item {
  margin-bottom: 0;
}

.table_item_name {
  display: flex;
  align-items: center;
  img {
    width: 50px;
    margin-right: 6px;
  }
}
.coefficient{
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
}
</style>


<template>
  <div class="bodyBox" id="PRODUCT_LIST">
    <div class="listType">
      <!-- <el-radio v-model="data.status" label="4" border>库存告急</el-radio> -->
      <el-radio-group v-model="data.status" @change="getList">
        <el-radio label border>全部</el-radio>
        <el-radio label="GROUNDED" border>上架</el-radio>
        <el-radio label="UNGROUNDED" border>下架</el-radio>
      </el-radio-group>
    </div>

    <el-form :model="data" ref="searchs" class="searchBox">
      <el-select class="select" size="mini" prop="lableId" v-model="data.lableId" placeholder="请选择">
        <el-option
          v-for="item in lableList"
          :key="item.labelId"
          :label="item.name"
          :value="item.labelId"
        ></el-option>
      </el-select>


      <!-- <el-select
        class="select"
        size="mini"
        prop="categoryId"
        v-model="data.categoryId"
        placeholder="请选择"
      >
        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select> -->


      <el-cascader
        class="select"
        size="mini"
        v-model="data.category"
        v-if="categoryList.length>0"
        :show-all-levels="false"
        :options="categoryList"
        :props="{ expandTrigger: 'hover',checkStrictly: true }"
        @change="handleChange">
      </el-cascader>
      <el-input class="inputs" placeholder="请输入内容" size="mini" prop="name" v-model="data.name">
        <template slot="prepend">商品名称</template>
      </el-input>
      <el-input class="inputs" placeholder="请输入内容" size="mini" prop="number" v-model="data.number">
        <template slot="prepend">商品货号</template>
      </el-input>
      <el-input
        class="inputs"
        placeholder="请输入内容"
        size="mini"
        prop="supplyMerchant"
        v-model="data.supplyMerchant"
      >
        <template slot="prepend">供货商</template>
      </el-input>
      <el-form-item prop="minPrice" verify :maxDecimalLength="2" can-be-empty>
        <el-input class="inputs number" placeholder="请输入最低价格" size="mini" v-model="data.minPrice"></el-input>
      </el-form-item>
      <el-form-item prop="maxPrice" verify :maxDecimalLength="2" can-be-empty :gt="+data.minPrice">
        <el-input class="inputs number" placeholder="请输入最高价格" size="mini" v-model="data.maxPrice"></el-input>
      </el-form-item>
      <el-button type="primary" size="mini" @click="searchs()">搜索</el-button>
      <el-button type="primary" size="mini" @click="$router.push({name:'PRODUCT_RELEASE'})">发布新商品</el-button>
    </el-form>

    <el-table
      class="tableBox"
      :data="tableData"
      border
      style="width: 100%"
      ref="multipleTable"
      :row-key="getRowKeys"
      @select="tableSelect"
      @select-all="tableSelectAll"
      @selection-change="handleSelectionChange"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
    >
      <!-- @selection-change="handleSelectionChange"
      @row-click="handleRowClick"-->
      <el-table-column align="center" type="selection" reserve-selection width="40"></el-table-column>
      <el-table-column align="center" type="index" width="40"></el-table-column>
      <el-table-column align="center" prop="name" label="商品名称">
        <template slot-scope="scope">
          <div class="table_item_name">
            <img :src="scope.row.headPath" />
            <p v-text="scope.row.name"></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="number" label="货号" width="100"></el-table-column>
      <el-table-column align="center" prop="salePrice" label="销售价格" width="100">
        <template slot-scope="scope">
          <p v-text="$util.prices(scope.row.salePrice)"></p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="usableStock" label="库存量" width="80"></el-table-column>
      <el-table-column align="center" prop="name" label="设置" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="GROUNDED"
            inactive-value="UNGROUNDED"
            inactive-text="上架"
            @change="setStatus(scope.row)"
          ></el-switch>
          <el-switch
            v-model="scope.row.isRecommend"
            active-value="Y"
            inactive-value="N"
            inactive-text="推荐"
            @change="recommends(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="coefficient" label="排序" width="80">
        <template slot-scope="scope"><input class="coefficient" @blur="changeSlot(scope.row)" type="number" v-model.number="scope.row.coefficient"></template>
      </el-table-column>
      <el-table-column align="center" prop="supplyMerchant" label="供应商" width="260"></el-table-column>
      <el-table-column align="center" prop="name" label="操作" width="100" v-if="!checkItem">
        <template slot-scope="scope">
          <router-link class="editBtn" :to="{name: 'PRODUCT_RELEASE', query: {id: scope.row.productId}}">编辑商品</router-link>
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
        <el-button type="primary" v-if="!checkItem" size="mini" @click="batchUp('GROUNDED')">上架</el-button>
        <el-button type="primary" v-if="!checkItem" size="mini" @click="batchUp('UNGROUNDED')">下架</el-button>
        <el-button
          type="primary"
          v-if="checkItem"
          size="mini"
          @click="upCheckData()"
        >确定（已选{{multipleSelection.length}}个商品）</el-button>
        <!-- <el-button type="primary" size="mini">转移分类</el-button> -->
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
  </div>
</template>


<script>
import {
  produckList,
  produckCounter,
  produckTree,
  produckTabel,
  produckSetStatus,
  produckRecommend,
  produckUnRecommend,
  produckBatchUp,
  produckSetCoefficient
} from "@/api/table";
import { stringify } from 'querystring';
export default {
  name: "PRODUCT_LIST",
  data() {
    return {
      data: {
        listType: "", // 顶部4按钮
        lableId: "", // 场景
        categoryId: "", // 分类
        category: [], // 分类
        status: "", // 上下架状态
        name: "", // 商品名称
        number: "", // 货号
        supplyMerchant: "", // 供货商
        minPrice: "", // 最低价
        maxPrice: "", // 最高价
        page: 1
      },
      counter: {},
      lableList: [],
      categoryList: [],
      tableData: [],
      checkAll: false,
      isIndeterminate: false,
      count: 0,
      multipleSelection: []
    };
  },
  props: {
    checkItem: Boolean,
    selectArr: Array
  },
  created() {
    if(this.selectArr&&this.selectArr.length>=0){
      this.multipleSelection=this.selectArr
    }
    if(window.sessionStorage.getItem('searchData')){
      try {
        this.data = JSON.parse(window.sessionStorage.getItem('searchData'))
      } catch (error) {
        window.sessionStorage.removeItem('searchData')        
      }
    }
    this.getData();
    this.getList();
  },
  methods: {
    getList() {
      window.sessionStorage.setItem('searchData',JSON.stringify(this.data))
      var data = JSON.parse(JSON.stringify(this.data));
      data.minPrice = data.minPrice ? +data.minPrice * 100 : "";
      data.maxPrice = data.maxPrice ? +data.maxPrice * 100 : "";
      // 后端page从0开始，所以需要减一
      data.page--;
      data.categoryId = data.category[data.category.length-1]
      delete data.category
      produckList(data).then(result => {
        this.count = result.data.count;
        this.tableData = result.data.list;
        if(this.selectArr&&this.selectArr.length>=0){
          var ids = []
          this.selectArr.forEach(e => {
            ids.push(e.productId)
          });
          result.data.list.forEach(e => {
            if(ids.indexOf(e.productId)!=-1){
              this.$refs.multipleTable.toggleRowSelection(e);
            }
          });
        }
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
    changeSlot(row){
      produckSetCoefficient({productId:row.productId,coefficient:row.coefficient}).then((res) => {
        
      }).catch((err) => {
        
      });
    },
    setStatus(row) {
      produckSetStatus({ productId: row.productId, status: row.status })
        .then(result => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
        })
        .catch(err => {
          console.log(err);
          // this.$message.error(err.description);
        });
    },
    batchUp(status) {
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message({
          message: "请选择需要操作的商品",
          type: "warning"
        });
        return;
      }
      var data = { status: status, productIds: "" };
      this.$refs.multipleTable.selection.forEach(e => {
        data.productIds += e.productId + ",";
      });
      produckBatchUp(data)
        .then(result => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.$refs.multipleTable.selection.forEach(e => {
            e.status = status;
          });
        })
        .catch(err => {});
    },
    recommends(row) {
      if (row.isRecommend == "Y") {
        produckRecommend({ productId: row.productId })
          .then(result => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
          })
          .catch(err => {});
      } else {
        produckUnRecommend({ productId: row.productId })
          .then(result => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
          })
          .catch(err => {});
      }
    },
    getData() {
      // 获取各类属性分类
      produckCounter().then(result => {
        this.counter = result.data;
      });
      produckTree().then(result => {
        result.data.unshift({ name: "所有分类", id: "" });
        var list = []
        result.data.forEach(e => {
          var one = {
            value: e.id,
            label: e.name,
            children: []
          }
          if(e.children){
            e.children.forEach(c => {
              var two = {
                value: c.id,
                label: c.name
              }
              one.children.push(two)
            });
          }
          list.push(one)
        });
        this.categoryList = list;
      });
      produckTabel().then(result => {
        result.data.unshift({ name: "所有场景", labelId: "" });
        this.lableList = result.data;
      });
    },
    handleChange(){
      
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
    getRowKeys(row) {
      // 给表格每行增加一个唯一 标识，用作切换分页后保留被选中行的信息
      return row.productId;
    },
    upCheckData() {
      // 把选择的商品向父组件传递数据
      this.$emit("selectData", this.multipleSelection);
    }
  }
};
</script>








