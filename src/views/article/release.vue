

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
.articleAddWithDetail {
  margin-top: 20px;
  padding-top: 20px;
  border: 1px solid #333;
  border-radius: 8px;
  width: 600px;
}
.articleAddWithDetail textarea {
  border-radius: 8px;
  padding: 12px;
  width: 360px;
  height: 100px;
  resize: none;
  outline: none !important;
}
.articleAddWithProduct {
  margin-top: 20px;
  padding-top: 20px;
  border: 1px solid #333;
  border-radius: 8px;
  width: 600px;
  height: 230px;
}
.footer {
  margin-top: 20px;
  @include flex-center;
}
.imgArea {
  border: 1px solid black;
  width: 500px;
  height: 4000px;
}
.addCont{
  display: block;
}
.detailContent{
  position: relative;
  width: 360px;
  .delete{
    position: absolute;
    left: 366px;
    bottom: 24px;
    font-size: 24px;
  }
}
.mobile {
  border: 1px solid black;
}
  .banner{
    position: absolute;
    top:0;
    width: 100%;
    .banner-img {
      width: 100%;
      height: 160px;
    }
  }
  .pre-content{
    position: absolute;
    background-color: red;
    border-radius:  10px 10px 0 0 ;
    top:140px;
    .pre-title{
      color: black;
      font-weight: bolder;
    }
    .pre-description{
      margin-top: -8px;
      font-weight: bolder;
    }
  .pre-description span{
    position: absolute;
    }
    .pre-description-detail{
      padding: 2px 0 0 5px;
    }
    .pre-scene {
      margin-top: 8px;
      padding-bottom: 5px;
      width: 100%;
      border-bottom: 2px solid #F3F3F3;
        .scene {
          display: inline-block;
          margin-right: 8px;
          padding: 4px 6px;
          font-size: 12px;
          color: #FA5051;
          background-color: #FFE8E4;
          border-radius: 50px;
        }
    }
.pre-detail {
  border: 1px solid red;
  height: 200px;
  margin-top: 15px;
  font-size: 30rpx;
  min-height: 1000rpx;
  .article-title {
    margin-bottom: 24rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
    }
  .article-paragraph {
    margin-bottom: 48rpx;
    font-size: 32rpx;
    line-height: 58rpx;
    color: #5C5C5C;
    .partList {
      margin-bottom: 20rpx;
    }
  }
  .article-lable {
    margin-bottom: 24rpx;
    font-size: 32rpx;
    line-height: 45rpx;
    color: #7D8B72;
  }
  .article-goods {
      position: relative;
      margin-bottom: 88rpx;
    .goods-img {
      display: block;
      margin: 0 auto;
      width: 686rpx;
      height: 686rpx;
    }
    .goods-price {
      position: absolute;
      bottom: 160rpx;
      right: 20rpx;
      padding: 9rpx 24rpx;
      font-size: 24rpx;
      color: #fff;
      background-color: rgba(172,170,176,0.5);
      border:2px solid rgba(255,255,255,0.5);
      border-radius: 50rpx;
    }
    .goods-price-line {
      position: absolute;
      right: 142rpx;
      bottom: 185rpx;
      width: 35rpx;
      height: 2rpx;
      background-color: #fff;
    }
    .goods-price-Circle1 {
      position: absolute;
      right: 175rpx;
      bottom: 172rpx;
      width: 30rpx;
      height: 30rpx;
      background-color:  rgba(0,0,0,0.3);
      border-radius: 50%;
    }
    .goods-price-Circle2 {
      position: relative;
      top: 9rpx;
      left: 9rpx;
      width: 12rpx;
      height: 12rpx;
      background-color: #fff;
      border-radius: 50%;
    }
    }
}
  .foot{
    margin-top: 25px;
    border: 1px solid green;
    border-top: 2px solid #F3F3F3;
    height: 30px;
  }
  }
</style>


