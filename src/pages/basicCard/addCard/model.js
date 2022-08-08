import {
  GetDataEvent,
  PostDataEvent
} from "@/services/common";
const model = {
  namespace: 'addBasicCard',
  //默认数据
  state: {
    tagList: [], //获取标签列表
    channelList: [], //渠道列表
    categoryList: [], //卡券品类分页列表
  },
  //处理异步事件
  effects: {
    /*新增基础卡券*/
    *addBasicCard({payload, callback, pageCallback},{call,put}){
      let params = {
        api: "addBasicCard",
        params: payload,
        ContentType: 'json'
      };
      let response = yield call(PostDataEvent, params)
      if(response.result.code === '0'){
        pageCallback && pageCallback(response)
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
  },
  //处理同步事件
  reducers: {
    setTag(state,{payload}){
      state.tagList = payload.list
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
