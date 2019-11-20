

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.inputs{
  width: 260px;
}
</style>


<template>
  <div>
    <el-form :model="formData" ref="formData" label-width="100px" class="demo-formData">
      <el-form-item verify label="标签名称" prop="labelName">
        <el-input class="inputs" v-model="formData.labelName"></el-input>
      </el-form-item>
      <el-form-item verify label="标签描述" prop="labelDescription">
        <el-input class="inputs" v-model="formData.labelDescription"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import {
  productLabel
} from "@/api/table";

export default {
  name: "ARTICLE_RELEASE",
  data() {
    return {
      formData:{}
    };
  },
  created() {
  },
  methods: {
  }
};
</script>
