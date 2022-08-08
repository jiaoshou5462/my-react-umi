import { getCouponList, qeGuideGetList, getNewsByIdOrTitle,getListProductData } from '@/services/saleTask';
const Model = {
  namespace: 'setTaskModal',
  state: {
    couponList: {},// 卡券数据
    quideList: [], // 扫码获客列表
    quideInfo: {}, // 扫码获客数据
    ArticleList: [], // 文章推广列表
    ArticleInfo: [], // 文章推广数据
  },
  effects: {
    // 销售任务 选择卡券
    *getCouponList({ payload, callback }, { call, put }) {
      let response = yield call(getCouponList, payload);
      yield put({
        type: 'setCouponList',
        payload:response,
      });
      callback && callback(response)
    },
    // 销售任务 扫码获客
    *qeGuideGetList({ payload, callback }, { call, put }) {
      let response = yield call(qeGuideGetList, payload);
      yield put({
        type: 'setQeGuideGetList',
        payload:response,
      });
      callback && callback(response)
    },
    // 销售任务 文章推广
    *getNewsByIdOrTitle({ payload, callback }, { call, put }) {
      let response = yield call(getNewsByIdOrTitle, payload);
      yield put({
        type: 'setGetNewsByIdOrTitle',
        payload:response,
      });
      callback && callback(response)
    },
    *getListProductData({ payload, callback }, { call, put }) {
      let response = yield call(getListProductData, payload);
      callback && callback(response)
    },
  },
  reducers: {
    // 销售任务 选择卡券
    setCouponList(state, action) {
      return { ...state, couponList: action.payload.body };
    },
    // 销售任务 扫码获客
    setQeGuideGetList(state, action) {
      return { ...state, quideList: action.payload.body.taskQrCodeVOList, quideInfo: action.payload.body.pageInfoVO };
    },
    // 销售任务  文章推广
    setGetNewsByIdOrTitle(state, action) {
      return { ...state, ArticleList: action.payload.body.newsList, ArticleInfo: action.payload.body.pageInfoVO };
    }
  },
};
export default Model;
