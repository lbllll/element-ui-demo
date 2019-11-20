

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
.categoryBox{
  position: relative;
  display: inline-block;
  .btn{
    width: 160px;
    margin-left: 10px;
  }
  .sort{
    margin-left: 10px;
    width: 80px;
  }
}
.btns {
  position: absolute;
  top: 50%;
  right: -30px;
  transform: translate(0, -50%);
  font-size: 24px;
}
</style>


<template>
  <div class>
    <div class="header flex">
      <el-button type="primary" @click="addLabel">添加标签</el-button>
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
      <el-table-column prop="operateContent" align="center" label="编辑" width="100">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="editLabel(scope.row.labelId)"></i>
        </template>
      </el-table-column>
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

    <el-dialog :title="formData.sceneId?'编辑标签':'添加标签'" :visible.sync="noticeCode" width="70%">
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
        <el-form-item label="分类" v-for="(item, index) in category" :key="index">
          <div class="categoryBox">
            <el-cascader
              v-model="item.categoryId"
              placeholder="选择分类"
              clearable
              :options="categoryList"
              :props="{ expandTrigger: 'hover' }"
              ></el-cascader>
            <el-button class="btn" @click="chectProduct(index)">{{item.product.length>0?'已选'+item.product.length+'件商品':'选择商品'}}</el-button>
            <el-input class="sort" v-model="item.sort" placeholder="排序"></el-input>
            <i
              class="btns"
              :class="index==0?'el-icon-plus':'el-icon-delete'"
              @click="valueChange(index)"
            ></i>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('formData')">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择商品" :visible.sync="productCode" width="90%">
      <product-list v-if="productCode" checkItem @selectData="selectData" :selectArr="selects"></product-list>
    </el-dialog>
  </div>
</template>


<script>
import {
  productLabel,
  productLabelCounter,
  noticeSetStatus,
  postApi,
  productScenelList,
  productLabelDelete,
  productLabelDetail,
  produckTree
} from "@/api/table";
import productList from "@/views/product/list";

export default {
  name: "PRODUCT_LABEL",
  components:{
    productList
  },
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
      options: [],
      categoryList: [],
      productCode: false,
      selects: [],
      category: [
        {
          categoryId: [],
          product: [],
          sort: ''
        }
      ],
      categoryIndex: 0
    };
  },
  created() {
    produckTree().then((res) => {
      var list = []
      res.data.forEach(e => {
        var a = {
          label:e.name,
          value:e.id,
          children:[]
        }
        if(e.children&&e.children.length>0){
          e.children.forEach(l => {
            var b = {
              label:l.name,
              value:l.id
            }
            a.children.push(b)
          });
        }
        list.push(a)
      });
      this.categoryList = list
    }).catch((err) => {
      
    });
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
          var list = [],
              data = JSON.parse(JSON.stringify(this.formData))
          this.category.forEach((e,i) => {
            try {
              var obj = {
                categoryId: e.categoryId[1],
                sort: e.sort||0,
                productIdList: ''
              }
              e.product.forEach(p => {
                if(obj.productIdList){
                  obj.productIdList+=(','+p.productId)
                }else{
                  obj.productIdList = p.productId
                }
              });
              list.push(obj)
            } catch (error) {
              console.log(error);
            }
          });
          data.categoryListJson = JSON.stringify(list)
          var url = ''
          if(data.sceneId){
            url = '/product/label/edit'
          }else{
            url = '/product/label/save'
          }
          postApi(data,url)
            .then(res => {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.noticeCode = false;
              this.formData.labelDescription = "";
              this.formData.labelName = "";
              this.category = [{categoryId: [],product: [],sort: ''}]
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
    },
    selectData(val){
      this.productCode = false
      this.category[this.categoryIndex].product = val
    },
    chectProduct(i){
      this.selects = JSON.parse(JSON.stringify(this.category[i].product))
      this.categoryIndex = i
      this.productCode=true
    },
    valueChange(i){
      if(i==0){
        this.category.push({categoryId: [],product: []})
      }else{
        this.category.splice(i, 1);
      }
    },
    editLabel(id){
      productLabelDetail({labelId:id}).then((res) => {
        try {
          var data = res.data.productLabelModel
          var formData= {
            icon: data.icon,
            labelName: data.name,
            labelDescription: data.description,
            sort: data.sort,
            labelId: data.labelId,
            sceneId: data.sceneId
          }
          // {
          //   detailUrl: "",
          //   iconUrl: "",
          //   sceneId:"",
          //   sceneName: ""
          // }
          this.formData = formData
          var list = []
          res.data.systemHomeCategoryDtoList.forEach(e => {
            var obj = {
              categoryId: [e.productCategoryModel.parentId,e.productCategoryModel.categoryId],
              product: [],
              sort: e.sort
            }
            e.productInfoModelList.forEach(l => {
              obj.product.push(l)
            });
            list.push(obj)
          });
          this.category = list
          this.noticeCode = true
        } catch (error) {
          console.log(error);
        }
      }).catch((err) => {
        
      });
    },
    addLabel(){
      this.formData = {
        detailUrl: "",
        iconUrl: "",
        sceneId:"",
        sceneName: ""
      }
      this.category = [{categoryId: [],product: [],sort: ''}]
      this.noticeCode = true
    }
  }
};
</script>
