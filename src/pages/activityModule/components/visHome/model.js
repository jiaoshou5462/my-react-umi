import {newStyleSave,getStyleByActivityIdAndStyleCode,saveHomeStyle,saveHomeAdStyle,backStageSActivityThree,queryEnterpriseLogo} from "@/services/activity";
const Model = {
  namespace: 'visHome',
  state: {
  },
  effects: {
    //样式保存
    *newStyleSave ({ payload, callback }, { put, call }) {
      let response = yield call(newStyleSave, payload);
      callback && callback(response)
    },
    *saveHomeStyle({ payload,callback}, { put,call }){
        let response = yield call(saveHomeStyle,payload);
        callback && callback(response)
    },
    *backStageSActivityThree({ payload,callback}, { put,call }){
      let response = yield call(backStageSActivityThree,payload);
      callback && callback(response)
    },
    *saveHomeAdStyle({ payload, callback }, { put,call }){
      let response = yield call(saveHomeAdStyle,payload);
      callback && callback(response)
    },
    //样式回显
    *getStyleByActivityIdAndStyleCode ({ payload, callback }, { put, call }) {
      let response = yield call(getStyleByActivityIdAndStyleCode, payload);
      callback && callback(response)
    },
    *queryEnterpriseLogo ({ payload, callback }, { put, call }) {
      let response = yield call(queryEnterpriseLogo, payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
