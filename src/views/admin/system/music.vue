<template>
  <div class="bodyBox">
    <div class="header">
      <el-button type="primary" size="small" @click="openAdd()">添加音乐</el-button>
    </div>

    <el-table
      :data="musicList"
      border
      style="width: 100%"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column prop="musicName" align="center" label="音乐名"></el-table-column>
      <el-table-column prop="musicUrl" align="center" width="320" label="音乐">
        <template slot-scope="scope">
          <audio :src="scope.row.musicUrl"  controls>
          </audio>
        </template>
      </el-table-column>
      <el-table-column prop="musicSinger" align="center" label="歌手"></el-table-column>
<!--      <el-table-column prop="musicTimeSeconds" align="center" label="音乐时长"></el-table-column>-->
      <el-table-column prop="musicType" align="center" label="音乐类型">
        <template slot-scope="scope">{{scope.row.musicType}}</template>
<!--        <template slot-scope="scope">{{musicTypes[scope.row.musicType]}}</template>-->
      </el-table-column>
      <el-table-column prop="musicTimeSeconds" align="center" label="音乐时长"></el-table-column>
      <!--      <el-table-column prop="musicGroup" align="center" label="音乐分组">
              <template slot-scope="scope">{{musicGroups[scope.row.musicGroup]}}</template>
            </el-table-column>-->
      <el-table-column prop="sourceName" align="center" label="来源名称"></el-table-column>
      <el-table-column prop="uploadName" align="center" label="上传人"></el-table-column>
      <el-table-column prop="musicGroup" align="center" label="音乐分组"></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
<!--          <router-link  type="primary" round icon="el-icon-edit" :to="{name: 'MUSIC_ADD', query: {musicInfo: scope.row}}">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>-->
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="delAll(scope.row.musicId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  底部操作工具栏  -->
    <div class="footer flex-between">
      <div>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
<!--        <el-button type="primary" v-if="!checkItem" size="mini" @click="delAll">删除</el-button>-->
      </div>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="data.page"
        :page-size="10"
        background
        layout="total, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>


    <!--  弹出层分配权限  -->
    <el-dialog
      title="请设置权限"
      :visible.sync="controlDialog"
      width="50%"
    >

      <el-tree
        ref="tree"
        :data="permissionList"
        show-checkbox
        node-key="moduleId"
        :props="defaultProps"
        :default-checked-keys="curUserPermissions"
        :default-expanded-keys="curUserPermissions"
        @check-change="handleCheckChange"
      >

      </el-tree>

      <div style="margin-top: 20px">
        <el-button type="primary" @click="" size="mini">全选</el-button>
        <el-button @click="" size="mini">取消全选</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="controlDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitBtn">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="新增音乐"
      :visible.sync="openAddPage">
      <musicAdd></musicAdd>
    </el-dialog>

    <el-dialog
      title="编辑音乐信息"
      :visible.sync="openEditPage">
      <div class="bodyBox">
        <el-form ref="form" :model="formData" class="formBox" label-width="80px">

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
            <el-button type="primary" @click="editSubmit">确认修改</el-button>
            <!--          <el-button type="primary" @click="previewData()">预览</el-button>-->
          </div>
        </el-form>
      </div>
    </el-dialog>



  </div>
</template>

