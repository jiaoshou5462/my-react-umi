import { message } from "antd";
import { connect, history } from 'umi'
import { BlockOutlined } from "@ant-design/icons";
import {
  marketingProList,
  addMarketingProject,
  delMarketingProject,
  updMarketing,
  queryBussinessType
} from "@/services/operate";
const model = {
  namespace: 'marketingProjectModel',
  //默认数据
  state: {
    marketingList: [],//营销项目列表
    marketingTotal:null,//列表总数
  },

  //处理异步事件
  effects: {
    // 处理修改值

    // 营销项目列表
    *marketList({ payload }, { call, put }) {
      let response = yield call(marketingProList, payload);
      yield put({
        type: "setMarketList",
        payload: response.body
      })
    },
    //添加营销项目
    *marketAdd({ payload, callback }, { call, put }) {
      let response = yield call(addMarketingProject, payload);
      yield put({
        type: "setMarketAdd",
        payload: response
      })
      callback && callback(response)
    },
    //刪除营销项目
    *marketDel({ payload, callback }, { call, put }) {
      let response = yield call(delMarketingProject, payload);
      console.log(response, 'response')
      yield put({
        type: "setMarketDel",
        payload: response
      })
      callback && callback(response)
    },
    // 编辑保存项目
    *marketEdit({ payload, callback }, { call, put }) {
      let response = yield call(updMarketing, payload);
      console.log(response, 'response')
      yield put({
        type: "setMarketEdit",
        payload: response
      })
      callback && callback(response)
    },

    // 查询全部业务类型
    *queryBussinessType({ payload, callback }, { call, put }) {
      let response = yield call(queryBussinessType, payload);
      callback && callback(response)
    },


  },





  //处理同步事件
  reducers: {
    // 修改数据

    setMarketList(state, action) {
      return {
        ...state,
        marketingList: action.payload.list,
        marketingTotal: action.payload.pageInfo.total
      };
    },
    setMarketAdd(state, action) {
      return {
        ...state,
      };
    },
    setMarketDel(state, action) {
      return {
        ...state,
      };
    },
    setMarketEdit(state, action) {
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