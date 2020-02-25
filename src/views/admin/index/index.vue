

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
    <span>这是首页</span>
  </div>
</template>


<script>
import {

} from '@/api/table';
import { mapGetters } from "vuex";


export default {
  name: "INDEX",
  data() {
    return {
      data:{}
    };
  },
  created() {
    // this.getData()
  },
  methods:{
    orderTo(name,status){
      this.$router.push({name:name,query:{status:status}})
    },
    // getData(){
    //   var data= {},
    //       num=0,
    //       self = this;
    //   function suc(res) {
    //     for (const k in res) {
    //       data[k] = res[k]
    //     }
    //     if(num == 4){
    //       self.$set(self,'data',data)
    //     }
    //   }
    //   userCounter().then((res) => {
    //     num++
    //     suc(res.data)
    //   }).catch((err) => {num++});
    //   productCounter().then((res) => {
    //     num++
    //     suc(res.data)
    //   }).catch((err) => {num++});
    //   orderCounter().then((res) => {
    //     num++
    //     suc(res.data)
    //   }).catch((err) => {num++});
    //   deliveryCounter().then((res) => {
    //     num++
    //     res.data.deliveryOrderCount = res.data.totalOrderCount
    //     delete res.data.totalOrderCount
    //     suc(res.data)
    //   }).catch((err) => {num++});
    // }
  }
};
</script>
