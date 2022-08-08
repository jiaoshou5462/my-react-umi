import {
  listPopupRecord,
} from "@/services/popupTouch";
const model = {
  namespace: 'touchRecordManage',
  //默认数据
  state: {
    popupRecordData: {},//列表数据
  },

  //处理异步事件
  effects: {
    // 处理修改值
    //列表
    *getListPopupRecord({ payload ,callback}, { call, put }) {
      let response = yield call(listPopupRecord, payload)
      callback && callback(response)
    },
  },





  //处理同步事件
  reducers: {
    // 修改数据
  
  },



  //发布订阅事件
  subscriptions: {

  },
};
export default model;