

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.overview {
  width: 100%;
  height: 100px;
  .item {
    width: 19%;
    height: 100px;
    border: 1px solid #ddd;
    position: relative;
    padding-left: 90px;
    border-radius: 4px;
    img {
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translate(0, -50%);
    }
    .data_box {
      flex-direction: column;
      height: 100%;
      p {
        width: 100%;
        margin: 8px 0;
      }
    }
  }
}
.tableBox {
  width: 100%;
  margin-top: 20px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #f2f2f2;
  .tab_title {
    width: 100%;
    height: 40px;
    padding-left: 10px;
    background: rgb(228, 228, 228);
    display: flex;
    align-items: center;
    color: #333;
  }
}

.handle {
  @include flex-between;
  flex-wrap: wrap;
  padding: 0 20px;
  .item {
    cursor: pointer;
    padding: 0 20px;
    width: 45%;
    height: 40px;
    border-bottom: 1px solid #f5f5f5;
    @include flex-between;
  }
  .item:hover{
    background: rgb(243, 243, 243);
  }
}

.quick {
  @include flex-between;
  width: 100%;
  height: 140px;
  .item {
    width: calc(100% / 8);
    height: 140px;
    @include flex-center;
    flex-direction: column;
  }
  .item:hover {
    background: #f8f8f8;
  }
  .img{
    width: 60px;
    height: 60px;
    @include flex-center;
  }
}

.dataOverview {
  width: 100%;
  @include flex-between;
  .tableBox {
    width: 49%;
  }
  .datas {
    height: 160px;
    @include flex-center;
    .item {
      width: calc(100% / 3);
      height: 160px;
      @include flex-center;
      flex-direction: column;
      p {
        margin-bottom: 20px;
        font-size: 26px;
        color: rgb(255, 0, 0);
      }
    }
    i {
      width: 1px;
      height: 100px;
      background: #f2f2f2;
    }
  }
}
</style>


