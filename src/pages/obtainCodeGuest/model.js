import {
  customerChannelList,
  qrGuideList,
  getMonitorFlag,
  getChannelType,
  editDetail,
  deleteQrGuide,
  judgeIsSuperRole,
  getWechatList,
  addSaveQrGuide,
  uploadIcon
} from '@/services/team'
const model = {
  namespace: 'obtainCodeGuest',
  //默认数据
  state: {

  },
  //处理异步事件
  effects: {

    /* 获取所属渠道 */
    *customerChannelList({ payload, callback }, { put, call }) {
      let response = yield call(customerChannelList, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 接口列表 */
    *qrGuideList({ payload, callback }, { put, call }) {
      let response = yield call(qrGuideList, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /*  渠道类型 */
    *getChannelType({ payload, callback }, { put, call }) {
      let response = yield call(getChannelType, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 渠道分类 */
    *getMonitorFlag({ payload, callback }, { put, call }) {
      let response = yield call(getMonitorFlag, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 判断是否为超管 */
    *judgeIsSuperRole({ payload, callback }, { put, call }) {
      let response = yield call(judgeIsSuperRole, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 删除获客码 */
    *deleteQrGuide({ payload, callback }, { put, call }) {
      let response = yield call(deleteQrGuide, payload)
      callback && callback(response)
    },

    /* 编辑获取码 */
    *editDetail({ payload, callback }, { put, call }) {
      let response = yield call(editDetail, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 获取公众号 */
    *getWechatList({ payload, callback }, { put, call }) {
      let response = yield call(getWechatList, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 新增保存获客码 */
    *addSaveQrGuide({ payload, callback }, { put, call }) {
      let response = yield call(addSaveQrGuide, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },

    /* 上传图片 */
    *uploadIcon({ payload, callback }, { put, call }) {
      let response = yield call(uploadIcon, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
      callback && callback(response)
    },


  },
  //处理同步事件
  reducers: {

  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
