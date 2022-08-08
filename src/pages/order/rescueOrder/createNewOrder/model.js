
import {
  getConfigCode,
  addRescueOrderList,
  addressAnalyze,
} from "@/services/order"
import {message} from "antd";
const model = {
  namespace: 'createNewOrder',
  //默认数据
  state: {
    destProvinceList:[],
    destCityList: [],
    destRegionList: [],

    echoFirstStepData:null,
    firstStepDetile:{},//第一页预览数据
    secondStepDetile:{},//第二页预览数据
    thirdStepDetile:{},//第三页预览数据
    secondListData:{}, //第二页全部省市区数组数据
    echoSecondStepData:null,
    echoThirdStepData:null,
    currentStep:0,
    toSecondStep:null,
    tofirstStep:null,
    toThirdStep:null,
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

    /* 存储第一步数据 */
    setFirstEchoStepData(state,{payload}){  
      state.echoFirstStepData = payload.echoFirstStepData
      return {...state};
    },
    /* 存储第一步预览数据 */
    setFirstStepDetile(state,{payload}){  
      state.firstStepDetile = payload.firstStepDetile
      return {...state};
    },
    // 编辑数据存储第二步必填
    setEditEchoSecondStepData(state,{payload}){  
      state.echoSecondStepData = payload.echoSecondStepData
      return {...state};
    },
    /* 存储第二步预览数据 */
    setSecondStepDetile(state,{payload}){  
      state.secondStepDetile = payload.secondStepDetile
      return {...state};
    },
    /* 存储第二步省市区数组数据用于回显*/
    setSecondListData(state,{payload}){  
      state.secondListData = payload.secondListData
      return {...state};
    },
    // 编辑数据存储第三步必填
    setEditEchoThirdStepData(state,{payload}){  
      state.echoThirdStepData = payload.echoThirdStepData
      return {...state};
    },
    /* 存储第三步预览数据 */
    setThirdStepDetile(state,{payload}){  
      state.thirdStepDetile = payload.thirdStepDetile
      return {...state};
    },
    /* 第一步是否填写完整进入第二步*/
    isToSecondStep(state,{payload}){
      state.toSecondStep = payload
      return {...state};
    },
     /* 点击上方圆点进入上一步*/
     isToFirstStep(state,{payload}){
      state.toFirstStep = payload
      return {...state};
    },
    /* 第二步是否填写完整进入第三步*/
    isToThirdStep(state,{payload}){
      state.toThirdStep = payload
      return {...state};
    },
    /* 更改step */
    setCurrentStep(state,{payload}){  
      state.currentStep = payload
      state.toSecondStep =  null
      state.toFirstStep =  null
      return {...state};
    },
    /* 清除缓存数据*/
    setReset(state,{payload}){
      state = {
        firstStepDetile:{},
        secondStepDetile:{},
        thirdStepDetile:{},
        secondListData:{},
        echoFirstStepData:null,
        echoSecondStepData:null,
        echoThirdStepData:null,
        currentStep:0,
        toSecondStep:null,
        tofirstStep:null,
        toThirdStep:null,
      }
      return JSON.parse(JSON.stringify(state));
    }

  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
