<template>
  <div class="bodyBox">
    <el-form ref="form" :model="formData" class="formBox" label-width="80px">
      <p class="title">系统字体信息</p>

      <el-form-item label="歌名" prop="musicName" verify>
        <el-input
          class="formItem"
          v-model="formData.musicName"
          maxlength="20"
          placeholder="请输入歌名"
        ></el-input>
      </el-form-item>

      <el-form-item label="歌手" prop="musicSinger" verify>
        <el-input
          class="formItem"
          v-model="formData.musicSinger"
          maxlength="20"
          placeholder="请输入歌手"
        ></el-input>
      </el-form-item>

      <el-form-item label="上传歌曲" prop="musicUrl" verify>
        <el-upload
          :action="uploadUrl"
          :data="access_token"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="uploadSuccess"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <!--          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> upload-demo-->
        </el-upload>
      </el-form-item>

      <el-form-item label="歌曲类型" verify prop="musicType">
        <el-input
          class="formItem"
          v-model="formData.musicType"
          maxlength="20"
          placeholder="请输入歌曲类型"
        ></el-input>
      </el-form-item>
      <el-form-item label="时长" verify prop="musicTimeSeconds">
        <el-input
          type="number"
          class="formItem"
          v-model="formData.musicTimeSeconds"
          maxlength="20"
          placeholder="请输入歌曲时长"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传者" verify prop="uploadName">
        <el-input
          class="formItem"
          v-model="formData.uploadName"
          maxlength="20"
          placeholder="上传者"
        ></el-input>
      </el-form-item>
      <el-form-item label="来源" verify prop="sourceName">
        <el-input
          class="formItem"
          v-model="formData.sourceName"
          maxlength="20"
          placeholder="请输入歌曲来源"
        ></el-input>
      </el-form-item>
      <el-form-item label="音乐分组" verify prop="musicGroup">
        <el-input
          class="formItem"
          v-model="formData.musicGroup"
          maxlength="20"
          placeholder="请输入音乐分组"
        ></el-input>
      </el-form-item>

<!--      <el-form-item label="歌曲分组" verify prop="musicGroup">
        <el-select
          class="formItem"
          v-model="formData.musicGroup"
          placeholder="请设置歌曲分组"
          @change="checkMusicGroups"
        >
          <el-option
            v-for="item in musicGroupList"
            :key="item.musicGroup"
            :label="item.name"
            :value="item.musicGroup"
          ></el-option>
        </el-select>
      </el-form-item>-->

      <!--   发布按钮     -->
      <div class="footer">
        <el-button type="primary" @click="addMusic">{{$route.query.musicInfo?'确认修改':'确认添加'}}</el-button>
        <!--          <el-button type="primary" @click="previewData()">预览</el-button>-->
      </div>
    </el-form>
  </div>
</template>

