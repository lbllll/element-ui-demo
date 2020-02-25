import Vue from 'vue'

/**
 * 实时时间转换指令，大于一个月则返回具体的年月日
 * @param { string } timeStamp - 时间 格式：年-月-日 时:分:秒 或 时间戳
 * @returns { string }
 */
function getFormatTime(timeStamp){
  let dateTime = new Date(timeStamp);
  let no1new = dateTime.valueOf();
  let year = dateTime.getFullYear();
  let month = dateTime.getMonth() + 1;
  let day = dateTime.getDate();
  let hour = dateTime.getHours();
  let minute = dateTime.getMinutes();
  let second = dateTime.getSeconds();
  let now = new Date();
  let now_new = now.valueOf();
  let milliseconds = 0;
  let timeSpanStr;

  milliseconds = now_new - no1new;

  if (milliseconds <= 1000 * 60 * 1) {
    timeSpanStr = '刚刚';
  }else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
    timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
  }else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
  }else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
  }else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
    timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    // timeSpanStr = year + '-' + month + '-' + day
  }else {
    timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    // timeSpanStr = year + '-' + month + '-' + day
  }

  return timeSpanStr;
}

function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y+M+D+h+m+s;
}

Vue.directive('time', {
  bind: function(el, binding){
    el.innerHTML = getFormatTime(binding.value);
    //每隔一分钟更新一次
    el.__timeout__ = setInterval(function(){
      el.innerHTML = getFormatTime(binding.value);
    }, 60000);
  },
  unbind: function(el){
    clearInterval(el.__timeout__);
    delete el.__timeout__;
  }
});
export default {
  getFormatTime,
  timestampToTime
}
