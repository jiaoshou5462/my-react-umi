import { queryReplyList, queryChannelList, deleteReplyId, saveReplyData, updateReplyData, detailReplyData } from '@/services/officialAccount';
const Model = {
  namespace: 'ReplyManage',
  state: {
    ReplyList: [],
    channelList: [],//渠道下拉
  },
  effects: {
    // 公众号自动回复条件查询
    *queryReplyList({ payload, callback }, { call, put }) {
      const response = yield call(queryReplyList, payload);
      yield put({
        type: 'setQueryReplyList',
        payload:response,
      });
    },
    // 获取所属渠道
    *queryChannelList({ payload, callback }, { call, put }) {
      let response = yield call(queryChannelList, payload);
      yield put({
        type: 'setQueryChannelList',
        payload: response
      })
    },
    // 公众号回复表格删除
    *deleteReplyId({ payload, callback }, { call, put }) {
      let response = yield call(deleteReplyId, payload);
      callback && callback(response)
    },
    // 保存新增信息
    *saveReplyData({ payload, callback }, { call, put }) {
      let response = yield call(saveReplyData, payload);
      callback && callback(response)
    },
    // 公众号更新微信自动回复消息
    *updateReplyData({ payload, callback }, { call, put }) {
      let response = yield call(updateReplyData, payload);
      callback && callback(response)
    },
     // 公众号更新微信自动回复消息
     *detailReplyData({ payload, callback }, { call, put }) {
      let response = yield call(detailReplyData, payload);
      callback && callback(response)
    },
  },
  reducers: {
    // 公众号自动回复条件查询同步
    setQueryReplyList(state, action) {
      return { ...state, ReplyList: action.payload.body };
    },
    //2设置未入账列表
    setQueryChannelList(state, action) {
      return { ...state, channelList: action.payload.body.data.channelList}
    },
  },
};
export default Model;