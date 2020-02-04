



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
  color: #333;
  p{
    width: 200px;
    font-size: 16px;
    color: #409EFF;
    span{
      margin-left: 16px;
      color: #000;
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

.attributeBox {
  padding-bottom: 1px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  .attribute_title {
    padding: 12px;
    order: 2;
  }
  .attribute_item.SALE {
    order: 1;
  }
  .attribute_item.STOCK {
    background: #f5f5f5;
    order: 3;
    margin-bottom: 0;
    padding-bottom: 22px;
  }
  .attribute_table {
    order: 4;
  }
  .categoryAdd {
    order: 5;
    width: 120px;
    margin-top: 15px;
    margin-left: 20px;
  }
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
.delAttr {
  font-size: 24px;
  margin-left: 15px;
}
.cascader{
  width: 360px;
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

      <el-form-item label="所属场景" verify prop="sceneId">
        <el-select
          class="formItem"
          multiple
          v-model="sizeForm.sceneId"
          placeholder="请选择场景分类"
          @change="getClassif"
        >
          <el-option
            v-for="item in scene"
            :key="item.sceneId"
            :label="item.name"
            :value="item.sceneId"
          ></el-option>
        </el-select>
        <span class="describe">商品所属场景，可多选</span>
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

      <el-form-item label="商品类别" verify prop="categoryId">
         <el-cascader
          class="cascader"
          v-model="sizeForm.categoryId"
          :options="category"
          :props="{ expandTrigger: 'hover',value:'id',label:'name' }"
          >
        </el-cascader>
      </el-form-item>

      <el-form-item label="供货商" verify prop="supplyMerchant">
        <el-input v-show="false" v-model="sizeForm.supplyMerchant"></el-input>
        <el-button @click="merchantListCode=true">{{sizeForm.supplyMerchant||'选择供货商'}}</el-button>
      </el-form-item>

      <el-form-item label="库存数量" verify number prop="usableStock">
        <el-input class="formItem" v-model.number="sizeForm.usableStock"></el-input>
      </el-form-item>

      <div class="attributeBox">
        <p class="attribute_title">库存属性部分</p>
        <el-form-item
          v-for="(item, index) in sizeForm.attrList"
          v-show="item.inputType!=='RADIO'"
          :key="item.name"
          :label="item.name"
          :verify="item.isNullable=='Y'?'verify':undefined"
          :prop="'attrList.'+index+'.value'"
          class="attribute_item"
          :class="item.dataType"
        >
          <el-input class="formItem" v-if="item.dataType=='SALE'" v-model="item.value"></el-input>
          <el-checkbox-group
            style="float:left"
            v-if="item.dataType=='STOCK'"
            v-model="item.value"
            @change="checkStock()"
          >
            <el-checkbox-button v-for="val in item.valueList" :label="val" :key="val">{{val}}</el-checkbox-button>
          </el-checkbox-group>
          <i
            class="delAttr el-icon-delete"
            @click="delAttr(index)"
          ></i>
        </el-form-item>
        <el-table
          class="attribute_table"
          v-show="sizeForm.stockList&&sizeForm.stockList.length>0"
          :data="sizeForm.stockList"
          border
          style="width: 100%"
        >
          <el-table-column
            align="center"
            v-for="(item, index) in tableHead"
            :prop="getKey(item,index)"
            :key="index"
            :label="item"
          ></el-table-column>
          <el-table-column align="center" width="200" label="库存">
            <template slot-scope="scope">
              <el-input class="stockItem" v-model="scope.row.usableStock" placeholder="请输入库存数量"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" width="200" label="售价">
            <template slot-scope="scope">
              <el-input class="stockItem" v-model="scope.row.salePrice" placeholder="请输入售价"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" width="200" label="进货价">
            <template slot-scope="scope">
              <el-input class="stockItem" v-model="scope.row.minPrice" placeholder="请输入进货价"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" width="200" label="原价">
            <template slot-scope="scope">
              <el-input class="stockItem" v-model="scope.row.originPrice" placeholder="请输入原价"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" class="categoryAdd" @click="categoryAdd=true">添加属性</el-button>
      </div>

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
      <el-form-item label="发货时间" verify int prop="postTime">
        <el-input class="formItem postType" type="number" v-model.number="sizeForm.postTime">
          <template slot="append">小时</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品编号" v-if="sizeForm.number">
        {{productInfo.number||sizeForm.number}}
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
        :on-remove="handleRemove"
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
                <!-- <div
                  class="li"
                  v-for="(item, index) in sizeForm.attrList"
                  :key="index"
                  v-show="item.name.inputType=='TEXT'"
                >
                  {{item.name.name}}：
                  <span>{{sizeForm.attrList[useless[index]]}}</span>
                </div>-->
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

    <el-dialog title="新增属性" :visible.sync="categoryAdd" width="60%">
      <el-form :model="attribute" ref="attribute" label-width="100px" class="addAttribute">
        <el-form-item label="属性名" verify prop="name">
          <el-input class="inputs" v-model="attribute.name"></el-input>
        </el-form-item>
        <el-form-item label="商品属性" prop="dataType">
          <el-radio v-model="attribute.dataType" label="STOCK">库存属性</el-radio>
          <el-radio v-model="attribute.dataType" label="SALE">普通属性</el-radio>
        </el-form-item>
        <el-form-item label v-if="attribute.dataType=='STOCK'">
          <div class="inputBox" v-for="(item, index) in typeItem" :key="index">
            <el-input class="inputs" placeholder="请输入候选项" v-model="item.value"></el-input>
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
          <el-button type="primary" @click="addAttr('attribute')">添加</el-button>
          <el-button @click="resetForm('attribute')">重置</el-button>
        </el-form-item>
      </el-form>
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
  productScenelList,
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
        sceneId: [],
        categoryId: [],
        supplyMerchant: "",
        usableStock: "",
        postPrice: "",
        postTime: 24, //发货时间，默认24,单位小时
        attrList: [], // 商品属性
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
      scene: [],
      category: [],
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
      ], // 无实际意义，渲染商品属性时用来绑定数据
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
      detailInfo: {},
      tableHead: [],
      categoryAdd: false,
      attribute: {
        dataType: "STOCK",
        isNullable: "Y",
        name: '',
        sort: '',
        value:[]
      },
      typeItem: [{ value: "" }],
    };
  },
  components: {
    merchantList
  },
  created() {
    var self = this;
    productScenelList()
      .then(res => {
        this.scene = res.data;
      })
      .catch(err => {});
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
            var scene_id = res.data.info.sceneIds;
            scene_id =
              scene_id.substring(scene_id.length - 1) == ","
                ? scene_id.substring(0, scene_id.length - 1)
                : scene_id;
            this.sizeForm.sceneId = scene_id?scene_id.split(","):[];
            this.getClassif(this.sizeForm.sceneId);
            var lab = res.data.info.labelIds;
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
            res.data.allAttributes.forEach(e => {
              if(e.dataType == 'STOCK'){
                e.valueList = e.value = e.value.split(',')
              }
            });
            this.sizeForm.attrList = res.data.allAttributes

            if (
              res.data.productStockModelList &&
              res.data.productStockModelList.length > 0
            ){
              var tableHead = [];
              res.data.productStockModelList.forEach(e => {
                var label = JSON.parse(e.stockProperties);
                var str = "";
                var objs = {
                  propertiesValue: e.stockProperties,
                  label: str,
                  usableStock: e.usableStock,
                  salePrice: self.$util.prices(e.salePrice),
                  minPrice: self.$util.prices(e.minPrice),
                  originPrice: self.$util.prices(e.originPrice),
                };

                for (const k in label) {
                  str += k + "：" + label[k] + "；";
                  if (tableHead.indexOf(k) == -1) {
                    tableHead.push(k);
                  }
                  for (let i = 0; i < res.data.allAttributes.length; i++) {
                    if (k == res.data.allAttributes[i].name) {
                      objs[self.useless[i]] = label[k];
                      break;
                    }
                  }
                }
                self.sizeForm.stockList.push(objs);
              });
              self.tableHead = tableHead;
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
    addAttr(formName) {
      var self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.attribute));
          var v = ''
          if (data.dataType == "STOCK") {
            v = []
            var code = true;
            var list = []
            this.typeItem.forEach(e => {
              if(e.value==""){
                code = false
              }else{
                list.push(e.value)
              }
            });
            data.valueList = list
            if(this.typeItem.length==0){
              code = false
            }
            if (!code) {
              this.$message.error("候选项不能为空");
              return;
            }
          }
          data.value = v
          this.sizeForm.attrList.push(data)
          this.categoryAdd = false
          this.resetForm('attribute')
          this.checkStock()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    valueChange(i) {
      if (i == 0) {
        this.typeItem.push({ value: "" });
      } else {
        this.typeItem.splice(i, 1);
      }
    },
    delAttr(i){
      this.sizeForm.attrList.splice(i, 1);
      this.checkStock()
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
    getChecks() {
      produckTree().then(result => {
        try {
          this.category = result.data;
          var ids = []
          // 编辑时，取商品信息下的类别
          result.data.forEach((e,a) => {
            e.children.forEach((i,b) => {
              i.children.forEach((t,c) => {
                if (this.$route.query.id){
                  if (t.id == this.detailInfo.info.categoryId) {
                    ids = [e.id,i.id,t.id]
                  }
                }else{
                  // 发布商品时，取第一个有效值
                  if(ids.length==0){
                    ids = [e.id,i.id,t.id]
                  }
                }
              });
            });
          });
          this.sizeForm.categoryId = ids
          var id = ids[2]
          if(id){
            this.getAttribute(id);
          }
        } catch (error) {
          console.log(error);
        }
      });
    },
    getKey(item, index) {
      var k = "";
      for (let i = 0; i < this.sizeForm.attrList.length; i++) {
        if (this.sizeForm.attrList[i].name == item) {
          k = this.useless[i];
          break;
        }
      }
      return k;
    },
    checkStock() {
      // 处理库存属性
      var data = {};
      var tableHead = [];
      this.sizeForm.attrList.forEach((e,i) => {
        if(e.dataType=='STOCK'&&e.value.length>0){
          data[this.useless[i]] = e.value;
        }
      });
      var stockList = [];
      if (Object.keys(data).length > 0) {
        stockList = this.$util.arrange(data);
      }
      stockList.forEach(e => {
        var propertiesValue = {};
        for (const k in e) {
          if (e[k]) {
            var name = this.sizeForm.attrList[this.useless.indexOf(k)].name;
            if (tableHead.indexOf(name) == -1) {
              tableHead.push(name);
            }
            propertiesValue[name] = e[k];
          }
        }
        e.propertiesValue = JSON.stringify(propertiesValue);
        e.usableStock = "";
        e.salePrice = "";
        e.minPrice = "";
        e.originPrice = "";
      });
      this.tableHead = tableHead;
      this.sizeForm.stockList = stockList;
    },
    getAttribute(id) {
      if (this.$route.query.id) {
        return;
      }
      produckAllAttribute({ categoryId: id }).then(result => {
        var list = [];
        result.data.forEach(e => {
          var obj = e.name,
            valList = [];
          e.valueList.forEach(v => {
            valList.push(v.value);
          });
          obj.valueList = valList;
          if(obj.dataType=='STOCK'){
            obj.value = []
          }else{
            obj.value = ''
          }
          list.push(obj);
        });
        this.sizeForm.attrList = list;
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
            data.categoryId = data.categoryId[2]
            // 处理属性值
            for (let index = 0; index < this.sizeForm.attrList.length; index++) {
              var k = this.useless[index];
              var item = this.sizeForm.attrList[index]
              var obj = {};
              obj.attributeName = item.name;
              obj.attributeValue = ""
              if (item.dataType == "SALE") {
                obj.attributeValue = item.value;
                // 输入框类型时，取输入的值作为valueid
              } else if (item.dataType == "STOCK") {
                item.value.forEach(n => {
                  obj.attributeValue += n + ",";
                });
                obj.attributeValue = obj.attributeValue.slice(0, obj.attributeValue.length - 1);
              }
              obj.sort = item.sort
              obj.isNullable = item.isNullable
              obj.attributeType = item.dataType
              data.attributes.push(obj);
            }
            data.propertiesValue = [];
            // 处理库存属性数据
            data.stockList.forEach(e => {
              var obj = {
                propertiesValue: e.propertiesValue,
                usableStock: e.usableStock,
                salePrice: e.salePrice * 100,
                minPrice: e.minPrice * 100,
                originPrice: e.originPrice * 100,
              };
              data.propertiesValue.push(obj);
            });
            data.attributes = JSON.stringify(data.attributes);
            data.properties = JSON.stringify(data.propertiesValue);
            data.labelIds = "";
            data.classif.forEach(e => {
              if (data.labelIds) {
                data.labelIds += "," + e;
              } else {
                data.labelIds = e;
              }
            });
            data.sceneIds = "";
            data.sceneId.forEach(e => {
              if (data.sceneIds) {
                data.sceneIds += "," + e;
              } else {
                data.sceneIds = e;
              }
            });
            delete data.classif;
            delete data.attrList;
            delete data.sceneId;
            delete data.stockList;
            delete data.propertiesValue;
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
      if(formName=='attribute'){
        this.typeItem = [{ value: "" }];
      }
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
    handleRemove(file, fileList) {
      console.log(fileList,'fileListfileListfileList');
      this.fileList = fileList;
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








