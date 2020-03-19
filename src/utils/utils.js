/**
 * Created by PanJiaChen on 16/11/18.
 */
import _ from 'lodash'

export default {

  /**
   * Parse the time to string
   * @param {(Object|string|number)} time
   * @param {string} cFormat
   * @returns {string}
   */
  parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      }
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  },

  /**
   * @param {number} time
   * @param {string} option
   * @returns {string}
   */
  formatTime(time, option) {
    if (('' + time).length === 10) {
      time = parseInt(time) * 1000
    } else {
      time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) {
      // less 1 hour
      return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
      return '1天前'
    }
    if (option) {
      return parseTime(time, option)
    } else {
      return (
        d.getMonth() +
        1 +
        '月' +
        d.getDate() +
        '日' +
        d.getHours() +
        '时' +
        d.getMinutes() +
        '分'
      )
    }
  },

  /**
   * @param {string} url
   * @returns {Object}
   */
  param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
      return {}
    }
    return JSON.parse(
      '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
    )
  },

  // var arr = {
  //   a: ['红', '黄', '蓝', '绿'],
  //   b: ['大', '中', '小'],
  //   c: ['A', 'B', 'C', 'D'],
  //   d: ['高', '矮', '胖', '瘦']
  // }
  // console.log(arrange(arr));
  /**
   * @priceOption {Object}
   * Object = {
      a: ['红', '黄', '蓝', '绿'],
      b: ['大', '中', '小'],
      c: ['A', 'B', 'C', 'D'],
      d: ['高', '矮', '胖', '瘦']
    }
   * @returns {Arrer}
   */
  arrange(priceOption) {
    var priceFactor = []
    for (const k in priceOption) {
      priceFactor.push(k)
    }

    function plzhFirst(datas) {
      var array = [];
      var propObj = getFirstProp(datas);
      var propName = propObj.name;
      var propValue = propObj.value;
      if (_.isArray(propValue)) {
        for (var i = 0; i < propValue.length; i++) {
          var newObj = {};
          newObj[propName] = propValue[i];
          array.push(newObj);
        }
      } else {
        var newObj = {};
        newObj[propName] = propValue;
        array.push(newObj)
      }
      for (var i = 1; i < priceFactor.length; i++) {
        array = plzh(array, priceOption[priceFactor[i]], priceFactor[i])
      }
      return array

    }

    function getFirstProp(obj) {
      var propObj = {}
      for (var i in obj) {
        propObj.name = i;
        propObj.value = obj[i];
        return propObj;
      }
    }

    function plzh(arr1, arr2, nextAttr) {
      var array = [];
      for (var i = 0; i < arr1.length; i++) {
        var obj = arr1[i];
        for (var j = 0; j < arr2.length; j++) {
          var newObj = _.cloneDeep(obj);
          var v2 = arr2[j];
          newObj[nextAttr] = v2;
          array.push(newObj);
        };
      };
      return array;
    }

    var endData = plzhFirst(priceOption);

    return endData
  },
  prices(n) {
    n = +n
    if (n && n > 0) {
      return Math.round(n) / 100
    }
    return 0
  },
  // base64编码
  encode(str) {
    return btoa(
      encodeURIComponent(str).replace(
        /%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode("0x" + p1);
        }
      )
    );
  },
  // base64解码
  decode(str) {
    if(str.indexOf('{') != -1){
      str = str.substr(0, str.length - 1);
      str = str.substr(1, str.length - 1);
    }
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  },
  // 验证手机号
  isphone(e) {
    var msg = /^1[3456789]{1}\d{9}$/
    if (!msg.test(e)) {
      return true;
    } else {
      return false;
    }
  },
  delLast(str){
    return str.slice(0,str.length-1)
  }
}
