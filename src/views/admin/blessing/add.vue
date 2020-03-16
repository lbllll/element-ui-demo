<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .bodyBox {
  }
  .bodyBox >.title {
    margin: 15px 0;
    font-weight: bold;
    color: #333;
  }
  .formBox {
    margin-top: 15px;
  }
  .formBox .title {
    margin: 15px 0;
    font-weight: bold;
    color: #333;
  }
  .formItem {
    width: 360px;
  }
  .describe {
    color: #999;
    margin-left: 10px;
  }
  .footer {
    margin-top: 20px;
  @include flex-center;
  }
</style>
<template>
    <div class="bodyBox">
      <el-form ref="form" :model="formData" :rules="rules" class="formBox" label-width="80px">
        <p class="title">作品基本信息</p>

        <el-form-item label="作品类型"  verify prop="resourceType">
          <el-select
            class="selectStyle"
            v-model="formData.resourceType"
            prop="resourceType"
            placeholder="作品类型"
            size="small"
            @change="checkCardType"
          >
            <el-option
              v-for="item in resourceTypes"
              :key="item.resourceType"
              :label="item.name"
              :value="item.resourceType"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="作品类别" verify prop="resourceKind">
          <el-select
            class="selectStyle"
            v-model="formData.resourceKind"
            prop="resourceKind"
            placeholder="作品类别"
            size="small"
            @change="checkKind"
          >
            <el-option
              v-for="item in resourceKinds"
              :key="item.resourceKind"
              :label="item.name"
              :value="item.resourceKind"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item verify label="封面图" prop="resourceCoverImageUrlUid">
          <p class="describe">提示：本地上传图片大小不能超过1M【图片尺寸比例建议：贺卡(9：16)；插画：(16：9)；条漫：(1：1)】</p>
          <el-upload
            :action="upImgUrl"
            :data="access_token"
            :show-file-list="false"
            :on-change="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccessCover"
          >
            <img v-if="resourceCoverImageUrl" :src="resourceCoverImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-input class="inputs none imgArea" v-model="formData.resourceCoverImageUrlUid"></el-input>
          </el-upload>
        </el-form-item>

        <el-form-item verify label="资源文件" prop="resourceFileUid">
          <!--上传图片文件-->
          <div v-if="formData.resourceType !== 4">
            <p class="describe">提示：本地上传图片大小不能超过1M</p>
            <el-upload
              :action="upImgUrl"
              :data="access_token"
              :show-file-list="false"
              :on-change="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-success="uploadSuccess"
            >
              <img v-if="resourceImageUrl" :src="resourceImageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-input class="inputs none imgArea" v-model="formData.resourceFileUid"></el-input>
            </el-upload>
          </div>
          <!--上传非图片文件-->
          <div v-if="formData.resourceType === 4">
            <el-upload
              :action="uploadVideo"
              :data="access_token"
              :before-upload="beforeAvatarUploadVideo"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="uploadSuccessVideo"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <el-input class="inputs none imgArea" v-model="formData.resourceFileUid"></el-input>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="作品名" prop="resourceName" verify>
          <el-input
            class="formItem"
            v-model="formData.resourceName"
            maxlength="20"
            placeholder="请输入作品名，20字内"
          ></el-input>
          <span class="describe">长度不超过20</span>
        </el-form-item>
        <el-form-item label="作品描述" prop="resourceDesc" verify>
          <el-input
            class="formItem"
            v-model="formData.resourceDesc"
            maxlength="100"
            placeholder="请输入作品描述"
          ></el-input>
          <span class="describe">长度不超过100</span>
        </el-form-item>
<!--        <el-form-item label="选择标签" verify prop="resourceLabelTreeCodes">
          <div class="header">选择标签</div>
          <el-tree
            ref="tree"
            show-checkbox
            :data="labelList"
            node-key="labelTreeCode"
            :props="defaultProps"
            :default-checked-keys="this.curLabels"
            :default-expanded-keys="this.curLabels"
            @check-change="checkLabels"
            :accordion="true"
          >
          </el-tree>
          <div style="margin-top: 20px">
            <el-button type="primary" @click="checkAllTree" size="mini">全选</el-button>
            <el-button @click="cancelAllTree" size="mini">取消全选</el-button>
          </div>
        </el-form-item>-->
        <el-form-item label="祝福语" prop="resourceDefaultBlessingText" verify>
          <el-input
            class="formItem"
            v-model="formData.resourceDefaultBlessingText"
            maxlength="100"
            placeholder="请输入默认祝福语"
          ></el-input>
          <span class="describe">长度不超过100</span>
        </el-form-item>

