import {
  channelWechatSmartFieldSave,channelWechatSmartFieldList,updateEnableStatus,channelWechatSmartFieldDelete,
  contentStatistics,fieldStatistics,channelWechatSmartFieldDetail,
} from "@/services/carowner";
import {articleList,queryAllCategory} from "@/services/articleManage";
import { channelGroupChannel} from '@/services/groups';
import {  history } from 'umi'
const model = {
  namespace: 'smartField_model',
  //默认数据
  state: {
    groupList: [], //列表页数据
  },

  //处理异步事件
  effects: {
    // 智能栏位保存
    *channelWechatSmartFieldSave({ payload , callback}, { call,put }) {
      let response = yield call(channelWechatSmartFieldSave, payload);
      callback && callback(response)
    },
    *articleList({ payload , callback}, { call,put }) {
      let response = yield call(articleList, payload);
      callback && callback(response)
    },
    *queryAllCategory({ payload , callback}, { call,put }) {
      let response = yield call(queryAllCategory, payload);
      callback && callback(response)
    },
    *channelGroupChannel({ payload, callback }, { call, put }) {
      const response = yield call(channelGroupChannel, payload);
      callback && callback(response)
    },
    *channelWechatSmartFieldList({ payload, callback }, { call, put }) {
      const response = yield call(channelWechatSmartFieldList, payload);
      callback && callback(response)
    },
    *updateEnableStatus({ payload, callback }, { call, put }) {
      const response = yield call(updateEnableStatus, payload);
      callback && callback(response)
    },
    *channelWechatSmartFieldDelete({ payload, callback }, { call, put }) {
      const response = yield call(channelWechatSmartFieldDelete, payload);
      callback && callback(response)
    },
    *channelWechatSmartFieldDetail({ payload, callback }, { call, put }) {
      const response = yield call(channelWechatSmartFieldDetail, payload);
      callback && callback(response)
    },
    *contentStatistics({ payload, callback }, { call, put }) {
      const response = yield call(contentStatistics, payload);
      callback && callback(response)
    },
    *fieldStatistics({ payload, callback }, { call, put }) {
      const response = yield call(fieldStatistics, payload);
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
    setGroupList(state, action) {
      return { ...state, groupList: action.payload};
    },
  },



  //发布订阅事件
  subscriptions: {

  },
};
export default model;