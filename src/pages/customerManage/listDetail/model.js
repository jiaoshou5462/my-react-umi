import {
  getSwittch,
  getCustomerCars,
  customerListDetail,
  getCustomerPolicy,
  customerCards,
  getCustomerBehaviors,
  getCustomerBehaviorsByTime,
  interactionRecord,
  interactionRecordTime,
  customerSocialCircle,
  toSocietyCustomerDetail,
  toRefresh,
  unbindWechat,
  openAndClosse,
  updatePhoneAndCardNo,
  queryEditRecord
} from "@/services/customerManage"
import {message} from "antd";
const model = {
  namespace: 'customerListDetail',
  //默认数据
  state: {
    customerId:'', // 用户id

  },
  //处理异步事件
  effects: {
    /* 获取详情 */
    *getSwittch({payload,callback},{put,call}){
      let response = yield call(getSwittch, payload)
      callback && callback(response)
    },
    /* 优享刷新*/
    *toRefresh({payload,callback},{put,call}){
      let response = yield call(toRefresh, payload)
      callback && callback(response)
    },
     /* 解除绑定*/
     *unbindWechat({payload,callback},{put,call}){
      let response = yield call(unbindWechat, payload)
      callback && callback(response)
    },
    /* 会员日开关通知 */
    *openAndClosse({payload,callback},{put,call}){
      let response = yield call(openAndClosse, payload)
      callback && callback(response)
    },
    /* 修改身份证，手机号 */
    *updatePhoneAndCardNo({payload,callback},{put,call}){
      let response = yield call(updatePhoneAndCardNo, payload)
      callback && callback(response)
    },
    /* 获取车辆信息 */ 
    *getCustomerCars({payload,callback},{put,call}){
      let response = yield call(getCustomerCars, payload)
      callback && callback(response)
    },
    /* 获取卡券明细 */ 
    *getCustomerBehaviors({payload, callback},{put, call}){
      let response = yield call(getCustomerBehaviors, payload)
      callback && callback(response)
    },
    /* 获取保险信息明细 */
    *getCustomerPolicy({payload,callback}, {put,call}){
      let response = yield call(getCustomerPolicy, payload)
      callback && callback(response)
    },
    /* 获取卡券信息 */
    *customerCards({payload,callback}, {put,call}){
      let response = yield call(customerCards, payload)
      callback && callback(response)
    },
    /* 获取用户行为时间*/
    *getCustomerBehaviorsByTime({payload,callback}, {put,call}){
      let response = yield call(getCustomerBehaviorsByTime, payload)
      callback && callback(response)
    },
    /* 获取用户行为次数*/
    *getCustomerBehaviors({payload,callback}, {put,call}){
      let response = yield call(getCustomerBehaviors, payload)
      callback && callback(response)
    },
    /*社交圈记录*/
    *interactionRecord({payload,callback}, {put,call}){
      let response = yield call(interactionRecord, payload)
      callback && callback(response)
    },
    /*社交圈时间*/
    *interactionRecordTime({payload,callback}, {put,call}){
      let response = yield call(interactionRecordTime, payload)
      callback && callback(response)
    },
    /*社交圈图表*/
    *customerSocialCircle({payload,callback}, {put,call}){
      let response = yield call(customerSocialCircle, payload)
      callback && callback(response)
    },
    /*社交圈图表详情*/
    *toSocietyCustomerDetail({payload,callback}, {put,call}){
      let response = yield call(toSocietyCustomerDetail, payload)
      callback && callback(response)
    },
    /* 用户管理-修改记录 */ 
    *queryEditRecord({payload,callback}, {put,call}){
      let response = yield call(queryEditRecord, payload)
      callback && callback(response)
    }
  },
  //处理同步事件
  reducers: {
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
