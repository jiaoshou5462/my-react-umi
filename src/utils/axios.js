import axios from 'axios';
import { notification,Modal } from 'antd';
import { history } from 'umi';
import { refreshToken } from '@/services/login'
import { loadingShow, loadingHide } from './loading.js';

let requestNum = 0;
let completeNum = 0;

const axiosEvent = {
  get: ({ url, params, headers, responseType, loading = true }) => {
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'accessToken': tokenObj.accessToken || '',
      'userName': tokenObj.userId || '',
    };
    ++requestNum;
    if (loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url,
        params,
        responseType: responseType,
        headers: Object.assign(defaultHeaders, headers),
      }).then((res) => {
        resolve(res.data);
      }).finally(() => {
        if (++completeNum == requestNum) { loadingHide(); }
      })
    })
  },
  post: ({ url, params, headers, loading = true }) => {
    let postParams = new URLSearchParams();
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'accessToken': tokenObj.accessToken || '',
      'refreshToken': tokenObj.refreshToken || '',//刷新token需要
      'userName': tokenObj.userId || '',
    };
    for (var key in params) {
      postParams.append(key, params[key])
    }

    ++requestNum;
    if (loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'post',
        data: postParams,
        headers: Object.assign(defaultHeaders, headers),

      }).then((res) => {
        resolve(res.data);
      }).finally(() => {
        if (++completeNum == requestNum) { loadingHide(); }
      })
    })
  },
  /*postJson 下载excel11111111*/
  postJsonExcel: ({ url, params, headers,loading=true }) => {
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'content-type': 'application/json',
      'accessToken': tokenObj.accessToken || '',
      'refreshToken': tokenObj.refreshToken || '',//刷新token需要
      'userName': tokenObj.userId || '',
    };
    ++requestNum;
    if(loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'post',
        data: params,
        responseType: 'blob',
        headers: Object.assign(defaultHeaders, headers),
      }).then((res) => {
        resolve(res.data);
      }).finally(()=>{
        if (++completeNum == requestNum) {loadingHide();}
      })
    })
  },
  /*post FromData 传参 下载excel*/
  postDownloadExcel: ({ url, params, headers,loading=true }) => {
    var postParams = new URLSearchParams();
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'content-type': 'application/x-www-form-urlencoded',
      'accessToken': tokenObj.accessToken || '',
      'refreshToken': tokenObj.refreshToken || '',//刷新token需要
      'userName': tokenObj.userId || '',
    };
    for (var key in params) {
      postParams.append(key, params[key])
    }
    ++requestNum;
    if(loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'post',
        data: postParams,
        responseType: 'blob',
        headers: Object.assign(defaultHeaders, headers),
      }).then((res) => {
        resolve(res.data);
      }).finally(()=>{
        if (++completeNum == requestNum) {loadingHide();}
      })
    })
  },
  /*get 下载excel*/
  getDownloadExcel: ({ url, params, headers,loading=true, allData = false }) => {
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'content-type': 'application/x-www-form-urlencoded',
      'accessToken': tokenObj.accessToken || '',
      'refreshToken': tokenObj.refreshToken || '',//刷新token需要
      'userName': tokenObj.userId || '',
    };
    ++requestNum;
    if(loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'get',
        params: params,
        responseType: 'blob',
        headers: Object.assign(defaultHeaders, headers),
      }).then((res) => {
        resolve(allData ? res : res.data);
      }).finally(()=>{
        if (++completeNum == requestNum) {loadingHide();}
      })
    })
  },
  /*get Url 传参*/
  getUrlParams: ({ url, params, headers,loading=true }) => {
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'accessToken': tokenObj.accessToken || '',
      'refreshToken': tokenObj.refreshToken || '',//刷新token需要
      'userName': tokenObj.userId || '',
    };
    ++requestNum;
    if(loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url: url + '/' + params,
        method: 'get',
        params: {},
        headers: Object.assign(defaultHeaders, headers),
      }).then((res) => {
        resolve(res.data);
      }).finally(()=>{
        if (++completeNum == requestNum) {loadingHide();}
      })
    })
  },
  postJSON: ({ url, params, headers, responseType, loading = true }) => {
    let postParams = JSON.stringify(params);//转json格式传递给后台
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'content-type': 'application/json;charset=UTF-8',
      'accessToken': tokenObj.accessToken || '',
      'userName': tokenObj.userId || '',
    };
    ++requestNum;
    if (loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'post',
        data: postParams,
        headers: Object.assign(defaultHeaders, headers),
        responseType: responseType,
      }).then((res) => {
        resolve(res.data);
      }).finally(() => {
        if (++completeNum == requestNum) { loadingHide(); }
      })
    })
  },
  put: ({ url, params, headers, loading = true }) => {
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'accessToken': tokenObj.accessToken || '',
      'refreshToken': tokenObj.refreshToken || '',//刷新token需要
      'userName': tokenObj.userId || '',
    };
    ++requestNum;
    if (loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'put',
        data: params,
        headers: Object.assign(defaultHeaders, headers),
      }).then((res) => {
        resolve(res.data);
      }).finally(() => {
        if (++completeNum == requestNum) { loadingHide(); }
      })
    })
  },
  putJSON: ({ url, params, headers, loading = true }) => {
    let postParams = JSON.stringify(params);//转json格式传递给后台
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'accessToken': tokenObj.accessToken || '',
      'refreshToken': tokenObj.refreshToken || '',//刷新token需要
      'content-type': 'application/json;charset=UTF-8',
      'userName': tokenObj.userId || '',
    };
    ++requestNum;
    if (loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'put',
        data: postParams,
        headers: Object.assign(defaultHeaders, headers),
      }).then((res) => {
        resolve(res.data);
      }).finally(() => {
        if (++completeNum == requestNum) { loadingHide(); }
      })
    })
  },
  delete: ({ url, params, headers, loading = true,isParams=false, }) => {
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'content-type': 'application/json',
      'accessToken': tokenObj.accessToken || '',
      'refreshToken': tokenObj.refreshToken || '',
      'userName': tokenObj.userId || '',
    };
    ++requestNum;
    let sendParams = {data:params};
    if(isParams){
      sendParams = {params:params};
    }
    if (loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'delete',
        ...sendParams,
        headers: Object.assign(defaultHeaders, headers),
      }).then((res) => {
        resolve(res.data);
      }).finally(() => {
        if (++completeNum == requestNum) { loadingHide(); }
      })
    })
  },
  deleteParams: ({ url, params, headers, loading = true,isParams=false, }) => {
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'accessToken': tokenObj.accessToken || '',
      'refreshToken': tokenObj.refreshToken || '',
      'userName': tokenObj.userId || '',
    };
    ++requestNum;
    let sendParams = {data:params};
    if(isParams){
      sendParams = {params:params};
    }
    if (loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url: url + '/' + params,
        method: 'delete',
        ...sendParams,
        headers: Object.assign(defaultHeaders, headers),
      }).then((res) => {
        resolve(res.data);
      }).finally(() => {
        if (++completeNum == requestNum) { loadingHide(); }
      })
    })
  },
  upload: ({ url, params, headers, loading = true }) => {
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    let defaultHeaders = {
      'accessToken': tokenObj.accessToken || '',
      'refreshToken': tokenObj.refreshToken || '',//刷新token需要
      'content-type': 'multipart/form-data',
      'userName': tokenObj.userId || '',
    };
    ++requestNum;
    if (loading) loadingShow();
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'post',
        data: params,
        headers: Object.assign(defaultHeaders, headers),

      }).then((res) => {
        resolve(res.data);
      }).finally(() => {
        if (++completeNum == requestNum) { loadingHide(); }
      })
    })
  },
}
//创建请求
export const createApi = ((obj) => {
  return axiosEvent[obj.method]({
    ...obj
  })
})

