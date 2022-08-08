import {
  queryOpinionFeedBack,
  opinionFeedBackDetail,
  addOpinionFeedBackReply
} from '@/services/customerManage';
const Model = {
  namespace: 'customerFeedbackManage',
  state: {
    feedBackList: [],// 列表数组
    total: 0,
    feedBackDetailObj: {}//详情数据
  },
  effects: {
    // 获取列表
    *getQueryOpinionFeedBack({ payload, callback }, { call, put }) {
      const response = yield call(queryOpinionFeedBack, payload);
      yield put({
        type: 'setQueryOpinionFeedBack',
        payload: response.body,
      });
      callback && callback(response)
    },
    // 意见反馈详情
    *getOpinionFeedBackDetail({ payload, callback }, { call, put }) {
      const response = yield call(opinionFeedBackDetail, payload);
      yield put({
        type: 'setOpinionFeedBackDetail',
        payload: response.body,
      });
    },
    // 意见反馈提交
    *getAddOpinionFeedBackReply({ payload, callback }, { call, put }) {
      const response = yield call(addOpinionFeedBackReply, payload);
      yield put({
        type: 'setAddOpinionFeedBackReply',
        payload: response.body,
      });
      callback && callback(response)
    },
  },
  reducers: {
    // 获取列表
    setQueryOpinionFeedBack(state, action) {
      // console.log(action, 'action')
      let pageInfo = action.payload.pageInfo
      state.total = pageInfo.total
      state.feedBackList = action.payload.list || []
      return { ...state };
    },
    setOpinionFeedBackDetail(state, action) {
      console.log(action, 'action')
      return {
        ...state,
        feedBackDetailObj: action.payload,
      };
    },
    setAddOpinionFeedBackReply(state, action) {
      console.log(action, 'action')
      return {
        ...state,
        feedBackDetailObj: action.payload,
      };
    },
  },
};
export default Model;
