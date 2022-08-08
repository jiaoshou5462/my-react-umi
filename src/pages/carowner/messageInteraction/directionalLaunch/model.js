import { connect, history } from 'umi';
import {
  getAppSettingListByChannelId,
  getSceneTemplateList,
  findListByCondition,
  getTemplateDetail,
  deleteTemplate,
  updateStatusTemplate,
  findSceneTypeVariableList,
  saveTemplate,
  importFilesNumber,
  getSceneDetail,
  download,
  listMarketProject,
  getEditSceneTemplate,
  getThrongListES
} from "@/services/officialAccount";
const model = {
  namespace: 'directionalLaunch',
  state: {
  },

  //处理异步事件
  effects: {
    //参与人群接口
    *getThrongListES({ payload, callback }, { call, put }) {
      let response = yield call(getThrongListES, payload)
      callback && callback(response)
    },

    //场景模板详情
    *getSceneTemplateListDetail({ payload, callback }, { call, put }) {
      let response = yield call(getEditSceneTemplate, payload)
      callback && callback(response)
    },

    //查询全部营销项目
    *listMarketProject({ payload, callback }, { call, put }) {
      let response = yield call(listMarketProject, payload)
      callback && callback(response)
    },

    //文件下载
    *fileDownload({ payload, callback }, { call, put }) {
      let response = yield call(download, payload)
      callback && callback(response)
    },

     /* 编辑详情接口 */
     *getSceneDetail({ payload, callback }, { put, call }) {
      let response = yield call(getSceneDetail, payload)
      callback && callback(response)
    },

     /* 导入 */
     *importFilesNumber({ payload, callback }, { put, call }) {
      let response = yield call(importFilesNumber, payload)
      callback && callback(response)
    },

    /* 添加变量接口 */
    *saveTemplate({ payload, callback }, { put, call }) {
      let response = yield call(saveTemplate, payload)
      callback && callback(response)
    },

    /* 添加变量接口 */
    *findSceneTypeVariableList({ payload, callback }, { put, call }) {
      let response = yield call(findSceneTypeVariableList, payload)
      callback && callback(response)
    },

    /* 启用禁用发送任务 */
    *updateStatusTemplate({ payload, callback }, { put, call }) {
      let response = yield call(updateStatusTemplate, payload)
      callback && callback(response)
    },

     /* 删除发送任务 */
     *deleteTemplate({ payload, callback }, { put, call }) {
      let response = yield call(deleteTemplate, payload)
      callback && callback(response)
    },
    /* 定向投放详情接口 */
    *getTemplateDetail({ payload, callback }, { put, call }) {
      let response = yield call(getTemplateDetail, payload)
      callback && callback(response)
    },
    /* 查询场景模板列表 */
    *findListByCondition({ payload, callback }, { put, call }) {
      let response = yield call(findListByCondition, payload)
      callback && callback(response)
    },
    /* 获取渠道下所属公众号 */
    *getAppSettingListByChannelId({ payload, callback }, { put, call }) {
      let response = yield call(getAppSettingListByChannelId, payload)
      callback && callback(response)
    },
    /* 查询场景模板选择列表 */
    *getSceneTemplateList({ payload, callback }, { put, call }) {
      let response = yield call(getSceneTemplateList, payload)
      callback && callback(response)
    },

  },
  reducers: {
    

  },



  //发布订阅事件
  subscriptions: {

  },
};
export default model;