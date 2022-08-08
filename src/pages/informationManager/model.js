import {
  customerChannelList,
  crmNewsCategoryList,
  delInfomation,
  getNewsList,
  queryForwardDetail,
  saveCategory,
  saveOrUpdateNews,
  updateNewsStatus,
  findPosterCategory,
  findPosterCategoryNew,
  posterList,
  posterListForQrGuide,
  findPosterForNewsCategory,
  posterListForNews,
  findByChannelId,
  exportForwardInfo,
  getTeamInfoByUniway,
  getNewsDetails,
  uploadIcon,
} from '@/services/team'
import {
  uploadSingle,
} from "@/services/cardgrant";
import {message} from "antd";
const model = {
  namespace: 'informationManager',
  //默认数据
  state: {
    
  },
  //处理异步事件
  effects: {

     //列表
     *posterListForNews({ payload, callback }, { call, put }) {
      let response = yield call(posterListForNews, payload)
      callback && callback(response)
    },

     //分类
     *findPosterForNewsCategory({ payload, callback }, { call, put }) {
      let response = yield call(findPosterForNewsCategory, payload)
      callback && callback(response)
    },
     //上传名单
     *uploadNameList({ payload, callback }, { call, put }) {
      let response = yield call(uploadIcon, payload)
      callback && callback(response)
    },

    /* 详情页面 */
    *getNewsDetails({payload, callback},{put,call}){
      let response = yield call(getNewsDetails, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 海报类别 */
    *findPosterCategoryNew({payload, callback},{put,call}){
      let response = yield call(findPosterCategoryNew, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 获取所属渠道 */
    *findByChannelId({payload, callback},{put,call}){
      let response = yield call(findByChannelId, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

     /* 获取所属渠道 */
     *customerChannelList({payload, callback},{put,call}){
      let response = yield call(customerChannelList, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 查询选择分类 */
    *crmNewsCategoryList({payload, callback},{put,call}){
      let response = yield call(crmNewsCategoryList, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

     /* 删除引导内容数据 */
     *delInfomation({payload, callback},{put,call}){
      let response = yield call(delInfomation, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },


     /* 获取引导内容列表数据 */
     *getNewsList({payload, callback},{put,call}){
      let response = yield call(getNewsList, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },


     /* 获取资讯转发详情列表数据 */
     *queryForwardDetail({payload, callback},{put,call}){
      let response = yield call(queryForwardDetail, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },


     /* 保存引导内容分类 */
     *saveCategory({payload, callback},{put,call}){
      let response = yield call(saveCategory, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },


     /* 保存引导内容分类 */
     *saveOrUpdateNews({payload, callback},{put,call}){
      let response = yield call(saveOrUpdateNews, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },


     /* 启用引导内容 */
     *updateNewsStatus({payload, callback},{put,call}){
      let response = yield call(updateNewsStatus, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

     /* 查询海报分类下拉列表 */
     *findPosterCategory({payload, callback},{put,call}){
      let response = yield call(findPosterCategory, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

     /* 查询海报列表 */
     *posterList({payload, callback},{put,call}){
      let response = yield call(posterList, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 查询海报列表 */
    *posterListForQrGuide({payload, callback},{put,call}){
      let response = yield call(posterListForQrGuide, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 查询海报列表 */
    *exportForwardInfo({payload, callback},{put,call}){
      let response = yield call(exportForwardInfo, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },
    /* 查询海报列表 */
    *getTeamInfoByUniway({payload, callback},{put,call}){
      let response = yield call(getTeamInfoByUniway, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

  },
  //处理同步事件
  reducers: {

  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
