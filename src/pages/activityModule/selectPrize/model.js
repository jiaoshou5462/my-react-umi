import {
  getCouponList,
  getChannelAuthority,
  getPackageSetUp,
  getCardByPackageNoNotGroupByCouponNum
} from "@/services/activity";
import {
selectChannelCouponPackage,
queryPackage
} from "@/services/cardgrant";
const model = {
  namespace: 'activitySelectPrize',
  // 默认数据
  state: {
    pageTotal: 1, //列表总数据
    cardList: [], //列表
    channelAuthority: false, //获取当前活动的 渠道权限
    couponCardbagList: [],//卡包列表
    couponCardbagTotal: 0,//卡包总数
    cardbagIdList: [],//卡包ID下拉
    cardbagByCouponNumList: [],//卡包明细
  },
  //处理异步事件
  effects: {
    //获取卡券套餐列表
    *getCouponList({ payload }, { put,call }){
      let response = yield call(getCouponList, payload);
      if(response.result.code === '0'){
        yield put({
          type: "setCouponList",
          payload: response
        })
      }
    },
    //获取当前活动的 渠道权限
    *getChannelAuthority({ payload }, { put,call }){
      let response = yield call(getChannelAuthority, payload);
      yield put({
        type: "setChannelAuthority",
        payload: response
      })
    },
    //获取卡包卡券最近一次设置
    *getPackageSetUp({ payload, callback}, { put,call }){
      let response = yield call(getPackageSetUp, payload);
      callback && callback(response)
    },
    *onResetCardList({ payload }, { put,call }){
      yield put({
        type: "setResetCardList"
      })
    },
    // 基础卡包
    *channelCouponPackage({ payload }, { call, put }) {
      let response = yield call(selectChannelCouponPackage, payload)
      yield put({
        type: 'setChannelCouponPackage',
        payload: response.body
      })
    },
    // 基础卡包-卡包ID下拉框数据
    *selsctQueryPackage({ payload }, { call, put }) {
      let response = yield call(queryPackage, payload)
      yield put({
        type: 'setSelsctQueryPackage',
        payload: response.body
      })
    },
    // 卡包明细
    *detailCardByCouponNum({ payload }, { call, put }) {
      let response = yield call(getCardByPackageNoNotGroupByCouponNum, payload)
      yield put({
        type: 'setDetailCardByCouponNum',
        payload: response.body,
        quotationItemId: payload.quotationItemId
      })
    },
  },
  //处理同步事件
  reducers: {
    setCouponList(state,{payload}){
      let temp = payload.body.list || []
      temp.map((item, key) => {
        item.key = key + 1
        item.status = false
        item.shareFlag = 1
      })
      state.cardList = temp;
      state.pageTotal = payload.body.total
      return {...state};
    },
    setResetCardList(state,{payload}){
      state.cardList = []
      state.pageTotal = 1
      return {...state};
    },
    setChannelAuthority(state,{payload}){
      if(payload.result.code === '0'){
        state.channelAuthority = payload.body
      }
      return {...state};
    },
    setChannelCouponPackage(state, {payload}) {
      let temp = payload.list || []
      temp.map((item, key) => {
        item.key = key + 1
        item.status = false
        item.shareFlag = 1
      })
      state.couponCardbagList = temp;
      return {
        ...state,
        couponCardbagList: payload.list,
        couponCardbagTotal: payload.total
      };
    },
    setSelsctQueryPackage(state, {payload}) {
      return {
        ...state,
        cardbagIdList: payload,
      };
    },
    setDetailCardByCouponNum(state, action) {
      let list = action.payload;
      let quotationItemId = action.quotationItemId;
      list.map((item) => {
        item.effectDateType = 0;//有效期类型（0：领取后生效，1：固定日期
        item.receiveEffectDays = 0;//"领取后多少天数生效 0为立即生效")
        item.effectiveDays = null;//有效天数
        item.effectStartDate = '';
        item.effectEndDate = '';
        item.quotationItemId = quotationItemId
      })
      return {
        ...state,
        cardbagByCouponNumList: list,
      };
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
