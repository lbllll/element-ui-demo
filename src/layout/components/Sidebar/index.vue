<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        class="navBar_box"
      >
        <sidebar-item
          v-for="(route,index) in routeList"
          :key="index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      path: "",
      routeList: []
    };
  },
  watch: {
    navIndex: function(old, newd) {
      this.getList();
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      /*
        刷新页面后，vuex里存储的数据会重置，需要遍历匹配当前页面所对应的路由
      */
      let self = this;
      setTimeout(() => {
        let route = JSON.parse(JSON.stringify(self.$router.options.routes));
        let list = [];
        route.forEach(e => {
            self.$store.commit("user/SetNavIndex");
        });
        /*try {
          /!*
          改造导航栏结构，抽取一级导航栏，从二级导航栏开始展示
          一级导航栏改为顶部展示。
          写路由时，第一层添加type值，对应一级分类名称。
          遍历路由数组，取出被选中的菜单子级。
        *!/
          route.forEach(e => {
            if (e.type == self.$store.state.user.navIndex) {
              self.path = e.path;
                list.push(e);
/!*              if (e.children && e.children.length > 0) {
                e.children.forEach(c => {
                  c.path = JSON.parse(JSON.stringify(e.path)) + "/" + c.path;
                  list.push(c);
                });
              } else {
                list.push(e);
              }*!/
            }
          });
        } catch (error) {
          console.log(error);
        }*/
        self.routeList = route;
      }, 100);
    }
  },
  computed: {
    ...mapGetters(["sidebar"]),
    navIndex() {
      return this.$store.state.user.navIndex;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
