import {newStyleSave,getStyleByActivityIdAndStyleCode,saveAddCountAdStyle,turntableGameActivityStyle,backStageSActivityThree} from "@/services/activity";
const Model = {
  namespace: 'visGame',
  state: {
    subimtData: '',
  },
  effects: {
    *turntableGameActivityStyle({ payload,callback }, { put,call }){
      let response = yield call(turntableGameActivityStyle,payload);
        callback && callback(response)
      //   yield put({
      //     type: "setInfoData",
      //     payload: response
      //   })
    },
    *backStageSActivityThree({ payload,callback}, { put,call }){
      let response = yield call(backStageSActivityThree,payload);
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
    //加次数广告保存
    *saveAddCountAdStyle ({ payload, callback }, { put, call }) {
      let response = yield call(saveAddCountAdStyle, payload);
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