//请求拦截器
axios.interceptors.request.use((request) => {
  return request;
}, function (error) {
  return Promise.reject(error);
});

//响应拦截器
axios.interceptors.response.use((response) => {
  return response;
}, function (error) {
  if (error && error.response && !/20./.test(error.response.status)) {
    //状态10001=访问令牌已过期无感刷新，10003=刷新令牌已过期跳出到登录输入账号密码
    let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
    if (error.response.data.result && error.response.data.result.code == "10001") {
      refreshToken(
        {
          method: 'post',
          headers: {
            accessToken: tokenObj.accessToken || '',
            refreshToken: tokenObj.refreshToken || '',
            userName: tokenObj.userId || '',
          }
        }
      ).then(res => {
        if (res.body) {
          localStorage.setItem("tokenObj", JSON.stringify(res.body));
          Modal.error({
            content: '页面token已失效，请刷新当前页面', onOk () {
              location.reload()
            }
          });
        }
      })
    } else if (error.response.data.result && error.response.data.result.code == "10003") {
      window.localStorage.removeItem("tokenObj");
      window.location.replace(`${window.location.origin}/login`);
    } else {
      notification.error({
        message: `请求错误 ${error.response.status}`,
        description: error.response.data.result && error.response.data.result.message,
      });
    }
  }

  return Promise.reject(error);
});