<!--        <el-form-item label="设置标记" verify prop="resourceMarkType">
          <el-select
            class="formItem"
            v-model="formData.resourceMarkType"
            placeholder="请选择标记内容"
            @change="checkMarker"
          >
            <el-option
              v-for="item in markerList"
              :key="item.markerId"
              :label="item.markerName"
              :value="item.markerId"
            ></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item label="选择作者"  prop="resourceAuthorUid" verify>
          <el-select
            class="formItem"
            v-model="formData.resourceAuthorUid"
            placeholder="请选择作者"
            @change="checkAuthor"
          >
            <el-option
              v-for="item in authorList"
              :key="item.memberUid"
              :label="deCodes(item.wechatNickName)"
              :value="item.memberUid"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="绑定音乐"  prop="resourceMusicUid">
          <el-select
            class="formItem"
            v-model="formData.resourceMusicUid"
            placeholder="请选择音乐"
            @change="checkMusic"
          >
            <el-option
              v-for="item in musicList"
              :key="item.musicId"
              :label="item.musicName+'--歌手：'+item.musicSinger"
              :value="item.musicId"
            ></el-option>
          </el-select>
        </el-form-item>
<!--   发布按钮     -->
        <div class="footer">
          <el-button type="primary" @click="releaseData">{{$route.query.id?'确认修改':'确认发布'}}</el-button>
          <el-button @click="cancelAndBack">取  消</el-button>
<!--          <el-button type="primary" @click="previewData()">预览</el-button>-->
        </div>
      </el-form>
    </div>
</template>