<script>
    import {
        musicList,
        musicDelete,
        fileInfo,
        musicUpdate
    } from "@/api/table";
    import musicAdd from "./musicAdd";
    export default {
        name: "MUSIC_LIST",
        components: {musicAdd},
        data() {
            return {
                data:{
                    musicId:"",
                    musicName:"",
                    musicUrlId:"",
                    musicUrl:"",//需组装
                    musicTimeSeconds:"",//音乐长度可能单词写错 应该为seconds
                    musicSinger:"",
                    musicType:"",//音乐分类MPEG、MP3、WMA
                    uploadName:"",//上传人
                    sourceName:"",//来源
                    page:1
                },
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
                cardList:[],
                labelList:[],
                categoryList:[
                    {
                        categoryId:"1",
                        prentId:"-1",
                        name:"第一个种类名字",
                        icon:"第一个种类图标",
                        description:"描述",
                        createTime:"2020-20-3",
                        updateTime:"2020-20-3",
                        isDeleted:"N",
                        sort:"0",
                    },
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
                userList: [],
                rolesList:[],
                musicList:[],
                usersType:{
                    "1":"用户类型1",
                    "2":"用户类型2",
                    "3":"用户类型3",
                },
                usersState:{
                    "1":"启用",
                    "2":"禁用",
                },
                roleType: {
                    "1":"超级管理员",
                    "2":"运营人员",
                    "3":"平台创作者",
                },
                count: 6,
                multipleSelection: [],
                //分页
                isIndeterminate: false,
                //全选
                checkAll: false,
                //弹出层控制
                controlDialog:false,
                //权限列表
                permissionList:[],
                //组装权限列表的载体
                checkPermissions:[],
                //模拟 用户当前拥有权限
                curUserPermissions:['111','21','121'],
                //树形所需
                defaultProps: {
                    children: "child",
                    label: "moduleName"
                },
                //音乐类型和分组
                musicTypes:{
                    "1":"MP3",
                    "2":"MP4"
                },
                musicGroups:{
                    "1":"流行",
                    "2":"轻音乐"
                },
                //控制打开添加页
                openAddPage: false,
                openEditPage: false,
                curMusicUid:'',
                curMusicInfo:{},
                musicUrl:'',
                //上传文件所需
                uploadUrl: process.env[this.$base] + "/medias/image/upload",
                access_token: {
                    access_token: this.$store.getters.token
                },
                fileList:[],
            }
        },
        props: {
            checkItem: Boolean,
            selectArr: Array
        },
        created() {
            this.init();
        },
        methods: {
            //todo 加载表格数据
            init(){
                //todo 初始化count
                //获取用户信息，加载表格数据
                let data = JSON.parse(JSON.stringify(this.data));
                data.page --;
                musicList(data).then(result => {
                    if(result.code == 200){
                        this.musicList = result.data.data.list;
                        //页的话还需初始化count
                        this.count = result.data.data.count;
                        // console.log(JSON.stringify(this.musicList))
                    }
                }).catch(err => {});
            },
            //监听选择的内容
            handleSelectionChange(val) {
                //val 为选中数据的集合
                this.multipleSelection = val;
                console.log(this.multipleSelection)
            },
            //加载第几页
            handleCurrentChange(val) {
                this.data.page = val;
                //修改页数，重新加载
                this.init();
            },
            //右下按钮全选，切换保证和表格的全选一致
            handleCheckAllChange(val) {
                if (this.checkAll) {
                    this.$refs.multipleTable.toggleAllSelection();
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
                this.isIndeterminate = false;
            },
            //弹出分配权限界面
            openDialog(roleId) {
                //弹出
                this.controlDialog = true;
                console.log(roleId)
            },
            //弹出层的一些方法
            submitBtn() {
                //提交后将窗口关闭
                this.controlDialog = false;
            },
            //权限选择
            handleCheckChange() {
                //需要加ref="tree"
                let res = this.$refs.tree.getCheckedNodes();
                let arr = [];
                res.forEach(item => {
                    arr.push(item.id);
                });
                this.checkPermissions = arr;
                console.log(this.checkPermissions)
            },
            //批量删除
            delAll(rowKey) {
                //是字符串类型则就是 rowKey
                if(typeof(rowKey) =='string'){
                    this.$confirm("此操作将永久删除该音乐, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then( () => {
                        musicDelete(rowKey).then(res => {
                            console.log(res);
                            if (res.data.isSuccessful === "Y") {
                                this.$message({
                                    message: "删除成功",
                                    type: "success"
                                });
                                setTimeout(() => {
                                    this.init();
                                }, 2000);
                                //跳转到列表
                            } else {
                                this.$message.error(res.data.message);
                            }
                        }).catch(err => {console.log("错误了")});
                    }).catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
                }else {
                    //不是字符串类型是对象类型
                    console.log(this.multipleSelection);

                }
                //todo 组装keys，调用删除接口
            },
            /*打开资源编辑弹出层*/
            openAdd(){
                this.openAddPage = true;
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
            edit(musicInfo){
                this.formData  = musicInfo;
                console.log(this.curMusicInfo );
                this.openEditPage = true;
            },
            editSubmit(){
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
                console.log(data);
                // return false;
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
            },
        },
    }
</script>

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

</style>
