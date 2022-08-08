import {
  getAllGoodClass,
  saveChannelSupGood,
  getChannelSupGoodDetail
} from "@/services/insurance"
import {message} from "antd";
const Model = {
  namespace: 'insuranceProduct',
  state: {
    channelList: [], //渠道
  },
  effects: {
   /*分类获取*/
   *getAllGoodClass({payload, callback},{put,call}){
      let response = yield call(getAllGoodClass, payload)
      callback && callback(response)
    },
   /*详情*/
   *getChannelSupGoodDetail({payload, callback},{put,call}){
    let response = yield call(getChannelSupGoodDetail, payload)
    callback && callback(response)
  },
   /*新增|编辑*/
   *saveChannelSupGood({payload, callback},{put,call}){
    let response = yield call(saveChannelSupGood, payload)
    callback && callback(response)
   },
  },
  reducers: {
    setActivityChannelList(state,{payload}){
      if(payload.code === '0000'){
        state.channelList = payload.items.data || []
        return {...state};
      }else {
        message.error(payload.message)
      }
    },
  },
};
export default Model;
