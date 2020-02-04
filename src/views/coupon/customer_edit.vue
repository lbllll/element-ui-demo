

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/preview.scss";

.inputs {
  width: 360px;
}
.describe {
  color: #999;
  margin-left: 10px;
}
.formItem {
  width: 360px;
}
.demo-formData {
  .title {
    margin: 15px 0;
    font-weight: bold;
    color: #333;
  }
}
.articleDetailBtn {
  margin: 0 auto;
}
.footer {
  margin-top: 20px;
  @include flex-center;
}


//预览样式
.Preview {
  width: 446px;
  height: 676px;
  background-image: url("../../assets/preview/mobile-ccs.jpg");
  background-repeat: no-repeat;
  background-position: center;
}
.content{
  position: relative;
  top: -25px;
  border-radius: 10px 10px 0 0;
  border: 1px solid white;
}
.pre-title{
  font-weight: bolder;
  font-size: 24px;
  margin: 10px 0;
  color: black;
  .pre-description{
    font-weight: bold
  }
}
.pre-scene {
			margin-top: 6px;
			margin-bottom: 10px;
			padding-bottom: 10px;
			width: 100%;
			border-bottom: 2px solid #F3F3F3;
			.scene {
				display: inline-block;
				margin-right: 10px;
				padding: 2px 6px;
				font-size: 12px;
				color: #FA5051;
				background-color: #FFE8E4;
				border-radius: 10px;
			}
		}
.pre_item{
  margin-bottom: 15px;
}
.article-goods-title{
  font-weight: bold;
  color: #7D8B72;
  margin-bottom:10px 
}
.pre_content_title{
  font-weight: bold;
  color: #333333;
  margin-bottom:10px 
}    




</style>


<template>
  <div>
    <el-form :model="formData" ref="formData" label-width="100px" class="demo-formData">
      <p class="title">客户基本信息</p>
        <el-input type="hidden" class="inputs" v-model="formData.customerId"></el-input>
      <el-form-item verify label="客户/公司名" prop="cusName">
        <el-input class="inputs" v-model="formData.cusName"></el-input>
        <span class="describe"></span>
      </el-form-item>
      <!-- <el-form-item verify label="客户密码" prop="cusPassword">
        <el-input class="inputs" v-model="formData.cusPassword"></el-input>
        <span class="describe">密码</span>
      </el-form-item> -->
      <el-form-item verify label="公司联系人" prop="cusSaleName">
        <el-input class="inputs" v-model="formData.cusSaleName"></el-input>
        <span class="describe">联系人</span>
      </el-form-item>
      <el-form-item verify label="联系电话" prop="cusPhone">
        <el-input class="inputs" v-model="formData.cusPhone"></el-input>
        <span class="describe">电话</span>
      </el-form-item>
      <el-form-item label="客户邮箱" prop="cusEmail">
        <el-input class="inputs" v-model="formData.cusEmail"></el-input>
        <span class="describe">邮箱</span>
      </el-form-item>
      <el-form-item verify label="客户地址" prop="cusAddress">
        <el-input class="inputs" v-model="formData.cusAddress"></el-input>
        <span class="describe">地址</span>
      </el-form-item>
      <el-form-item  verify label="客户类型" prop="cusType" >
        <div class="">
            <el-select
              class="inputs"
              v-model="formData.cusType"
              placeholder="请选择客户类型"
              size="small"
            >
              <el-option
                v-for="item in cusTypes"
                :key="item.cusType"
                :label="item.name"
                :value="item.cusType"
              ></el-option>
            </el-select>
        </div>
      </el-form-item>
      <el-form-item  verify label="客户等级
      " prop="cusLevel" >
        <div class="">
            <el-select
              class="inputs"
              v-model="formData.cusLevel"
              placeholder="请选择客户等级"
              size="small"
            >
              <el-option
                v-for="item in cusLevels"
                :key="item.cusLevel"
                :label="item.name"
                :value="item.cusLevel"
              ></el-option>
            </el-select>
        </div>
      </el-form-item>
      <!-- <div>
        <p class="title">添加银行卡</p>
      </div>
      <el-button type="primary" @click="articleAddWithDetail">添加银行卡</el-button> -->
      <div class="footer">
        <el-button type="primary" @click="customerAdd">{{$route.query.id?'确认修改':'确认添加'}}</el-button>
        <!-- <el-button type="primary" @click="previewData()">预览</el-button> -->
      </div>
    </el-form>
  </div>
