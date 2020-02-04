



<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.tableBox {
  margin-top: 10px;
}
.searchBox {
  height: 50px;
  width: 100%;
  margin-top: 20px;
  padding: 0 20px;
  border-radius: 4px;
  .radio{
    float: left;
    width: 300px;
  }
  .title,.scene,.search{
    margin-left: 25px;
    float: left;
    height: 50px;
  }
}
.footer {
  height: 50px;
}
</style>


<template>
  <div class="bodyBox" id>
    <div class="listType">
      <!--状态查询 -->
      <el-form :model="data" ref="searchs" class="searchBox">
        <div class="radio">
          <el-radio-group
            v-model="data.status"
            @change="init"
            size="small"
          >
            <el-radio label border>全部</el-radio>
            <el-radio label="PUTAWAY" border>上架</el-radio>
            <el-radio label="SOLD_OUT" border>下架</el-radio>
          </el-radio-group>
        </div>
        <div class="title">
          <el-form-item prop="title"  can-be-empty>
            <el-input class="inputs" placeholder="请输入标题关键字" size="mini" v-model="data.title"></el-input>
          </el-form-item>
        </div>
        <div class="scene">
          <el-form-item  prop="labelIds">
            <el-select
              class="data"
              v-model="data.labelIds"
              placeholder="请选择文章包含场景"
              size="small"
            >
              <el-option value="">全部</el-option>
              <el-option
                v-for="item in scene"
                :key="item.sceneId"
                :label="item.name"
                :value="item.sceneId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="scene">
          <el-form-item  prop="articleSort" >
            <el-select
              class="data"
              v-model="data.articleSort"
              placeholder="请选择文章排序顺序"
              size="small"
            >
              <el-option
                v-for="item in articleSortGroup"
                :key="item.articleSortId"
                :label="item.name"
                :value="item.articleSortId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="search">
          <el-button type="primary"  size="small" @click="searchs()">搜索</el-button>
        </div>
        <div class="search">
        <el-button type="primary" size="small" @click="$router.push({name:'ARTICLE_RELEASE'})">发布文章</el-button>
        </div>
      </el-form>
    </div>
    <el-table
      class="tableBox"
      :data="tableData"
      border
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
      :row-key="getRowKeys"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column label="封面图" width="120" align="center">
        <template slot-scope="scope">
          <span>
            <img :src="scope.row.headImg" width="100" height="100" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="列表图" width="120" align="center">
        <template slot-scope="scope">
          <span>
            <img :src="scope.row.listImg" width="100" height="100" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="文章标题"  prop="title" align="center"></el-table-column>
      <el-table-column label="副标题"  prop="description" align="center"></el-table-column>
      <el-table-column label="场景" width="250" prop="labels" align="center"></el-table-column>
      <el-table-column label="文章上下架" width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="changeShow(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="PUTAWAY"
            inactive-value="SOLD_OUT">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="点赞数" width="100" prop="likeCount" align="center"></el-table-column>
      <el-table-column label="分享数" width="100" prop="shareCount" align="center"></el-table-column>
      <el-table-column label="文章排序" width="100" prop="articleSort" align="center"></el-table-column>
      <el-table-column  align="center" width="150" label="操作">
        <template slot-scope="scope">
          <router-link class="editBtn" type="primary" round icon="el-icon-edit" :to="{name: 'ARTICLE_RELEASE', query: {id: scope.row.articleId}}">
            <el-button type="primary" round icon="el-icon-edit" size="mini"  @click="edit(scope.row.articleId)"></el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" size="mini" round @click="del(scope.row.articleId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer flex-between">
      <div>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <el-button type="primary" v-if="!checkItem" size="mini" @click="putwayAll('PUTAWAY')">上架</el-button>
        <el-button type="primary" v-if="!checkItem" size="mini" @click="putwayAll('SOLD_OUT')">下架</el-button>
        <el-button type="primary" v-if="!checkItem" size="mini" @click="delAll('Y')">删除</el-button>
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
    
  </div>
</template>


<script>
import {
  articleList,
  postApi,
  articleDel,
  productScenelList,
  articleDelAll,
  articleChangeStatus
} from "@/api/table";
import { stringify } from "querystring";
export default {
  name: "ARTICLE_LIST",
  data() {
    return {
      data: {
        listType: "", // 顶部按钮
        title: "", // 文章标题
        labelIds: "", // 标签id
        memberId: "", // 商户id
        status:"",//状态
        articleSort:"",
        page: 1,
        size: 10
      },
      articleSortGroup:[
        {
          articleSortId:"1",
          name:"根据创建时间排序"
        },
        {
          articleSortId:"2",
          name:"根据序号降序"
        },
        {
          articleSortId:"3",
          name:"根据序号升序"
        }
      ],
      scenes:'',
      scene:[],
      tableData: [],
      checkAll: false,
      isIndeterminate: false,
      count: 0,
      multipleSelection: [],
      articleLists: []
    };
  },
  props: {
    checkItem: Boolean,
    selectArr: Array
  },
  created() {
    productScenelList().then(res => {
      this.scene = res.data;
    //解析表单数据
  })
    this.init()
  },
  methods: {
    init() {
      window.sessionStorage.setItem('articleSearch',JSON.stringify(this.data));
      let data = JSON.parse(JSON.stringify(this.data));
      data.page --;
      articleList(data).then(result => {
        this.count = result.data.count;
        this.tableData = result.data.articleLists;
      this.tableData.forEach(item => {
        item.labels= item.labels.toString().replace(/,/g," | ")
      })
    });
    },
    handleCurrentChange(val) {
      this.data.page = val;
      this.init();
      console.log(`当前页: ${val}`);
    },
    getRowKeys(row) {
      // 给表格每行增加一个唯一 标识，用作切换分页后保留被选中行的信息
      return row.articleId;
    },
    searchs() {
      this.$refs.searchs.validate(valid => {
        if (valid) {
          this.init();
        } else {
          console.log("error submit!!");
      return false;
    }
    });
    },
    changeShow(row){
      var url = ''
      if(row.status=='PUTAWAY'){
        url = '/article/info/putAway'
      }else{
        url = '/article/info/soldOut'
      }
      postApi({articleId:row.articleId},url).then((res) => {
        this.$message({
          message:res.data,
          type: 'success'
        })
      }).catch((err) => {

      });
    },
    edit(articleId){
      console.log(articleId)
    },
    del(articleId){
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
        articleDel({ articleId: articleId })
        .then(res => {
        this.$message({
        type: "success",
        message: "操作成功"
      });
      this.init();
    })
    .catch(err => {});
    })
    .catch(() => {
        this.$message({
        type: "info",
        message: "已取消删除"
      });
    });
    },
    //全选,取消选择
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
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
    //监听选择的内容
      handleSelectionChange(val) {
       //val 为选中数据的集合
        this.multipleSelection = val;
        console.log(this.multipleSelection)
      },
    //批量上/下架
    putwayAll(status){
      if(this.$refs.multipleTable.selection.length == 0){
        this.$message({
          message: "请选择需要操作的文章",
          type: "warning"
        });
        return;
      }
      let data = {articleIds:"",status:status}
      this.$refs.multipleTable.selection.forEach(e => {
        data.articleIds += e.articleId + ","
      });
      articleChangeStatus(data)
      .then(result => {
        if (result.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            setTimeout(() => {
              this.updataInfo = 2;
              this.init(); 
            }, 2000);
            //跳转到列表
          } else {
            this.$message.error(result.description);
            this.updataInfo = 2;
          }
    })
    .catch(err => {});
    },
    //批量删除
    delAll(status){
      if(this.$refs.multipleTable.selection.length == 0){
        this.$message({
          message: "请选择需要操作的文章",
          type: "warning"
        });
        return;
      }
      let data = {articleIds:"",status:status}
      this.$refs.multipleTable.selection.forEach(e => {
        data.articleIds += e.articleId + ","
      });
      articleDelAll(data)
      .then(result => {
        if (result.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            setTimeout(() => {
              this.updataInfo = 2;
              this.init(); 
            }, 2000);
            //跳转到列表
          } else {
            this.$message.error(result.description);
            this.updataInfo = 2;
          }
    })
    .catch(err => {});
    },
  },
};
</script>








