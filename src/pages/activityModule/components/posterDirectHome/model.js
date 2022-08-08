import {newStyleSave,saveAddCountAdStyle,getStyleByActivityIdAndStyleCode,saveHomeStyle,saveHomeAdStyle,backStageSActivityThree,queryEnterpriseLogo} from "@/services/activity";
const Model = {
  namespace: 'posterDirectHome',
  state: {
    subimtData: '',
    adverData: ''
  },
  effects: {
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
    //样式保存
    *newStyleSave ({ payload, callback }, { put, call }) {
      let response = yield call(newStyleSave, payload);
      callback && callback(response)
    },
    //加次数广告保存
    *saveAddCountAdStyle ({ payload, callback }, { put, call }) {
      let response = yield call(saveAddCountAdStyle, payload);
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
    setInfoData(state,{payload}){
      state.subimtData = payload
      return {...state};
    },
    setSaveData(state,{payload}){
      state.adverData = payload
      return {...state};
    }
  },
};
export default Model;
