import { getCouponList, getChannelAuthority } from "@/services/growth";
const model = {
  namespace: 'selectPrize',
  //默认数据
  state: {
    pageTotal: 1, //列表总数据
    cardList: [], //列表
    channelAuthority: false, //获取当前活动的 渠道权限
  },
  //处理异步事件
  effects: {
    //获取卡券套餐列表
    *getCouponList ({ payload }, { put, call }) {
      let response = yield call(getCouponList, payload);
      if (response.result.code === '0') {
        yield put({
          type: "setCouponList",
          payload: response
        })
      }
    },
    //获取当前活动的 渠道权限
    *getChannelAuthority ({ payload }, { put, call }) {
      let response = yield call(getChannelAuthority, payload);
      yield put({
        type: "setChannelAuthority",
        payload: response
      })
    },
    *onResetCardList ({ payload }, { put, call }) {
      yield put({
        type: "setResetCardList"
      })
    },
  },
  //处理同步事件
  reducers: {
    setCouponList (state, { payload }) {
      let temp = payload.body.list || []
      temp.map((item, key) => {
        item.key = key + 1
        item.status = false
        item.shareFlag = 1
      })
      state.cardList = temp
      state.pageTotal = payload.body.total
      return { ...state };
    },
    setResetCardList (state, { payload }) {
      state.cardList = []
      state.pageTotal = 1
      return { ...state };
    },
    setChannelAuthority (state, { payload }) {
      if (payload.code === '0000') {
        state.channelAuthority = payload.items
      }
      return { ...state };
    },

  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
