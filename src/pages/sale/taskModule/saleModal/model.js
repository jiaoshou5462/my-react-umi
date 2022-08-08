import {
  addModalSale,
  getModalSaleList,
} from '@/services/saleTask'
import {message} from "antd";
const model = {
  namespace: 'saleModal',
  //默认数据
  state: {
    list: [], //列表
    pageTotal: 0, //列表总数据
  },
  //处理异步事件
  effects: {
    /*获取 列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(getModalSaleList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取 列表*/
    *addModalSale({payload, callback},{put,call}){
      let response = yield call(addModalSale, payload)
      if(response.result.code === '0') {
        callback && callback(response)
      }else {
        message.error(response.result.message)
      }
    },
  },
  //处理同步事件
  reducers: {
    setList(state,{payload}){
      let tempData = payload.body || {}
      let temp = []
      if(Object.keys(tempData).length > 0){
        temp = tempData.taskSaleList || []
        if(temp.length > 0) {
          temp.map((item, key) => {
            item.key = key
          })
        }
      }
      state.list = temp
      state.pageTotal = tempData.pageInfoVO && tempData.pageInfoVO.totalCount || 0
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
