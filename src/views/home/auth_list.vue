

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.bodyBox {
  padding-bottom: 30px;
}
.tableBox {
  margin-bottom: 15px;
  border: 1px solid #f5f5f5;
  border-radius: 2px;
  .title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    background: #f5f5f5;
    color: #000;
    font-size: 14px;
  }
  .content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px;
    .el-checkbox {
      width: 160px;
      padding: 6px 0;
    }
  }
}
.submitBtn {
  display: block;
  margin: auto;
  margin-top: 20px;
}
</style>


<template>
  <div class="bodyBox" id="HOME_AUTH_LIST">
    <el-checkbox-group v-model="select">
      <div class="tableBox" v-for="(item, index) in tree" :key="index">
        <div class="title">{{item.label}}</div>
        <div class="content">
          <el-checkbox
            v-for="(child, i) in item.children"
            :key="i"
            :label="child.id"
          >{{child.label}}</el-checkbox>
        </div>
      </div>
    </el-checkbox-group>
    <div>
      <el-button type="primary" @click="checkAll">全选</el-button>
      <span>(此操作默认为admin超级管理员权限)</span>
    </div>
    <el-button class="submitBtn" type="primary" @click="submit">保存提交</el-button>
  </div>
</template>


<script>
import { getUsableList, userAuthorize } from "@/api/table";

export default {
  name: "HOME_AUTH_LIST",
  data() {
    return {
      tree: [],
      select: [],
      count: 0
    };
  },
  created() {
    if (!this.$route.query.id) {
      this.$message.error("无效用户");
      var self = this;
      setTimeout(() => {
        self.$router.push({ name: "HOME_ACCOUNT_LIST" });
      }, 1000);
      return;
    }
    var obj = {};
    getUsableList({ targetId: this.$route.query.id })
      .then(res => {
        if (res.code == 200) {
          try {
            var select = [],
              tree = [];
            this.count = res.data.length;
            res.data.forEach((r, i) => {
              var e = r.permission;
              if (r.isAuthorize == "Y") {
                select.push(e.permissionId);
              }
              if (!obj[e.code]) {
                obj[e.code] = {
                  label: e.code,
                  children: []
                };
              }
              obj[e.code].children.push({
                id: e.permissionId,
                label: e.name
              });
            });
            for (const k in obj) {
              tree.push(obj[k]);
            }
            this.tree = tree;
            this.select = select;
          } catch (error) {
            console.log(error);
          }
        }
      })
      .catch(err => {});
  },
  methods: {
    submit() {
      var data = {
        targetUserId: this.$route.query.id,
        permissionIds: ""
      };
      this.select.forEach(e => {
        data.permissionIds += e + ",";
      });
      data.permissionIds = this.$util.delLast(data.permissionIds);
      console.log(data);
      userAuthorize(data)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            var self = this;
            setTimeout(() => {
              self.$router.back();
            }, 1000);
          }
        })
        .catch(err => {});
    },
    checkAll() {
      if (this.select.length == this.count) {
        this.select = [];
      } else {
        var list = [];
        this.tree.forEach(e => {
          e.children.forEach(i => {
            list.push(i.id);
          });
        });
        this.select = list;
      }
    }
  }
};
</script>
