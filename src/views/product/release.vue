



<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/preview.scss";

.formBox {
  margin-top: 15px;
}
.formItem {
  width: 360px;
}
.formItem.classif {
  width: auto;
  min-width: 360px;
}
.category {
  width: 170px;
  margin-right: 16px;
}
.formItem.postType {
  width: 294px;
}
.stockItem {
  width: 160px;
  margin-right: 15px;
}
.describe {
  color: #999;
  margin-left: 10px;
}

.bodyBox {
  .title {
    margin: 15px 0;
    font-weight: bold;
    color: #333;
  }
}
.detailsBox {
  width: 800px;
  height: 800px;
  // margin: auto;
  border: 1px solid #eeeeee;
  padding: 15px;
  border-radius: 4px;
  .imgList {
    height: 650px;
    width: 100%;
    overflow-y: scroll;
  }
  .btnBox {
    height: 120px;
    cursor: pointer;
  }
  .upImtBtn {
    font-size: 30px;
    border: 1px solid #d1d1d1;
    padding: 15px;
    width: 60px;
    margin: 0 auto 15px;
  }
}
.imgItem {
  width: 100%;
  position: relative;
  min-height: 50px;
  img {
    width: auto;
    max-height: 200px;
    border: 1px solid #eee;
    margin: 0 auto 10px;
    display: block;
  }
  .listBtnBox {
    display: none;
    position: absolute;
    top: 15px;
    right: 15px;
    .listBtnInner {
      display: flex;
      align-items: center;
      .listBtn {
        margin-left: 10px;
      }
    }
  }
}
.imgItem:hover .listBtnBox {
  display: block;
}
.details {
  display: flex;
}
.guidance {
  width: 300px;
  margin-left: 20px;
  .line {
    border-bottom: 1px dashed #666;
    display: block;
    width: 100%;
    margin: 15px 0;
  }
}
.addBtn {
  font-size: 24px;
  border: 1px solid #ccc;
  color: #ccc;
  border-radius: 3px;
}
.classifBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .classifItem {
    position: relative;
    margin-right: 10px;
    margin-bottom: 8px;
    .deleteBtn {
      position: absolute;
      width: 18px;
      height: 18px;
      top: -7px;
      right: 5px;
      background: rgb(255, 0, 0);
      color: #fff;
      border-radius: 50%;
      @include flex-center;
    }
  }
}

.detail_body {
  display: flex;
  flex-wrap: wrap;
  min-height: 300px;
  .item {
    img {
      width: 100%;
    }
  }
}
.Preview {
  width: 446px;
  height: 676px;
  background-image: url("../../assets/preview/mobile-ccs.jpg");
  background-repeat: no-repeat;
  background-position: center;
}
.footer {
  margin-top: 20px;
  @include flex-center;
}
</style>


