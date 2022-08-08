/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import {extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  const { response } = error,
    headerType = response.headers.get("content-type");
    //报错信息提示
    const { status, url } = response ? response : ''
    //判断错误信息的数据格式
    if (headerType.includes("application/json")) {
      let jsonD = {};
      //错误信息转成json格式
      response.json()
        .then(json=>{
          notification.error({
            message: `请求错误 ${status}: ${url}`,
            description: json.result ? json.result.message : codeMessage[status],
          });
          jsonD = json;
        })
        return Promise.reject(jsonD);
    } else if (headerType.includes("text/html")) {
      //非json格式错误信息
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: codeMessage[status],
      });
      return Promise.reject(response);
    }
};
/**
 * 配置request请求时的默认参数
 */
//根据环境变量配置路由前缀
const baseUrl = {
  dev: '/api',
  test: `//${window.location.host}/api`,
  prod: `//${window.location.host}/api`
}[process.env.REACT_APP_ENV];
//获取Cookie值
let cookieObj = (()=>{
  let cookieData = {};
   document.cookie.split(";").forEach((v)=>{
      let keyVal = v.split("=");
      cookieData[keyVal[0].trim()] = keyVal[1] || "";
    });
  return cookieData;
})()
//登录账户
sessionStorage.UNIWAY_ORCBSYS_USERID = cookieObj.UNIWAY_ORCBSYS_USERID||"";
const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  prefix: baseUrl,
  headers: {
    "Content-Type": "multipart/form-data",
    "accessToken": cookieObj.accessToken,
    // "accessToken": 'eyJraWQiOiIzNzAiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvbmVfcm9hZF91c2VyIiwiZXhwIjoxNjA3ODU0NjA5LCJqdGkiOiIzODUyMjEwNzk5Nzc1NDk4MjQifQ.Y7H0Vfcyjc1cN4L96bi7m178kRkADEESY4q3e9QZqkk'
  }
});

/*本地接口联调*/
const localRequest = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  prefix: '/local',
  headers: {
    "Content-Type": "multipart/form-data",
    "accessToken": cookieObj.accessToken,
    // "accessToken": 'eyJraWQiOiIxMzQwNjkiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvbmVfcm9hZF91c2VyIiwiZXhwIjoxNjA3ODI1NDUxLCJqdGkiOiIzODQyMTkyMTg3MjYwMzU0NTYifQ.OYtm5D-gD3dbFV4i3JYMIg9WoKOTyAY6NL3BqnrDp14'
  },
});


export  {localRequest, request};
