import {
  PutUrlData,
  GetDataEvent,
  PostDataEvent
} from "@/services/common";
const model = {
  namespace: 'basicCardList',
  //默认数据
  state: {
    channelList: [], //渠道列表
    categoryList: [], //获取卡券品类(服务)
    pageTotal: 1, //列表总数据
    list: [], //列表
  },
  //处理异步事件
  effects: {
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
    /*获取卡券品类（服务）*/
    *getCategory({payload, callback},{call,put}){
      let params = {
        api: "getCategory",
        params: {
          "pageNum": 1,
          "pageSize": 999,
          "query": {
            "categoryName": null
          }
        },
        ContentType: 'json'
      };
      let response = yield call(PostDataEvent, params)
      if(response.result.code === '0') {
        yield put({
          type: "setCategory",
          payload: response
        })
      }
    },
    *getList({payload, callback},{call,put}){
      let params = {
        api: "getBasicCardList",
        params: payload,
        ContentType: 'json',
      };
      let response = yield call(PostDataEvent, params)
      yield put({
        type: "setList",
        payload: response
      })
    },
    *onTakeEffect({payload, callback, pageCallback},{call,put}){
      let params = {
        api: "onTakeEffect",
        params: payload,
      };
      let response = yield call(PutUrlData, params)
      if(response.result.code === '0'){
        pageCallback && pageCallback(response)
      }
    },
    *onLoseEffect({payload, callback, pageCallback},{call,put}){
      let params = {
        api: "onLoseEffect",
        params: payload,
      };
      let response = yield call(PutUrlData, params)
      if(response.result.code === '0'){
        pageCallback && pageCallback(response)
      }
    },
  },
  //处理同步事件
  reducers: {
    setChannel(state,{payload}){
      state.channelList = payload.body
      return {...state};
    },
    setCategory(state,{payload}){
      state.categoryList = payload.body.list
      return {...state};
    },
    setList(state,{payload}){
      let data = payload.body
      state.list = data.list
      state.pageTotal = data.total || 1
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
