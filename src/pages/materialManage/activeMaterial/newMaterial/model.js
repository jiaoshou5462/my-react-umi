import {
  saveOrUpdate,
  getMaterialDetails,
  materialCategoryList,
  addMaterialCategory
} from "@/services/material"
const model = {
  namespace: 'activeMaterial',
  //默认数据
  state: {
  },
  //处理异步事件
  effects: {
    /*保存编辑*/
    *saveOrUpdate({payload, callback},{put,call}){
      let response = yield call(saveOrUpdate, payload)
      callback && callback(response)
  },
   /*回显 */
   *getMaterialDetails({payload, callback},{put,call}){
      let response = yield call(getMaterialDetails, payload)
      callback && callback(response)
    },
    /* 获取分类列表 */
    *materialCategoryList({payload, callback},{put,call}){
      let response = yield call(materialCategoryList, payload)
      callback && callback(response)
    },
    /*添加分类 */
   *addMaterialCategory({payload, callback},{put,call}){
      let response = yield call(addMaterialCategory, payload)
      callback && callback(response)
    },
   
},
  //处理同步事件
  reducers: {
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