<template>
  <div>
    <el-form :model="formData" ref="formData" label-width="100px" class="demo-formData">
      <p class="title">文章基本信息</p>
      <el-form-item verify label="文章封面图" prop="headImg">
        <p class="describe">提示：本地上传图片大小不能超过2M（图片尺寸比例建议640×378）</p>
        <el-upload
          :action="upImgUrl"
          :data="access_token"
          :show-file-list="false"
          :on-change="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-input class="inputs none imgArea" v-model="imageUrl"></el-input>
        </el-upload>
      </el-form-item>
      <el-form-item verify label="列表展示图" prop="listImg">
        <p class="describe">提示：本地上传图片大小不能超过2M（图片尺寸比例建议300×300）</p>
        <el-upload
          :action="upImgUrl"
          :data="access_token"
          :show-file-list="false"
          :on-change="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadListSuccess"
          :multiple="false"
        >
          <img v-if="imageListUrl" :src="imageListUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-input class="inputs none imgArea" v-model="imageUrl"></el-input>
        </el-upload>
      </el-form-item>
      <el-form-item verify label="文章标题" prop="title">
        <el-input class="inputs" v-model="formData.title"></el-input>
        <span class="describe">字数不超过30</span>
      </el-form-item>
      <el-form-item verify label="文章副标题" prop="description">
        <el-input class="inputs" v-model="formData.description"></el-input>
        <span class="describe">字数不超过50</span>
      </el-form-item>
      <el-form-item verify label="文章排序" prop="sort">
        <el-input class="inputs" v-model="formData.articleSort"></el-input>
        <span class="describe">排序数字(越大越前)</span>
      </el-form-item>
      <el-form-item label="选择场景" verify prop="labelIds">
        <el-select
          class="formItem"
          multiple
          v-model="formData.sceneId"
          placeholder="请选择场景"
          @change="checkScene"
        >
          <el-option
            v-for="item in scene"
            :key="item.sceneId"
            :label="item.name"
            :value="item.sceneId"
          ></el-option>
        </el-select>
        <span class="describe">文章场景，可多选</span>
      </el-form-item>
      <div>
        <p class="title">文章描述/添加产品</p>
      </div>
      <div class="articleDetailInfo">
        <div class="articleDetailBtn">
          <el-button type="primary" @click="articleAddWithDetail">添加文章描述</el-button>
          <el-button type="primary" @click="articleAddWithProduct">添加相关产品</el-button>
        </div>
        <div class="articleAddWithDetail" v-for="(info,index) in articleInfo" :key="index">
          <el-form-item label="描述小标题" prop="articleDetailTitle">
            <el-input class="inputs" v-model="info.articleDetailTitle"></el-input>
            <span class="describe">字数不超过30</span>
          </el-form-item>
          <el-form-item label="描述内容" prop="detailContent">
            <div class="detailContent" v-for="(cont, i) in info.detailContent" :key="i">
              <textarea class="inputs" v-model="cont.txt"></textarea>
              <i class="delete el-icon-delete" v-if="i>0" @click="delCont(index,i)"></i>
            </div>
            <el-button type="primary" size="mini" class="addCont" @click="addCont(index)">添加段落</el-button>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input class="inputs" v-model="info.sort"></el-input>
            <span class="describe">排序数字(越大越前)</span>
          </el-form-item>
          <el-input class="inputs articleType" v-model="info.articleType" type="hidden"></el-input>
          <el-input class="inputs " v-model="info.articleDetailId" type="hidden"></el-input>
        </div>
        <div
          class="articleAddWithProduct"
          v-for="(item,index) in articleProduct"
          :key="'product'+index"
        >
          <el-form-item label="描述小标题" prop="articleDetailTitle">
            <el-input class="inputs" v-model="item.articleDetailTitle"></el-input>
          </el-form-item>
          <el-form-item label="选择产品" verify prop="labelIds">
            <el-button
              class="btn"
              @click="chectProduct(index)"
            >{{item.product.length>0?'已选'+item.product.length+'件商品':'选择商品'}}</el-button>
            <span class="describe">选择产品</span>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input class="inputs" v-model="item.sort"></el-input>
            <span class="describe">排序数字(越大越前)</span>
          </el-form-item>
          <el-input class="inputs articleType" v-model="item.articleType" type="hidden"></el-input>
          <el-input class="inputs " v-model="item.articleDetailId" type="hidden"></el-input>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary" @click="releaseData">{{$route.query.id?'确认修改':'确认发布'}}</el-button>
        <el-button type="primary" @click="previewCode=true;previewData()">预览</el-button>
      </div>



      <el-dialog title="预览" class="previewBox" :visible.sync="previewCode" width="446px">
        <div class="previewBox">
          <div class="Preview" id="Preview">
            <div class="mobile pre-mobile">
              <div class="wins">
                <div class="banner">
                    <img class="banner-img" :src="imageUrl" alt />
                </div>
                <div class="content pre-content">
                  <h2 class="pre-title">{{formData.title}}</h2>
                  <div class="pre-description">
                    <span>|</span>
                    <div class="pre-description-detail">{{formData.description}}</div>
                  </div>
                  <div class="pre-scene">
                    <div class="scene" v-for="(item, index) in  checkedScene" :key="index">{{item.name}}</div>
                  </div>
                  <div class="pre-detail">
                    <block class="detail" v-for="(item, index) in  detailsJson" :key="index">
                          <view class="article-title" v-if="item.articleType === 'ARTICLE'">{{item.articleDetailTitle}}</view>
                          <view class="article-paragraph" v-if="item.articleType === 'ARTICLE'">
                            <view v-if="!item.partList">{{item.detailContent}}</view>
                            <view v-if="item.partList">
                              <view class="partList" v-for="(tt,ii) in item.partList" :key="ii">{{tt}}</view>
                            </view>
                          </view>
                          <view class="article-lable" v-if="item.articleType === 'PRODUCT'">{{item.articleDetailTitle}}</view>
                          <view class="article-goods" v-if="item.articleType === 'PRODUCT'">
                            <image class="goods-img" :src="item.productInfoOne.productImg"></image>
                            <view class="goods-price">
                              ￥{{item.productInfoOne.productPrice/100}}
                            </view>
                            <view class="goods-price-line"></view>
                            <view class="goods-price-Circle1">
                              <view class="goods-price-Circle2"></view>
                            </view>
                          </view>
                        </block>
                    </block>
                  </div>
                  <div class="foot">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>




    </el-form>
    <el-dialog title="选择商品" :visible.sync="productCode" width="90%">
      <product-list v-if="productCode" checkItem @selectData="selectData" :selectArr="selects"></product-list>
    </el-dialog>
  </div>
