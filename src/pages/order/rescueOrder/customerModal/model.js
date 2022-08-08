import {
  getConfigCode
} from "@/services/order"
import {message} from "antd";
const model = {
  namespace: 'customerModal',
  //默认数据
  state: {
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
    }
  },
  //处理同步事件
  reducers: {
    setModalConfigCode(state,{payload}){
      /*1、省 2、市 3、区 4、服务类型 5、服务项目 6、承保单位*/
      let {flag} = payload
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
