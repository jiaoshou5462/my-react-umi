import {
  getConfigCode,
  addRescueOrderList,
  reviseRescueOrderList,
  addressAnalyze,
} from "@/services/order"
import {message} from "antd";
const model = {
  namespace: 'comboModal',
  //默认数据
  state: {
    destProvinceList:[],
    destCityList: [],
    destRegionList: [],
  },
  //处理异步事件
  effects: {
    /*查询 服务类型、服务项目、方位、故障类型、车型、颜色、保险公司、省市区、承保单位 字典接口*/
    *getModalConfigCode({payload, flag, callback},{call,put}){
      let response = yield call(getConfigCode, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setModalConfigCode",
          payload: {
            flag,
            response
          }
        })
      }else {
        message.error(response.result.message)
      }
      callback && callback(response)
    },
    //新增救援订单
    *addRescueOrderList({payload, callback},{put,call}){
      let response = yield call(addRescueOrderList, payload)
      callback && callback(response)
    },
    //修改救援订单
    *reviseRescueOrderList({payload, callback},{put,call}){
      let response = yield call(reviseRescueOrderList, payload)
      callback && callback(response)
    },
    //地址反写省市区
    *addressAnalyze({payload, callback},{put,call}){
      let response = yield call(addressAnalyze, payload)
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
    setModalConfigCode(state,{payload}){
      /*1、省 2、市 3、区 4、服务类型 5、服务项目 6、承保单位*/
      let {flag} = payload
      if(flag === 1){
        state.destProvinceList = payload.response.body || []
      }
      if(flag === 2) {
        state.destCityList = payload.response.body || []
      }
      if(flag === 3) {
        state.destRegionList = payload.response.body || []
      }
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
