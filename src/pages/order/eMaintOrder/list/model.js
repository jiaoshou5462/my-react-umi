import {
  getEmaintOrderList,
  raiseCarPaintSelectList
} from '@/services/order'
import {message} from "antd";
const model = {
  namespace: 'eMaintOrderList',
  //默认数据
  state: {
    queryStoreSelectLists: [],//门店列表
    list: [], //列表
    pageTotal: 0, //列表总数据
  },
  //处理异步事件
  effects: {
    //获取预约门店
    *getQueryStoreSelectList({ payload, callback }, { call, put }) {
      let response = yield call(raiseCarPaintSelectList, payload);
      yield put({
        type: 'setQueryStoreSelectList',
        payload: response.body.list || []
      })
    },
    /*获取 列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(getEmaintOrderList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
  },
  //处理同步事件
  reducers: {
    setQueryStoreSelectList(state,{payload}) {
      state.queryStoreSelectLists = payload
      return { ...state};
    },
    setList(state,{payload}){
      state.list = payload.body.list || []
      state.pageTotal = payload.body.total || 0
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
