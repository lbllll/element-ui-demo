



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
  <div class="bodyBox" id="PRODUCT_ORDER_LIST">
    <div class="searchBox">
      <el-input class="inputs" placeholder="请输入内容" size="mini" v-model="data.nickName">
        <template slot="prepend">供货商名称</template>
      </el-input>
      <div class="flex-center">
        <p>状态：</p>
        <el-select
          class="select"
          size="mini"
          @change="getList"
          v-model="data.status"
          placeholder="请选择"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="flex-center">
        <p>商户类型：</p>
        <el-select
          class="select"
          size="mini"
          @change="getList"
          v-model="data.buyType"
          placeholder="请选择"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-button type="primary" size="mini" @click="getList">搜索</el-button>
    </div>
    <el-button v-if="!checkItem" type="primary" @click="getDetail()">添加供货商</el-button>
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
      <!-- 
      @row-click="handleRowClick"-->
      <el-table-column align="center" type="selection" width="40"></el-table-column>
      <el-table-column align="center" prop="nickName" label="商户名称"></el-table-column>
      <el-table-column align="center" prop="linkMan" label="联系人" width="160"></el-table-column>
      <el-table-column align="center" prop="mobile" label="联系电话" width="160"></el-table-column>
      <el-table-column align="center" prop="address" label="地址" width="260"></el-table-column>
      <el-table-column align="center" label="状态" width="120">
        <template slot-scope="scope">{{statusCode[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="getDetail(scope.row.merchantId)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer flex-between">
      <el-button v-if="checkItem" type="primary" @click="upSelect">确定</el-button>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="data.page"
        background
        layout="total, prev, pager, next, jumper"
        :total="countNum"
      ></el-pagination>
    </div>
    <el-dialog :title="titles" :visible.sync="addMerchant" width="70%">
      <p class="formTitle">供货商信息</p>
      <el-form :model="forms" ref="forms" label-width="100px">
        <el-form-item label="用户名" verify prop="userName">
          <el-input v-model="forms.userName" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="密码" verify prop="password">
          <el-input v-model="forms.password" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="商户名称" verify prop="nickName">
          <el-input v-model="forms.nickName" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="联系人" verify prop="linkMan">
          <el-input v-model="forms.linkMan" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" verify phone prop="mobile">
          <el-input v-model.number="forms.mobile" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="商户类型" verify prop="type">
          <!-- <el-input v-model="forms.type" style="width:300px"></el-input> -->
          <el-select
            class="select"
            style="width:300px"
            @change="getList"
            v-model="forms.type"
            placeholder="请选择"
          >
            <el-option label="个人" value="PERSONAL"></el-option>
            <el-option label="企业" value="COMPANY"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" verify prop="description">
          <el-input v-model="forms.description" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="地址" verify prop="address">
          <el-input v-model="forms.address" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="银行" prop="bankName">
          <el-input v-model="forms.bankName" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="bankAccount">
          <el-input v-model="forms.bankAccount" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="开户姓名" prop="bankUserName">
          <el-input v-model="forms.bankUserName" style="width:300px"></el-input>
        </el-form-item>
        <p class="formTitle">相关证件</p>
        <div class="flex">
          <el-form-item label-width="140px" verify label="营业执照" prop="businessImagePath">
            <el-input v-model="forms.businessImagePath" style="display:none"></el-input>
            <el-upload
              class="avatar-uploader"
              :action="upImgUrl"
              :data="access_token"
              :show-file-list="false"
              :on-success="upbusinessImagePath"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="forms.businessImagePath" :src="forms.businessImagePath" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item label-width="140px" label="食品流通许可证" prop="foodLicencePath">
            <el-input v-model="forms.foodLicencePath" style="display:none"></el-input>
            <el-upload
              class="avatar-uploader"
              :action="upImgUrl"
              :data="access_token"
              :show-file-list="false"
              :on-success="upfoodLicencePath"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="forms.foodLicencePath" :src="forms.foodLicencePath" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>

      <div class="flex" style="margin-left:120px;margin-top:20px">
        <el-button type="primary" @click="addMerchantData('forms')">确认提交</el-button>
        <el-button @click="resetForm('forms')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  merchantList,
  merchantCreate,
  companyDetail,
  companyEdit
} from "@/api/table";

export default {
  name: "MERCHANT_LIST",
  data() {
    return {
      data: {
        buyType: "", // 购买类型
        status: "", // 付款状态
        nickName: "", // 供货商名称
        page: 1
      },
      titles: "添加供货商",
      typeList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "PERSONAL",
          label: "个人"
        },
        {
          value: "COMPANY",
          label: "企业"
        }
      ],
      statusList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "CREATED",
          label: "待审核"
        },
        {
          value: "NORMAL",
          label: "正常"
        },
        {
          value: "DISABLED",
          label: "禁用"
        }
      ],
      statusCode: {
        CREATED: "创建",
        NORMAL: "正常",
        DISABLED: "禁用"
      },
      upImgUrl: process.env[this.$base] + "/medias/image/upload",
      access_token: {
        access_token: this.$store.getters.token
      },
      tableData: [],
      checkAll: false,
      isIndeterminate: false,
      countNum: 0,
      addMerchant: false,
      updataInfo: false,
      forms: {
        type: "PERSONAL",
        businessImagePath: "", // 营业执照
        foodLicencePath: "", // 食品流通许可证
        address: "",
        bankAccount: "",
        bankName: "",
        bankUserName: "",
        description: "",
        linkMan: "",
        mobile: "",
        nickName: "",
        password: "",
        userName: ""
      },
      multipleSelection: []
    };
  },
  props: {
    checkItem: Boolean,
    selectList: Array
  },
  created() {
    this.getList();
  },
  mounted(){
    if(this.selectList&&this.selectList.length>0){
      this.multipleSelection = this.selectList
    }
  },
  methods: {
    getList() {
      var data = JSON.parse(JSON.stringify(this.data));
      // 后端page从0开始，所以需要减一
      data.page--;
      merchantList(data)
        .then(result => {
          if (result.code == 200) {
            this.countNum = result.data.count;
            this.tableData = result.data.data;
          } else {
          }
        })
        .catch(err => {});
    },
    getDetail(id) {
      if (!id) {
        try {
          this.resetForm("forms");
        } catch (error) {}
        this.titles = "添加供货商";
        this.addMerchant = true;
        delete this.forms.merchantId;
        return;
      }
      this.forms.merchantId = id;
      companyDetail({ merchantId: id })
        .then(res => {
          if (res.code == 200) {
            this.forms = res.data;
            this.forms.businessImagePath = res.data.businessImgPath;
            this.forms.foodLicencePath = res.data.foodLicenceImgPath;
            this.titles = "编辑";
            this.addMerchant = true;
          }
        })
        .catch(err => {});
    },
    addMerchantData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.updataInfo) {
            return;
          }
          this.updataInfo = true;
          try {
            var data = JSON.parse(JSON.stringify(this.forms));
            var self = this;
            function successFun(res, msg) {
              if (res.code == 200) {
                self.$message({
                  message: msg,
                  type: "success"
                });
                self.addMerchant = false;
              }
              self.getList();
              self.updataInfo = false;
            }
            if (this.titles == "添加供货商") {
              merchantCreate(data)
                .then(res => {
                  successFun(res, "添加成功");
                })
                .catch(err => {
                  this.updataInfo = false;
                  this.$message.error(err.description);
                });
            } else {
              companyEdit(data)
                .then(res => {
                  successFun(res, "编辑成功");
                })
                .catch(err => {
                  this.updataInfo = false;
                  this.$message.error(err.description);
                });
            }
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
    getRowKeys(row) {
      // 给表格每行增加一个唯一 标识，用作切换分页后保留被选中行的信息
      return row.merchantId;
    },
    upSelect() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择供货商",
          type: "warning"
        });
      } else if (this.multipleSelection.length > 1) {
        this.$message({
          message: "只能选择1个供货商",
          type: "warning"
        });
      }else if(this.multipleSelection.length == 1){
        this.$emit('upSelect',this.multipleSelection)
      }
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
    },
    upbusinessImagePath(res, file) {
      // 上传营业执照成功
      console.log(res);
      if (res.code == 200) {
        this.forms.businessImagePath = res.data;
      } else {
        this.$message.error(res.description);
      }
    },
    upfoodLicencePath(res, file) {
      // 上传食品经营许可证成功
      console.log(res);
      if (res.code == 200) {
        this.forms.foodLicencePath = res.data;
      } else {
        this.$message.error(res.description);
      }
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
    }
  }
};
</script>








