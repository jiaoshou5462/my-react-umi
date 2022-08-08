import { getMetaInfo, getTagEvent} from '@/services/tag';
import {  category,selectChannelSku,selectChannelCoupon } from '@/services/cardgrant'
const Model = {
  namespace: 'dataModule_common',
  state: {
    attributeSelectData:{
      oneList:[],twoList:[],threeList:[],
    },//屬性 从后台获取的下拉数据
    actionSelectData:{
      oneList:[],twoList:[],threeList:[],
    },// 行为 从后台获取的下拉数据
    cardCategorys:[],
    skuList:[],
    couponList:[],
  },
  effects: {
    *getMetaMess({ payload, callback }, { call, put }) {
      const response = yield call(getMetaInfo, payload);
      yield put({
        type: 'setMetaMess',
        payload:response,
      });
    },
    *getTagEvent({ payload, callback }, { call, put }) {
      const response = yield call(getTagEvent, payload);
      yield put({
        type: 'setTagEvent',
        payload:response,
      });
    },
    *category({payload, callback},{put,call}){
      let response = yield call(category, payload)
      yield put({
        type: 'setCardCategorys',
        payload: response && response.body,
      });
    },
    *selectChannelSku({payload, callback},{put,call}){
      let response = yield call(selectChannelSku, payload)
      yield put({
        type: 'setSkuList',
        payload: response && response.body || [],
      });
    },
    *selectChannelCoupon({payload, callback},{put,call}){
      let response = yield call(selectChannelCoupon, payload)
      callback && callback(response && response.body || {})
    },
  },
  reducers: {
    setCardCategorys(state,action){
      let cardCategorys = action.payload.list;
      return { ...state,
        cardCategorys: cardCategorys,
      };
    },
    setSkuList(state,action){
      let skuList = action.payload;
      return { ...state,
        skuList: skuList,
      };
    },
    setMetaMess(state,action){
      let res = action.payload;
      let selectData={};
      if (res.body && res.body.length > 0) {
        selectData.oneList = res.body;
        selectData.twoList = res.body[0].dataTypeInfo.predicateInfoList;
        selectData.threeList = res.body[0].userMetaInfoOptions;
      }
      return { ...state, attributeSelectData: selectData };
    },
    setTagEvent(state,action){
      let res = action.payload;
      let selectData={};
      if (res.body && res.body.length > 0) {
        selectData.oneList = res.body;
        selectData.twoList = res.body[0].userEventPropertiesInfos;
        selectData.threeList = res.body[0].userEventPropertiesInfos[0].dataTypeInfo.predicateInfoList;
      }
      return { ...state, actionSelectData: selectData };
    },
  },
};
export default Model;
