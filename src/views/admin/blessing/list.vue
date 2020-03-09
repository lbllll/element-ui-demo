<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  /*查询框*/
  .searchBox{
  }
  .selectStyle,.inputStyle,.searchStyle,.radioStyle{
    float: left;
    margin-left: 20px;
  }
  .selectStyle,.inputStyle{
    width: 200px;
  }
  .row-one{
  }
  .row-two{
    margin-top: 30px;
  }
  /*表格*/
  audio {
    margin-top: 8px;
    width: 150px;
    height: 30px;
  }
  .label-max-height{
    height: 70px;
    overflow: auto;
  }
  .labelStyle{
    margin: 3px 3px;
  }
/*编辑页面*/
  .title {
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
  <div>
<!--  筛选提交表单 -->
   <el-form :model="data" ref="searchs" class="searchBox">
     <div class="row-one">
        <!--   状态   -->
       <div>
         <el-select
           class="selectStyle"
           v-model="data.resourceState"
           prop="resourceState"
           placeholder="作品状态"
           size="small"
           @change="checkState"
         >
           <el-option value="">全部</el-option>
           <el-option
             v-for="item in resourceStateList"
             :key="item.resourceState"
             :label="item.name"
             :value="item.resourceState"
           ></el-option>
         </el-select>
       </div>
        <!--   作品类型   -->
        <div>
          <el-select
            class="selectStyle"
            v-model="data.resourceType"
            prop="resourceType"
            placeholder="作品类型"
            size="small"
            @change="checkType"
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="item in resourceTypes"
              :key="item.resourceType"
              :label="item.name"
              :value="item.resourceType"
            ></el-option>
          </el-select>
        </div>
       <!--   作品类别   -->
       <div>
         <el-select
           class="selectStyle"
           v-model="data.resourceKind"
           prop="resourceKind"
           placeholder="作品类别"
           size="small"
           @change="checkKind"
         >
           <el-option value="">全部</el-option>
           <el-option
             v-for="item in resourceKinds"
             :key="item.resourceKind"
             :label="item.name"
             :value="item.resourceKind"
           ></el-option>
         </el-select>
       </div>
       <!--   标记类型   -->
       <div>
         <el-select
           class="selectStyle"
           v-model="data.resourceMarkType"
           prop="resourceMarkType"
           placeholder="标记类型"
           size="small"
           @change="checkMarker"
         >
           <el-option value="">全部</el-option>
           <el-option
             v-for="item in markerList"
             :key="item.markerId"
             :label="item.markerName"
             :value="item.markerId"
           ></el-option>
         </el-select>
       </div>
       <div>
         <el-select
           class="selectStyle"
           v-model="data.isDeleted"
           prop="isDeleted"
           placeholder="是否删除"
           size="small"
           @change="checkIsDel"
         >
           <el-option value="">全部</el-option>
           <el-option
             v-for="item in delStatusList "
             :key="item.isDeleted"
             :label="item.name"
             :value="item.isDeleted"
           ></el-option>
         </el-select>
       </div>
     </div>
     <br>
     <div class="row-two">
       <!--   作品名   -->
       <div class="inputStyle">
         <el-form-item prop="resourceAuthorNickName"  can-be-empty>
           <el-input class="inputs" placeholder="请输入作品名" size="mini" v-model="data.resourceName"></el-input>
         </el-form-item>
       </div>
       <!--   作者名   -->
       <div class="inputStyle">
         <el-form-item prop="nickName"  can-be-empty>
           <el-input class="nickName" placeholder="请输入作者" size="mini" v-model="data.resourceAuthorNickName"></el-input>
         </el-form-item>
       </div>

       <!--标签筛选-->
       <div class="inputStyle">
         <el-form-item prop="labelIds"  can-be-empty>
           <el-popover
             placement="bottom"
             title="标签"
             width="300"
             trigger="click">
             <el-tree
               ref="filterTree"
               :data="labelList"
               show-checkbox
               node-key="labelTreeCode"
               check-strictly
               :props="defaultProps"
               :default-checked-keys="filterLabelsList"
               :default-expanded-keys="filterLabelsList"
               @check-change="checkOnlyOneLabel"
               @node-click="checkOnlyOneLabel"
             >
             </el-tree>
             <div style="margin-top: 20px">
               <el-button size="mini" @click="resetFilterQuery()">重 置</el-button>
               <el-button size="mini" type="primary" @click="filterByLabels">筛 选</el-button>
               <!--              <el-button type="primary" @click="checkAllTree" size="mini">全选</el-button>
                             <el-button @click="cancelAllTree" size="mini">取消全选</el-button>-->
             </div>
             <el-button size="small" slot="reference">选择标签</el-button>
           </el-popover>
         </el-form-item>
       </div>

       <div class="searchStyle">
         <el-button type="primary"  size="small" @click="search()">搜 索</el-button>
       </div>
       <div class="searchStyle">
         <el-button type="primary" size="small" @click="openAdd()">新增作品</el-button>
       </div>
       <div class="searchStyle">
         <el-button size="small" @click="resetQuery()">重 置</el-button>
       </div>
     </div>
    </el-form>

<!--  表格数据  -->
    <el-table
      :data="blessingList"
      border
      :row-key="getRowKeys"
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="left" type="selection" reserve-selection width="40"></el-table-column>
      <el-table-column prop="sourceInfo" align="left" width="200" label="资源信息">
        <template slot-scope="scope">
          <span>名字：{{scope.row.resourceName}}</span>
          <br>
          <el-tooltip :content="scope.row.resourceDesc">
            <span>简介：{{scope.row.resourceDesc | controlLength}}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="resourceCoverImageUrl" align="left" label="封面图" width="80">
        <template slot-scope="scope">
          <img v-image-preview :src="scope.row.resourceCoverImageUrl" width="60" height="60" />
        </template>
      </el-table-column>

      <el-table-column prop="resourceMarkType" align="left" label="标记" width="100">
        <template slot-scope="scope">
          <el-tag>{{markerTypes[scope.row.resourceMarkType]}}</el-tag>
          <br>
          <span><el-button type="text" @click="setRescourceMarkerType(scope.row.resourceUid,scope.row.resourceMarkType)" size="small">打标记</el-button></span>
        </template>
      </el-table-column>

      <el-table-column prop="resourceDefaultBlessingText" align="left" width="150" label="默认祝福语">
        <template slot-scope="scope">
          <!--<span>字体：{{scope.row.fontUrl}}</span>
          <br>-->
          <el-tooltip :content="scope.row.resourceDefaultBlessingText">
            <span>祝福语：{{scope.row.resourceDefaultBlessingText | controlLength}}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="musicId" align="left" label="关联音乐" width="180">
        <template slot-scope="scope">
          <span>歌名：{{scope.row.resourceMusicName}}</span><br>
          <audio  :src="scope.row.resourceMusicUrl" type="audio/mpeg" controls></audio>
        </template>
      </el-table-column>

      <el-table-column prop="labelsModelList"  align="left" label="标签" >
        <template slot-scope="scope">
          <div class="label-max-height">
            <el-tag class="labelStyle"  v-for="(item,index) in scope.row.labelsModelList">{{item.labelPathText}}</el-tag>
          </div>
          <span><el-button type="text" @click="checkLabels(scope.row)" size="small">打标签</el-button></span>
        </template>
      </el-table-column>


      <el-table-column prop="memberInfo" align="left" label="创作者信息" width="100">
        <template slot-scope="scope">
          <div><img class="userHeadImg" v-image-preview :src="scope.row.resourceAuthorHeadPicUrl" width="60" height="60" /></div>
          <span class="nickName">{{deCodes(scope.row.resourceAuthorNickName)}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="memberInfo" align="left" label="状态" width="150">
        <template slot-scope="scope">
          <span>状态：{{resourceStates[scope.row.resourceState]}}</span><br>
          <span>更新时间：{{$timeUtil.getFormatTime(scope.row.resourceStateLastChangeTime)}}</span><br>
          <span>操作：<el-button @click="checkResourceState(scope.row)" type="text" size="small">{{scope.row.resourceState != '2'?'上线':'下线'}}</el-button></span>
          <!--(状态变更历史)-->
<!--          <span><el-button type="text" @click="checkStatus(scope.row.cardId)" size="small">查看明细</el-button></span>-->
        </template>
      </el-table-column>
      <el-table-column prop="memberInfo" align="left" label="汇总" width="150">
        <template slot-scope="scope">
          <span>送出:{{scope.row.resourceSendCount}}次 </span>
          <span>下载:{{scope.row.resourceDownloadCount}}次</span><br>
          <span>评论:{{scope.row.resourceCommentsCount}}条 </span>
          <span>收藏:{{scope.row.resourceFavoritesCount}}次</span><br>
          <span>红包:{{scope.row.resourceAmountOfRedPacket}}</span><br>
        </template>
      </el-table-column>
      <el-table-column prop="memberInfo" align="left" label="创建信息" width="150" >
        <template slot-scope="scope">
          <span>创建时间:{{$timeUtil.getFormatTime(scope.row.createTime)}}</span><br>
          <span>创建者:{{scope.row.resourceCreateUserNickName}}</span><br>
        </template>
      </el-table-column>


      <!--操作列处理-->
      <el-table-column label="操作" align="left" width="100">
        <template slot-scope="scope">
<!--          <router-link  type="primary" round icon="el-icon-edit" :to="{name: 'BLESSING_ADD', query: {id: scope.row.cardId}}">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>-->
          <el-button @click="delAll(scope.row.resourceUid)" type="text" size="small">删除</el-button>
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
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


    <!--  弹出层设置标签 -->
    <el-dialog
      title="请设置标签"
      :visible.sync="controlOpenSetLabels"
      width="50%"
      :destroy-on-close="true"
      @close="nodeCollapse"
    >
      <el-tree
        ref="tree"
        :data="labelList"
        show-checkbox
        node-key="labelTreeCode"
        :props="defaultProps"
        :default-checked-keys="curLabelsList"
        :default-expanded-keys="curLabelsList"
        @check-change="handleCheckChange"
      >
      </el-tree>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="checkAllTree" size="mini">全选</el-button>
        <el-button @click="cancelAllTree" size="mini">取消全选</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="controlOpenSetLabels = false">取 消</el-button>
        <el-button type="primary" @click="checkLabelsSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--弹出层设置资源标记-->
    <el-dialog
      title="设置标记"
      :visible.sync="controlOpenMarker"
      width="30%"
      :destroy-on-close="true"
    >
      <el-form>
        <el-select
          class="data"
          v-model="markerType"
          prop="markerType"
          placeholder="标记类型"
          size="small"
          @change="checkMarkerType"
        >
          <el-option
            v-for="item in markerList"
            :key="item.markerId"
            :label="item.markerName"
            :value="item.markerId"
          ></el-option>
        </el-select>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="controlOpenMarker = false">取 消</el-button>
        <el-button type="primary" @click="setMarkerTypeSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!--发布资源作品-->
    <el-dialog
      title="发布作品"
      :visible.sync="openAddPage">
      <blessAdd  @func="getMsgFormSon" ></blessAdd>
    </el-dialog>
    <!--编辑草稿资源作品-->
    <el-dialog
      title="资源文件编辑"
      :visible.sync="openEditPage"
      width="50%"
      :destroy-on-close="true"
      @close="nodeCollapse"
    >
      <el-form ref="form" :model="formData" :rules="rules" class="formBox" label-width="80px">
        <p class="title">作品基本信息</p>

        <el-form-item label="作品类型"  verify prop="resourceType">
          <el-select
            class="selectStyle"
            v-model="formData.resourceType"
            prop="resourceType"
            placeholder="作品类型"
            size="small"
            @change="checkCardTypeForEdit"
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
            @change="checkKindForEdit"
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
        <el-form-item label="祝福语" prop="resourceDefaultBlessingText" verify>
          <el-input
            class="formItem"
            v-model="formData.resourceDefaultBlessingText"
            maxlength="20"
            placeholder="请输入默认祝福语"
          ></el-input>
          <span class="describe">长度不超过100</span>
        </el-form-item>


        <el-form-item label="选择作者"  prop="resourceAuthorUid" verify>
          <el-select
            class="formItem"
            v-model="formData.resourceAuthorUid"
            placeholder="请选择作者"
            @change="checkAuthorForEdit"
          >
            <el-option
              v-for="item in authorList"
              :key="item.memberId"
              :label="item.wechatNickName"
              :value="item.memberId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="绑定音乐"  prop="resourceMusicUid">
          <el-select
            class="formItem"
            v-model="formData.resourceMusicUid"
            placeholder="请选择音乐"
            @change="checkMusicForEdit"
          >
            <el-option
              v-for="item in musicList"
              :key="item.musicId"
              :label="item.musicName+'--歌手：'+item.musicSinger"
              :value="item.musicId"
            ></el-option>
          </el-select>
        </el-form-item>
<!--        &lt;!&ndash;   发布按钮     &ndash;&gt;
        <div class="footer">
          <el-button type="primary" @click="releaseData">{{$route.query.id?'确认修改':'确认发布'}}</el-button>
          <el-button @click="cancelAndBack">取  消</el-button>
          &lt;!&ndash;          <el-button type="primary" @click="previewData()">预览</el-button>&ndash;&gt;
        </div>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openEditPage = false">取 消</el-button>
        <el-button type="primary" @click="updateSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {
        blessingList,
        moduleList,
        blessingState,
        blessingRemarkType,
        blessingLabels,
        blessingDelete,
        labelListAll,
        labelListByBusinessType,
        memberList,
        musicList,
        blessingUpdate
    } from "@/api/table";
    import blessAdd from "./add";
export default {
  name: 'BLESSING_LIST',
  components: {
      blessAdd
  },
  data() {
    return {
        data:{
            resourceName:"",//资源名称
            resourceAuthorNickName:"",//创作者名称

            resourceLabelTreeCodes:"",//todo 资源标签,筛选暂时还没加
            resourceKind:"",//资源类别[1-官方资源, 2-第三方创作者]
            resourceType:"",//资源类型
            resourceState:"",//资源状态
            resourceMarkType:"",//资源标记类型
            isDeleted:"",//资源是否被删除
            page: 1
        },
        //筛选标签列表
        filterLabelsList:[],
        checkLabelId:'',//选中标签id
        formData:{
            resourceUid:"",
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
        cardList:[],
        labelList:[],
        markerList:[
            {
                markerId:1,
                markerName:"无标记",
            },
            {
                markerId:2,
                markerName:"推荐",
            },
            {
                markerId:3,
                markerName:"火热",
            },
            {
                markerId:4,
                markerName:"人气",
            },

        ],
        markerTypes:{
            1:"无标记",
            2:"推荐",
            3:"火热",
            4:"人气",
        },
        fontList:[
            {
                fontId:"1",
                fontName:"第一个字体名字",
                fontSize:"第一个字体大小",
                fontUrl:"第一个字体地址",
            },
        ],
        cardStatusList:{
            in:"上架",
            out:"下架",
        },
        //分页
        isIndeterminate: false,
        checkAll: false,
        count: 6,
        multipleSelection: [],
        //控制打开设置标签界面
        controlOpenSetLabels:false,
        //控制打开标记设置界面
        controlOpenMarker:false,
        markerType:'',
        curRescourceUid:'',
        curLabelsList:[],
        //预存选择的标签
        checkedLabels:[],
        //树形所需
        defaultProps: {
            children: "child",
            label: "labelText"
        },
        //列表出来过后将所有标签组装成一个数组，便于遍历和展示
        allLabelsNotTree:{},
        //每次点击操作用户，临时存储主键，每次点击都会重置为当前的值
        cardId:'',
        blessingList:[],
        //资源类别
        resourceKinds:[
            {
                resourceKind:1,
                name:"官方资源"
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
                name:"条漫"
            },
            {
                resourceType:3,
                name:"插画" ,
            },
            {
                resourceType:4,
                name:"动画视频" ,
            },
        ],
        //资源状态
        resourceStates:{
            1:"草稿",
            2:"上线",
            3:"已下线",
        },
        resourceStateList:[
            {
                resourceState:1,
                name:"草稿"
            },
            {
                resourceState:2,
                name:"发布上线"
            },
            {
                resourceState:3,
                name:"已下线"
            }
        ],
        //是否删除
        delStatusList:[
            {
                isDeleted:"Y",
                name:"已删除",
            },
            {
                isDeleted:"N",
                name:"未删除",
            }
        ],
        //设置标签选中当前资源信息
        curResourceInfo:{},
        /*弹出编辑页面*/
        openAddPage:false,
        //打开编辑页面
        openEditPage:false,
        rules: {
            resourceName: [{ required: true, message: "请输入作品名", trigger: "change" }],
            resourceType: [{ required: true, message: "请选择资源类型", trigger: "change" }],
        },
        upImgUrl: process.env[this.$base] + "/medias/image/upload",
        access_token: {
            access_token: this.$store.getters.token
        },
        uploadVideo:process.env[this.$base] + "/medias/image/upload",
        resourceCoverImageUrl:'',
        resourceImageUrl:'',
        resourceUrl:'',
        curLabels:[],
        authorList:[],
        musicList:[],
        fileList:[],
    }
  },
    //多选配置
    props: {
        checkItem: Boolean,
        selectArr: Array
    },
  filters: {
      //控制字符串长度，过长显示...
      controlLength(curStr) {
          if(!curStr){
              return "";
          }
          if(curStr.length > 18){
              return curStr.slice(0,18)+"..."
          }
          return curStr;
      },
  },
  created() {
      //遍历所有标签，进行标签树组装
      //初始化当前业务资源类型下的树
      labelListByBusinessType({labelBusinessType:"1"}).then(result => {
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
      //musicList
      musicList({page:0}).then(result => {
          if(result.code == 200){
              this.musicList = result.data.data.list;
              //页的话还需初始化count
              this.count = result.data.data.count;
              // console.log(JSON.stringify(this.musicList))
          }
      }).catch(err => {});
      //表格数据初始化
      this.init();
    },
  methods: {
      //初始化列表数据
      init(){
          //获取用户信息，加载表格数据
          let data = JSON.parse(JSON.stringify(this.data));
          data.resourceAuthorNickName = this.$util.encode(data.resourceAuthorNickName);
          data.page --;
          blessingList(data).then(result => {
              if(result.code == 200){
                  this.blessingList = result.data.data.data;
                  //分页的话还需初始化count
                  this.count = result.data.data.count;
                  // console.log(JSON.stringify( this.blessingList))
              }
          }).catch(err => {});
      },
      //用户编码
      deCodes(str) {
          return this.$util.decode(str);
      },
        getRowKeys(row) {
            // 给表格每行增加一个唯一 标识，用作切换分页后保留被选中行的信息
            return row.cardId;
        },
        search() {
            this.init();
        },
      //选择作品类型
      checkState() {
          console.log(this.data.resourceState)
          this.init()
      },
      checkType() {
          console.log(this.data.resourceType)
          this.init()
      },
      checkKind() {
          console.log(this.data.resourceKind)
          this.init()
      },
      //选择标记
      checkMarker() {
          console.log(this.data.resourceMarkType)
          this.init()
      },
      checkIsDel(){
          console.log(this.data.isDeleted)
          this.init()
      },
      //监听选择的内容
      handleSelectionChange(val) {
          //val 为选中数据的集合
          this.multipleSelection = val;
          // console.log(this.multipleSelection)
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
      //设置标记
      setRescourceMarkerType(rescourceUid,markerType){
          this.curRescourceUid = rescourceUid;
          this.markerType = markerType;
          console.log(this.curRescourceUid);
          console.log(this.markerType)
          this.controlOpenMarker = true;
      },
      checkMarkerType(){
        console.log(this.markerType);
      },
      setMarkerTypeSubmit(){
          let data = {
              resourceUid:this.curRescourceUid,
              remarkType:this.markerType,
          };
          blessingRemarkType(data).then(res => {
              if(res.data.isSuccessful === "Y"){
                  this.$message({
                      message: "设置成功！",
                      type: "success"
                  });
                  setTimeout(() => {
                      this.init();
                  }, 2000);
                  //跳转到列表
              }else {
                  this.$message.error(res.data.message);
              }
          }).catch(err => {});
          this.controlOpenMarker = false;
      },
      //修改状态，上下线
      checkResourceState(resourceInfo){
          let resourceState;
          if(resourceInfo.resourceState != 2){
              resourceState = 2
          }else {
              resourceState = 3;
          }
          let data = {
              resourceUid:resourceInfo.resourceUid,
              resourceState:resourceState
          };
          //上下线
          blessingState(data).then(res => {
              if(res.data.isSuccessful === "Y"){
                  this.$message({
                      message: "设置成功！",
                      type: "success"
                  });
                  setTimeout(() => {
                      this.init();
                  }, 2000);
                  //跳转到列表
              }else {
                  this.$message.error(res.data.message);
              }
          }).catch(err => {});
          this.controlOpenSetLabels = false;
      },
      //批量删除
      delAll(rowKey) {
          //是字符串类型则就是 rowKey
          if(typeof(rowKey) =='string'){
              this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
              }).then( () => {
                  blessingDelete(rowKey).then(res => {
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
      },
      checkLabels(resourceInfo) {
          //当前角色id临时存储
          this.curResourceInfo = resourceInfo;
          let curLabelsCodes = [];
          //查询相应标签，并赋值当前便于渲染
          this.curResourceInfo.labelsModelList.forEach(e => {
              curLabelsCodes.push(e.labelTreeCode);
          });
          this.curLabelsList = curLabelsCodes;
          //给当前文件赋值
          this.checkedLabels = this.curLabelsList;
          //弹出
          this.controlOpenSetLabels = true;
      },
      nodeCollapse(data) {
          this.curLabels =[];
      },
      //提交标签设置
      checkLabelsSubmit(){
          console.log(this.checkedLabels.join(","));
          console.log(this.cardId);
          let data = {
              resourceUid:this.curResourceInfo.resourceUid,
              labelTreeCodes:this.checkedLabels===''?'':this.checkedLabels.join(",")
          };
          //设置标签
          blessingLabels(data).then(res => {
              if(res.data.isSuccessful === "Y"){
                  this.$message({
                      message: "设置成功！",
                      type: "success"
                  });
                  setTimeout(() => {
                      this.init();
                  }, 2000);
                  //跳转到列表
              }
          }).catch(err => {});
          this.controlOpenSetLabels = false;
      },
      //选择标签
      handleCheckChange() {
          //需要加ref="tree"
          let arr = [];
          //全选中和半选中状态合并则是选中的所有
          let checkedKeys = this.$refs.tree.getCheckedKeys();
          let hafCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
          arr = checkedKeys.concat(hafCheckedKeys);
          this.checkedLabels = arr;
          console.log(this.checkedLabels)
      },
      //查看状态明细
      checkStatus(cardId) {
            console.log(cardId);
      },
      //全选树
      checkAllTree() {
          this.$refs.tree.setCheckedNodes(this.labelList)
      },
      cancelAllTree() {
          this.$refs.tree.setCheckedNodes([])
      },
      /*打开资源编辑弹出层*/
      openAdd(){
        this.openAddPage = true;
      },
      getMsgFormSon(data){
          this.openAddPage = data;
      },
      resetQuery(){
          this.data={
              resourceName:"",//资源名称
              resourceAuthorNickName:"",//创作者名称

              resourceLabelTreeCodes:"",//todo 资源标签,筛选暂时还没加
              resourceKind:"",//资源类别[1-官方资源, 2-第三方创作者]
              resourceType:"",//资源类型
              resourceState:"",//资源状态
              resourceMarkType:"",//资源标记类型
              isDeleted:"",//资源是否被删除
              page: 1
          };
          this.init();
      },
      resetFilterQuery(){
          this.data={
              resourceName:"",//资源名称
                  resourceAuthorNickName:"",//创作者名称

                  resourceLabelTreeCodes:"",//todo 资源标签,筛选暂时还没加
                  resourceKind:"",//资源类别[1-官方资源, 2-第三方创作者]
                  resourceType:"",//资源类型
                  resourceState:"",//资源状态
                  resourceMarkType:"",//资源标记类型
                  isDeleted:"",//资源是否被删除
                  page: 1
          };
          this.init();
          this.checkedLabels=[];
          this.filterLabelsList=[];
          this.$refs.filterTree.setCheckedNodes([])
      },
      /*标签筛选*/
      filterByLabels(){
          // this.data.resourceLabelTreeCodes = this.checkedLabels===''?'':this.checkedLabels.join(",")
          this.data.resourceLabelTreeCodes = this.checkLabelId+"";
          console.log(this.formData);
          this.init();
      },
      //将标签筛选树树做成单选
      checkOnlyOneLabel(item,node,self) {
          //共三个参数，依次为：item:data属性的数组中该节点所对应的对象、node:节点本身是否被选中、self:节点的子树中是否有被选中的节点(感觉永远为false)
          //需要两个事件同时作用，才可达到单选
          if(node){
              this.$refs.filterTree.setCheckedKeys([item.labelTreeCode]);
              this.checkLabelId = this.$refs.filterTree.getCheckedKeys();
              this.checkLabelId = item.labelTreeCode;
          }
          else {
              this.checkLabelId = this.$refs.filterTree.getCheckedKeys();
          }
      },
      /*编辑相关*/
      //选择作品类型
      checkCardType() {
          console.log(this.formData.resourceType)
      },
      //上传图片
      handleAvatarSuccess(file, fileList) {},
      beforeAvatarUpload(file) {
          var type = "image/jpg,image/jpeg,image/png,image/gif";
          const isJPG = type.indexOf(file.type) != -1;
          const isLt2M = file.size / 1024 / 1024 < 1;

          if (!isJPG) {
              this.$message.error("上传图片只能是 JPG,JPEG,PNG,GIF 格式!");
          }
          if (!isLt2M) {
              this.$message.error("上传图片大小不能超过 1MB!");
          }
          return isJPG && isLt2M;
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
      checkCardTypeForEdit(){
          console.log(this.formData.resourceKind)
      },
      //选择作品类型
      checkKindForEdit() {
          console.log(this.formData.resourceKind)
      },
      checkAuthorForEdit(){
          console.log(this.formData.resourceAuthorUid)
      },
      //选择作品种类0
      checkMusicForEdit() {
          console.log(this.formData.musicId)
      },
      //选择标记
      checkMarkerForEdit() {
          console.log(this.formData.resourceMarkType)
      },
      // 标签组装
      checkLabelsForEdit() {
          //需要加ref="tree"
          let arr = [];
          //全选中和半选中状态合并则是选中的所有
          let checkedKeys = this.$refs.tree.getCheckedKeys();
          let hafCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
          arr = checkedKeys.concat(hafCheckedKeys);
          this.curlabels = arr;
          console.log(this.curlabels)
      },
      edit(resourceInfo){
          this.resourceCoverImageUrl = resourceInfo.resourceCoverImageUrl;
          this.resourceImageUrl = resourceInfo.resourceFileUrl;
          this.resourceUrl = resourceInfo.resourceFileUrl;
          //给当前文件赋值
          this.curLabels = resourceInfo.resourceLabelTreeCodes===null?'':resourceInfo.resourceLabelTreeCodes.split(",");
          this.formData = {
                  resourceUid:resourceInfo.resourceUid,
                  resourceName:resourceInfo.resourceName,
                  resourceDesc:resourceInfo.resourceDesc,
                  resourceCoverImageUrlUid:resourceInfo.resourceCoverImageUrlUid,
                  resourceFileUid:resourceInfo.resourceFileUid,
                  resourceDefaultBlessingText:resourceInfo.resourceDefaultBlessingText,
                  resourceMusicUid:resourceInfo.resourceMusicUid,
                  resourceLabelTreeCodes:resourceInfo.resourceLabelTreeCodes,
                  resourceKind:resourceInfo.resourceKind,
                  resourceAuthorUid:resourceInfo.resourceAuthorUid,//后端接口名字需要修改
                  resourceType:resourceInfo.resourceType,
                  resourceMarkType:resourceInfo.resourceMarkType,
          };
          console.log(resourceInfo);
          console.log(this.formData);
          this.openEditPage = true;
      },
      updateSubmit(){
          this.$refs['form'].validate((valid) => {
              if (valid) {
                  console.log(this.formData);
                  //增加
                  blessingUpdate(this.formData).then(res => {
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
          })
      }
    }
}
</script>
