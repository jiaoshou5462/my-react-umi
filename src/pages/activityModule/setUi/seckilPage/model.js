import {echoSeckillStyle} from "@/services/activity";
const Model = {
  namespace: 'activitySeckilPageThree',
  state: {
    info:{}
  },
  effects: {
    *echoSeckillStyle({ payload, callback }, { put,call }){
      let response = yield call(echoSeckillStyle, payload);
      yield put({
        type: "setEchoSeckillStyle",
        payload: response
      })
    },
  },
  reducers: {
    setEchoSeckillStyle(state,{payload}){
      if(payload.result.code === '0'){
        state.info = payload.body
        return {...state};
      }else {
        message.error(payload.result.message)
      }
    },
  },
};
export default Model;
