import {
  getRescueOrderList,
  getExportCaseList,
  rescueOrderUrge,
  rescueOrderRemark,
  rescueOrderCancel,
} from '@/services/order'
import {message} from "antd";
const model = {
  namespace: 'rescueOrderList',
  //默认数据
  state: {
    list: [], //列表
    pageTotal: 1, //列表总数据
  },
  //处理异步事件
  effects: {
    /*获取 列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(getRescueOrderList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*导出救援列表*/
    *getExportCaseList({payload, callback},{put,call}){
      let response = yield call(getExportCaseList, payload)
      callback && callback(response)
    },
    /*催促*/
    *rescueOrderUrge({payload, callback},{put,call}){
      let response = yield call(rescueOrderUrge, payload)
      callback && callback(response)
    },
    /*备注*/
    *rescueOrderRemark({payload, callback},{put,call}){
      let response = yield call(rescueOrderRemark, payload)
      callback && callback(response)
    },
    /*取消*/
    *rescueOrderCancel({payload, callback},{put,call}){
      let response = yield call(rescueOrderCancel, payload)
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
    setList(state,{payload}){
      state.list = payload.body.list || []
      state.pageTotal = payload.body.total || 1
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
