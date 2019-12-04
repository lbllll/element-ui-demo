



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
.coefficient {
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
}
.avatar-uploader {
  width: 120px;
  height: 120px;
  border: 1px solid rgb(238, 238, 238);
  border-radius: 4px;
}
</style>


<template>
  <div class="bodyBox" id="PRODUCT_CATEGORY">
    <div class="searchBox">
      <el-button @click="addBtn">添加分类</el-button>
    </div>
    <el-dialog :title="categoryTitle" :visible.sync="categoryCode" width="60%">
      <el-form :model="categoryData" ref="categoryData" label-width="100px" class="addAttribute">
        <el-form-item label="分类名称" verify prop="categoryName">
          <el-input class="inputs" v-model="categoryData.categoryName"></el-input>
        </el-form-item>
        <el-form-item verify label="分类图标" prop="icon">
          <el-upload
            class="avatar-uploader"
            :action="upImgUrl"
            :data="access_token"
            :show-file-list="false"
            :on-success="iconUrlSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="categoryData.icon" :src="categoryData.icon" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="分类描述" verify prop="description">
          <el-input class="inputs" v-model="categoryData.description"></el-input>
        </el-form-item>
        <el-form-item label="分类排序" verify prop="sort">
          <el-input class="inputs" type="number" v-model.number="categoryData.sort"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addCategory('categoryData')">添加分类</el-button>
          <el-button @click="resetForm('categoryData')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      class="tableBox"
      :data="categoryList"
      border
      style="width: 100%"
      ref="multipleTable"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
    >
      <el-table-column align="center" prop="categoryId" label="编号" width="80"></el-table-column>
      <el-table-column align="center" prop="name" label="分类名称"></el-table-column>
      <el-table-column align="center" prop="sort" label="排序">
        <template slot-scope="scope">
          <input
            class="coefficient"
            @blur="changeSlot(scope.row)"
            type="number"
            v-model.number="scope.row.sort"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="productCount" label="关联商品数"></el-table-column>
      <el-table-column align="center" label="查看">
        <template slot-scope="scope">
          <el-button @click="edits(scope.row,1)" type="primary" size="mini">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="删除">
        <template slot-scope="scope">
          <el-button @click="delCategory(scope.row,scope.$index,'categoryList')" type="primary" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="atCategory.index==1?'二级分类':'三级分类'" :visible.sync="categoryEdit" width="60%">
      <div>
        <div class="align-center">
          <el-button @click="addBtnTwo">添加分类</el-button>
          <el-button @click="backList" v-if="atCategory.index==2">返回上级</el-button>
        </div>
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
              <input
                class="coefficient"
                @blur="changeSlot(scope.row)"
                type="number"
                v-model.number="scope.row.sort"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="添加属性" v-if="atCategory.index==2">
            <template slot-scope="scope">
              <el-button @click="addAttribute(scope.row)" type="primary" size="mini">添加属性</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="查看全部属性" v-if="atCategory.index==2">
            <template slot-scope="scope">
              <el-button @click="openAll(scope.row)" type="primary" size="mini">查看全部属性</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="编辑" v-if="atCategory.index==1">
            <template slot-scope="scope">
              <el-button @click="edits(scope.row,2)" type="primary" size="mini">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="删除">
            <template slot-scope="scope">
              <el-button @click="delCategory(scope.row,scope.$index,'children')" type="primary" size="mini">删除</el-button>
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
  saveCategory,
  deleteCategory,
  setCoefficient
} from "@/api/table";

