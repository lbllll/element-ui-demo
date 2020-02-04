<template>
  <div class="header_box">
    <div class="heder_inner" :class="classObj">
      <div class="navHead">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo navItem"
          mode="horizontal"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#fff"
          @select="handleSelect"
        >
          <!-- 
        遍历路由结构，顶部直接展示一级路由
        从第三级路由开始，需要拼接除item级以外，其他祖级路由链接，否则会进入404页面
          -->
          <template v-for="(item,index) in routes">
            <app-link
              class="appLink"
              :key="item.name"
              v-if="!item.children"
              :to="resolvePath(item.path)"
            >
              <el-menu-item v-if="!item.children" :index="(index)+''">{{item.meta.title}}</el-menu-item>
            </app-link>
            <!-- 
            外层div为了绑定点击事件，点击一级路由时 就要渲染左侧导航栏。
            -->
            <div v-else :key="item.name" class="appLink" @click="handleSelect(index,'appLink')">
              <el-submenu :index="(index)+''">
                <template slot="title">{{item.meta.title}}</template>
                <template v-for="(child,i) in item.children">
                  <app-link
                    v-if="!child.children&&!child.hidden"
                    :key="child.name"
                    :to="resolvePath(child.path,item.path)"
                  >
                    <el-menu-item :index="(index)+'-'+(i)">{{child.meta.title}}</el-menu-item>
                  </app-link>

                  <el-submenu :key="child.name" :index="(index)+'-'+(i)" v-else-if="!child.hidden">
                    <template slot="title">{{child.meta.title}}</template>
                    <template v-for="(three,n) in child.children">
                      <app-link
                        :key="three.name"
                        v-if="!three.children"
                        :to="resolvePath((child.path+'/'+three.path),item.path)"
                      >
                        <el-menu-item :index="(index)+'-'+(i)+'-'+(n)">{{three.meta.title}}</el-menu-item>
                      </app-link>

                      <el-submenu :key="three.name" :index="(index)+'-'+(i)+'-'+(n)" v-else>
                        <template slot="title">{{three.meta.title}}</template>
                        <app-link
                          v-for="(four,x) in three.children"
                          :key="four.name"
                          :to="resolvePath((child.path+'/'+three.path+'/'+four.path),item.path)"
                        >
                          <el-menu-item :index="(index)+'-'+(i)+'-'+(n)+'-'+(x)">{{four.meta.title}}</el-menu-item>
                        </app-link>
                      </el-submenu>
                    </template>
                  </el-submenu>
                </template>
              </el-submenu>
            </div>
          </template>
        </el-menu>

        <div class="right-menu">
          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <img :src="avatar" class="user-avatar" />
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <router-link to="/">
                <el-dropdown-item>首页</el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
                <span style="display:block;" @click="logout">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="navbar">
        <hamburger
          :is-active="sidebar.opened"
          class="hamburger-container"
          @toggleClick="toggleSideBar"
        />
        <breadcrumb class="breadcrumb-container" />
      </div>
    </div>
  </div>
</template>

<script>
import path from "path";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import AppLink from "./Sidebar/Link";
import { isExternal } from "@/utils/validate";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    AppLink
  },
  computed: {
    ...mapGetters(["sidebar"]),
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      routes: [],
      avatar:''
    };
  },
  mounted() {
    this.avatar = window.sessionStorage.getItem('avatar')

    var route = this.$router.options.routes;
    var list = [];
    /* 
        改造导航栏结构，抽取一级导航栏，从二级导航栏开始展示
        一级导航栏改为顶部展示。
        写路由时，第一层添加type值，对应一级分类名称。
        遍历路由数组，取出被选中的菜单子级。
      */
    route.forEach(e => {
      if (e.type) {
        list.push(e);
      }
    });
    this.routes = list;
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    resolvePath(routePath, parentPath) {
      parentPath = parentPath ? parentPath : "";
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(parentPath)) {
        return parentPath;
      }
      return path.resolve(parentPath, routePath);
    },
    handleSelect(key, keyPath) {
      var i = this.routes[parseInt(key)].type;
      this.$store.commit("user/SetNavIndex", i);
      if (keyPath == "appLink") {
        try {
          this.$router.push({
            name: this.routes[parseInt(key)].children[0].name
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header_box {
  height: 111px;
}
.heder_inner {
  position: fixed;
  top: 0;
  left: 210px;
  right: 0;
  z-index: 1999;
  background: #fff;
  transition: left 0.28s;
}
.hideSidebar.heder_inner {
  left: 54px;
}
.withoutAnimation {
  transition: left 0s;
}
.mobile.heder_inner {
  left: 0px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
}

.navHead {
  height: 61px;
  position: relative;
}

.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);

  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-right: 30px;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.appLink {
  float: left;
}
</style>
