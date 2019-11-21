

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.inputs{
  width: 260px;
}
</style>


<template>
  <div>
    <el-form :model="formData" ref="formData" label-width="100px" class="demo-formData">
      <el-form-item verify label="文章标题" prop="title">
        <el-upload
          :action="upImgUrl"
          :data="access_token"
          :show-file-list="false"
          :on-change="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-input class="inputs none" v-model="formData.imageUrl"></el-input>
        </el-upload>
      </el-form-item>
      <el-form-item verify label="文章标题" prop="title">
        <el-input class="inputs" v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item verify label="文章副标题" prop="description">
        <el-input class="inputs" v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="所属标签" verify prop="classif">
        <el-checkbox-group v-model="sizeForm.classif">
          <div class="classifBox" v-for="(item, index) in classif" :key="index">
            <p>
              {{item.parentName}}
              <span>
                <el-switch v-model="item.checkAll"  active-color="#13ce66" inactive-color="#f5f5f5" @change="handleCheckAllChange(index)">
                </el-switch>
                全选
              </span>
            </p>
            <el-checkbox v-for="(l, i) in item.list" :key="i" :label="l.labelId">{{l.name}}</el-checkbox>
          </div>
        </el-checkbox-group>
        <span class="describe">商品所属标签，可多选</span>
      </el-form-item>
    </el-form>
    <!-- <el-upload
            class="upload-demo"
            :action="upImgUrl"
            :data="access_token"
            :file-list="detailList"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            multiple
            :on-change="detailListenChange"
            list-type="picture"
          >
            <p class="flex-center upImtBtn">
              <i class="el-icon-plus"></i>
            </p>
            <p>上传商品图片</p>
          </el-upload> -->
  </div>
</template>


<script>
import {
  productLabel,
  produckTabel
} from "@/api/table";

export default {
  name: "ARTICLE_RELEASE",
  data() {
    return {
      formData:{
        memberId: '1',
        headImg:'',
        classif: []
      },
      upImgUrl: process.env[this.$base] + "/medias/image/upload",
      access_token: {
        access_token: this.$store.getters.token
      },
      imageUrl: '',
      classif: []
    };
  },
  created() {
  },
  methods: {
    handleAvatarSuccess(){

    },
    beforeAvatarUpload(file) {
      var type = "image/jpg,image/jpeg,image/png,image/gif";
      const isJPG = type.indexOf(file.type) != -1;
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG,JPEG,PNG,GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleCheckAllChange(i){
      this.classif[i].list.forEach(e => {
        var index = this.sizeForm.classif.indexOf(e.labelId)
        if(this.classif[i].checkAll){
          if(index == -1){
            this.sizeForm.classif.push(e.labelId)
          }
        }else{
          if(index != -1){
            this.sizeForm.classif.splice(index,1)
          }
        }
      });
    },
    getClassif(val) {
      var list = [];
      var code = 0;
      var self = this;
      val.forEach((e,i) => {
        produckTabel({ sceneId: e }).then(result => {
          var parentName =  ''
          try {
            parentName = result.data[0].sceneName
          } catch (error) {}
          var obj = {
            list : result.data,
            parentName: parentName,
            checkAll: false
          }
          list.push(obj);
          code++;
          if (code == val.length) {
            successFun();
          }
        });
      });
      if(!val||val.length==0){
        this.classif = []
      }
      function successFun() {
        self.classif = list;
      }
    },
  }
};
</script>
