import { message } from "antd";
import { connect, history } from 'umi'
import { BlockOutlined } from "@ant-design/icons";
import {
  queryPopupDirectPage,
  popupPageConfig,
  validateAfterEnable,
  updateStatus,
  deleteId,
  saveOrUpdate,
  detailId,
} from "@/services/popupTouch";
const model = {
  namespace: 'directionalPopupManage',
  //默认数据
  state: {
    popupDirectData: {},//列表数据
    popupPageList: [],//弹窗页面列表
    checkedContList: [],//选中ContList
    isUpdate:false,
    detailData:{}
  },

  //处理异步事件
  effects: {
    // 处理修改值
    //列表
    *getQueryPopupDirectPage({ payload }, { call, put }) {
      let response = yield call(queryPopupDirectPage, payload)
      yield put({
        type: 'setQueryPopupDirectPage',
        payload: response.body
      })
    },
    // 弹窗页面列表
    *getPopupPageConfig({ payload }, { call, put }) {
      let response = yield call(popupPageConfig, payload)
      yield put({
        type: 'setPopupPageConfig',
        payload: response.body
      })
    },
    // 启用前验证
    *getValidateAfterEnable({ payload, callback }, { call, put }) {
      let response = yield call(validateAfterEnable, payload)
      yield put({
        type: 'setValidateAfterEnable',
        payload: response.body
      })
      callback && callback(response)
    },
    // 启用-停用
    *getUpdateStatus({ payload, callback }, { call, put }) {
      let response = yield call(updateStatus, payload)
      yield put({
        type: 'setUpdateStatus',
        payload: response.body
      })
      callback && callback(response)
    },
    // 删除定向弹窗
    *getDeleteId({ payload, callback }, { call, put }) {
      let response = yield call(deleteId, payload)
      yield put({
        type: 'setDeleteId',
        payload: response.body
      })
      callback && callback(response)
    },
    // 新增或保存
    *getSaveOrUpdate({ payload, callback }, { call, put }) {
      let response = yield call(saveOrUpdate, payload)
      yield put({
        type: 'setSaveOrUpdate',
        payload: response.body
      })
      callback && callback(response)
    },
    // 消息详情
    *getDetailId({ payload, callback }, { call, put }) {
      let response = yield call(detailId, payload)
      yield put({
        type: 'setDetailId',
        payload: response.body
      })
      callback && callback(response)
    },
  },



  //处理同步事件
  reducers: {
    // 修改数据
    // setRadioTabs(state, action) {
    //   return { ...state, isRadioTabs: action.payload };
    // },
    setQueryPopupDirectPage(state, action) {
      // console.log(action, '列表')
      return {
        ...state,
        popupDirectData: action.payload,
      };
    },
    setPopupPageConfig(state, action) {
      // console.log(action, '弹窗页面列表')
      return {
        ...state,
        popupPageList: action.payload,
      };
    },
    setValidateAfterEnable(state, action) {
      // console.log(action, '启用前验证')
      return {
        ...state,
        // popupDirectData: action.payload,
      };
    },
    setUpdateStatus(state, action) {
      // console.log(action, '启用-停用')
      return {
        ...state,
        // popupDirectData: action.payload,
      };
    },
    setDeleteId(state, action) {
      // console.log(action, '删除定向弹窗')
      return {
        ...state,
        // popupDirectData: action.payload,
      };
    },
    setContData(state, action) {
      return {
        ...state,
        checkedContList: action.payload.checkedContList,
        isUpdate: action.payload.isUpdate
      };
    },
    setSaveOrUpdate(state, action) {
      // console.log(action, '新增或保存')
      return {
        ...state,
        // popupDirectData: action.payload,
      };
    },
    setDetailId(state, action) {
      // console.log(action, '消息详情')
      return {
        ...state,
        detailData: action.payload,
      };
    },
  },



  //发布订阅事件
  subscriptions: {

  },
};
export default model;