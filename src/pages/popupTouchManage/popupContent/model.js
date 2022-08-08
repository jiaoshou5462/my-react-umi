import { message } from "antd";
import { connect, history } from 'umi'
import { BlockOutlined } from "@ant-design/icons";
import {
  listPopupContent,
  updatePopupContent,
  savePopupContent,
  detailPopupContentRecord,
  detailPopupContentRecordId,
  detailPopupContent,
} from "@/services/popupTouch";
const model = {
  namespace: 'popupContentManage',
  //默认数据
  state: {
    popupContentData: {},//列表数据
    popupContentDataList: [],
    popupContentDataTotal: null,
    typeItem: {},//类型数据
    isUpdate: false,
    detailRecord: {},//详情数据1
    contentRecord: {},//详情数据2
    detailContObj: {},//编辑数据
  },

  //处理异步事件
  effects: {
    // 处理修改值
    //列表
    *getListPopupContent({ payload }, { call, put }) {
      let response = yield call(listPopupContent, payload)
      yield put({
        type: 'setListPopupContent',
        payload: response.body
      })
    },
    // 1:启用 2:停用 3:删除
    *getUpdatePopupContent({ payload, callback }, { call, put }) {
      let response = yield call(updatePopupContent, payload)
      yield put({
        type: 'setUpdatePopupContent',
        payload: response.body
      })
      callback && callback(response)
    },
    // 保存弹窗内容
    *getSavePopupContent({ payload, callback }, { call, put }) {
      let response = yield call(savePopupContent, payload)
      yield put({
        type: 'setSavePopupContent',
        payload: response.body
      })
      callback && callback(response)
    },
    // 查看弹窗内容详情(查看数据信息)
    *getDetailPopupContentRecord({ payload, callback }, { call, put }) {
      let response = yield call(detailPopupContentRecord, payload)
      yield put({
        type: 'setDetailPopupContentRecord',
        payload: response.body
      })
      callback && callback(response)
    },
    // 查看弹窗内容详情(查看任务明细)
    *getDetailPopupContentRecordId({ payload, callback }, { call, put }) {
      let response = yield call(detailPopupContentRecordId, payload)
      yield put({
        type: 'setDetailPopupContentRecordId',
        payload: response.body
      })
      callback && callback(response)
    },
    *getDetailPopupContent({ payload, callback }, { call, put }) {
      let response = yield call(detailPopupContent, payload)
      yield put({
        type: 'setDetailPopupContent',
        payload: response.body
      })
      callback && callback(response)
    }
  },





  //处理同步事件
  reducers: {
    // 修改数据
    // setRadioTabs(state, action) {
    //   return { ...state, isRadioTabs: action.payload };
    // },
    setListPopupContent(state, action) {
      let data = action.payload;
      let temp = data.list || [];
      temp.map((item) => {
        item.key = item.id
      })
      state.popupContentData = data;
      state.popupContentDataList = temp;
      return {
        ...state,
        // popupContentData: action.payload,
      };
    },
    setUpdatePopupContent(state, action) {
      return {
        ...state,
      };
    },
    setSavePopupContent(state, action) {
      return {
        ...state,
      };
    },
    setTypeData(state, action) {
      return {
        ...state,
        typeItem: action.payload.typeItem,
        isUpdate: action.payload.isUpdate
      };
    },


    setDetailPopupContentRecord(state, action) {
      // console.log(action, 'action1')
      return {
        ...state,
        contentRecord: action.payload
      };
    },
    setDetailPopupContentRecordId(state, action) {
      // console.log(action, 'action2')
      return {
        ...state,
        detailRecord: action.payload
      };
    },
    setDetailPopupContent(state, action) {
      console.log(action, 'action3')
      return {
        ...state,
        detailContObj: action.payload
      };
    },
    setGrantInvalid(state, action) {
      return {
        ...state,
      };
    },
  },



  //发布订阅事件
  subscriptions: {

  },
};
export default model;