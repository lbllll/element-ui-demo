

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.header {
  margin-top: 20px;
  margin-bottom: 20px;
  .inputs {
    width: 260px;
    margin-right: 20px;
  }
  .times {
    width: 320px;
    margin-right: 20px;
  }
}
.tableImg {
  width: 40px;
}
.avatar-uploader {
  width: 120px;
  height: 120px;
  border: 1px solid rgb(238, 238, 238);
  border-radius: 4px;
}
.inputs {
  width: 220px;
}
.sorts {
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
}
</style>


<template>
  <div class>
    <div class="header flex">
      <el-button type="primary" @click="noticeCode=true">添加标签</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" align="center" label="标签名称"></el-table-column>
      <el-table-column prop="description" align="center" label="描述"></el-table-column>
      <el-table-column prop="productCount" align="center" label="商品数量"></el-table-column>
      <el-table-column prop="sceneName" align="center" label="所属场景"></el-table-column>
      <el-table-column align="center" label="排序" width="120">
        <template slot-scope="scope">
          <input class="sorts" type="number" v-model.number="scope.row.sort" />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="operateContent" align="center" label="删除" width="100">
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="delLabel(scope.row.labelId)"></i>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px"
      @current-change="handleCurrentChange"
      :current-page="page"
      background
      layout="total, prev, pager, next, jumper"
      :total="countNum"
    ></el-pagination>

    <el-dialog title="添加标签" :visible.sync="noticeCode" width="70%">
      <el-form :model="formData" ref="formData" label-width="100px" class="demo-formData">
        <el-form-item verify label="标签名称" prop="labelName">
          <el-input class="inputs" v-model="formData.labelName"></el-input>
        </el-form-item>
        <el-form-item verify label="标签描述" prop="labelDescription">
          <el-input class="inputs" v-model="formData.labelDescription"></el-input>
        </el-form-item>
        <el-form-item verify label="所属场景" prop="sceneId">
          <el-select v-model="formData.sceneId" placeholder="请选择" @change="changeScene">
            <el-option
              v-for="item in options"
              :key="item.sceneId"
              :label="item.name"
              :value="item.sceneId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('formData')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import {
  productLabel,
  productLabelCounter,
  noticeSetStatus,
  productLabelSave,
  productScenelList,
  productLabelDelete
} from "@/api/table";

export default {
  name: "PRODUCT_LABEL",
  data() {
    return {
      page: 1,
      formData: {
        detailUrl: "",
        iconUrl: "",
        sceneId:"",
        sceneName: ""
      },
      tableData: [],
      noticeCode: false,
      countNum: 0,
      options: []
    };
  },
  created() {
    this.getList();
    productScenelList({ page: 0, sceneName: "" })
      .then(res => {
        this.options = res.data;
      })
      .catch(err => {});
  },
  methods: {
    getList() {
      var page = JSON.parse(JSON.stringify(this.page));
      page--;
      productLabel({ page: page })
        .then(res => {
          this.tableData = res.data;
        })
        .catch(err => {});
      productLabelCounter()
        .then(res => {
          this.countNum = res.data;
        })
        .catch(err => {});
    },
    delLabel(id) {
      this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          productLabelDelete({ labelId: id })
            .then(res => {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getList();
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          productLabelSave(this.formData)
            .then(res => {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.noticeCode = false;
              this.formData.labelDescription = "";
              this.formData.labelName = "";
              this.getList();
            })
            .catch(err => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setStatus(row) {
      noticeSetStatus({ noticeId: row.noticeId, status: row.status })
        .then(res => {
          this.$message({
            type: "success",
            message: "操作成功"
          });
        })
        .catch(err => {});
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
      console.log(`当前页: ${val}`);
    },
    changeScene(val){
      console.log(val);
      this.options.forEach(e => {
        if(e.sceneId==val){
          this.formData.sceneName = e.name
        }
      });
    }
  }
};
</script>
