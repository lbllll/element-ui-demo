

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
</style>


<template>
  <div class>
    <div class="header flex">
      <el-input class="inputs" placeholder="请输入内容" v-model="data.noticeTitle">
        <template slot="prepend">通知标题</template>
      </el-input>
      <el-select v-model="data.status" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="getList">查询</el-button>
      <el-button type="primary" @click="noticeCode=true">添加通知</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="noticeTitle" align="center" label="标题"></el-table-column>
      <el-table-column align="center" label="图标" width="260">
        <template slot-scope="scope">
          <img class="tableImg" :src="scope.row.iconUrl" alt />
        </template>
      </el-table-column>
      <el-table-column align="center" label="海报" width="260">
        <template slot-scope="scope">
          <img class="tableImg" :src="scope.row.detailUrl" alt />
        </template>
      </el-table-column>
      <el-table-column prop="operateContent" align="center" label="上下架状态" width="260">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-text="上架"
            inactive-text="下架"
            active-value="GROUNDED"
            inactive-value="UNGROUNDED"
            @change="setStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px"
      @current-change="handleCurrentChange"
      :current-page="data.page"
      background
      layout="total, prev, pager, next, jumper"
      :total="countNum"
    ></el-pagination>

    <el-dialog title="提示" :visible.sync="noticeCode" width="70%">
      <el-form :model="formData" ref="formData" label-width="100px" class="demo-formData">
        <el-form-item verify label="通知标题" prop="noticeTitle">
          <el-input class="inputs" v-model="formData.noticeTitle"></el-input>
        </el-form-item>
        <el-form-item verify label="图标" prop="iconUrl">
          <el-upload
            class="avatar-uploader"
            :action="upImgUrl"
            :data="access_token"
            :show-file-list="false"
            :on-success="iconUrlSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formData.iconUrl" :src="formData.iconUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item verify label="海报" prop="detailUrl">
          <el-upload
            class="avatar-uploader"
            :action="upImgUrl"
            :data="access_token"
            :show-file-list="false"
            :on-success="detailUrlSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formData.detailUrl" :src="formData.detailUrl" class="avatar" />
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
  noticeList,
  noticeCounter,
  noticeSetStatus,
  addRelease
} from "@/api/table";

export default {
  name: "HOME_NOTICE",
  data() {
    return {
      data: {
        status: "",
        noticeTitle: "",
        page: 1
      },
      formData: {
        detailUrl: "",
        iconUrl: ""
      },
      tableData: [],
      noticeCode: false,
      upImgUrl: process.env[this.$base] + "/medias/image/upload",
      access_token: {
        access_token: this.$store.getters.token
      },
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "GROUNDED",
          label: "上架"
        },
        {
          value: "UNGROUNDED",
          label: "下架"
        }
      ],
      countNum: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      var data = JSON.parse(JSON.stringify(this.data));
      data.page--;
      noticeList(data)
        .then(res => {
          this.tableData = res.data;
        })
        .catch(err => {});
      noticeCounter()
        .then(res => {
          this.countNum = res.data;
        })
        .catch(err => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addRelease(this.formData)
            .then(res => {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.noticeCode = false;
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
    iconUrlSuccess(res) {
      console.log(res);
      this.formData.iconUrl = res.data;
    },
    detailUrlSuccess(res) {
      console.log(res);
      this.formData.detailUrl = res.data;
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
    handleCurrentChange(val) {
      this.data.page = val;
      this.getList();
      console.log(`当前页: ${val}`);
    }
  }
};
</script>
