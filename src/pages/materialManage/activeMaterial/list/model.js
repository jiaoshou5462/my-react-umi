import {
  materialList,
  updateMaterialStatus,
  deleteMaterial,
  materialCategoryList
} from "@/services/material"
const model = {
  namespace: 'activeMaterialList',
  //默认数据
  state: {
    
  },
  //处理异步事件
  effects: {
   /* 查询活动素材列表 */
    *materialList({payload, callback},{put,call}){
      let response = yield call(materialList, payload)
      callback && callback(response)
    },
    /* 上下架素材 */
    *updateMaterialStatus({payload, callback},{put,call}){
      let response = yield call(updateMaterialStatus, payload)
      callback && callback(response)
    },
    /* 删除素材 */
    *deleteMaterial({payload, callback},{put,call}){
      let response = yield call(deleteMaterial, payload)
      callback && callback(response)
    },
    /* 查询素材分类列表 */
    *materialCategoryList({payload, callback},{put,call}){
      let response = yield call(materialCategoryList, payload)
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
