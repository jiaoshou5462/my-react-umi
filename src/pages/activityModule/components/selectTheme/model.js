import {
  materialList,
  materialCategoryNameList,
  getMaterialDetails,
  putActivityMaterialId,
  newStyleSave,
  saveAddCountAdStyle
} from "@/services/activity"
const model = {
  namespace: 'selectTheme',
  //默认数据
  state: {
    applyTheme: null,
  },
  //处理异步事件
  effects: {
    /* 查询活动素材列表 */
    *materialList({payload, callback},{put,call}){
      let response = yield call(materialList, payload)
      callback && callback(response)
    },
    /* 查询素材分类列表 */
    *materialCategoryNameList({payload, callback},{put,call}){
      let response = yield call(materialCategoryNameList, payload)
      callback && callback(response)
    },
    /*回显 */
   *getMaterialDetails({payload, callback},{put,call}){
    let response = yield call(getMaterialDetails, payload)
    callback && callback(response)
    },
     /*保存当前活动所应用的样式 */
   *putActivityMaterialId({payload, callback},{put,call}){
    let response = yield call(putActivityMaterialId, payload)
    callback && callback(response)
    },
    //加次数广告保存
    *saveAddCountAdStyle ({ payload, callback }, { put, call }) {
      let response = yield call(saveAddCountAdStyle, payload);
      callback && callback(response)
    },
    //样式保存
    *newStyleSave ({ payload, callback }, { put, call }) {
      let response = yield call(newStyleSave, payload);
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
    onSetTheme (state, {payload}) {
      state.applyTheme = payload
      return {...state}
    }
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
