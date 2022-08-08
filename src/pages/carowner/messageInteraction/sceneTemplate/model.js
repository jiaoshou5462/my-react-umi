import {
  getWechatSceneTemplateList,
  SceneTemplateList,
  getSceneTemplateListDetail,
  StopSceneTemplate,
  deleteSceneTemplate,
  newSceneTemplate,
  getEditSceneTemplate,
  getAppSettingListByChannelId,
  getVariableList
} from '@/services/officialAccount'
import {message} from "antd";
const model = {
  namespace: 'sceneTemplate',
  //默认数据
  state: {
    list: [], //列表
    pageTotal: 1, //列表总数据
    weChatLiat:[], //公众号列表
  },
  //处理异步事件
  effects: {
    /*获取 列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(SceneTemplateList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取列表详情*/
    *getDetail({payload, callback},{put,call}){
      let response = yield call(getSceneTemplateListDetail, payload)
      callback && callback(response)
    },

    /*停用*/
    *stop({payload, callback},{put,call}){
      let response = yield call(StopSceneTemplate, payload)
        yield put({
          type: "setDetail",
          payload: response
        })
        callback && callback(response)
    },

    /*删除*/
    *delete({payload, callback},{put,call}){
      let response = yield call(deleteSceneTemplate, payload)
        yield put({
          type: "setDetail",
          payload: response
        })
        callback && callback(response)
    },

    /*获取编辑场景模板详情*/
    *getEditDetail({payload, callback},{put,call}){
      let response = yield call(getEditSceneTemplate, payload)
        yield put({
          type: "setDetail",
          payload: response
        })
        callback && callback(response)
    },

    /*新建场景模板*/
    *new({payload, callback},{put,call}){
      let response = yield call(newSceneTemplate, payload)
        callback && callback(response)
    },

    /*获取公众号列表列表*/
    *getWeChatList({payload, callback},{put,call}){
      let response = yield call(getAppSettingListByChannelId, payload)
      callback && callback(response)
    },

    /*获取微信场景模板列表*/
    *getWechatSceneTemplateList({payload, callback},{put,call}){
      let response = yield call(getWechatSceneTemplateList, payload)
        callback && callback(response)
    },
    /*获取分类变量列表*/
    *getVariableList({payload, callback},{put,call}){
      let response = yield call(getVariableList, payload)
        callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
    setList(state,{payload}){
      state.list = payload.body.list || []
      state.pageTotal = payload.body.total || 1
      return {...state};
    },
    setWeChatList(state,{payload}){
      state.weChatLiat = payload.body || []
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
