



<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
</style>


<template>
  <div class="bodyBox" id>
    <el-table :data="tableData" border :header-cell-style="{background:'#afafaf',color:'#606266'}">
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
      <el-table-column label="标签" width="250" prop="labels" align="center"></el-table-column>
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
      <el-table-column  align="center" width="150" label="操作">
        <template slot-scope="scope">
          <router-link class="editBtn" type="primary" round icon="el-icon-edit" :to="{name: 'ARTICLE_RELEASE', query: {id: scope.row.articleId}}">
            <el-button type="primary" round icon="el-icon-edit" size="mini"  @click="edit(scope.row.articleId)"></el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" size="mini" round @click="del(scope.row.articleId)"></el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="data.page"
      :page-size="10"
      background
      layout="total, prev, pager, next, jumper"
      :total="count"
    ></el-pagination>
  </div>
</template>


<script>
import {
  articleList,
  postApi,
  articleDel
} from "@/api/table";
export default {
  name: "ARTICLE_LIST",
  data() {
    return {
      data: {
        title: "", // 文章标题
        labelIds: "", // 标签id
        memberId: "", // 商户id
        page: 1,
        size: 10
      },
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
  created() {},
  methods: {
    init() {
      this.data.page = 0;
      this.data.size = 10;
      articleList(this.data).then(result => {
        this.count = result.data.count;
        this.tableData = result.data.articleLists;
      });
    },
    handleCurrentChange(val) {
      this.data.page = val;
      this.getList();
      console.log(`当前页: ${val}`);
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
        console.log(res);
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
  },
  mounted() {
    this.init();
  }
};
</script>








