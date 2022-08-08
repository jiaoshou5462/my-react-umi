import {
  PutDate,
  GetUrlData,
  PostDataEvent,
  GetDataEvent
} from "@/services/common";
import {getSkuProductDetail} from "@/services/preProduction";
const model = {
  namespace: 'editBasicCard',
  //默认数据
  state: {
    tagList: [], //获取标签列表
    cardDetail: {}, //卡券详请
    channelList: [], //渠道列表
    categoryList: [], //卡券品类列表
  },
  //处理异步事件
  effects: {
    /*获取卡券详请*/
    *getCardDetail({payload, callback},{call,put}){
      let params = {
        api: "getBasicCardDetail",
        params: payload,
        ContentType: 'json'
      };
      let response = yield call(GetUrlData, params)
      if(response.result.code === '0'){
        yield put({
          type: "setCardDetail",
          payload: response.body
        })
      }
    },
    /*获取标签列表*/
    *getTag({payload, callback},{call,put}){
      let params = {
        api: "getTag",
        params: {
          pageNum: 1,
          pageSize: 999,
          query:{
            tagName: null
          }
        },
        ContentType: 'json'
      };
      let response = yield call(PostDataEvent, params)
      if(response.result.code === '0'){
        yield put({
          type: "setTag",
          payload: response.body
        })
      }
    },
    /*卡券品类分页列表*/
    *getCategoryBasicCard({payload, callback},{call,put}){
      let params = {
        api: "getCategoryBasicCard",
        params: {
          pageNum: 1,
          pageSize: 999,
          query:{
            categoryName: null
          }
        },
        ContentType: 'json'
      };
      let response = yield call(PostDataEvent, params)
      if(response.result.code === '0'){
        yield put({
          type: "setCategoryBasicCard",
          payload: response.body
        })
      }
    },
    /*获取渠道*/
    *getChannel({payload, callback},{call,put}){
      let params = {
        api: "getChannel",
        params: {},
      };
      let response = yield call(GetDataEvent, params)
      if(response.result.code === '0') {
        yield put({
          type: "setChannel",
          payload: response
        })
      }
    },
    /*编辑卡券*/
    *editBasicCard({payload, callback, pageCallback},{call,put}){
      let params = {
        api: "editBasicCard",
        params: payload,
        ContentType: 'json'
      };
      let response = yield call(PutDate, params)
      if(response.result.code === '0'){
        pageCallback && pageCallback(response)
      }
    },
    /*查询sku详情*/
    *getSkuProductDetail({payload, callback},{put,call}){
      let response = yield call(getSkuProductDetail, payload)
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
    setTag(state,{payload}){
      state.tagList = payload.list
      return {...state};
    },
    setCardDetail(state,{payload}){
      state.cardDetail = payload
      return {...state};
    },
    setCategoryBasicCard(state,{payload}){
      state.categoryList = payload.list
      return {...state};
    },
    setChannel(state,{payload}){
      state.channelList = payload.body
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
