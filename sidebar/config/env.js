/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * imUrl: im
 * imgBaseUrl: 图片所在域名地址
 *
 */

//测试
let baseUrl = '';
let imUrl = '';
// let imUrl = 'wss://www.a02zhibo.com:19968';
if(typeof(chatserver) == 'string' && chatserver) {
   imUrl = chatserver
}  else {
   imUrl = 'wss://www.a02zhibo.com:19968';
}
// let imUrl = 'https://www.a02index.com:19968';
let imgBaseUrl = '';


if (process.env.NODE_ENV == 'development') {
  baseUrl = '';
}else if(process.env.NODE_ENV == 'production'){
}

export {
	baseUrl,
	imgBaseUrl,
  imUrl
}
