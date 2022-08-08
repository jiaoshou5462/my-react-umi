import { stringify } from 'querystring';
import { history } from 'umi';
import { accountLogin, loginOut ,getRoleMenu,queryPhone,sendFindPwdMessage,checkFindPwdMessage,updatePassword,
  messageSelectPage,readMessage,getCountMessageChannel} from '@/services/login';
import { passwordInit} from '@/services/privilege';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import Cookies from 'js-cookie';
import { notification,Modal } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    roleData:[],//菜单结构列表
    roleElement:[],//dom权限控制
    jumpPage:false,//是否在获取菜单列表后，跳转到第一个路由 默认不跳转
    msgCount:0,
    msgList:[],
  },
  effects: {
    *login({ payload,callback }, { call, put }) {
      const response = yield call(accountLogin, payload);
      //code状态为0是请求成功
      if (response.result.code === '0') {

        Cookies.set('accessToken', response.body.accessToken, { domain: '.yltapi.com',expires: 999, path: '/' });
        Cookies.set('refreshToken', response.body.refreshToken, { domain: '.yltapi.com',expires: 999, path: '/' });
        localStorage.setItem("tokenObj", JSON.stringify(response.body));
        //登录存信息后调整标签
        callback && callback();
      }else{
        notification.error({
          message: '提示',
          description: response.result.message,
        });
      }
    },
    *logout({ payload }, { call, put }) {
      const response = yield call(loginOut, payload);
      localStorage.removeItem("tokenObj");
      yield put({
        type: 'setRoleData',
        payload: {menuInfo:[],roleElement:[],jumpPage:false},
      });
      window.location.replace(`${window.location.origin}/login`);
    },
    *getRoleData({ payload,jumpPage=false,callback }, { call, put }) {
      const response = yield call(getRoleMenu, payload);
      let data = response.body || {};
      if(jumpPage && data){//是否跳转到第一个子路由
        data.jumpPage = jumpPage;
      }
      yield put({
        type: 'setRoleData',
        payload: data,
      });
      callback && callback(data);
    },
    *passwordInit({ payload,callback }, { call, put }) {
      const response = yield call(passwordInit, payload);
      callback && callback(response);
    },
    *queryPhone({ payload,callback }, { call, put }) {
      const response = yield call(queryPhone, payload);
      callback && callback(response);
    },
    *sendFindPwdMessage({ payload,callback }, { call, put }) {
      const response = yield call(sendFindPwdMessage, payload);
      callback && callback(response);
    },
    *checkFindPwdMessage({ payload,callback }, { call, put }) {
      const response = yield call(checkFindPwdMessage, payload);
      callback && callback(response);
    },
    *updatePassword({ payload,callback }, { call, put }) {
      const response = yield call(updatePassword, payload);
      callback && callback(response);
    },
    //消息通知
    *messageSelectPage({ payload,callback }, { call, put }) {
      const response = yield call(messageSelectPage, payload);
      yield put({
        type: 'setMsgList',
        payload: response.body,
      });
      callback && callback(response.body);
    },
    *readMessage({ payload,callback }, { call, put }) {
      const response = yield call(readMessage, payload);
      callback && callback(response);
    },
    *getCountMessageChannel({ payload,callback }, { call, put }) {
      const response = yield call(getCountMessageChannel, payload);
      yield put({
        type: 'setMsgCount',
        payload: response.body,
      });
    },
    
  },
  reducers: {
    setRoleData(state, { payload }) {
      let list = [];
      let obj = {};
      let eachMenu = (meun,topMenu,parentMenu=[])=>{
        for(let item of meun){
          if(item.path){
            let topPath =  topMenu || item.path;
            let itemObj = {path:item.path,isPage:item.childNodeMenuInfos.length <= 0,topMenu:topPath || '',icon:item.icon,name:item.name};
            list.push(itemObj);
            obj[item.path] = {id:item.id,...itemObj,parentMenu,...item};
            if(item.childNodeMenuInfos.length){
              eachMenu(item.childNodeMenuInfos,topPath,[...parentMenu,item.path]);
            }
          }
        }
      }
      payload.menuInfo && eachMenu(payload.menuInfo);
      window._user_menuList = list;//菜单平级列表
      window._user_menuList_obj = obj;//菜单平级列表 对象形式
      return {
        ...state, 
        roleData: payload.menuInfo || [],
        roleElement: payload.roleElement || [],
        jumpPage: payload.jumpPage || false,
      };
    },
    setJumpPage(state, { payload }){
      return {
        ...state, 
        jumpPage: payload,
      };
    },
    setMsgCount(state, { payload }){
      return {
        ...state, 
        msgCount: payload,
      };
    },
    setMsgList(state, { payload }){
      return {
        ...state, 
        msgList: payload && payload.list,
      };
    },
  },
};
export default Model;
