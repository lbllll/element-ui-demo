



<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.searchBox {
  width: 100%;
  height: 60px;
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
.addAttribute {
  .inputs {
    width: 200px;
  }
  .inputBox {
    position: relative;
    width: 260px;
    margin-top: 10px;
    .isDefault {
      position: absolute;
      top: 50%;
      right: 70px;
      width: 14px;
      height: 14px;
      transform: translate(0, -50%);
      background: #fff;
      border-radius: 50%;
      border: 1px solid #ccc;
      cursor: pointer;
    }
    .isDefault.on {
      border: 5px solid #409eff;
    }
    .btns {
      position: absolute;
      top: 50%;
      right: 26px;
      transform: translate(0, -50%);
      font-size: 24px;
    }
  }
}
.mb0 {
  margin-bottom: 0px;
}
.coefficient{
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
}
</style>


<template>
  <div class="bodyBox" id="PRODUCT_CATEGORY">
    <div class="searchBox">
      <el-radio-group v-model="type">
        <el-radio :label="true" border>商品分类</el-radio>
        <el-radio :label="false" border>送礼场景</el-radio>
      </el-radio-group>
    </div>

    <el-table
      class="tableBox"
      :data="type?categoryList:labelData"
      border
      style="width: 100%"
      ref="multipleTable"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
    >
      <el-table-column align="center" :prop="type?'categoryId':'labelId'" label="编号" width="80"></el-table-column>
      <el-table-column align="center" prop="name" label="分类名称"></el-table-column>
      <el-table-column align="center" prop="sort" label="排序">
        <template slot-scope="scope">
          <input class="coefficient" @blur="changeSlot(scope.row)" type="number" v-model.number="scope.row.sort">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :prop="type?'productCount':'relatedProductCount'"
        label="关联商品数"
      ></el-table-column>
      <el-table-column align="center" label="查看">
        <template slot-scope="scope">
          <el-button v-if="type" @click="edits(scope.row)" type="primary" size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="二级分类" :visible.sync="categoryEdit" width="60%">
      <div>
        <el-table
          class="tableBox"
          :data="children"
          border
          style="width: 100%"
          ref="multipleTable"
          :header-cell-style="{background:'#afafaf',color:'#606266'}"
        >
          <el-table-column align="center" prop="categoryId" label="编号" width="80"></el-table-column>
          <el-table-column align="center" prop="name" label="分类名称"></el-table-column>
          <el-table-column align="center" prop="sort" label="排序">
            <template slot-scope="scope">
              <input class="coefficient" @blur="changeSlot(scope.row)" type="number" v-model.number="scope.row.sort">
            </template>
          </el-table-column>
          <el-table-column align="center" label="添加属性">
            <template slot-scope="scope">
              <el-button
                v-if="type"
                @click="addAttribute(scope.row)"
                type="primary"
                size="mini"
              >添加属性</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="查看全部属性">
            <template slot-scope="scope">
              <el-button v-if="type" @click="openAll(scope.row)" type="primary" size="mini">查看全部属性</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :title="childName" :visible.sync="allAttribute" width="60%">
      <div>
        <el-table
          class="tableBox"
          :data="allAttributeList"
          border
          style="width: 100%"
          ref="multipleTable"
          :header-cell-style="{background:'#afafaf',color:'#606266'}"
        >
          <el-table-column align="center" prop="name.name" label="属性名" width="80"></el-table-column>
          <el-table-column align="center" label="商品属性">
            <template slot-scope="scope">{{scope.row.name.dataType=="SALE"?'普通属性':'库存属性'}}</template>
          </el-table-column>
          <el-table-column align="center" label="输入类型">
            <template slot-scope="scope">{{getInputType(scope.row.name.inputType)}}</template>
          </el-table-column>
          <el-table-column align="center" label="是否必填">
            <template slot-scope="scope">{{scope.row.name.isNullable=='Y'?'是':'否'}}</template>
          </el-table-column>
          <el-table-column align="center" prop="name.sort" label="排序"></el-table-column>
          <el-table-column align="center" prop="name.defaultValue" label="默认选项"></el-table-column>
          <el-table-column align="center" label="备选项">
            <template slot-scope="scope">
              <p
                v-if="scope.row.valueList && scope.row.valueList.length>0"
              >{{getItem(scope.row.valueList)}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="删除">
            <template slot-scope="scope">
              <i class="el-icon-delete" @click="delAttribute(scope.row.name.nameId,scope.$index)"></i>
            </template>
          </el-table-column>
          <el-table-column align="center" label="编辑">
            <template slot-scope="scope">
              <i class="el-icon-edit-outline" @click="editAttr(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :title="childName+(addEdit?'新增属性':'编辑属性')" :visible.sync="categoryAdd" width="60%">
      <el-form :model="attribute" ref="attribute" label-width="100px" class="addAttribute">
        <el-form-item label="属性名" verify prop="name">
          <el-input class="inputs" v-model="attribute.name"></el-input>
        </el-form-item>
        <el-form-item label="商品属性" prop="dataType">
          <el-radio v-model="attribute.dataType" label="STOCK">库存属性</el-radio>
          <el-radio v-model="attribute.dataType" label="SALE">普通属性</el-radio>
        </el-form-item>
        <el-form-item label="输入类型" :class="attribute.inputType=='TEXT'?'':'mb0'">
          <el-select v-model="attribute.inputType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label v-if="attribute.inputType!=='TEXT'">
          <div class="inputBox" v-for="(item, index) in typeItem" :key="index">
            <el-input class="inputs" placeholder="请输入候选项" v-model="item.value"></el-input>
            <i class="isDefault" :class="item.default?'on':''" @click="checkDefault(index)"></i>
            <i
              class="btns"
              :class="index==0?'el-icon-plus':'el-icon-delete'"
              @click="valueChange(index)"
            ></i>
          </div>
        </el-form-item>
        <el-form-item label="是否必填">
          <el-switch
            v-model="attribute.isNullable"
            active-value="Y"
            inactive-value="N"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <el-form-item label="排序" verify prop="sort">
          <el-input class="inputs" v-model.number="attribute.sort"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('attribute')">{{addEdit?'立即创建':'确认编辑'}}</el-button>
          <el-button @click="resetForm('attribute')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
import {
  produckCategoryList,
  produckLabelList,
  produckAddAttribute,
  produckEditAttribute,
  produckAllAttribute,
  produckDelAttribute,
  setCoefficient
} from "@/api/table";

export default {
  name: "PRODUCT_CATEGORY",
  data() {
    return {
      labelData: [],
      categoryList: [],
      children: [],
      childName: "",
      type: true,
      categoryEdit: false,
      categoryAdd: false,
      parentId: "",
      attribute: {
        dataType: "STOCK",
        inputType: "TEXT",
        categoryId: "",
        isNullable: "Y",
        name: '',
        sort: '',
        defaultValue:''
      },
      options: [
        {
          value: "TEXT",
          label: "文本框"
        },
        {
          value: "RADIO",
          label: "单选框"
        },
        {
          value: "CHECKBOX",
          label: "多选框"
        }
      ],
      typeItem: [{ value: "", default: true }],
      allAttribute: false,
      allAttributeList: [],
      addEdit: true // true=新增，false=编辑
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeSlot(row){
      console.log(row);
      setCoefficient({categoryId:row.categoryId,coefficient:row.sort}).then((res) => {
      }).catch((err) => {
      });
    },
    getList() {
      produckCategoryList()
        .then(result => {
          this.categoryList = result.data;
        })
        .catch(err => {});
      produckLabelList()
        .then(result => {
          this.labelData = result.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    edits(row) {
      this.parentId = row.categoryId || "";
      produckCategoryList({ parentId: this.parentId })
        .then(result => {
          this.children = result.data;
          this.categoryEdit = true;
        })
        .catch(err => {});
    },
    delAttribute(id, i) {
      this.$confirm("此操作将永久删除该属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          produckDelAttribute({ nameId: id })
            .then(result => {
              this.$message({
                message: "删除属性成功",
                type: "success"
              });
              this.allAttributeList.splice(i, 1);
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
    editAttr(row){
      this.addEdit = false
      console.log(row);
      this.attribute.categoryId = row.name.categoryId;
      this.attribute.name = row.name.name;
      this.attribute.dataType = row.name.dataType;
      this.attribute.inputType = row.name.inputType;
      this.attribute.isNullable = row.name.isNullable;
      this.attribute.sort = row.name.sort;
      this.attribute.nameId = row.name.nameId;
      var list = JSON.parse(JSON.stringify(row.valueList))

      list.forEach(e => {
        if(e.value==row.name.defaultValue){
          e.default = true
        }else{
          e.default = false
        }
      });
      this.typeItem = list
      this.childName = row.name.name;
      this.categoryAdd = true;
    },
    addAttribute(row) {
      this.addEdit = true
      console.log(row);

      this.attribute.name = '';
      this.attribute.dataType = 'STOCK';
      this.attribute.inputType = 'TEXT';
      this.attribute.isNullable = 'Y';
      this.attribute.sort = '';
      this.attribute.nameId = '';
      this.typeItem = [{ value: "", default: true }]

      this.attribute.categoryId = row.categoryId;
      this.childName = row.name;
      this.categoryAdd = true;
    },
    getItem(list) {
      var str = "";
      list.forEach(e => {
        str += e.value + ",";
      });
      return str;
    },
    getInputType(t) {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].value == t) {
          return this.options[i].label;
        }
      }
    },
    valueChange(i) {
      if (i == 0) {
        this.typeItem.push({ value: "", default: false });
      } else {
        if (this.typeItem[i].default) {
          this.typeItem[0].default = true;
        }
        this.typeItem.splice(i, 1);
      }
    },
    checkDefault(i) {
      this.typeItem.forEach(e => {
        e.default = false;
      });
      this.typeItem[i].default = true;
    },
    openAll(row) {
      this.childName = row.name;
      produckAllAttribute({ categoryId: row.categoryId })
        .then(result => {
          this.allAttributeList = result.data;
          this.allAttribute = true;
        })
        .catch(err => {});
    },
    resetForm(formName) {
      this.typeItem = [{ value: "", default: true }];
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      var self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.attribute));
          if (data.inputType != "TEXT") {
            var code = true;
            data.valueListJson = [];
            this.typeItem.forEach(e => {
              if (e.default) {
                data.defaultValue = e.value;
              }
              data.valueListJson.push(e.value);
              if (!e.value) {
                code = false;
              }
            });
            data.valueListJson = JSON.stringify(data.valueListJson);
            if (!code) {
              this.$message.error("候选项不能为空");
              return;
            }
          }
          if(this.addEdit){
            delete data.nameId
            produckAddAttribute(data)
              .then(result => {
                this.$message({
                  message: "添加属性成功",
                  type: "success"
                });
                setTimeout(() => {
                  self.categoryAdd = false;
                  self.resetForm("attribute");
                }, 1000);
              })
              .catch(err => {});
          }else{
            produckEditAttribute(data)
              .then(result => {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                self.openAll({name:data.name,categoryId:data.categoryId})
                setTimeout(() => {
                  self.categoryAdd = false;
                  self.resetForm("attribute");
                }, 1000);
              })
              .catch(err => {});
          }
          console.log(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>








