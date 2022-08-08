import {api} from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';

//payload需传入方法以及参数等(url除外)
//账号登录接口
export const accountLogin = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/userLogin/login`,
    ...payload
  })
};
//token失效刷新
export const refreshToken = (payload) => {
  return createApi({
    url: `${api}/api/sso/token/refresh`,
    ...payload
  })
};
//登出
export const loginOut = (payload) => {
  return createApi({
    url: `${api}/api/sso/token`,
    ...payload
  })
};
//获取权限列表
export const getRoleMenu = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/menu/getRoleMenu`,
    ...payload
  })
};

//找回密码-获取手机号
export const queryPhone = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/forgotPassword/queryPhone`,
    ...payload
  })
};
//找回密码-发送验证码
export const sendFindPwdMessage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/forgotPassword/sendFindPwdMessage`,
    ...payload
  })
};
//找回密码-校验验证码
export const checkFindPwdMessage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/forgotPassword/checkFindPwdMessage`,
    ...payload
  })
};//找回密码-修改密码
export const updatePassword = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/forgotPassword/updatePassword`,
    ...payload
  })
};
//获取消息通知列表
export const messageSelectPage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channel/message/selectPage`,
    ...payload
  })
};
//消息通知 修改状态
export const readMessage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channel/message/readMessage`,
    ...payload
  })
};
//消息通知 获取数量
export const getCountMessageChannel = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channel/message/getCountMessageChannel`,
    ...payload
  })
};
