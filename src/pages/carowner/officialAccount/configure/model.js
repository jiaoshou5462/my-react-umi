import { queryChannelList, queryConfigureList, wechatAppSettingDel, WechatMenuToWechat, saveWechatAppSetting, queryWechatAppSettingDetail, wechatAppMenuSetting,
  deleteWechatAppMenuSetting, querySelectDictionary, queryWechatAppMenuSetting, saveWechatAppMenuSetting } from '@/services/officialAccount';
const Model = {
  namespace: 'configureManage',
  state: {
    channelList: [],//渠道下拉
    configureList: {},// 公众号配置查询列表(公众号分页列表)
    menuInfo: [], //公众号配置设置菜单
  },
  effects: {
    // 获取所属渠道
    *queryChannelList({ payload, callback }, { call, put }) {
      let response = yield call(queryChannelList, payload);
      yield put({
        type: 'setQueryChannelList',
        payload: response
      })
    },
    // 公众号配置查询列表(公众号分页列表)
    *queryConfigureList({ payload, callback }, { call, put }) {
      let response = yield call(queryConfigureList, payload);
      yield put({
        type: 'setQueryConfigureList',
        payload: response
      })
    },
    // 公众号批量失效 参数逗号分隔
    *wechatAppSettingDel({ payload, callback }, { call, put }) {
      let response = yield call(wechatAppSettingDel, payload);
      callback && callback(response)
    },
    // 公众号配置 (同步菜单)
    *WechatMenuToWechat({ payload, callback }, { call, put }) {
      let response = yield call(WechatMenuToWechat, payload);
      callback && callback(response)
    },
    // 公众号配置(查看新增保存接口)
    *saveWechatAppSetting({ payload, callback }, { call, put }) {
      let response = yield call(saveWechatAppSetting, payload);
      callback && callback(response)
    },
    // 公众号配置(公众号详情点击公众号名称与查看时调用)
    *queryWechatAppSettingDetail({ payload, callback }, { call, put }) {
      let response = yield call(queryWechatAppSettingDetail, payload);
      callback && callback(response)
    },
    // 公众号配置(设置菜单查询)  菜单列表
    *wechatAppMenuSetting({ payload, callback }, { call, put }) {
      let response = yield call(wechatAppMenuSetting, payload);
      yield put({
        type: 'setWechatAppMenuSetting',
        payload: response
      })
      callback && callback(response)
    },
    // 公众号配置(菜单删除)
    *deleteWechatAppMenuSetting({ payload, callback }, { call, put }) {
      let response = yield call(deleteWechatAppMenuSetting, payload);
      callback && callback(response)
    },
    // 公众号配置(查询菜单类型查询功能类型)
    *querySelectDictionary({ payload, callback}, { call, put}) {
      let response = yield call(querySelectDictionary, payload);
      callback && callback(response)
    },
    // 公众号配置(根据id查询菜单信息)
    *queryWechatAppMenuSetting({ payload, callback}, { call, put}) {
      let response = yield call(queryWechatAppMenuSetting, payload);
      callback && callback(response)
    },
    // 公众号配置(菜单的保存与更新)
    *saveWechatAppMenuSetting({ payload, callback}, { call, put}) {
      let response = yield call(saveWechatAppMenuSetting, payload);
      callback && callback(response)
    }
  },
  reducers: {
    // 获取所属渠道
    setQueryChannelList(state, action) {
      return { ...state, channelList: action.payload.body.data.channelList}
    },
    // 公众号配置查询列表(公众号分页列表)
    setQueryConfigureList(state, action) {
      return { ...state, configureList: action.payload.body}
    },
    // 公众号配置(设置菜单查询)  菜单列表
    setWechatAppMenuSetting(state, action) {
      return { ...state, menuInfo: action.payload.body}
    }
  },
};
export default Model;