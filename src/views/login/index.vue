<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">鹅小满登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      //   callback(new Error('Please enter the correct user name'))
      // } else {
        callback()
      // }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
          const query = route.query
          if (query) {
              this.redirect = query.redirect
              this.otherQuery = this.getOtherQuery(query)
          }
      },
      immediate: true
    }
  },
  created(){
/*      if(getToken()){
          var route = JSON.parse(window.sessionStorage.getItem('route'));
          console.log(route);
          let menu = [];
          route.forEach(e => {
              if(e.moduleType === "MENU"){
                  menu.push(e);
              }
          });
          var name = '';
          for (let i = 0; i < menu.length; i++) {
              if(menu[i].routeCode){
                  name = menu[i].routeCode;
                  break;
              }
          }
          this.$router.push({ name: name});
         /!* // console.log(JSON.stringify(route));
          //组装菜单列表
          let menuParentArr = [];
          let menuChildArr = [];
          let menu = [];
          route.forEach(e => {
              //组装一级菜单
              if(e.moduleType === "MENU" && e.moduleParentTreeCode == -1) {
                  e.child = [];
                  menuParentArr.push(e)
              }
              //非一级菜单
              if(e.moduleType === "MENU" && e.moduleParentTreeCode != -1){
                  menuChildArr.push(e)
              }
          });
          //遍历一级菜单，插入所属二级菜单
          menuParentArr.forEach(item  => {
              menuChildArr.forEach(child => {
                  if(item.moduleTreeCode === child.moduleParentTreeCode){
                      item.child.push(child);
                  }
              });
          });
          //组装路由
          menuParentArr.forEach(e => {
              let routeItem = {
                  path: e.moduleUrl,
                  meta: { title: e.moduleName },
                  redirect:'',
                  children: []
              };
              e.child.forEach( (i, index) => {
                  /!*添加二级菜单 children component: () => import()   不能使用变量，必须用模板字符串 *!/
                  routeItem.children.push(
                      {
                          path: i.moduleUrl.split('/')[i.moduleUrl.split('/').length-1],
                          component: () => import(`@/views${i.moduleUrl}`),
                          name: i.routeCode,
                      });
                  //如果有首页菜单权限那就跳首页
                  if(index === 0 && e.moduleUrl === '/'){
                      routeItem.redirect = i.moduleUrl.split('/')[i.moduleUrl.split('/').length-1];
                  }
                  if(index === 0 && routeItem.redirect === ''){
                      routeItem.redirect = i.moduleUrl
                  }
              });
              menu.push(routeItem);
          });
          console.log(menu);
          this.$router.push({ name: menu[0].children[0].name});*!/
        /!*          var name = '';
                  for (let i = 0; i < route.length; i++) {
                      if(route[i].routeCode){
                          name = route[i].routeCode;
                          break;
                      }
                  }
                  this.$router.push({ name: name});*!/
      }*/
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('user/login', this.loginForm).then(() => {
              try {
              let route = JSON.parse(window.sessionStorage.getItem('route'))
                try {
                    let menu = [];
                    route.forEach(e => {
                        if(e.moduleType === "MENU"){
                            menu.push(e);
                        }
                    });
                    var name = '';
                    for (let i = 0; i < menu.length; i++) {
                        if(menu[i].routeCode){
                            name = menu[i].routeCode;
                            break;
                        }
                    }
                    this.$router.push({ name: name});
 /*                 // console.log(JSON.stringify(route));
                  //组装菜单列表
                  let menuParentArr = [];
                  let menuChildArr = [];
                  let menu = [];
                  route.forEach(e => {
                      //组装一级菜单
                      if(e.moduleType === "MENU" && e.moduleParentTreeCode == -1) {
                          e.child = [];
                          menuParentArr.push(e)
                      }
                      //非一级菜单
                      if(e.moduleType === "MENU" && e.moduleParentTreeCode != -1){
                          menuChildArr.push(e)
                      }
                  });
                  //遍历一级菜单，插入所属二级菜单
                  menuParentArr.forEach(item  => {
                      menuChildArr.forEach(child => {
                          if(item.moduleTreeCode === child.moduleParentTreeCode){
                              item.child.push(child);
                          }
                      });
                  });
                  //组装路由
                  menuParentArr.forEach(e => {
                      let routeItem = {
                          path: e.moduleUrl,
                          meta: { title: e.moduleName },
                          redirect:'',
                          children: []
                      };
                      e.child.forEach( (i, index) => {
                          /!*添加二级菜单 children component: () => import()   不能使用变量，必须用模板字符串 *!/
                          routeItem.children.push(
                              {
                                  path: i.moduleUrl.split('/')[i.moduleUrl.split('/').length-1],
                                  component: () => import(`@/views${i.moduleUrl}`),
                                  name: i.routeCode,
                              });
                          //如果有首页菜单权限那就跳首页
                          if(index === 0 && e.moduleUrl === '/'){
                              routeItem.redirect = i.moduleUrl.split('/')[i.moduleUrl.split('/').length-1];
                          }
                          if(index === 0 && routeItem.redirect === ''){
                              routeItem.redirect = i.moduleUrl
                          }
                      });
                      menu.push(routeItem);
                  });
                  console.log(menu);
                  this.$router.push({ name: menu[0].children[0].name});*/
                  // this.$router.push({ path: menu[0].children[0].path});
              } catch (error) {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              }
              this.loading = false
            } catch (error) {
              console.log(error);
            }
          }).catch((err) => {
            this.$message.error(err.message)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
      getOtherQuery(query) {
          return Object.keys(query).reduce((acc, cur) => {
              if (cur !== 'redirect') {
                  acc[cur] = query[cur]
              }
              return acc
          }, {})
      }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 120px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
