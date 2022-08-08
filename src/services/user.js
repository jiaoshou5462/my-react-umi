import {request} from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  // console.log(process.env.REACT_APP_ENV)
  // return request('/tag/user/');
}
export async function queryNotices() {
  return request('/api/notices');
}