<template>
  <div class="bodyBox" id="PRODUCT_RELEASE">
    <p>商品基本属性</p>
    <el-form class="formBox" ref="form" :model="sizeForm" label-width="80px">
      <el-form-item label="商品标题" prop="name" verify>
        <el-input
          class="formItem"
          v-model="sizeForm.name"
          maxlength="20"
          placeholder="请输入商品的主标题，20字内"
        ></el-input>
        <span class="describe">商品主标题，详情页加黑字体标题</span>
      </el-form-item>

      <el-form-item label="副标题" prop="description">
        <el-input
          class="formItem"
          v-model="sizeForm.description"
          maxlength="15"
          placeholder="请输入商品的副标题，15字内"
        ></el-input>
        <span class="describe">副标题为商品说明</span>
      </el-form-item>

      <el-form-item label="商品货号" verify prop="number">
        <el-select
          class="formItem"
          v-model="sizeForm.number"
          :disabled="$route.query.id?true:false"
          placeholder="请选择"
        >
          <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <span class="describe">如果您不输入商品货号，系统将自动生成一个唯一的货号</span>
      </el-form-item>

      <el-form-item label="供货价" verify :maxDecimalLength="2" prop="minPrice">
        <el-input class="formItem" v-model="sizeForm.minPrice">
          <template slot="append">元</template>
        </el-input>
        <span class="describe">商品进货价，即为该商品成本价格</span>
      </el-form-item>

      <el-form-item label="原价" verify :maxDecimalLength="2" prop="originPrice">
        <el-input class="formItem" v-model="sizeForm.originPrice">
          <template slot="append">元</template>
        </el-input>
        <span class="describe">商品进货价，即为该商品成本价格</span>
      </el-form-item>

      <el-form-item label="销售价" verify :maxDecimalLength="2" prop="salePrice">
        <el-input class="formItem" v-model="sizeForm.salePrice">
          <template slot="append">元</template>
        </el-input>
        <span class="describe">商品销售价格</span>
      </el-form-item>

      <el-form-item label="场景分类" verify prop="classif">
        <el-select
          class="formItem classif"
          multiple
          v-model="sizeForm.classif"
          placeholder="请选择场景分类"
        >
          <el-option
            v-for="item in classif"
            :key="item.labelId"
            :label="item.name"
            :value="item.labelId"
          ></el-option>
        </el-select>
        <span class="describe">商品所属场景，可多选</span>
      </el-form-item>

      <el-form-item label="商品类别">
        <el-select class="category" v-model="categoryId" @change="changeCategory">
          <el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select
          class="category"
          v-model="sizeForm.categoryId"
          @change="getAttribute"
          placeholder="请选择"
        >
          <el-option
            v-for="item in categoryChild"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="供货商" verify prop="supplyMerchant">
        <el-input v-show="false" v-model="sizeForm.supplyMerchant"></el-input>
        <el-button @click="merchantListCode=true">{{sizeForm.supplyMerchant||'选择供货商'}}</el-button>
      </el-form-item>

      <el-form-item label="库存数量" verify number prop="usableStock">
        <el-input class="formItem" v-model.number="sizeForm.usableStock"></el-input>
      </el-form-item>

      <el-form-item
        v-for="(item, index) in attribute"
        :key="item.name.nameId"
        :label="item.name.name"
        verify
        :prop="item.name.inputType!=='CHECKBOX'?('attrs.'+useless[index]):''"
      >
        <el-input
          class="formItem"
          v-if="item.name.inputType=='TEXT'"
          v-model="sizeForm.attrs[useless[index]]"
        ></el-input>
        <el-checkbox-group
          v-if="item.name.inputType=='CHECKBOX'"
          v-model="sizeForm.attrs[useless[index]]"
          @change="checkStock"
        >
          <el-checkbox-button
            v-for="val in item.valueList"
            :label="val.value"
            :key="val.value"
          >{{val.value}}</el-checkbox-button>
        </el-checkbox-group>
        <el-select
          class="formItem"
          v-if="item.name.inputType=='RADIO'"
          v-model="sizeForm.attrs[useless[index]]"
          placeholder="请选择"
        >
          <el-option
            v-for="child in item.valueList"
            :key="child.value"
            :label="child.value"
            :value="child.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="item in sizeForm.stockList"
        :key="item.label"
        :label="item.label"
        class="stockLabel"
      >
        <el-input class="stockItem" v-model="item.usableStock" placeholder="请输入库存数量">
          <template slot="prepend">库存</template>
        </el-input>
        <el-input class="stockItem" v-model="item.salePrice" placeholder="请输入售价">
          <template slot="prepend">售价</template>
        </el-input>
        <el-input class="stockItem" v-model="item.minPrice" placeholder="请输入进货价">
          <template slot="prepend">进货价</template>
        </el-input>
      </el-form-item>

      <el-form-item
        label="是否包邮"
        verify
        can-be-empty
        :maxDecimalLength="2"
        error-message="邮费最多接受2位小数"
        prop="postPrice"
      >
        <el-checkbox v-model="postType" @change="checkPostType">包邮</el-checkbox>
        <el-input class="formItem postType" :disabled="postType" v-model="sizeForm.postPrice">
          <template slot="prepend">邮费</template>
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="发货时间"
        verify
        prop="postPrice"
      >
        <el-input class="formItem postType" v-model="sizeForm.postTime"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="upImgBox">
      <p class="title">列表封面</p>
      <p class="describe">提示：本地上传图片大小不能超过2M。本类目下您最多可以上传 1 张图片。（图片尺寸比例建议800×800）</p>
      <el-upload
        class="avatar-uploader"
        :action="upImgUrl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :data="access_token"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <p class="title">商品图片信息</p>
      <p class="describe">提示：本地上传图片大小不能超过2M。本类目下您最多可以上传 5 张图片。（图片尺寸比例建议800×800）</p>
      <el-upload
        ref="imgDetails"
        :action="upImgUrl"
        :data="access_token"
        multiple
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-change="handleListenChange"
        :before-upload="beforeAvatarUpload"
        :limit="5"
        :file-list="fileList"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>
    <p class="title">商品详情</p>
    <p class="describe">提示：本地上传图片大小不能超过2M。（图片宽度750）</p>
    <div class="details">
      <div class="detailsBox">
        <div class="imgList">
          <div v-for="(item, index) in detailList" :key="index" class="imgItem">
            <img :src="item.response.data" alt />
            <div class="listBtnBox">
              <div class="listBtnInner">
                <el-button
                  class="listBtn"
                  type="primary"
                  size="mini"
                  @click="moveDetail(true,index)"
                >上移</el-button>
                <el-button
                  class="listBtn"
                  type="primary"
                  size="mini"
                  @click="moveDetail(false,index)"
                >下移</el-button>
                <el-upload
                  class="upload-demo"
                  :action="upImgUrl"
                  :data="access_token"
                  :show-file-list="false"
                  accept="image/jpg, image/jpeg, image/png, image/gif"
                  :on-success="chengeDetailSuccess"
                  list-type="picture"
                >
                  <el-button
                    class="listBtn"
                    @click="chengeDetail(index)"
                    type="primary"
                    size="mini"
                  >替换</el-button>
                </el-upload>
                <el-button class="listBtn" type="primary" size="mini" @click="delDetail(index)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-center direction_column btnBox">
          <el-upload
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
          </el-upload>
        </div>
      </div>
      <div class="guidance">
        <p>发布指导</p>
        <i class="line"></i>
        <p>1、点击“+”可批量上传商品图片；</p>
        <p>2、点击已上传图片可进行“上移”“下移”“替换”“删除”等操作。</p>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="releaseData">{{$route.query.id?'确认修改':'确认发布'}}</el-button>
      <el-button type="primary" @click="previewCode=true">预览</el-button>
    </div>

    <el-dialog title="预览" class="previewBox" :visible.sync="previewCode" width="446px">
      <div class="previewBox">
        <div class="Preview" id="Preview">
          <div class="mobile">
            <div class="wins">
              <div class="layui-carousel" id="p-banner">
                <el-carousel height="150px">
                  <el-carousel-item v-for="(item,index) in fileList" :key="index">
                    <img class="bannerImg" :src="item.response.data" alt />
                  </el-carousel-item>
                </el-carousel>
              </div>
              <div class="content">
                <div class="left">
                  <div class="t1">{{$util.prices(productInfo.salePrice)}}</div>
                  <div class="t3">{{productInfo.name}}</div>
                  <div class="t4">预计24小时之内发货</div>
                  <div
                    class="t4"
                    style="color: #333;"
                  >快递：{{productInfo.postType=='FREE'?'包邮':$util.prices(productInfo.postPrice)}}</div>
                </div>
                <div class="right">
                  <div class="r1">
                    <div class="bo reduce">-</div>
                    <div class="bo inpu">
                      <input type="text" value="1" />
                    </div>
                    <div class="bo increase">+</div>
                  </div>
                  <div class="r2">
                    <div class="collection">
                      <img src="../../assets/preview/details-collection-on.png" />
                    </div>
                    <div class="share">
                      <img src="../../assets/preview/details-share.png" />
                    </div>
                  </div>
                  <div style="clear: both"></div>
                </div>
                <div style="clear: both"></div>
              </div>
              <div class="hc"></div>
              <div class="attribute">
                <div
                  class="li"
                  v-for="(item, index) in attribute"
                  :key="index"
                  v-show="item.name.inputType=='TEXT'"
                >
                  {{item.name.name}}：
                  <span>{{sizeForm.attrs[useless[index]]}}</span>
                </div>
              </div>
              <div class="label">
                <div class="li">
                  <img src="../../assets/preview/details-label1.png" />
                  24小时售后
                </div>
                <div class="li">
                  <img src="../../assets/preview/details-label2.png" />
                  正品承诺
                </div>
                <div class="li">
                  <img src="../../assets/preview/details-label3.png" />
                  质量认证
                </div>
                <div class="li">
                  <img src="../../assets/preview/details-label4.png" />
                  7天退换
                </div>
              </div>
              <div class="details">
                <div class="h1">商品详情</div>
                <div class="cont">
                  <img
                    v-for="(item, index) in detailList"
                    :key="index"
                    :src="item.response.data"
                    width="100%"
                  />
                </div>
              </div>
              <div style="width: auto;height: 100px;"></div>
              <div class="p_footer">
                <div class="p1">
                  <img src="../../assets/preview/product-shop.png" />
                </div>
                <div class="p2">
                  <div class="number">共1件</div>
                  <p>￥0.00</p>
                </div>
                <div class="p4">立即购买</div>
                <div class="p3">加入购物车</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <el-dialog title="选择供货商" :visible.sync="merchantListCode" width="70%">
      <merchant-list checkItem @upSelect="upSelect" :selectList="multipleSelection"></merchant-list>
    </el-dialog>
    <el-dialog title="商品详情图" :visible.sync="detailsLog" width="70%">
      <div class="detail_body">
        <div v-for="(item, index) in detailList" :key="index" class="item">
          <img :src="item.response.data" alt />
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  produckTabel,
  produckTree,
  produckAllAttribute,
  produckInfoRelease,
  produckInfoUpdate,
  produckBatchAdd,
  produckInfoDetails
} from "@/api/table";
import merchantList from "@/views/merchant/list";

