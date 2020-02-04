



<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
</style>


<template>
  <div class="bodyBox" id="COUPON_COUPON_CREATE">
    <el-form :model="forms" ref="forms" label-width="100px">
      <!-- <el-form-item label="生成数量" verify prop="totalCount">
        <el-input v-model="forms.totalCount" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="批次编号" verify prop="code">
        <el-input v-model="forms.code" style="width:300px"></el-input>
      </el-form-item> -->
      <el-form-item label="礼卡类型" verify prop="couponType">
        <el-select v-model="forms.couponType" placeholder="请选择礼卡类型" style="width:300px">
          <el-option label="通兑卡" value="BALANCE_CARD"></el-option>
          <el-option label="单品卡" value="PRODUCT_CARD"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :type="batchId?'success':'primary'"
          @click="submitForm('forms')"
        >{{batchId?'导出表格':'开始生成'}}</el-button>
        <el-button @click="resetForm('forms')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { companyGenerate } from "@/api/table";

export default {
  name: "COUPON_COUPON_CREATE",
  data() {
    return {
      forms: {
        // totalCount: "",
        // code: "",
        couponType: ""
      },
      updataInfo: false,
      batchId: ""
    };
  },
  created() {
    console.log(process.env[this.$base]);
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      if (this.batchId) {
        // 触发下载
        var str = `${process.env[this.$base]}/coupon/info/tables?access_token=${this.$store.getters.token}&batchId=${this.batchId}`;
        window.open(str);
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.updataInfo) {
            return;
          }
          this.updataInfo = true;
          try {
            var data = JSON.parse(JSON.stringify(this.forms));
            companyGenerate(data)
              .then(res => {
                this.updataInfo = false;
                if (res.code == 200) {
                  this.batchId = res.data;
                }else{
                  this.$message.error(res.description)
                }
              })
              .catch(err => {
                this.updataInfo = false;
              });
          } catch (error) {
            this.updataInfo = false;
          }
        } else {
          this.$message.error("存在未填写项!");
          return false;
        }
      });
    }
  }
};
</script>








