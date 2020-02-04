import axios from '@/utils/request';
import axiosDown from 'axios';
import fileDownload from 'js-file-download';
import { getToken } from '@/utils/auth';
import { Message } from 'element-ui';
import qs from 'qs';
export default {
  get(url, data) {
    var code = true
    if (data && data.is_export && code) {
      if (url.indexOf('?') != -1) {
        url = process.env.BASE_API + url + '&';
      } else {
        url = process.env.BASE_API + url + '?';
      }
      for (var key in data) {
        url = url + key + '=' + data[key] + '&'
      }
      return axiosDown.get(url, {
        headers: {
          usertoken: getToken()
        },
        responseType: 'arraybuffer'
      }).then((res) => {
        var reg2 = /([^=]+)$/;
        var name = res.headers['content-type'].match(reg2)[1];
        if (name == 'UTF-8') {
          Message({
            message: '导出失败，数据不存在!',
            type: 'warning'
          })
          return
        }
        let fileName = res.headers['content-type'].match(reg2)[1] + '.xls';
        fileDownload(res.data, fileName);
        return res
      }).catch(function (res) {
        console.log(res, '错误！！！')
      })
    } else {
      return axios.get(url, { params: data })
    };
  },
  post(url, data, dataType) {
    if (data) {
      data.access_token = getToken()
    } else {
      data = { access_token: getToken() }
    }
    if (dataType == 'formData') {
      return axios.post(url, qs.stringify(data))
    }
    return axios.post(url, data)
  },
  put(url, data) {
    return axios.put(url, data)
  },
  delete(url, data) {
    return axios.delete(url, { params: data })
  }
}