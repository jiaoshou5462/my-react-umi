import {newStyleSave, getStyleByActivityIdAndStyleCode, getBuyCheaperPageStyle,saveBuyCheaperPageStyle} from "@/services/activity";
const Model = {
  namespace: 'discountGame',
  state: {
    subimtData: '',
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
  },
  reducers: {
    setInfoData(state,{payload}){
      state.subimtData = payload
      return {...state};
    },
  },
};
export default Model;
