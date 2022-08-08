import {newStyleSave, getStyleByActivityIdAndStyleCode, saveSeckillStyle,queryEnterpriseLogo} from "@/services/activity";
const Model = {
  namespace: 'seckilHome',
  state: {
  },
  effects: {
    *saveSeckillStyle({ payload,callback}, { put,call }){
      let response = yield call(saveSeckillStyle,payload);
      callback && callback(response)
    },
    //样式保存
    *newStyleSave ({ payload, callback }, { put, call }) {
      let response = yield call(newStyleSave, payload);
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