</template>


<script>
import {
  productLabel,
  produckTabel,
  produckList,
  productScenelList,
  postArticleRelease,
  articleDetail,
  articleEdit
} from "@/api/table";
import productList from "@/views/product/list";

export default {
  name: "ARTICLE_RELEASE",
  components: {
    productList
  },
  data() {
    return {
      formData: {
        articleId:"",
        labelIds: "",
        headImg: "",
        listImg: "",
        title: "",
        description: "",
        memberId: "1",
        articleSort:"",
        sceneId: "",
        detailsJson: [
          {
            articleDetailTitle: "",
            detailContent: "",
            articleType: "",
            sort: 0
          }
        ]
      },
      checkedScene:[],
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
      previewCode:false,
      detailsJson:[],
      productInfoOne:{
        productImg: "",
        productPrice: ""
      }
    };
  },
  created() {
    productScenelList().then(res => {
      this.scene = res.data;
      //解析表单数据
    }),
      produckList().then(res => {
        this.product = res.data.list;
        //解析表单数据
      });

    //如果有id则是修改,这里查询文章详情
    if(this.$route.query.id){
      articleDetail({ articleId: this.$route.query.id })
        .then(res => {
        //处理标签赋值
      res.data.articleInfoModel.sceneId = res.data.articleInfoModel.labelIds.split(",");
      this.formData = res.data.articleInfoModel;
      //图片赋值
      this.imageUrl=this.formData.headImg;
      this.imageListUrl=this.formData.listImg;
      //文章文字内容描述
      var list = [];
      res.data.articleInfos.forEach(item => {
        let info = {
          articleDetailId:item.articleDetailId,
          articleDetailTitle: item.articleDetailTitle,
          articleId: item.articleId,
          articleType: item.articleType,
          detailContent: [],
          sort: item.sort
        };
      var cont =  item.detailContent.split("##")
      cont.forEach(e => {
        info.detailContent.push({txt:e})
      })
        list.push(info);
      })
      this.articleInfo = list;
      let productList=[];
      //文章产品描述
//      this.product = res.data.articleProductses;
      res.data.articleProductses.forEach( item => {
        let info = {
          articleDetailId:item.articleDetailId,
          articleDetailTitle: item.articleDetailTitle,
          articleId: item.articleId,
          articleType: item.articleType,
          detailContent: item.detailContent,
          sort: item.sort,
          product: []
        };
        productList.push(info);
      })
      this.articleProduct = productList;
    })
    };
  },
  methods: {
    //商品筛选：
    dataFilter(name) {
      this.name = name;
      console.log(this.name);
      if (name) {
        this.options = this.product.filter(item => {
          if (
            !!~item.name.indexOf(name) ||
            !!~item.name.toUpperCase().indexOf(name.toUpperCase())
          ) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.options = this.product;
      }
    },
    // 预览选中标签处理
    checkScene(){
//      this.checkedScene.length=0;
    },
    addCont(i){
      this.articleInfo[i].detailContent.push({txt:''})
    },
    delCont(index,i){
      this.articleInfo[index].detailContent.splice(i,1)
    },
    articleAddWithDetail() {
      let info = {
        articleDetailId:"",
        articleDetailTitle: "",
        detailContent: [{ txt: "" }],
        articleType: "ARTICLE",
        sort: ""
      };
      this.articleInfo.push(info);
    },
    articleAddWithProduct() {
      let item = {
        articleDetailId:"",
        articleDetailTitle: "",
        detailContent: "",
        articleType: "PRODUCT",
        sort: "",
        product: []
      };
      this.articleProduct.push(item);
    },
    selectData(val) {
      if (val.length > 1) {
        this.$message.error("一次选择一个产品");
        return;
      }
      this.productCode = false;
      this.articleProduct[this.categoryIndex].product = val;
      this.articleProduct[this.categoryIndex].detailContent = JSON.parse(
        JSON.stringify(val)
      )[0].productId;
    },
    chectProduct(i) {
      this.selects = JSON.parse(JSON.stringify(this.articleProduct[i].product));
      this.categoryIndex = i;
      this.productCode = true;
    },
    handleAvatarSuccess(file, fileList) {},
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
    //修改或者发布文章
    releaseData() {
      //发布文章请求参数组装
      let data = {
        labelIds: "",
        articleId:this.formData.articleId,
        headImg: this.formData.headImg,
        listImg: this.formData.listImg,
        title: this.formData.title,
        description: this.formData.description,
        memberId: this.formData.memberId,
        articleSort:this.formData.articleSort,
        detailsJson: ""
      };
      //labelIds转为1,2,3的格式
      data.labelIds = this.formData.sceneId.join(",");
      //detailsJson数组转为字符串
      //            "[{"articleDetailTitle": "articleDetailTitle", "detailContent": "detailContent", "articleType": "articleType", "sort": "0"},]"
      //组装数据
      let arr = [];
      this.articleInfo.forEach(item => {
        let article = {
          articleDetailId: item.articleDetailId,
          articleDetailTitle: item.articleDetailTitle,
          detailContent: '',
          articleType: item.articleType,
          sort: item.sort
        };
        item.detailContent.forEach(e => {
          if(article.detailContent){
            article.detailContent += '##'+e.txt
          }else{
            article.detailContent = e.txt
          }
        });
        arr.push(article);
      });
      this.articleProduct.forEach(item => {
        let article = {
          articleDetailId: item.articleDetailId,
          articleDetailTitle: item.articleDetailTitle,
          detailContent: item.detailContent,
          articleType: item.articleType,
          sort: item.sort
        };
        arr.push(article);
      });
      data.detailsJson = JSON.stringify(arr);
      console.log(data);
//      return false;
      //如果文章id不为空，那就是修改
      if(data.articleId!=""){
        articleEdit(data)
          .then(result =>{
          if(result.code == 200){
          this.$message({
            message: "编辑成功",
            type: "success"
          });
          setTimeout(() => {
            location.reload();
          this.updataInfo = 2;
          }, 2000);
        }else {
          this.$message.error(result.description);
          this.updataInfo = 2;
        }
        })
      }
      else {
        postArticleRelease(data)
          .then(result => {
          if (result.code == 200) {
          this.$message({
            message: "发布成功",
            type: "success"
          });
          setTimeout(() => {
            location.reload();
          this.updataInfo = 2;
        }, 2000);
        } else {
          this.$message.error(result.description);
          this.updataInfo = 2;
        }
      })
      .catch(err => {
          this.$message.error("网络错误");
        this.updataInfo = 2;
      });
      }
    },
    //组装预览数据
    previewData(){

    },
    getArticleInfoByProductId(productId){
      this.product.forEach( item => {
        if(item.productId == productId){
          let info = {
            productImg: item.headPath,
            productPrice: item.salePrice
          };
        this.productInfoOne = info;
        console.log("info=========="+this.productInfoOne.productImg)
        }
      })
    }
  }
};
</script>
