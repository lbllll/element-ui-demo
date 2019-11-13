

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
.icon{
  width: 40px;
}
</style>


<template>
  <div class>
    <div class="header flex">
      <el-input class="inputs" v-model="sceneName" placeholder="场景名"></el-input>
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="primary" @click="noticeCode=true">添加场景</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" align="center" label="场景名称"></el-table-column>
      <el-table-column prop="description" align="center" label="描述"></el-table-column>
      <el-table-column prop="icon" align="center" label="图标">
        <template slot-scope="scope"><img class="icon" :src="scope.row.icon" alt=""></template>
      </el-table-column>
      <el-table-column align="center" label="排序" width="120">
        <template slot-scope="scope">
          <input class="sorts" type="number" v-model.number="scope.row.sort" @blur="setStor(scope.row.sort,scope.row.sceneId)" />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="operateContent" align="center" label="删除" width="100">
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="delLabel(scope.row.sceneId)"></i>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      style="margin-top:20px"
      @current-change="handleCurrentChange"
      :current-page="page"
      background
      layout="total, prev, pager, next, jumper"
      :total="countNum"
    ></el-pagination> -->

    <el-dialog title="添加标签" :visible.sync="noticeCode" width="70%">
      <el-form :model="formData" ref="formData" label-width="100px" class="demo-formData">
        <el-form-item verify label="场景名" prop="sceneName">
          <el-input class="inputs" v-model="formData.sceneName"></el-input>
        </el-form-item>
        <el-form-item verify label="描述" prop="sceneDescription">
          <el-input class="inputs" v-model="formData.sceneDescription"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input class="inputs" type="number" v-model.number="formData.sort"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-upload
            class="avatar-uploader"
            :action="upImgUrl"
            :data="access_token"
            :show-file-list="false"
            :on-success="iconUrlSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formData.icon" :src="formData.icon" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
  productScenelList,
  productLabelCounter,
  productScenelSort,
  productScenelSave,
  productScenelDel
} from "@/api/table";

export default {
  name: "PRODUCT_SCENE",
  data() {
    return {
      page: 1,
      formData: {
        icon: "",
        sceneName: "",
        sceneDescription: "",
        sort: "",
      },
      tableData: [],
      noticeCode: false,
      countNum: 0,
      upImgUrl: process.env[this.$base] + "/medias/image/upload",
      access_token: {
        access_token: this.$store.getters.token
      },
      sceneName: ''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      var page = JSON.parse(JSON.stringify(this.page))
      page--;
      productScenelList({ page: page,sceneName:this.sceneName })
        .then(res => {
          this.tableData = res.data;
        })
        .catch(err => {});
      // productLabelCounter()
      //   .then(res => {
      //     this.countNum = res.data;
      //   })
      //   .catch(err => {});
    },
    delLabel(id) {
      this.$confirm("此操作将永久删除该场景, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          productScenelDel({ sceneId: id })
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
          productScenelSave(this.formData)
            .then(res => {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.noticeCode = false;
              this.formData.icon = ''
              this.formData.sceneName = ''
              this.formData.sceneDescription = ''
              this.formData.sort = ''
              this.getList();
            })
            .catch(err => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      this.data.page = val;
      this.getList();
      console.log(`当前页: ${val}`);
    },
    iconUrlSuccess(res) {
      console.log(res);
      this.formData.icon = res.data;
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
    setStor(val, id){
      productScenelSort({sceneId:id,sort:+val}).then((res) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      }).catch((err) => {
        this.$message.error('操作失败')
      });
    }
  }
};
</script>
