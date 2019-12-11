



<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.tableBox {
  margin-top: 10px;
}
.searchBox {
  height: 50px;
  width: 100%;
  margin-top: 20px;
  padding: 0 20px;
  border-radius: 4px;
  .radio{
    float: left;
    width: 300px;
  }
  .title,.scene,.search{
    margin-left: 45px;
    float: left;
    height: 50px;
  }
}
</style>


<template>
  <div class="bodyBox" id>
    <div class="listType">
      <!--状态查询 -->
      <el-form :model="data" ref="searchs" class="searchBox">
        <div class="title">
          <el-form-item prop="cusName"  can-be-empty>
            <el-input class="inputs" placeholder="请输入客户名称" size="mini" v-model="data.cusName"></el-input>
          </el-form-item>
        </div>
        <div class="title">
          <el-form-item prop="cusPhone"  can-be-empty>
            <el-input class="inputs" placeholder="请输入客户电话" size="mini" v-model="data.cusPhone"></el-input>
          </el-form-item>
        </div>
        <div class="title">
          <el-form-item prop="cusEmail"  can-be-empty>
            <el-input class="inputs" placeholder="请输入客户邮箱" size="mini" v-model="data.cusEmail"></el-input>
          </el-form-item>
        </div>
        <div class="title">
          <el-form-item prop="cusAddress"  can-be-empty>
            <el-input class="inputs" placeholder="请输入客户地址" size="mini" v-model="data.cusAddress"></el-input>
          </el-form-item>
        </div>
        <div class="scene">
          <el-form-item  prop="cusType" >
            <el-select
              class="data"
              v-model="data.cusType"
              placeholder="请选择客户类型"
              size="small"
            >
              <el-option
                v-for="item in cusTypes"
                :key="item.cusType"
                :label="item.name"
                :value="item.cusType"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="scene">
          <el-form-item  prop="cusLevel" >
            <el-select
              class="data"
              v-model="data.cusLevel"
              placeholder="请选择客户类型"
              size="small"
            >
              <el-option
                v-for="item in cusLevels"
                :key="item.cusLevel"
                :label="item.name"
                :value="item.cusLevel"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="search">
          <el-button type="primary"  size="small" @click="searchs()">搜索</el-button>
        </div>
      </el-form>
    </div>
    <el-table
      class="tableBox"
      :data="tableData"
      border
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
      :row-key="getRowKeys"
    >
      <el-table-column label="客户名称"  prop="cusName" align="center"></el-table-column>
      <el-table-column label="联系人"  prop="cusSaleName" align="center"></el-table-column>
      <el-table-column label="电话"  prop="cusPhone" align="center"></el-table-column>
      <!-- <el-table-column label="文章上下架" width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="changeShow(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="PUTAWAY"
            inactive-value="SOLD_OUT">
          </el-switch>
        </template>
      </el-table-column> -->
      <el-table-column label="邮箱"  prop="cusEmail" align="center"></el-table-column>
      <el-table-column label="地址"  prop="cusAddress" align="center"></el-table-column>
      <el-table-column label="客户类型"  prop="cusType" align="center">
        <template slot-scope="scope">{{cusTypeList[scope.row.cusType]}}</template>
      </el-table-column>
      <el-table-column label="客户等级"  prop="cusLevel" align="center">
        <template slot-scope="scope">{{cusLevelList[scope.row.cusLevel]}}</template>
      </el-table-column>
      <el-table-column  align="center" width="150" label="操作">
        <template slot-scope="scope">
          <router-link class="editBtn" type="primary" round icon="el-icon-edit" :to="{name: 'COUPON_CUSTOMER_EDIT', query: {id: scope.row.customerId}}">
            <el-button type="primary" round icon="el-icon-edit" size="mini"></el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" size="mini" round @click="del(scope.row.customerId)"></el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="data.page"
      :page-size="10"
      background
      layout="total, prev, pager, next, jumper"
      :total="count"
    ></el-pagination>
  </div>
</template>


<script>
import {
  getCustomerList,
  customerDel
} from "@/api/table";
export default {
  name: "COUPON_CUSTOMER_LIST",
  data() {
    return {
      data: {
        // listType: "", // 顶部按钮
        cusName: "", // 客户名
        cusSaleName: "", // 联系人名
        cusPhone: "", // 电话
        cusEmail: "", // 邮箱
        cusAddress:"",//地址
        cusType:"",
        cusLevel:"",
        page: 1
      },
      cusTypes:[
        {
          cusType:"",
          name:"全部"
        },
        {
          cusType:"BUSINESS",
          name:"企业客户"
        },
        {
          cusType:"PERSONAL",
          name:"个人客户"
        }
      ],
      cusLevels:[
        {
          cusLevel:"",
          name:"全部"
        },
        {
          cusLevel:"NORMAL",
          name:"普通客户"
        },
        {
          cusLevel:"VIP",
          name:"VIP客户"
        }
      ],
      cusTypeList: {
        BUSINESS: "企业客户",
        PERSONAL: "个人客户",
      },
      cusLevelList: {
        NORMAL: "普通客户",
        VIP: "VIP客户",
      },
      tableData: [],
      checkAll: false,
      isIndeterminate: false,
      count: 0,
      multipleSelection: [],
      articleLists: []
    };
  },
  props: {
    checkItem: Boolean,
    selectArr: Array
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      window.sessionStorage.setItem('articleSearch',JSON.stringify(this.data));
      let data = JSON.parse(JSON.stringify(this.data));
      data.page --;
      getCustomerList(data).then(result => {
        this.count = result.data.count;
        this.tableData = result.data.list;
        result.data.list.forEach(element => {
          if(element.cusType == this.cusTypes[0].cusType){
            this.cusTypeName = this.cusTypes[0].name
          }
          if(element.cusType === this.cusTypes[1].cusType){
            this.cusTypeName = this.cusTypes[1].name
          }
          if(element.cusType === this.cusTypes[2].cusType){
            this.cusTypeName = this.cusTypes[2].name
          }
        });
    });
    },
    handleCurrentChange(val) {
      this.data.page = val;
      this.init();
      console.log(`当前页: ${val}`);
    },
    getRowKeys(row) {
      // 给表格每行增加一个唯一 标识，用作切换分页后保留被选中行的信息
      return row.articleId;
    },
    searchs() {
      this.$refs.searchs.validate(valid => {
        if (valid) {
          this.init();
        } else {
          console.log("error submit!!");
      return false;
    }
    });
    },
    del(customerId){
      this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
        customerDel({ customerId: customerId ,isDeleted:"Y"})
        .then(res => {
        this.$message({
        type: "success",
        message: "操作成功"
      });
      this.init();
    })
    .catch(err => {});
    })
    .catch(() => {
        this.$message({
        type: "info",
        message: "已取消删除"
      });
    });
    },
  },
  mounted() {
    this.init();
  }
};
</script>








