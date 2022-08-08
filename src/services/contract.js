import { request, localRequest } from "@/utils/request";
let APIs = {
  "downloadFile": `/file/download`, //下载合同
};
let ContentArr = {
  'json': 'application/json',
  'form_data': 'application/x-www-form-urlencoded'
};
let tokenObj = localStorage.getItem("tokenObj") ? JSON.parse(localStorage.getItem("tokenObj")) : {};
/**
 * 基于流下载文件
*/
export function GetDownFile ({ apier, params = {}, ContentType = 'form_data' }) {
  let url;
  if (process.env.NODE_ENV == 'development') {
    url = `/api/${APIs[apier]}/${params.param}`;
  } else {
    url = `${APIs[apier]}/${params.param}`;
  }
  return request(url, {
    data: {},
    headers: {
      "Content-Type": ContentArr[ContentType],
      'accessToken': tokenObj.accessToken
    },
    responseType: 'blob'
  });
}