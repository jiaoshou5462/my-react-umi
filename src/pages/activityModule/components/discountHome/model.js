import {newStyleSave, getStyleByActivityIdAndStyleCode, saveBuyCheaperPageStyle,getBuyCheaperPageStyle,queryEnterpriseLogo} from "@/services/activity";
const Model = {
  namespace: 'discountHome',
  state: {
    subimtData: '',
    adverData: ''
  },
  effects: {
    *saveBuyCheaperPageStyle({ payload,callback }, { put,call }){
      let response = yield call(saveBuyCheaperPageStyle,payload);
        callback && callback(response)
    },
    *getBuyCheaperPageStyle({ payload,callback}, { put,call }){
      let response = yield call(getBuyCheaperPageStyle,payload);
      if(response.result.code === '0'){
        callback && callback(response)
      }
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
