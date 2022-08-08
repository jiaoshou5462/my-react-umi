import {
  materialList,
  updateMaterialStatus,
  deleteMaterial,
  materialCategoryNameList,
  copyMaterial,
  saveActivityCenter
} from "@/services/activityCenter"
const model = {
  namespace: 'activityCenter',
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
    *materialCategoryNameList({payload, callback},{put,call}){
      let response = yield call(materialCategoryNameList, payload)
      callback && callback(response)
    },
    /* 复制素材 */
    *copyMaterial({payload, callback},{put,call}){
      let response = yield call(copyMaterial, payload)
      callback && callback(response)
    },
    /* 应用素材创建活动 */
    *saveActivityCenter({payload, callback},{put,call}){
      let response = yield call(saveActivityCenter, payload)
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
