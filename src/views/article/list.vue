



<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
</style>


<template>
  <div class="bodyBox" id="">
    <el-table
      :data="tableData"
      border
      :header-cell-style="{background:'#afafaf',color:'#606266'}"
    >
      <el-table-column
        label="文章标题"  width="400" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标签"  width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.labels}}</span>
        </template>
      </el-table-column>

      <!--      <el-table-column
              label="标签id">
              <template slot-scope="scope">
                <span>{{ scope.row.labelIds}}</span>
              </template>
            </el-table-column>-->

      <el-table-column
        label="封面图" width="120" align="center" >
        <template slot-scope="scope">
          <span><img :src="scope.row.headImg" width="100" height="100"></span>
        </template>
      </el-table-column>

      <el-table-column
        label="副标题" width="400" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="点赞数" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.likeCount}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="分享数" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shareCount}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="商户id" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.memberId}}</span>
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
    articleList
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
        articleLists:[]
      };
    },
    props: {
      checkItem: Boolean,
      selectArr: Array
    },
    created() {

    },
    methods: {
      init() {
        this.data.page=0;
        this.data.size=10;
        articleList(this.data).then(result => {
          this.count = result.data.count;
        this.tableData = result.data.articleLists;
      })
      },
      handleCurrentChange(val) {
        this.data.page = val;
        this.getList();
        console.log(`当前页: ${val}`);
      },
    },
    mounted(){
      this.init()
    }
  }
</script>