<template>
  <div>
    <div class="overview flex-between">
      <div class="item">
        <img src="../../assets/home/u54.png" alt />
        <div class="data_box flex-center">
          <p>今日订单总数</p>
          <p>{{data.todayOrderCount||0}}</p>
        </div>
      </div>
      <div class="item">
        <img src="../../assets/home/u54.png" alt />
        <div class="data_box flex-center">
          <p>历史订单总数</p>
          <p>{{data.totalOrderCount||0}}</p>
        </div>
      </div>
      <div class="item">
        <img src="../../assets/home/u59.png" alt />
        <div class="data_box flex-center">
          <p>昨日新增用户</p>
          <p>{{data.todayAddUserCount||0}}</p>
        </div>
      </div>
      <div class="item">
        <img src="../../assets/home/u69.png" alt />
        <div class="data_box flex-center">
          <p>今日销售总额</p>
          <p>￥ {{$util.prices(data.todayOrderAmountTotal)||0}}</p>
        </div>
      </div>
      <div class="item">
        <img src="../../assets/home/u69.png" alt />
        <div class="data_box flex-center">
          <p>历史销售总额</p>
          <p>￥ {{$util.prices(data.orderAmountTotal)||0}}</p>
        </div>
      </div>
    </div>
    <div class="tableBox">
      <p class="tab_title">待处理事务</p>
      <div class="handle flex-between">
        <div class="item" @click="orderTo('PRODUCT_DELIVERY')">
          <p>订单总数</p>
          <p>（{{data.deliveryOrderCount||0}}）</p>
        </div>
        <div class="item" @click="orderTo('PRODUCT_DELIVERY','WATTING')">
          <p>待发货订单</p>
          <p>（{{data.waitingDeliveryOrderCount||0}}）</p>
        </div>
        <div class="item" @click="orderTo('PRODUCT_DELIVERY','DELIVERYING')">
          <p>待收货订单</p>
          <p>（{{data.waitingReceiveOrderCount||0}}）</p>
        </div>
        <div class="item" @click="orderTo('PRODUCT_DELIVERY','DELIVERED')">
          <p>已完成订单数</p>
          <p>（{{data.finishedOrderCount||0}}）</p>
        </div>
      </div>
    </div>
    <div class="tableBox">
      <p class="tab_title">运营快捷操作</p>
      <div class="quick">
        <router-link :to="{name: 'PRODUCT_RELEASE'}" class="item">
          <div class="img">
            <img src="../../assets/home/u100.png" alt />
          </div>
          <p>发布商品</p>
        </router-link>
        <router-link :to="{name: 'PRODUCT_ORDER_LIST'}" class="item">
          <div class="img">
            <img src="../../assets/home/u1.png" alt />
          </div>
          <p>订单管理</p>
        </router-link>
        <router-link :to="{name: 'HOME_ACCOUNT_LIST'}" class="item">
          <div class="img">
            <img src="../../assets/home/u113.png" alt />
          </div>
          <p>用户管理</p>
        </router-link>
        <router-link :to="{name: 'PRODUCT_DELIVERY'}" class="item">
          <div class="img">
            <img src="../../assets/home/u116.png" alt />
          </div>
          <p>订单查询</p>
        </router-link>
        <router-link :to="{name: 'COUPON_COUPON_CREATE'}" class="item">
          <div class="img">
            <img src="../../assets/home/u119.png" alt />
          </div>
          <p>实卡生成</p>
        </router-link>
        <!-- <router-link :to="{name: ''}" class="item">
          <div class="img">
            <img src="../../assets/home/aaaaaa.png" alt />
          </div>
          <p>统计报告</p>
        </router-link>
        <router-link :to="{name: ''}" class="item">
          <div class="img">
            <img src="../../assets/home/aaaaaa.png" alt />
          </div>
          <p>库存管理</p>
        </router-link>
        <router-link :to="{name: ''}" class="item">
          <div class="img">
            <img src="../../assets/home/aaaaaa.png" alt />
          </div>
          <p>供货商结算</p>
        </router-link> -->
      </div>
    </div>
    <div class="dataOverview">
      <div class="tableBox">
        <p class="tab_title">商品数据总览</p>
        <div class="datas">
          <div class="item">
            <p>{{data.groundedCount||0}}</p>
            <span>上架商品总数</span>
          </div>
          <i></i>
          <div class="item">
            <p>{{data.unGroundedCount||0}}</p>
            <span>已下架商品</span>
          </div>
          <i></i>
          <div class="item">
            <p>{{data.totalCount||0}}</p>
            <span>商品总数</span>
          </div>
        </div>
      </div>
      <div class="tableBox">
        <p class="tab_title">用户数据总览</p>
        <div class="datas">
          <div class="item">
            <p>{{data.todayAddUserCount||0}}</p>
            <span>昨日新增用户</span>
          </div>
          <i></i>
          <div class="item">
            <p>{{data.bindMobileUserCount||0}}</p>
            <span>绑定手机用户</span>
          </div>
          <i></i>
          <div class="item">
            <p>{{data.totalUserCount||0}}</p>
            <span>全部用户数</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import {userCounter,productCounter,orderCounter,deliveryCounter} from '@/api/table';
import { mapGetters } from "vuex";

// let echarts = require("echarts/lib/echarts");
// require("echarts/lib/chart/line");
// require("echarts/lib/component/tooltip");
// require("echarts/lib/component/toolbox");
// require("echarts/lib/component/legend");
// require("echarts/lib/component/markLine");

export default {
  name: "HOME_DASHBOARD",
  data() {
    return {
      data:{}
    };
  },
  created() {
    this.getData()
  },
  methods:{
    orderTo(name,status){
      this.$router.push({name:name,query:{status:status}})
    },
    getData(){
      var data= {},
          num=0,
          self = this;
      function suc(res) {
        for (const k in res) {
          data[k] = res[k]
        }
        if(num == 4){
          self.$set(self,'data',data)
        }
      }
      userCounter().then((res) => {
        num++
        suc(res.data)
      }).catch((err) => {num++});
      productCounter().then((res) => {
        num++
        suc(res.data)
      }).catch((err) => {num++});
      orderCounter().then((res) => {
        num++
        suc(res.data)
      }).catch((err) => {num++});
      deliveryCounter().then((res) => {
        num++
        res.data.deliveryOrderCount = res.data.totalOrderCount
        delete res.data.totalOrderCount
        suc(res.data)
      }).catch((err) => {num++});
    }
  }
};
</script>