</template>


<script>
import {
  customerAdd,
  customerEdit,
  getCustomerDetail
} from "@/api/table";
export default {
  name: "COUPON_CUSTOMER_EDIT",
  data() {
    return {
      formData: {
        customerId: "",
        cusName: "",
        // cusPassword: "",
        cusSaleName:"",
        cusPhone: "",
        cusEmail: "",
        cusAddress: "",
        cusType: ""
      },
      cusTypes:[
        {
          cusType:"BUSINESS",
          name:"企业客户"
        },
        {
          cusType:"PERSONAL",
          name:"个人客户"
        }
      ],
      cusLevels:[
        {
          cusLevel:"NORMAL",
          name:"普通客户"
        },
        {
          cusLevel:"VIP",
          name:"VIP客户"
        }
      ],
      checkedScene: [],
      scene: [],
      product: [],
      upImgUrl: process.env[this.$base] + "/medias/image/upload",
      access_token: {
        access_token: this.$store.getters.token
      },
      imageUrl: "",
      imageListUrl: "",
      classif: [],
      articleInfo: [],
      articleProduct: [],
      selects: [],
      categoryIndex: "",
      productCode: false,
      previewCode: false, // ·······························
      detailsJson: [],
      productInfoOne: {
        productImg: "",
        productPrice: ""
      },
      previewList:[],
      chenckProductImg:"",
      showImgArea:false
    };
  },
  created() {
    //如果有id则是修改,这里查询文章详情
    if (this.$route.query.id) {
      getCustomerDetail({ customerId: this.$route.query.id }).then(res => {
        this.formData = res.data;  
    })
    }
  },
  methods: {
    addCont(i) {
      this.articleInfo[i].detailContent.push({ txt: "" });
    },
    delCont(index, i) {
      this.articleInfo[index].detailContent.splice(i, 1);
    },
    uploadSuccess(response, file, fileList) {
      if (response.code == "200") {
        this.formData.headImg = response.data;
        this.imageUrl = response.data;
      }
    },
    uploadListSuccess(response, file, fileList) {
      if (response.code == "200") {
        this.formData.listImg = response.data;
        this.imageListUrl = response.data;
      }
    },
    customerAdd(){
      let that  = this;
      //如果客户不为空，那就是修改，调修改接口
      if(this.formData.customerId!=""){
        //修改
        let data = {
        customerId: this.formData.customerId,
        cusName: this.formData.cusName,
        // cusPassword: this.formData.cusPassword,
        cusSaleName:this.formData.cusSaleName,
        cusPhone: this.formData.cusPhone,
        cusEmail: this.formData.cusEmail,
        cusAddress: this.formData.cusAddress,
        cusType: this.formData.cusType,
        cusLevel: this.formData.cusLevel
      }
      customerEdit(data).then(res => {
        if (res.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            setTimeout(() => {
              this.updataInfo = 2;
           //跳转到列表
          // that.$ruter.push({path:'COUPON_CUSTOMER_LIST'});
          this.$router.go(-1); 
            }, 2000);
          }
      })
      }else{
        //否则就是添加接口
        let data = {
        cusName: this.formData.cusName,
        // cusPassword: this.formData.cusPassword,
        cusSaleName:this.formData.cusSaleName,
        cusPhone: this.formData.cusPhone,
        cusEmail: this.formData.cusEmail,
        cusAddress: this.formData.cusAddress,
        cusType: this.formData.cusType,
        cusLevel: this.formData.cusLevel
      }
      customerAdd(data).then(res => {
        if (res.code == 200) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            setTimeout(() => {
              this.updataInfo = 2;
           //跳转到列表
          // that.$ruter.push({path:'COUPON_CUSTOMER_LIST'});
          this.$router.go(-1); 
            }, 2000);
          }
      })
      }
    }
  }
};
</script>
