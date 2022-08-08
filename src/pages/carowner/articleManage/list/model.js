
import {
  customerChannelList,
  queryAllCategory,
  saveCategory,
  orderCategory,
  delCategory,
  articleDetail,
  articleList,
  articleStatus,
  cancelArticleTop,
  delArticle,
  saveArticle
} from "@/services/articleManage"
import {message} from "antd";
import { result } from "lodash";
const model = {
  namespace: 'articleManage',
  //默认数据
  state: {
    channelList: [], //渠道
    allCategoryList: [],
  },
  //处理异步事件
  effects: {
    /*获取列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(crmCustomerInfoList, payload)
      callback && callback(response)
    },
     /* 获取渠道列表 */
    *customerChannelList({payload, callback},{put,call}){
      let response = yield call(customerChannelList, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
    },
    /* 查询全部分类 */
    *queryAllCategory({payload, callback},{put,call}){
      let response = yield call(queryAllCategory, payload)
      yield put({
        type: "setQueryAllCategory",
        payload: response
      })
    },
    /* 添加文章分类 */
    *saveCategory({payload, callback},{put,call}){
      let response = yield call(saveCategory, payload)
      callback && callback(response)
    },
    /* 排序分类 */
    *orderCategory({payload, callback},{put,call}){
      let response = yield call(orderCategory, payload)
      callback && callback(response)
    },
    /* 删除分类 */
    *delCategory({payload, callback},{put,call}){
      let response = yield call(delCategory, payload)
      callback && callback(response)
    },
    /* 文章详情 */
    *articleDetail({payload, callback},{put,call}){
      let response = yield call(articleDetail, payload)
      callback && callback(response)
    },
    /* 通过分类查询文章 */
    *articleList({payload, callback},{put,call}){
      let response = yield call(articleList, payload)
      callback && callback(response)
    },
    /* 停用-启用 */
    *articleStatus({payload, callback},{put,call}){
      let response = yield call(articleStatus, payload)
      callback && callback(response)
    },
     /* 置顶文章 */
    *cancelArticleTop({payload, callback},{put,call}){
      let response = yield call(cancelArticleTop, payload)
      callback && callback(response)
    },
    /* 删除文章 */
    *delArticle({payload, callback},{put,call}){
      let response = yield call(delArticle, payload)
      callback && callback(response)
    },
    /* 保存文章 */
    *saveArticle({payload, callback},{put,call}){
      let response = yield call(saveArticle, payload)
      callback && callback(response)
    }
},
  //处理同步事件
  reducers: {
    setActivityChannelList(state,{payload}){
      if(payload.body.code === '000'){
        state.channelList = payload.body.data || []
        return {...state};
      }else {
        message.error(payload.message)
      }
    },
    setQueryAllCategory(state,{payload}){
      payload.body.forEach(item => {
        item.isShow = false
        item.isActive = false
      })
      state.allCategoryList = payload.body || []
      return {...state}
    }
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