<script>
    import {
        musicUpdate,
        musicAdd,
    } from "../../../api/table";

    export default {
        name: "MUSIC_ADD",
        components: {},
        data() {
            return {
                formData:{
                    musicId:"",
                    musicName:"",
                    musicUrlId:"",
                    musicUrl:"",//需组装
                    musicTimeSeconds:"",//音乐长度可能单词写错 应该为seconds
                    musicSinger:"",
                    musicType:"",//音乐分类MPEG、MP3、WMA
                    musicGroup:"",//音乐分组
                    uploadName:"",//上传人
                    sourceName:"",//来源
                },
                cardList:[
                ],
                labelList:[

                ],
                fontList:[
                    {
                        fontId:"1",
                        fontName:"第一个字体名字",
                        fontSize:"第一个字体大小",
                        fontUrl:"第一个字体地址",
                    },
                ],
                categoryList:[

                ],
                cardTypeList:[
                    {
                        cardType:"heka",
                        name:"贺卡",
                    },
                    {
                        cardType:"chahua",
                        name:"插画",
                    },
                    {
                        cardType:"tiaoman",
                        name:"条漫",
                    }
                ],
                cardStatusList:{
                    in:"上架",
                    out:"下架",
                },
                userList: [

                ],
                rolesList:[

                ],
                usersType:{
                    "1":"用户类型1",
                    "2":"用户类型2",
                    "3":"用户类型3",
                },
                usersState:{
                    "1":"启用",
                    "2":"禁用",
                },
                roleTypeList: [
                    {
                        roleType:"1",
                        name:"超级管理员",
                    },
                    {
                        roleType:"2",
                        name:"运营人员",
                    },
                    {
                        roleType:"3",
                        name:"平台创作者",
                    },

                ],
                roleType: {
                    "1":"超级管理员",
                    "2":"运营人员",
                    "3":"平台创作者",
                },
                //上传文件所需
                uploadUrl: process.env[this.$base] + "/medias/image/upload",
                access_token: {
                    access_token: this.$store.getters.token
                },
                userHeadImageUrl:"",
                fileList:[],
                //音乐分组和类
                //音乐类型和分组
                musicTypes:{
                    "1":"MP3",
                    "2":"MP4"
                },
                musicGroups:{
                    "1":"流行",
                    "2":"轻音乐"
                },
                musicTypeList:[
                    {
                        musicType:"1",
                        name:"MP3"
                    },
                    {
                        musicType:"2",
                        name:"MP4"
                    },
                ],
                musicGroupList:[
                    {
                        musicGroup:"l",
                        name:"流行"
                    },
                    {
                        musicGroup:"2",
                        name:"轻音乐"
                    },
                    {
                        musicGroup:"3",
                        name:"摇滚"
                    },
                    {
                        musicGroup:"4",
                        name:"爵士"
                    },
                ],
                musicUrl:'',
            }
        },
        created() {
            //如果有musicInfo则是修改,将表单填充
            if(this.$route.query.musicInfo){
                let musicInfo = this.$route.query.musicInfo;
                //赋值
                this.formData = musicInfo;
                // console.log(this.formData)
            }
        },
        methods: {
            //选择歌曲类型和分组
            checkMusicTypes() {
                console.log(this.formData.musicType)
            },
            checkMusicGroups() {
                console.log(this.formData.musicGroup)
            },
            //上传文件的一些钩子
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                // return this.$confirm(`确定移除 ${ file.name }？`);
            },
            //上传之前格式和大小判断
            beforeAvatarUpload(file) {
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    this.$message.error("上传文件大小不能超过 1MB!");
                }
                return isLt1M;
            },
            uploadSuccess(response, file, fileList) {
                if (response.code == "200") {
                    this.formData.musicUrlId = response.data.fileUid;
                    this.musicUrl= response.data.fileUrl;
                    this.formData.musicUrl= response.data.fileUrl;
                }
                console.log(this.formData.musicUrlId);
                console.log(this.musicUrl)
            },
            //新增编辑角色
            addMusic() {
                //验证参数输入情况
                this.$refs['form'].validate((valid) => {
                    //如果有roleId则是，修改
                    if(this.$route.query.musicInfo){
                        //组装修改参数
                        let data = {
                            musicId:this.formData.musicId,
                            musicName:this.formData.musicName,
                            musicUrlId:this.formData.musicUrlId,//用来关联的
                            musicTimeSeconds:this.formData.musicTimeSeconds,//音乐长度可能单词写错 应该为seconds
                            musicSinger:this.formData.musicSinger,
                            uploadName:this.formData.uploadName,//上传人
                            sourceName:this.formData.sourceName,//来源
                            musicType:this.formData.musicType,//音乐分类MPEG、MP3、WMA
                            musicUrl:this.formData.musicUrl,//
                            musicGroup:this.formData.musicGroup,//音乐分组
                        };
                        //编辑
                        musicUpdate(data).then(res => {
                            if (res.data.isSuccessful === "Y") {
                                this.$message({
                                    message: "修改成功！",
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
                    else {
                        //组装增加参数
                        let data = {
                            musicName: this.formData.musicName,
                            musicUrlId: this.formData.musicUrlId,//用来关联的
                            musicTimeSeconds: this.formData.musicTimeSeconds,//音乐长度可能单词写错
                            musicSinger: this.formData.musicSinger,
                            uploadName: this.formData.uploadName,//上传人
                            sourceName: this.formData.sourceName,//来源
                            musicType: this.formData.musicType,//音乐分类MPEG、MP3、WMA
                            musicUrl: this.formData.musicUrl,//
                            musicGroup:this.formData.musicGroup,//音乐分组
                        };
                        //编辑
                        musicAdd(data).then(res => {
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
                  });
            },
        },
    }
</script>

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
