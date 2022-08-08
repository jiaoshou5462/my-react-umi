import {
  getActivityChannelList,
  getAllGoodClass,
  createGoodClass,
  updateGoodClass,
  delGoodClass,
  batchDelChannelSupGoods,
  changeSort,
  delChannelSupGoods,
  startChannelSupGood,
  stopChannelSupGood,
  onUpDataProductCategory,
  getSupGoodsPage
} from "@/services/insurance"
import {message} from "antd";
const superModel = {
  namespace: 'superMarket',
  state: {
    channelList: [], //渠道
  },
  effects: {
    /*获取渠道列表*/
    *getActivityChannelList({payload, callback},{put,call}){
      let response = yield call(getActivityChannelList, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
    },
     /*分类获取*/
     *getAllGoodClass({payload, callback},{put,call}){
      let response = yield call(getAllGoodClass, payload)
      callback && callback(response)
    },
     /*分类新增*/
     *createGoodClass({payload, callback},{put,call}){
      let response = yield call(createGoodClass, payload)
      callback && callback(response)
    },
    /*修改分类*/
    *updateGoodClass({payload, callback},{put,call}){
      let response = yield call(updateGoodClass, payload)
      callback && callback(response)
    },
    /*删除分类*/
    *delGoodClass({payload, callback},{put,call}){
      let response = yield call(delGoodClass, payload)
      callback && callback(response)
    },
    /*产品-批量删除*/
    *batchDelChannelSupGoods({payload, callback},{put,call}){
      let response = yield call(batchDelChannelSupGoods, payload)
      callback && callback(response)
    },
    /*产品-调整排序*/
    *changeSort({payload, callback},{put,call}){
      let response = yield call(changeSort, payload)
      callback && callback(response)
    },
    /*产品-删除*/
    *delChannelSupGoods({payload, callback},{put,call}){
      let response = yield call(delChannelSupGoods, payload)
      callback && callback(response)
    },
     /*产品-启用*/
    *startChannelSupGood({payload, callback},{put,call}){
      let response = yield call(startChannelSupGood, payload)
      callback && callback(response)
    },
    /*产品-停用*/
    *stopChannelSupGood({payload, callback},{put,call}){
      let response = yield call(stopChannelSupGood, payload)
      callback && callback(response)
    },
    /*产品-列表*/
    *getSupGoodsPage({payload, callback},{put,call}){
      let response = yield call(getSupGoodsPage, payload)
      callback && callback(response)
    },
    /*修改产品分类排序*/
    *onUpDataProductCategory({payload, callback},{put,call}){
      let response = yield call(onUpDataProductCategory, payload)
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
export default superModel;