export default {
  name: "PRODUCT_RELEASE",
  data() {
    return {
      sizeForm: {
        name: "",
        description: "",
        number: "P",
        minPrice: "",
        originPrice: "",
        salePrice: "",
        classif: [],
        categoryId: "",
        supplyMerchant: "",
        usableStock: "",
        postPrice: "",
        postTime: '24小时', //发货时间，默认24小时
        attrs: {}, // 存放商品属性值，提交之前处理一次。
        stockList: [] // 库存属性处理完成后存放
      },
      productInfo: {}, //商品基本属性提交成功后储存
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      merchantListCode: false,
      detailsLog: false,
      postType: true,
      options: ["P", "F", "S", "W"],
      classif: [],
      category: [],
      categoryId: "",
      categoryChild: [],
      attribute: [],
      useless: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m"
      ],
      // 无实际意义，渲染商品属性时用来绑定数据
      updataInfo: 0, // 保存商品基本属性状态，0 = 参数未提交； 1 = 参数正在提交，不可重复提交； 2 = 参数已提交完毕，如需再次提交，将参数重置为0。
      upImgUrl: process.env[this.$base] + "/medias/image/upload",
      access_token: {
        access_token: this.$store.getters.token
      },
      fileList: [], // 商品图片信息列表
      detailList: [], // 商品详情图片列表
      changeIndex: 0, // 商品详情列表替换图片时，存储需要替换的图片索引。
      previewCode: false,
      multipleSelection: [],
      detailInfo: {}
    };
  },
  components: {
    merchantList
  },
  created() {
    var self = this;
    var obj = {};
    this.useless.forEach(e => {
      obj[e] = "";
    });
    // 给sizeForm下的attrs赋值，用作数据绑定。
    this.$set(this.sizeForm, "attrs", obj);

    if (this.$route.query.id) {
      // 编辑，初始化数据
      produckInfoDetails({ productId: this.$route.query.id })
        .then(res => {
          // this.sizeForm = res.data.info
          if (res.code == 200) {
            // 处理图片信息
            res.data.details.forEach(e => {
              if (e.position == "LIST") {
                this.imageUrl = e.content;
              } else if (e.position == "BANNER") {
                this.fileList.push({
                  response: { code: 200, data: e.content },
                  url: e.content
                });
              } else if (e.position == "DETAIL") {
                this.detailList.push({
                  response: { code: 200, data: e.content }
                });
              }
            });
            this.sizeForm.name = res.data.info.name;
            this.sizeForm.description = res.data.info.description;
            this.sizeForm.number = res.data.info.number;
            this.sizeForm.supplyMerchant = res.data.info.supplyMerchant;
            this.sizeForm.usableStock = res.data.info.usableStock;
            this.sizeForm.minPrice = this.$util.prices(res.data.info.minPrice);
            this.sizeForm.originPrice = this.$util.prices(
              res.data.info.originPrice
            );
            this.sizeForm.salePrice = this.$util.prices(
              res.data.info.salePrice
            );
            var lab = res.data.info.lableIds;
            lab =
              lab.substring(lab.length - 1) == ","
                ? lab.substring(0, lab.length - 1)
                : lab;
            this.sizeForm.classif = lab.split(",");
            if (res.data.info.postType == "PAY") {
              this.sizeForm.postPrice = this.$util.prices(
                res.data.info.postPrice
              );
              this.postType = false;
            }
            this.detailInfo = res.data;
            this.getChecks();
          }
        })
        .catch(err => {});
    } else {
      this.getChecks();
    }
  },
  methods: {
    getChecks() {
      produckTabel().then(result => {
        this.classif = result.data;
      });
      produckTree().then(result => {
        try {
          this.category = result.data;
          if (this.$route.query.id) {
            // 编辑时，取商品信息下的类别
            result.data.forEach(e => {
              if (e.id == this.detailInfo.info.categoryId) {
                this.categoryId = e.id;
                this.categoryChild = e.children;
                this.sizeForm.categoryId = e.children[0].id;
              }
              e.children.forEach(i => {
                if (i.id == this.detailInfo.info.categoryId) {
                  this.categoryId = e.id;
                  this.categoryChild = e.children;
                  this.sizeForm.categoryId = i.id;
                }
              });
            });
          } else {
            // 发布新商品时，默认取第一个类别
            this.categoryId = result.data[0].id;
            this.categoryChild = result.data[0].children;
            this.sizeForm.categoryId = result.data[0].children[0].id;
          }
          this.getAttribute(this.sizeForm.categoryId);
        } catch (error) {}
      });
    },
    changeCategory(val) {
      for (let i = 0; i < this.category.length; i++) {
        if (this.category[i].id == val) {
          this.categoryChild = this.category[i].children;
          this.sizeForm.categoryId = this.category[i].children[0].id;
          this.getAttribute(this.sizeForm.categoryId);
          break;
        }
      }
    },
    checkStock() {
      // 处理库存属性
      var data = {};
      for (const k in this.sizeForm.attrs) {
        if (
          this.sizeForm.attrs[k].length > 0 &&
          typeof this.sizeForm.attrs[k] !== "string"
        ) {
          data[k] = this.sizeForm.attrs[k];
        }
      }
      var stockList = [];
      if (Object.keys(data).length > 0) {
        stockList = this.$util.arrange(data);
      }
      stockList.forEach(e => {
        var str = "";
        var propertie = {};
        for (const k in e) {
          if (e[k]) {
            str +=
              this.attribute[this.useless.indexOf(k)].name.name +
              "：" +
              e[k] +
              "；";
            propertie[this.attribute[this.useless.indexOf(k)].name.name] = e[k];
            delete e[k];
          }
        }
        e.propertie = JSON.stringify(propertie);
        e.label = str;
        e.usableStock = "";
        e.salePrice = "";
        e.minPrice = "";
      });
      this.sizeForm.stockList = stockList;
    },
    getAttribute(id) {
      produckAllAttribute({ categoryId: id }).then(result => {
        try {
          var self = this,
            isDetail = false;
          function attrs() {
            if (
              self.detailInfo.saleAttributes &&
              self.detailInfo.saleAttributes.length > 0
            ) {
              self.detailInfo.saleAttributes.forEach((e, i) => {
                if (e.dataType == "STOCK") {
                  self.sizeForm.attrs[self.useless[i]] = e.value.split(",");
                } else {
                  self.sizeForm.attrs[self.useless[i]] = e.value;
                }
              });
            }
            if (
              self.detailInfo.productStockModelList &&
              self.detailInfo.productStockModelList.length > 0
            ) {
              self.detailInfo.productStockModelList.forEach(e => {
                var label = JSON.parse(e.stockProperties);
                var str = "";
                for (const k in label) {
                  str += k + "：" + label[k] + "；";
                }
                var objs = {
                  propertie: e.stockProperties,
                  label: str,
                  usableStock: e.usableStock,
                  salePrice: self.$util.prices(e.salePrice),
                  minPrice: self.$util.prices(e.minPrice)
                };
                self.sizeForm.stockList.push(objs);
              });
            }
          }
          // 初始化attrs
          this.useless.forEach(e => {
            this.sizeForm.attrs[e] = "";
          });
          // 初始化规格列表
          self.sizeForm.stockList = [];
          result.data.forEach((e, i) => {
            // 如果是CheckBox类型的属性，则对应绑定值修改为数组类型。
            if (e.name.inputType == "CHECKBOX") {
              this.sizeForm.attrs[this.useless[i]] = [];
            } else {
              this.sizeForm.attrs[this.useless[i]] = "";
            }
            if (this.$route.query.id) {
              if (this.detailInfo.info.categoryId == e.name.categoryId) {
                isDetail = true;
              }
            }
          });
          if (isDetail) {
            attrs();
          }
        } catch (error) {
          console.log(error);
        }
        this.attribute = result.data;
      });
    },
    checkPostType(val) {
      this.sizeForm.postPrice = "";
    },
    releaseData() {
      // 确认发布
      if (this.updataInfo == 0) {
        this.$message.error("请先提交商品基本信息");
        return;
      }
      if (!this.imageUrl) {
        this.$message.error("请先上传商品列表封面");
        return;
      }
      if (!this.fileList.length) {
        this.$message.error("请先上传商品图片信息");
        return;
      }
      if (!this.detailList.length) {
        this.$message.error("请先上传商品详情图");
        return;
      }
      if (this.updataInfo == 1) {
        return;
      }
      this.updataInfo = 1;
      try {
        var data = {
          productId: this.productInfo.productId,
          details: []
        };
        data.details.push({
          position: "LIST",
          content: this.imageUrl,
          sort: "1"
        });
        this.fileList.forEach((e, i) => {
          data.details.push({
            position: "BANNER",
            content: e.response.data,
            sort: i
          });
        });
        this.detailList.forEach((e, i) => {
          data.details.push({
            position: "DETAIL",
            content: e.response.data,
            sort: i
          });
        });
        data.details = JSON.stringify(data.details);
        produckBatchAdd(data)
          .then(result => {
            if (result.code == 200) {
              this.$message({
                message: this.$route.query.id ? "修改成功" : "发布成功",
                type: "success"
              });
              location.reload();
              this.updataInfo = 2;
            } else {
              this.$message.error(result.description);
              this.updataInfo = 2;
            }
          })
          .catch(err => {
            this.$message.error("网络错误");
            this.updataInfo = 2;
          });
      } catch (error) {
        this.updataInfo = 2;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (this.updataInfo == 2) {
          this.$confirm(
            "当前填写数据已提交，再次点击即重新提交，是否继续？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.updataInfo = 0;
              this.submitForm(formName);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
          return;
        }
        if (valid) {
          if (this.updataInfo == 1) {
            return;
          }
          this.updataInfo = 1;
          try {
            var data = JSON.parse(JSON.stringify(this.sizeForm));
            data.minPrice = data.minPrice * 100;
            data.originPrice = data.originPrice * 100;
            data.salePrice = data.salePrice * 100;
            data.postPrice = this.postType ? 0 : data.postPrice * 100;
            data.postType = this.postType ? "FREE" : "PAY";
            data.attributes = [];
            // 处理属性值
            for (let index = 0; index < this.attribute.length; index++) {
              var k = this.useless[index];
              if (data.attrs[k]) {
                var obj = {};
                obj.nameId = this.attribute[index].name.nameId;
                if (this.attribute[index].name.inputType == "TEXT") {
                  // 输入框的数据类型是字符串，多选、单选的数据类型是object
                  obj.valueId = data.attrs[k];
                  // 输入框类型时，取输入的值作为valueid
                } else if (this.attribute[index].name.inputType == "CHECKBOX") {
                  obj.valueId = "";
                  data.attrs[k].forEach(e => {
                    this.attribute[index].valueList.forEach(n => {
                      if (n.value == e) {
                        obj.valueId += n.valueId + ",";
                      }
                    });
                  });
                  obj.valueId = obj.valueId.slice(0, obj.valueId.length - 1);
                } else if (this.attribute[index].name.inputType == "RADIO") {
                  obj.valueId = "";
                  this.attribute[index].valueList.forEach(n => {
                    if (n.value == data.attrs[k]) {
                      obj.valueId = n.valueId;
                    }
                  });
                }
                data.attributes.push(obj);
              }
            }
            data.properties = [];
            // 处理库存属性数据
            data.stockList.forEach(e => {
              var obj = {
                propertie: e.propertie,
                usableStock: e.usableStock,
                salePrice: e.salePrice * 100,
                minPrice: e.minPrice * 100
              };
              data.properties.push(obj);
            });
            data.attributes = JSON.stringify(data.attributes);
            data.properties = JSON.stringify(data.properties);
            data.lableIds = "";
            data.classif.forEach(e => {
              if (data.lableIds) {
                data.lableIds += "," + e;
              } else {
                data.lableIds = e;
              }
            });
            delete data.classif;
            delete data.attrs;
            delete data.stockList;
            if (this.$route.query.id) {
              data.productId = this.$route.query.id;
              produckInfoUpdate(data)
                .then(result => {
                  this.productInfo = result.data;
                  this.updataInfo = 2;
                  this.$message({
                    message: "保存成功",
                    type: "success"
                  });
                })
                .catch(err => {
                  this.$message.error("提交失败");
                  this.updataInfo = 0;
                });
            } else {
              produckInfoRelease(data)
                .then(result => {
                  if (result.code == 200) {
                    this.productInfo = result.data.productInfo;
                    this.updataInfo = 2;
                    this.$message({
                      message: "保存成功",
                      type: "success"
                    });
                  } else {
                    this.$message.error(result.description);
                    this.updataInfo = 0;
                  }
                })
                .catch(err => {
                  this.$message.error("提交失败");
                  this.updataInfo = 0;
                });
            }
          } catch (error) {
            this.updataInfo = 0;
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
    handleAvatarSuccess(res, file) {
      // 上传图片成功
      console.log(res);
      if (res.code == 200) {
        this.imageUrl = res.data;
      } else {
        this.$message.error(res.description);
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
    chengeDetail(i) {
      this.changeIndex = i;
    },
    upSelect(val) {
      this.multipleSelection = val;
      this.sizeForm.supplyMerchant = val[0].nickName;
      this.merchantListCode = false;
    },
    chengeDetailSuccess(file, fileList) {
      // 替换时，先保存需要替换图片的索引值，图片上传成功后，修改数组里的信息
      var self = this;
      var obj = JSON.parse(JSON.stringify(fileList));
      if (obj.response.code == 200) {
        self.$set(self.detailList, self.changeIndex, obj);
      } else {
        this.$message.error("替换图片失败");
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      // 查看原图
    },
    async handleListenChange(file, fileList) {
      var self = this;
      setTimeout(() => {
        var list = [];
        try {
          fileList.forEach(e => {
            if (e.response.code == 200) {
              list.push(e);
            }
          });
          self.fileList = list;
        } catch (error) {}
      }, 100);
    },
    detailListenChange(file, fileList) {
      var self = this;
      setTimeout(() => {
        var list = [];
        try {
          fileList.forEach(e => {
            if (e.response.code == 200) {
              list.push(e);
            }
          });
          self.detailList = list;
        } catch (error) {}
      }, 100);
    },
    delDetail(i) {
      this.detailList.splice(i, 1);
    },
    moveDetail(type, index) {
      var self = this;
      function swapArray(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
      }
      function zIndexUp(arr, index) {
        if (index != 0) {
          swapArray(arr, index, index - 1);
        } else {
          self.$message.error("已经处于置顶，无法上移");
        }
      }
      function zIndexDown(arr, index) {
        //下移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
        if (index + 1 != arr.length) {
          swapArray(arr, index, index + 1);
        } else {
          self.$message.error("已经处于置底，无法下移");
        }
      }

      if (type) {
        zIndexUp(this.detailList, index);
      } else {
        zIndexDown(this.detailList, index);
      }
    }
  }
};
</script>








