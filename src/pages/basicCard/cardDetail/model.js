import {
  GetUrlData,
} from "@/services/common";
const model = {
  namespace: 'basicCardDetail',
  //默认数据
  state: {
    cardDetail: {}, //卡券详请
  },
  //处理异步事件
  effects: {
    /*获取卡券详请*/
    *getCardDetail({payload, callback, pageCallback},{call,put}){
      let params = {
        api: "getBasicCardDetail",
        params: payload,
        ContentType: 'json'
      };
      let response = yield call(GetUrlData, params)
      if(response.result.code === '0'){
        yield put({
          type: "setCardDetail",
          payload: response.body
        })
      }
    },
  },
  //处理同步事件
  reducers: {
    setCardDetail(state,{payload}){
      state.cardDetail = payload
      return {...state};
    }
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