export default {
  name: "PRODUCT_CATEGORY",
  data() {
    return {
      categoryList: [],
      children: [],
      childName: "",
      categoryEdit: false,
      categoryAdd: false,
      parentId: "",
      attribute: {
        dataType: "STOCK",
        inputType: "TEXT",
        categoryId: "",
        isNullable: "Y",
        name: "",
        sort: "",
        defaultValue: ""
      },
      upImgUrl: process.env[this.$base] + "/medias/image/upload",
      access_token: {
        access_token: this.$store.getters.token
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
      categoryData: {
        categoryName: "",
        icon: "",
        description: "",
        sort: "",
        parentId: ''
      },
      typeItem: [{ value: "", default: true }],
      allAttribute: false,
      categoryCode: false,
      categoryTitle: "添加分类",
      atCategory:{index:0},  
      /* 
        该对象可保存3个属性，index：当前所在分类层级，0最外层（既列表页），1（二级分类），2（三级分类）
        1 : (1级分类的子元素)
        2 ：(2级分类的子元素）
        这种做法可以 减少一个层级的处理，2,3级分类使用同一个弹窗以及列表渲染
       */
      allAttributeList: [],
      addEdit: true // true=新增，false=编辑
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeSlot(row) {
      console.log(row);
      setCoefficient({ categoryId: row.categoryId, coefficient: row.sort })
        .then(res => {})
        .catch(err => {});
    },
    getList() {
      produckCategoryList()
        .then(result => {
          this.categoryList = result.data;
        })
        .catch(err => {});
    },
    edits(row,i) {
      // 根据索引值，存储对象数据，以便后期使用
      this.atCategory[i] = row
      this.atCategory.index = i
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
    editAttr(row) {
      this.addEdit = false;
      console.log(row);
      this.attribute.categoryId = row.name.categoryId;
      this.attribute.name = row.name.name;
      this.attribute.dataType = row.name.dataType;
      this.attribute.inputType = row.name.inputType;
      this.attribute.isNullable = row.name.isNullable;
      this.attribute.sort = row.name.sort;
      this.attribute.nameId = row.name.nameId;
      var list = JSON.parse(JSON.stringify(row.valueList));

      list.forEach(e => {
        if (e.value == row.name.defaultValue) {
          e.default = true;
        } else {
          e.default = false;
        }
      });
      this.typeItem = list;
      this.childName = row.name.name;
      this.categoryAdd = true;
    },
    addAttribute(row) {
      this.addEdit = true;
      console.log(row);

      this.attribute.name = "";
      this.attribute.dataType = "STOCK";
      this.attribute.inputType = "TEXT";
      this.attribute.isNullable = "Y";
      this.attribute.sort = "";
      this.attribute.nameId = "";
      this.typeItem = [{ value: "", default: true }];

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
      if (formName == "attribute") {
        this.typeItem = [{ value: "", default: true }];
      }
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
          if (this.addEdit) {
            delete data.nameId;
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
          } else {
            produckEditAttribute(data)
              .then(result => {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                self.openAll({ name: data.name, categoryId: data.categoryId });
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
    },
    addCategory(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this[formName]));
          saveCategory(data)
            .then(res => {
              if(data.parentId){
                // 提交成功后，刷新列表内容
                this.edits(this.atCategory[this.atCategory.index],this.atCategory.index)
              }
              this.$message({
                message: "添加分类成功",
                type: "success"
              });
              this.categoryCode = false;
              this.resetForm("categoryData");
            })
            .catch(err => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    delCategory(row,i,type) {
      this.$confirm("此操作将永久删除该分类及其子属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCategory({categoryId:row.categoryId}).then((res) => {
            this.$message({
              message: "删除属性成功",
              type: "success"
            });
            this[type].splice(i, 1);
          }).catch((err) => {
            
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    iconUrlSuccess(res) {
      console.log(res);
      this.categoryData.icon = res.data;
    },
    beforeAvatarUpload(file) {
      var type = "image/jpg,image/jpeg,image/png,image/gif";
      const isJPG = type.indexOf(file.type) != -1;
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG,JPEG,PNG,GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 5MB!");
      }
      return isJPG && isLt2M;
    },
    addBtn() {
      // 添加1级分类内容
      this.categoryTitle = "添加分类";
      this.categoryCode = true;
      this.atCategory = {index:0}
    },
    addBtnTwo(){
      // atCategory
      // 添加2,3级分类内容
      this.categoryTitle = this.atCategory[this.atCategory.index].name
      this.categoryData.parentId = this.atCategory[this.atCategory.index].categoryId
      this.categoryCode = true;
    },
    backList(){
      // 从三级分类返回二级分类
      this.edits(this.atCategory[1],1)
    }
  }
};
</script>








