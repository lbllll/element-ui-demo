

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
.titleP {
  line-height: 80px;
  font-size: 36px;
  width: 100%;
  text-align: center;
}
</style>


<template>
  <div class="bodyBox" id="HOME_AUTH_LIST">
    <div>
      <p class="titleP">操作权限</p>
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
    </div>

    <div>
      <p class="titleP">菜单权限</p>
      <!-- <el-checkbox-group v-model="Mselect">
        <div class="tableBox" v-for="(item, index) in Mtree" :key="index">
          <el-checkbox class="title" :key="item.id" :label="item.id">{{item.label}}</el-checkbox>
          <div class="content">
            <el-checkbox
              v-for="(child, i) in item.children"
              :key="i"
              :label="child.id"
            >{{child.label}}</el-checkbox>
          </div>
        </div>
      </el-checkbox-group>-->
      <el-tree
        ref="tree"
        :data="Mtree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="Mselect"
        :props="defaultProps"
        @check-change="handleCheckChange"
      ></el-tree>
      <!-- <div>
        <el-button type="primary" @click="McheckAll">全选</el-button>
        <span>(此操作默认为admin超级管理员权限)</span>
      </div>-->
      <el-button class="submitBtn" type="primary" @click="submit">保存提交</el-button>
    </div>
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
      count: 0,
      Mtree: [],
      Mselect: [],
      Mchange: [],
      Mcount: 0,
      defaultProps: {
        children: "children",
        label: "label"
      }
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
    var Mobj = {};
    getUsableList({ targetId: this.$route.query.id })
      .then(res => {
        if (res.code == 200) {
          try {
            var select = [],
              tree = [],
              Mselect = [],
              Mtree = [];
            var authList = res.data.authList;
            var paixu = [];
            res.data.menuList.forEach(e => {
              if (e.permission.parent == "-1") {
                paixu.push(e);
              }
            });
            res.data.menuList.forEach(e => {
              if (e.permission.parent != "-1") {
                paixu.push(e);
              }
            });
            var menuList = paixu;
            this.count = authList.length;
            this.Mcount = menuList.length;
            authList.forEach((r, i) => {
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
            menuList.forEach((r, i) => {
              var e = r.permission;
              if (r.isAuthorize == "Y") {
                Mselect.push(e.permissionId);
              }
              if (e.parent == "-1") {
                Mobj[e.permissionId] = {
                  label: e.name,
                  id: e.permissionId,
                  children: []
                };
              } else {
                Mobj[e.parent].children.push({
                  id: e.permissionId,
                  label: e.name
                });
              }
            });
            for (const k in obj) {
              tree.push(obj[k]);
            }
            for (const k in Mobj) {
              Mtree.push(Mobj[k]);
            }
            this.tree = tree;
            this.select = select;
            this.Mtree = Mtree;
            this.Mselect = Mselect;
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
      this.Mselect.forEach(e => {
        data.permissionIds += e + ",";
      });
      data.permissionIds = this.$util.delLast(data.permissionIds);
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
    },
    McheckAll() {
      if (this.Mselect.length == this.Mcount) {
        this.Mselect = [];
      } else {
        var list = [];
        this.Mtree.forEach(e => {
          e.children.forEach(i => {
            list.push(i.id);
          });
        });
        this.Mselect = list;
      }
    },
    handleCheckChange() {
      let res = this.$refs.tree.getCheckedNodes();
      let arr = [];
      res.forEach(item => {
        arr.push(item.id);
      });
      this.Mselect = arr
    }
  }
};
</script>
