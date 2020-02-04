

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


<template>
  <div class="bodyBox">
    <!-- <el-radio-group v-model="radio">
      <el-radio-button label="操作日志"></el-radio-button>
      <el-radio-button label="登陆日志"></el-radio-button>
    </el-radio-group> -->
    <div class="header flex">
      <el-input class="inputs" placeholder="请输入内容" v-model="data.nickName">
        <template slot="prepend">操作人员</template>
      </el-input>
      <el-date-picker
        v-model="data.time"
        type="daterange"
        class="times"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <el-button type="primary" @click="getList">查询</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column prop="operateAccount" align="center" label="操作用户" width="260"></el-table-column>
      <el-table-column prop="createTime" align="center" label="操作时间" width="260"></el-table-column>
      <el-table-column prop="operateIp" align="center" label="ip记录"></el-table-column>
      <el-table-column prop="operateContent" align="center" label="操作记录"></el-table-column>
      <el-table-column prop="params" align="center" label="操作参数"></el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px"
      @current-change="handleCurrentChange"
      :current-page="data.page"
      background
      layout="total, prev, pager, next, jumper"
      :total="countNum"
    ></el-pagination>
  </div>
</template>


<script>
import { userLog } from "@/api/table";

export default {
  name: "HOME_LOG",
  data() {
    return {
      radio: "操作日志",
      data: {
        nickName: "",
        time: "",
        page: 1
      },
      countNum: 0,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableData: []
    };
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      var data  = JSON.parse(JSON.stringify(this.data))
      console.log(data);
      data.beginDate = data.time[0]||''
      data.endDate = data.time[1]||''
      data.page--
      delete data.time
      userLog(data).then((res) => {
        this.countNum = res.data.count
        this.tableData = res.data.data
      }).catch((err) => {
        
      });
    },
    handleCurrentChange(val) {
      this.data.page = val;
      this.getList();
      console.log(`当前页: ${val}`);
    }
  }
};
</script>
