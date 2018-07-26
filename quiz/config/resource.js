import Vue from 'vue'
import { baseUrl } from './env'
// 转换为form data urlEncode 数据
let urlEncode = function (param, key, encode) {
  if(param==null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};
/**
 * 异步函数
 * @param { string } type 'get,post'
 * @param { string } url '请求地址' 
 * @param { object } data '可选，发送的数据'
 * @param { object } headers '可选，get方式要携带的headers'
 * post 方式需注意阅读注释 
 */
export default async (type, url, data, headers) => {
  type = type.toLowerCase() || 'get';
  url = baseUrl + url;
  
  if (type === 'get') {
    return new Promise((resolve, reject) => {
      let params = {params:data};
      if (headers) {
        params.headers = headers;
      }
      Vue.http.get(url, params).then(response => {
        resolve(response.body);
      }, response => {
        reject(response);
      });
    })
  } else if (type === 'post') {
    Vue.http.interceptors.push(function(request) {
      request.method = 'POST';
      request.headers.set('Accept', 'application/json, application/xml, text/plain, text/html, *.*');
      request.headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    });
    // 注意：因为请求接口默认带有get参数，需要截取掉一位
    return new Promise((resolve, reject) => {
      Vue.http.post(url, urlEncode(data).substr(1)).then(response => {
        resolve(response.body);
      }, response => {
        reject(response);
      });
    })
  }
}