<script>
    import {
        blessingUpdate,
        blessingAdd,
        musicList,
        labelListAll,
        memberList,
        labelListByBusinessType
    } from "@/api/table";
  export default {
      name: "BLESSING_ADD",
      components: {},
      data() {
          return{
              formData:{
                  // resourceUid:"",
                  resourceName:"",
                  resourceDesc:"",
                  resourceCoverImageUrlUid:"",
                  resourceFileUid:"",
                  resourceDefaultBlessingText:"",
                  resourceMusicUid:"",
                  resourceLabelTreeCodes:"",
                  resourceKind:"",
                  resourceAuthorUid:"",//后端接口名字需要修改
                  resourceType:"",
                  resourceMarkType:"",
              },
              openAddPage:false,
              labelList:[],
              fontList:[],
              musicList:[],
              markerList:[
                  {
                      markerId:1,
                      markerName:"无标记",
                  },
                  {
                      markerId:2,
                      markerName:"最新",
                  },
                  {
                      markerId:3,
                      markerName:"人气",
                  }

              ],
              labels:[],
              upImgUrl: process.env[this.$base] + "/medias/image/upload",
              access_token: {
                  access_token: this.$store.getters.token
              },
              uploadVideo:process.env[this.$base] + "/medias/image/upload",
              fileList:[],
              resourceCoverImageUrl:"",
              resourceImageUrl:"",
              resourceUrl:"",
              //预存选择的标签
              checkedLabels:[],
              //树形所需
              defaultProps: {
                  children: "child",
                  label: "labelText"
              },
              curLabels:[],
              //资源类别
              resourceKinds:[
                  {
                      resourceKind:1,
                      name:"平台作者"
                  },
                  {
                      resourceKind:2,
                      name:"第三方创作者"
                  }
              ],
              //资源类型
              resourceTypes:[
                  {
                      resourceType:1,
                      name:"贺卡"
                  },
                  {
                      resourceType:2,
                      name:"插画"
                  },
                  {
                      resourceType:3,
                      name:"漫画" ,
                  },
                  {
                      resourceType:4,
                      name:"视频" ,
                  },
              ],
              //平台作者列表
              authorList:[],
              rules: {
                  resourceName: [{ required: true, message: "请输入作品名", trigger: "change" }],
                  resourceType: [{ required: true, message: "请选择资源类型", trigger: "change" }],
              },
          }
      },
      created() {
          //musicList
          musicList({page:0}).then(result => {
              if(result.code == 200){
                  this.musicList = result.data.data.list;
                  //页的话还需初始化count
                  this.count = result.data.data.count;
                  // console.log(JSON.stringify(this.musicList))
              }
          }).catch(err => {});
          //labelList
          //遍历所有标签，进行标签树组装
          //初始化当前业务类型下的树
          labelListByBusinessType({labelBusinessType:"2"}).then(result => {
              if(result.data.isSuccessful === 'Y'){
                  //将数据转为map，以labelTreeCode为标识
                  let map = {};
                  result.data.data.forEach( item => {
                      map[item.labelTreeCode] = item
                  });
                  let labelArr = [];
                  //然后遍历，只要当前item存在父标签parent则一直找，找到就设为其子标签
                  result.data.data.forEach(item => {
                      let parent = map[item.labelParentTreeCode];
                      if(parent){
                          (parent.child || (parent.child = [])).push(item)
                      }else {
                          //没有父标签，则就是一级标签
                          labelArr.push(item)
                      }
                  });
                  //重组标签树
                  this.labelList = labelArr;
              }
          }).catch(err => {});
          //组装普通作者和平台签约作者类型
          let creater = [], sign_creater = [];
          memberList({userType:'2'}).then(result => {
              if(result.code == 200){
                  creater = result.data.data;
                  // console.log(JSON.stringify(creater))
                  //组装普通作者类型平台签约作者
                  memberList({userType:'3'}).then(result => {
                      if(result.code == 200){
                          sign_creater = result.data.data;
                          //合并所有作者
                          creater.forEach(e => {
                              sign_creater.push(e);
                          });
                          this.authorList = sign_creater;
                      }
                  }).catch(err => {});
              }
          }).catch(err => {});
      },
      //多选配置
      props: {
          checkItem: Boolean,
          selectArr: Array
      },
      methods: {
          //上传图片
          handleAvatarSuccess(file, fileList) {},
          beforeAvatarUpload(file) {
              var type = "image/jpg,image/jpeg,image/png,image/gif";
              const isJPG = type.indexOf(file.type) != -1;
              const isLt1M = file.size / 1024 / 1024 < 1;

              if (!isJPG) {
                  this.$message.error("上传图片只能是 JPG,JPEG,PNG,GIF 格式!");
              }
              if (!isLt1M) {
                  this.$message.error("上传图片大小不能超过 1MB!");
              }
              return isJPG && isLt1M;
          },
          //封面图上传成功
          uploadSuccessCover(response, file, fileList) {
              if (response.code == "200") {
                  this.formData.resourceCoverImageUrlUid = response.data.fileUid;
                  this.resourceCoverImageUrl = response.data.fileUrl;
              }
          },
          //作品图上传成功
          uploadSuccess(response, file, fileList) {
              if (response.code == "200") {
                  this.formData.resourceFileUid = response.data.fileUid;
                  this.resourceImageUrl = response.data.fileUrl;
              }
          },
          //上传视频
          //上传文件的一些钩子
          handleRemove(file, fileList) {
              console.log(file, fileList);
          },
          handlePreview(file) {
              console.log(file);
          },
          handleExceed(files, fileList) {
              this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
          },
          beforeRemove(file, fileList) {
              // return this.$confirm(`确定移除 ${ file.name }？`);
          },
          //上传之前格式和大小判断
          beforeAvatarUploadVideo(file) {
              const isLt1M = file.size / 1024 / 1024 < 1;
              if (!isLt1M) {
                  this.$message.error("上传文件大小不能超过 1MB!");
              }
              return isLt1M;
          },
          uploadSuccessVideo(response, file, fileList) {
              if (response.code == "200") {
                  this.formData.resourceFileUid = response.data.fileUid;
                  this.resourceUrl= response.data.fileUrl;
              }
          },
          //用户编码
          deCodes(str) {
              return this.$util.decode(str);
          },
          //选择作品类型
          checkCardType() {
              console.log(this.formData.resourceType)
          },
          //选择作品类型
          checkKind() {
              console.log(this.formData.resourceKind)
          },
          //选择作品种类0
          checkMusic() {
              console.log(this.formData.musicId)
          },
          checkAuthor(){
              console.log(this.formData.resourceAuthorUid)
          },
          //选择标记
          checkMarker() {
              console.log(this.formData.resourceMarkType)
          },
          //选择字体
          checkFont() {
              console.log(this.formData.fontId)
          },
          // 标签组装
          checkLabels() {
              //需要加ref="tree"
              let arr = [];
              //全选中和半选中状态合并则是选中的所有
              let checkedKeys = this.$refs.tree.getCheckedKeys();
              let hafCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
              arr = checkedKeys.concat(hafCheckedKeys);
              this.checkedLabels = arr;
              console.log(this.checkedLabels)
          },
          //全选树
          checkAllTree() {
              this.$refs.tree.setCheckedNodes(this.labelList)
          },
          cancelAllTree() {
              this.$refs.tree.setCheckedNodes([])
          },
          //修改或发布作品
          releaseData() {
              //如果cardId不为空，那就是修改
              if (this.$route.query.id) {
                  //todo 修改
                  this.formData.cardId = this.$route.query.id;
                  console.log(this.formData);
              }
              else {
                  //处理标签
                  this.formData.resourceLabelTreeCodes = this.checkedLabels.length>0?this.checkedLabels.join(","):'';
                  //删除cardId字段
                  delete this.formData.resourceUid;
                  this.$refs['form'].validate((valid) => {
                      if (valid) {
                          // console.log("验证终于通过！");
                          //删除cardId字段
                          delete this.formData.resourceUid;
                          console.log(this.formData);
                          //增加
                          blessingAdd(this.formData).then(res => {
                              if (res.data.isSuccessful === "Y") {
                                  this.$message({
                                      message: "新增成功！",
                                      type: "success"
                                  });
                                  setTimeout(() => {
                                      this.$router.go(0);
                                  }, 2000);
                                  //跳转到列表
                              } else {
                                  this.$message.error(res.data.message);
                              }
                          });
                      }
                  })
              }
          },
          cancelAndBack(){
              this.formData ={};
              this.$emit('func',this.openAddPage)
          }

      },
  }
</script>

